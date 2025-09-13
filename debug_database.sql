-- Debug script to check current database state
-- Run this in Supabase SQL Editor to see what's wrong

-- Check if tables exist
SELECT 'Tables that exist:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check newsletters table structure if it exists
SELECT 'Newsletters table columns:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'newsletters'
ORDER BY ordinal_position;

-- Check profiles table structure if it exists  
SELECT 'Profiles table columns:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if RLS policies exist
SELECT 'Existing policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';