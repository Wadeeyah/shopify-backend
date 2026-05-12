# 🧭 InsightFlow SaaS — Project Map & Source of Truth

> **Protocol**: B.L.A.S.T. (Blueprint → Link → Architect → Stylize → Trigger)
> **Status**: 🟡 Phase 2 — Connectivity Handshake
> **Last Updated**: 2026-02-19

---

## 📁 Directory Structure

```
/InsightFlow1
├── gemini.md                 # ← You are here (Source of Truth)
├── architecture/             # SOPs: auth_flow.md, data_flow.md
├── reference_snippets/       # UI screenshots (all 8 present ✅)
│   ├── hero.png
│   ├── client's_dashboard.png
│   ├── Admin's_dashboard.png
│   ├── Navigation panel on frontend.png
│   ├── Pricing_plans.png
│   ├── Testimonials.png
│   ├── Why_choose_Us_Section.png
│   └── How_it_works.png
├── src/                      # React Frontend (Vite + Tailwind)
├── supabase/                 # Migrations & RLS policies
├── workflows/                # n8n JSON exports
└── legacy_code/
    └── insightflow-automation-manager.php
```

---

## 🗄️ CANONICAL Data Schema (User-Confirmed 2026-02-19)

> ⚠️ This is the **Source of Truth**. Do not deviate without user approval.

---

### TABLE: `clients`
**Purpose**: Billing + plan control + identity

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | `gen_random_uuid()` |
| `email` | `text` UNIQUE | Primary identity |
| `plan` | `text` | enum: `basic` \| `standard` \| `premium` |
| `active` | `boolean` | Account active state |
| `wp_user_id` | `text` | Legacy WordPress user ID reference |
| `iss` | `text` | JWT issuer / origin site |
| `ls_customer_id` | `text` | LemonSqueezy customer ID |
| `ls_subscription_id` | `text` | LemonSqueezy subscription ID |
| `ls_variant_id` | `text` | LemonSqueezy variant (maps to plan) |
| `created_at` | `timestamptz` | `now()` |
| `updated_at` | `timestamptz` | `now()` |

---

### TABLE: `client_integrations`
**Purpose**: Automation configuration + encrypted credentials
> ⚡ **THIS IS THE EXECUTION SOURCE OF TRUTH**

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | |
| `client_id` | `uuid` (FK → clients.id) | |
| `shop_domain` | `text` | Shopify store domain |
| `delivery_channel` | `text` | enum: `email` \| `whatsapp` \| `slack` |
| `delivery_days` | `text[]` | Array of day names, e.g. `{Monday, Tuesday}` |
| `delivery_hour` | `integer` | Hour of day (0–23) UTC |
| `timezone` | `text` | IANA timezone string |
| `email_to` | `text` | Destination email |
| `whatsapp_to` | `text` | Destination phone with country code |
| `delivery_slack` | `text` | Slack channel / webhook |
| `shopify_token_ciphertext` | `text` | AES-GCM encrypted token |
| `shopify_token_iv` | `text` | Initialization vector |
| `shopify_token_tag` | `text` | Authentication tag |
| `whatsapp_token_ciphertext` | `text` | AES-GCM encrypted token |
| `whatsapp_token_iv` | `text` | Initialization vector |
| `whatsapp_token_tag` | `text` | Authentication tag |
| `slack_webhook_ciphertext` | `text` | AES-GCM encrypted webhook |
| `slack_webhook_iv` | `text` | Initialization vector |
| `slack_webhook_tag` | `text` | Authentication tag |
| `last_sent_at` | `timestamptz` | Last successful dispatch |
| `created_at` | `timestamptz` | `now()` |
| `updated_at` | `timestamptz` | `now()` |

---

### TABLE: `job_runs`
**Purpose**: Execution history + analytics + pricing enforcement

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | |
| `client_id` | `uuid` (FK → clients.id) | |
| `status` | `text` | enum: `pending` \| `success` \| `failed` |
| `delivery_channel` | `text` | Channel used for this run |
| `started_at` | `timestamptz` | |
| `finished_at` | `timestamptz` | |
| `error` | `text` | Error message if failed |
| `payload` | `jsonb` | Full request/response data |

---

### TABLE: `client_events`
**Purpose**: Admin monitoring + debugging + audit

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | |
| `client_id` | `uuid` (FK → clients.id) | |
| `type` | `text` | Event type: `credential_update`, `data_deletion`, `plan_change`, etc. |
| `payload` | `jsonb` | Contextual event data |
| `created_at` | `timestamptz` | `now()` |

---

### TABLE: `form_configs`
**Purpose**: WordPress plugin control

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | |
| `form_id` | `text` | Human-readable form key (e.g. `form_1`) |
| `webhook_url` | `text` | n8n ingest webhook |
| `active` | `boolean` | Enable/disable form |
| `created_at` | `timestamptz` | `now()` |
| `updated_at` | `timestamptz` | `now()` |

