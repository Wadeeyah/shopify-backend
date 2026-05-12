-- Execute this in the Supabase SQL Editor
-- This script is idempotent: you can run it multiple times without errors.

-- (NEW) Fix for the Unique Constraint error: drop both constraints AND indexes
ALTER TABLE IF EXISTS public.clients DROP CONSTRAINT IF EXISTS clients_email_uniq CASCADE;
ALTER TABLE IF EXISTS public.clients DROP CONSTRAINT IF EXISTS clients_email_key CASCADE;
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_email_uniq CASCADE;
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_email_key CASCADE;

DROP INDEX IF EXISTS public.clients_email_uniq CASCADE;
DROP INDEX IF EXISTS public.clients_email_key CASCADE;
DROP INDEX IF EXISTS public.profiles_email_uniq CASCADE;
DROP INDEX IF EXISTS public.profiles_email_key CASCADE;

-- 1. Ensure profiles table and columns exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  store_id UUID UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Explicitly add email column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 4. Create handle_new_user function & trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  store_id UUID UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Explicitly add ALL columns to clients in case the table already existed without them
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS store_id UUID UNIQUE;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shop_domain TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shopify_token TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS ads_platform TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS ads_token TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS delivery_method TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS delivery_email TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS delivery_whatsapp TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS delivery_slack TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS schedule_days TEXT[];
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS delivery_time TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS plan TEXT;

-- 6. Enable RLS for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 7. Clients policies
DROP POLICY IF EXISTS "Users can view own client data" ON public.clients;
CREATE POLICY "Users can view own client data" 
ON public.clients FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own client data" ON public.clients;
CREATE POLICY "Users can update own client data" 
ON public.clients FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own client data" ON public.clients;
CREATE POLICY "Users can insert own client data" 
ON public.clients FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 8. Sync trigger: Profiles -> Clients
CREATE OR REPLACE FUNCTION public.sync_profile_to_client()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.clients (id, store_id, email)
  VALUES (new.id, new.store_id, new.email)
  ON CONFLICT (id) DO UPDATE
  SET store_id = EXCLUDED.store_id,
      email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  AFTER INSERT OR UPDATE OF store_id ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.sync_profile_to_client();

-- 9. RPC for secure store_id generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.generate_store_id()
RETURNS uuid AS $$
DECLARE
  new_store_id uuid;
  user_id uuid;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT store_id INTO new_store_id FROM public.profiles WHERE id = user_id;
  
  IF new_store_id IS NULL THEN
    new_store_id := uuid_generate_v4();
    -- Update profile (this will trigger the sync to clients)
    UPDATE public.profiles SET store_id = new_store_id WHERE id = user_id;
  END IF;
  
  RETURN new_store_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Final Backfill and Sync
INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- ---- NEW: ADMIN FORMS TABLE ----
-- We need to store Admin forms in Supabase so clients running on different browsers can fetch the correct Webhook URLs.
CREATE TABLE IF NOT EXISTS public.admin_forms (
  id TEXT PRIMARY KEY,
  title TEXT,
  author TEXT,
  date TEXT,
  delivery_preset TEXT,
  delivery_options TEXT[],
  schedules TEXT[],
  times TEXT[],
  webhook_url TEXT,
  lock_ads_fields BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and allow anyone to read forms (clients need to see settings). Only Service Role (or specific auth) can write.
ALTER TABLE public.admin_forms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view forms" ON public.admin_forms;
CREATE POLICY "Anyone can view forms" 
ON public.admin_forms FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage forms" ON public.admin_forms;
CREATE POLICY "Authenticated users can manage forms" 
ON public.admin_forms FOR ALL 
USING (auth.uid() IS NOT NULL);

-- 11. Force Supabase API to reload its schema cache
NOTIFY pgrst, 'reload schema';
