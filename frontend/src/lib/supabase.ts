import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zidevnuuqhmcqnsgkgjv.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'MISSING_ANON_KEY';

if (supabaseKey === 'MISSING_ANON_KEY') {
    console.error("Missing VITE_SUPABASE_ANON_KEY in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
