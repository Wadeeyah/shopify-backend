import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zidevnuuqhmcqnsgkgjv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey || supabaseKey === 'your_anon_key_here') {
    console.log('ERROR: VITE_SUPABASE_ANON_KEY is missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignupAndLogin() {
    const testEmail = `client_${Date.now()}@insightflow.io`;
    const testPassword = 'SecurePassword123!';

    console.log(`\n--- 1. Testing SignUp for ${testEmail} ---`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword
    });

    if (signUpError) {
        console.error('SIGNUP FAILED:', signUpError.message);
        console.error('Full Error:', JSON.stringify(signUpError, null, 2));
        return;
    }
    console.log('SignUp Success! User ID:', signUpData.user?.id);
    console.log('Confirmed At:', signUpData.user?.email_confirmed_at);
    console.log('Session returned?', !!signUpData.session);

    console.log(`\n--- 2. Testing Login for ${testEmail} ---`);
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
    });

    if (loginError) {
        console.error('LOGIN FAILED:', loginError.message);
        console.error('Full Error:', JSON.stringify(loginError, null, 2));
    } else {
        console.log('LOGIN SUCCESS!');
        console.log('Session:', !!loginData.session);
    }
}

testSignupAndLogin();
