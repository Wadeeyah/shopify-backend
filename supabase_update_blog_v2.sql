-- Supabase Database Update V2 for WordPress Classic Redesign
-- Run this in your Supabase SQL Editor

-- 1. Add post_type for Pages feature
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'post' CHECK (post_type IN ('post', 'page'));

-- 2. Add categories and tags arrays
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
