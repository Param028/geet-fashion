-- GEET FASHION BOUTIQUE - SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor to initialize your database and fix RLS errors

-- 1. DESIGNS TABLE
CREATE TABLE IF NOT EXISTS designs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  measurements JSONB DEFAULT '{}'::jsonb,
  "preferredDesigns" JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. ADMIN CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL
);

-- INSERT ADMIN CREDENTIALS
INSERT INTO admin_users (username, password)
VALUES ('gsj6600', '6600')
ON CONFLICT (username) DO UPDATE 
SET password = EXCLUDED.password;

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 5. TABLE POLICIES (Fixes "new row violates row level security policy" for Data)

-- Allow public access to Designs
DROP POLICY IF EXISTS "Public Designs Access" ON designs;
CREATE POLICY "Public Designs Access" ON designs
FOR ALL USING (true) WITH CHECK (true);

-- Allow public access to Customers
DROP POLICY IF EXISTS "Public Customers Access" ON customers;
CREATE POLICY "Public Customers Access" ON customers
FOR ALL USING (true) WITH CHECK (true);

-- 6. STORAGE POLICIES (Fixes "new row violates..." during Image Upload)

-- Note: You must first create a bucket named 'designs' in the Storage menu.

-- Allow Public Uploads (INSERT) to 'designs' bucket
DROP POLICY IF EXISTS "Allow Public Uploads" ON storage.objects;
CREATE POLICY "Allow Public Uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'designs');

-- Allow Public Viewing (SELECT) from 'designs' bucket
DROP POLICY IF EXISTS "Allow Public Selects" ON storage.objects;
CREATE POLICY "Allow Public Selects" ON storage.objects
FOR SELECT USING (bucket_id = 'designs');

-- Allow Public Updates/Deletes in 'designs' bucket
DROP POLICY IF EXISTS "Allow Public Updates" ON storage.objects;
CREATE POLICY "Allow Public Updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'designs');

DROP POLICY IF EXISTS "Allow Public Deletes" ON storage.objects;
CREATE POLICY "Allow Public Deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'designs');
