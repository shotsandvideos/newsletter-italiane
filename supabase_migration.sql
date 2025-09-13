-- Migration script to add missing columns to newsletters table
-- Run this in Supabase SQL Editor if tables already exist

-- Add missing columns to newsletters table if they don't exist
DO $$
BEGIN
    -- Add open_rate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'open_rate') THEN
        ALTER TABLE newsletters ADD COLUMN open_rate DECIMAL;
    END IF;
    
    -- Add ctr column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'ctr') THEN
        ALTER TABLE newsletters ADD COLUMN ctr DECIMAL;
    END IF;
    
    -- Add email_contatto column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'email_contatto') THEN
        ALTER TABLE newsletters ADD COLUMN email_contatto TEXT;
    END IF;
    
    -- Add linkedin_profile column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'linkedin_profile') THEN
        ALTER TABLE newsletters ADD COLUMN linkedin_profile TEXT;
    END IF;
    
    -- Modify frequency column to allow NULL if it's currently NOT NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'frequency' AND is_nullable = 'NO') THEN
        ALTER TABLE newsletters ALTER COLUMN frequency DROP NOT NULL;
    END IF;
    
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'newsletters'
ORDER BY ordinal_position;