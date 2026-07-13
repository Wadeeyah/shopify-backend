/**
 * Call the n8n webhook URL directly.
 *
 * The webhook URL is configured by the admin in the Form Editor and passed
 * as a prop to CredentialForm via IntegrationsPage. It is stored in
 * localStorage via FormManager.
 *
 * Settings are always persisted locally as well so they survive refreshes
 * even if no webhook URL is configured yet.
 */
export async function callN8nProxy(payload: Record<string, unknown> = {}) {
    const webhookUrl = (payload.webhookUrl as string | undefined)?.trim() || import.meta.env.VITE_N8N_WEBHOOK_URL;

    // Always persist settings locally
    if (payload.action === 'save') {
        try {
            const key = `ifam_client_settings_${payload.shopDomain ?? 'default'}`;
            localStorage.setItem(key, JSON.stringify({ ...payload, savedAt: new Date().toISOString() }));
        } catch {
            // ignore localStorage errors
        }
    }

    // If no webhook URL is configured, return a local-save success
    if (!webhookUrl) {
        console.info('[n8n] No webhook URL configured — saved locally only.');
        return { status: 'local_save' };
    }

    // 4. Call the n8n webhook directly
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => response.statusText);
        throw new Error(`Webhook responded with ${response.status}: ${text}`);
    }

    // Parse response (n8n can return JSON or plain text)
    const text = await response.text();
    try { return JSON.parse(text); } catch { return { message: text }; }
}
