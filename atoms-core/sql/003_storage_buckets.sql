-- 003_storage_buckets.sql
-- Create "fonts" bucket for user uploads

-- 1. Create Bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('fonts', 'fonts', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies (Allow Public Read, Authenticated Upload)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'fonts' );

CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'fonts' );
