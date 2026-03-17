-- AGGRESSIVE SUPABASE STORAGE FIX FOR 'avatars' BUCKET
-- Run this if upload is still failing

-- 1. Ensure the bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- 3. Create simplified, permissive policies
-- ALL users (public) can read
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- ALL AUTHENTICATED users can upload/update/delete any file in the bucket
-- This is much more reliably for development than ownership-based policies
CREATE POLICY "Anyone authenticated can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Anyone authenticated can update avatars"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Anyone authenticated can delete avatars"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
