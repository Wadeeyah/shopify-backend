import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zidevnuuqhmcqnsgkgjv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey || supabaseKey === 'your_anon_key_here') {
    console.log('ERROR: VITE_SUPABASE_ANON_KEY is missing or invalid in .env / .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
    console.log('Testing login for admin@insightflow.io...');
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@insightflow.io',
        password: 'InsightFlowAdmin2026!$'
    });

    if (error) {
        console.error('LOGIN FAILED:', error.message);
        console.error('Full Error Object:', JSON.stringify(error, null, 2));
    } else {
        console.log('LOGIN SUCCESSFUL!');
        console.log('User Role:', data.user?.user_metadata?.role);
    }
}

testLogin();
