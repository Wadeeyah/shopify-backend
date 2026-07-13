-- Supabase Database Setup for Blog & Waitlist Feature
-- Please run this script in your Supabase SQL Editor

-- 1. Create Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id SERIAL PRIMARY KEY,
    blog_waitlist_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default row if none exists
INSERT INTO public.site_settings (id, blog_waitlist_active)
SELECT 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE id = 1);

-- Enable RLS for settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Public can view site settings" ON public.site_settings
    FOR SELECT USING (true);

-- Only authenticated users can update settings (you can restrict this to admins later)
CREATE POLICY "Authenticated users can update settings" ON public.site_settings
    FOR UPDATE USING (auth.role() = 'authenticated');
    
CREATE POLICY "Authenticated users can insert settings" ON public.site_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 2. Create Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    cover_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author_name TEXT DEFAULT 'InsightFlow Admin',
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
DROP TRIGGER IF EXISTS handle_posts_updated_at ON public.posts;
CREATE TRIGGER handle_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can view published posts
CREATE POLICY "Public can view published posts" ON public.posts
    FOR SELECT USING (status = 'published');

-- Authenticated users have full access to posts (for admin panel)
CREATE POLICY "Authenticated users have full access to posts" ON public.posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Create a storage bucket for blog images if you haven't already
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog-images
CREATE POLICY "Public can view blog images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');
    
CREATE POLICY "Authenticated users can modify blog images" ON storage.objects
    FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'blog-images');
