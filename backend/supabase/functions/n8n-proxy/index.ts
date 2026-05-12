import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    try {
        // Read secrets from environment (set via Supabase Dashboard → Edge Functions → Manage Secrets)
        const ifamSecret = Deno.env.get('IFAM_API_SECRET');
        const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');

        if (!ifamSecret || !n8nWebhookUrl) {
            console.error('Missing required secrets: IFAM_API_SECRET or N8N_WEBHOOK_URL');
            return new Response(
                JSON.stringify({ error: 'Server configuration error' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Parse the incoming request body from the frontend
        const payload = await req.json();

        // Forward the request to n8n with the IFAM secret header for verification
        const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-ifam-secret': ifamSecret,
            },
            body: JSON.stringify(payload),
        });

        // Get the response from n8n
        const n8nData = await n8nResponse.text();

        // Try to parse as JSON, fallback to wrapping as text
        let responseBody: string;
        try {
            const parsed = JSON.parse(n8nData);
            responseBody = JSON.stringify(parsed);
        } catch {
            responseBody = JSON.stringify({ message: n8nData });
        }

        return new Response(responseBody, {
            status: n8nResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Edge Function error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