---

### TABLE: `deletion_logs`
**Purpose**: Security + audit trail

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | |
| `client_id` | `uuid` (FK → clients.id) | |
| `deleted_table` | `text` | Which table was affected |
| `deleted_record_id` | `text` | ID of the deleted record |
| `reason` | `text` | User-provided deletion reason |
| `created_at` | `timestamptz` | `now()` |

---

## 🎯 Plan-Gated Feature Matrix

| Feature | Basic | Standard | Premium |
|---|:---:|:---:|:---:|
| Delivery channels | 1 | Multiple | Multiple |
| Scheduled runs | Limited | ✅ Full | ✅ Full |
| Analytics dashboard (`job_runs`) | ❌ | ❌ | ✅ |
| Admin support tools | ❌ | ❌ | ✅ |
| Full event history (`client_events`) | ❌ | ❌ | ✅ |
| LemonSqueezy billing | ✅ | ✅ | ✅ |

---

## 🔐 Security & Auth

| Concern | Implementation |
|---|---|
| **User Auth** | Supabase Auth (JWT + RLS) |
| **Credential Encryption** | AES-GCM (ciphertext + iv + tag triplet per secret) |
| **Webhook Signing** | `X-Signature: HMAC-SHA256(body, API_SECRET)` |
| **Auth Gate** | Edge Function verifies `clients.active` + plan before n8n ingest |
| **Admin Access** | RLS policy: `role = 'admin'` column on `clients` |
| **WhatsApp Validation** | Regex: `^\+\d[\d\s\-()]{6,}$` (enforced on frontend) |

---

## ⚡ Delivery Preset Logic (from Legacy)

| Preset Key | Code | Allowed Methods |
|---|---|---|
| `all` | `all` | email, slack, whatsapp |
| `slack_email` | `1` | Single choice: email OR slack |
| `slack_whatsapp` | `2` | slack + whatsapp |
| `email` | `email` | email only (1 day) |

---

## 🔗 Connectivity (Phase 2)

| Service | Endpoint | Status |
|---|---|---|
| **Supabase** | `https://zidevnuuqhmcqnsgkgjv.supabase.co` | ✅ ACTIVE_HEALTHY (eu-west-1) |
| **n8n** | `https://nango1.app.n8n.cloud/webhook/insightflow` | ⚠️ 404 — Activate workflow in n8n editor |

---

## 📋 Phase Checklist

| Phase | Status | Notes |
|---|---|---|
| **0. Initialization** | ✅ Complete | Schema confirmed 2026-02-19 |
| **1. Blueprint** | ✅ Complete | Landing page, React scaffold, Readdy theme |
| **2. Link** | ✅ Complete | Supabase ✅ · n8n ⚠️ (activate workflow) |
| **3. Architect** | ✅ Complete | Auth flows + N8N data flows documented |
| **4. Stylize** | ✅ Complete | Dashboards + UI Components (Framer Motion) |
| **5. Trigger** | ✅ Complete | Build verified, strict mode passing |

---

## 🗒️ Reference Snippets Audit

| File | Found | Purpose |
|---|---|---|
| `hero.png` | ✅ | Landing page hero — "Finally, know exactly how your store is doing — without the stress." |
| `client's_dashboard.png` | ✅ | Page Views · Visitors · Click · Orders · Total Profit · Best Selling Products |
| `Admin's_dashboard.png` | ✅ | Financial overview · Transactions · Goals · Cost analysis |
| `Navigation panel on frontend.png` | ✅ | Left sidebar: Dashboard · Orders · Finance · Analytics · Settings |
| `Pricing_plans.png` | ✅ | Basic / Standard / Premium tiers |
| `Testimonials.png` | ✅ | Social proof cards |
| `Why_choose_Us_Section.png` | ✅ | Feature value cards |
| `How_it_works.png` | ✅ | Step-by-step flow |

---

## 📝 Change Log

| Date | Change | Phase |
|---|---|---|
| 2026-02-18 | Initialized project structure, extracted draft schema from legacy PHP | Phase 0 |
| 2026-02-19 | Replaced draft schema with canonical user-confirmed schema (6 tables) | Phase 0 |
| 2026-02-19 | Added plan-gated feature matrix, connectivity config | Phase 2 |
| 2026-02-19 | Applied migrations 001+002+003: 6 canonical tables created, RLS enabled on 11 tables, security advisors clean | Phase 2 |
| 2026-02-19 | **HANDSHAKE**: Supabase ✅ ACTIVE_HEALTHY · n8n ⚠️ pending workflow activation | Phase 2 |
