import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Create a Supabase client with the Auth context of the user making the request
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Get the session / user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 3. Admin client to bypass RLS for DB modifications if needed
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 4. Check if a profile with a store_id already exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('store_id')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') { // Ignore "no rows returned" error
      throw profileError
    }

    if (profile?.store_id) {
      // They already have one
      return new Response(JSON.stringify({ store_id: profile.store_id, message: 'Existing store ID used.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 5. Generate a new valid UUID for the store_id
    const newStoreId = crypto.randomUUID()

    // 6. Update the user's profile with the new store_id
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: user.id, store_id: newStoreId })

    if (updateError) {
      throw updateError
    }

    // 7. Return success
    return new Response(JSON.stringify({ store_id: newStoreId, message: 'New store ID generated.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
