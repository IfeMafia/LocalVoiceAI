-- FINAL SUPABASE STORAGE FIX
-- The error happened because the app uses custom login (not Supabase Auth).
-- This means the frontend client is seen as 'anonymous' by Supabase.

-- 1. Ensure bucket is public
UPDATE storage.buckets SET public = true WHERE id = 'avatars';

-- 2. Clear all previous policies for this bucket
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone authenticated can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone authenticated can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone authenticated can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;

-- 3. Create 'Public' policies (allowing anonymous uploads)
-- This is necessary because we use custom Auth and not Supabase Auth
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

CREATE POLICY "Public Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Public Update Access" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'avatars' );

CREATE POLICY "Public Delete Access" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'avatars' );
