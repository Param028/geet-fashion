-- GEET FASHION BOUTIQUE - SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor to initialize your database

-- 1. DESIGNS TABLE
-- Stores portfolio pieces and gallery items
CREATE TABLE IF NOT EXISTS designs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL, -- Stores Cloud URL or Base64
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CUSTOMERS TABLE
-- Stores client registry, measurements, and preferred designs
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  measurements JSONB DEFAULT '{}'::jsonb,
  "preferredDesigns" JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. ADMIN CREDENTIALS TABLE
-- Stores the secure access credentials for the admin dashboard
CREATE TABLE IF NOT EXISTS admin_users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL
);

-- INSERT ADMIN CREDENTIALS
-- Username: gsj6600
-- Password: 6600
INSERT INTO admin_users (username, password)
VALUES ('gsj6600', '6600')
ON CONFLICT (username) DO UPDATE 
SET password = EXCLUDED.password;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- The application currently uses the Supabase Anon Key for operations.
-- We must enable public access policies for the app to function without Supabase Auth Sign-in.

-- Enable RLS on tables
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create Policies for Designs (Public Read/Write)
CREATE POLICY "Public Designs Access" ON designs
FOR ALL USING (true) WITH CHECK (true);

-- Create Policies for Customers (Public Read/Write)
CREATE POLICY "Public Customers Access" ON customers
FOR ALL USING (true) WITH CHECK (true);

-- Note: The Admin Users table is left private by default (no policy) for security.
-- The app currently validates these credentials using the client-side constants.

-- 5. STORAGE BUCKET SETUP INSTRUCTION
-- You must manually create a bucket named 'designs' in the Supabase Storage dashboard
-- and set its "Public Access" to TRUE.