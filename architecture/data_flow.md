# InsightFlow Data Flow

## Overview
Replaces the legacy WordPress `wp_remote_post` logic with a modern, decoupled JSON webhook architecture directly from React to n8n.

## The Sync Sequence (Frontend to n8n)

### 1. Payload Assembly
The React frontend (specifically the `<CredentialForm />`) gathers user input. 
Unlike the legacy plugin which stored plaintext on the server, the frontend prepares a direct JSON payload.

### 2. Encryption (In-Transit / At Rest)
- **Supabase DB Storage**: Sensitive fields (Shopify tokens, WhatsApp tokens) are sent to Supabase over HTTPS. Row Level Security policies ensure data isolation. Inside the DB, triggers or Postgres functions can use `pgcrypto` to encrypt the tokens (`aes-gcm`) before inserting into `client_integrations`.
- **N8N Execution**: When a scheduled job runs (via cron or n8n trigger), n8n pulls the encrypted token from Supabase, decrypts it using the shared secret context, and executes the API call to Shopify/Ad platforms.

### 3. Webhook Trigger (`/webhook/insightflow`)
For live testing or ad-hoc syncs, the frontend triggers the n8n webhook directly:

```json
POST https://nango1.app.n8n.cloud/webhook/insightflow
Content-Type: application/json
Authorization: Bearer <Supabase_JWT>

{
  "client_id": "uuid",
  "action": "trigger_sync",
  "channels": ["whatsapp", "email"]
}
```

### 4. N8N Core Logic
1. N8N receives the POST request.
2. Validates the `Authorization: Bearer <Supabase_JWT>` against the Supabase instance.
3. Queries Supabase `client_integrations` for the user's specific limits (`delivery_days`, `delivery_hour`, etc.).
4. Validates the `whatsapp_to` number against the strict regex `^\+\d[\d\s\-()]{6,}$`.
5. Pings Shopify/Meta APIs to pull recent analytics.
6. Packages the response into a sleek summary.
7. Dispatches the summary via configured channels (Email, Slack, WhatsApp).
8. Logs the status into `public.job_runs`.

## 5. Self-Healing & Fallbacks
- If Shopify API rate limits are hit, n8n queues the job with exponential backoff.
- If WhatsApp validation fails execution, the error is immediately written back to `job_runs.error`, and the React frontend's polling UI displays the ifam-shake animation.
