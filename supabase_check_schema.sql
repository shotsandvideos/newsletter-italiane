-- Check existing tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check columns of newsletters table if it exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'newsletters'
ORDER BY ordinal_position;

-- Check columns of profiles table if it exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;