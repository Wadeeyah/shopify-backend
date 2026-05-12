-- =============================================================
-- InsightFlow SaaS — Initial Schema Migration
-- Migration: 001_initial_schema
-- Date: 2026-02-19
-- Source of Truth: gemini.md (Schema confirmed by user)
-- =============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- TABLE: clients
-- Purpose: Billing + plan control + identity
-- =============================================================
CREATE TABLE IF NOT EXISTS public.clients (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               TEXT NOT NULL UNIQUE,
    plan                TEXT NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'standard', 'premium')),
    active              BOOLEAN NOT NULL DEFAULT true,
    wp_user_id          TEXT,
    iss                 TEXT,
    ls_customer_id      TEXT,
    ls_subscription_id  TEXT,
    ls_variant_id       TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- TABLE: client_integrations
-- Purpose: Automation configuration + encrypted credentials
-- THIS IS THE EXECUTION SOURCE OF TRUTH
-- =============================================================
CREATE TABLE IF NOT EXISTS public.client_integrations (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id                   UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,

    shop_domain                 TEXT,

    delivery_channel            TEXT CHECK (delivery_channel IN ('email', 'whatsapp', 'slack')),
    delivery_days               TEXT[] DEFAULT ARRAY['Monday']::TEXT[],
    delivery_hour               INTEGER CHECK (delivery_hour BETWEEN 0 AND 23),
    timezone                    TEXT DEFAULT 'UTC',

    email_to                    TEXT,
    whatsapp_to                 TEXT,
    delivery_slack              TEXT,

    -- Shopify token (AES-GCM encrypted)
    shopify_token_ciphertext    TEXT,
    shopify_token_iv            TEXT,
    shopify_token_tag           TEXT,

    -- WhatsApp token (AES-GCM encrypted)
    whatsapp_token_ciphertext   TEXT,
    whatsapp_token_iv           TEXT,
    whatsapp_token_tag          TEXT,

    -- Slack webhook (AES-GCM encrypted)
    slack_webhook_ciphertext    TEXT,
    slack_webhook_iv            TEXT,
    slack_webhook_tag           TEXT,

    last_sent_at                TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- TABLE: job_runs
-- Purpose: Execution history + analytics + pricing enforcement
-- =============================================================
CREATE TABLE IF NOT EXISTS public.job_runs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id           UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,

    status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    delivery_channel    TEXT,

    started_at          TIMESTAMPTZ,
    finished_at         TIMESTAMPTZ,

    error               TEXT,
    payload             JSONB
);

-- =============================================================
-- TABLE: client_events
-- Purpose: Admin monitoring + debugging + audit
-- =============================================================
CREATE TABLE IF NOT EXISTS public.client_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id   UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,

    type        TEXT NOT NULL,
    payload     JSONB,

    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- TABLE: form_configs
-- Purpose: WordPress plugin control (legacy bridge)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.form_configs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id     TEXT NOT NULL UNIQUE,
    webhook_url TEXT,
    active      BOOLEAN NOT NULL DEFAULT true,

    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- TABLE: deletion_logs
-- Purpose: Security + audit trail
-- =============================================================
CREATE TABLE IF NOT EXISTS public.deletion_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id           UUID REFERENCES public.clients(id) ON DELETE SET NULL,

    deleted_table       TEXT NOT NULL,
    deleted_record_id   TEXT NOT NULL,
    reason              TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- INDEXES — for query performance
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_client_integrations_client_id ON public.client_integrations(client_id);
CREATE INDEX IF NOT EXISTS idx_job_runs_client_id ON public.job_runs(client_id);
CREATE INDEX IF NOT EXISTS idx_job_runs_started_at ON public.job_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_runs_status ON public.job_runs(status);
CREATE INDEX IF NOT EXISTS idx_client_events_client_id ON public.client_events(client_id);
CREATE INDEX IF NOT EXISTS idx_client_events_created_at ON public.client_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deletion_logs_client_id ON public.deletion_logs(client_id);

-- =============================================================
-- TRIGGERS — auto-update updated_at timestamps
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_client_integrations_updated_at
    BEFORE UPDATE ON public.client_integrations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_form_configs_updated_at
    BEFORE UPDATE ON public.form_configs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================
-- ROW LEVEL SECURITY — Enable on all user-facing tables
-- =============================================================
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deletion_logs ENABLE ROW LEVEL SECURITY;

-- clients: users can only see their own record (matched by email)
CREATE POLICY "clients_self_read" ON public.clients
    FOR SELECT USING (email = auth.email());

CREATE POLICY "clients_self_update" ON public.clients
    FOR UPDATE USING (email = auth.email());

-- client_integrations: owner access via client_id lookup
CREATE POLICY "integrations_owner_all" ON public.client_integrations
    FOR ALL USING (
        client_id IN (
            SELECT id FROM public.clients WHERE email = auth.email()
        )
    );

-- job_runs: owner read only (plan-gated in app layer for analytics)
CREATE POLICY "job_runs_owner_read" ON public.job_runs
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM public.clients WHERE email = auth.email()
        )
    );

-- client_events: owner read
CREATE POLICY "events_owner_read" ON public.client_events
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM public.clients WHERE email = auth.email()
        )
    );

-- deletion_logs: owner read
CREATE POLICY "deletion_logs_owner_read" ON public.deletion_logs
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM public.clients WHERE email = auth.email()
        )
    );

-- form_configs: public read (used by legacy plugin)
CREATE POLICY "form_configs_public_read" ON public.form_configs
    FOR SELECT USING (active = true);

-- =============================================================
-- SEED: default form_config (mirrors legacy form_1)
-- =============================================================
INSERT INTO public.form_configs (form_id, webhook_url, active)
VALUES ('form_1', 'https://nango1.app.n8n.cloud/webhook-test/insightflow', true)
ON CONFLICT (form_id) DO NOTHING;
