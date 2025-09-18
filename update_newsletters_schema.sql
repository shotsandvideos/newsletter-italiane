-- Complete SQL schema update for newsletters table with all new fields
-- Execute this in Supabase SQL Editor

-- Fix title/name column issue - ensure we have title column
DO $$ 
BEGIN 
    -- Check if name column exists and title doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'name') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'title') 
    THEN
        -- Rename name to title
        ALTER TABLE newsletters RENAME COLUMN name TO title;
    END IF;
    
    -- If neither exists, add title
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'title') 
    THEN
        ALTER TABLE newsletters ADD COLUMN title TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add new columns if they don't exist
ALTER TABLE newsletters 
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT,
ADD COLUMN IF NOT EXISTS open_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ctr_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sponsorship_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS author_first_name TEXT,
ADD COLUMN IF NOT EXISTS author_last_name TEXT,
ADD COLUMN IF NOT EXISTS author_email TEXT;

-- Remove unused columns
ALTER TABLE newsletters 
DROP COLUMN IF EXISTS website_url,
DROP COLUMN IF EXISTS rss_url;

-- Add constraints for data validation (only if they don't exist)
DO $$ 
BEGIN 
    -- Add open_rate constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_open_rate' AND table_name = 'newsletters'
    ) THEN
        ALTER TABLE newsletters ADD CONSTRAINT check_open_rate CHECK (open_rate >= 0 AND open_rate <= 100);
    END IF;
    
    -- Add ctr_rate constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_ctr_rate' AND table_name = 'newsletters'
    ) THEN
        ALTER TABLE newsletters ADD CONSTRAINT check_ctr_rate CHECK (ctr_rate >= 0 AND ctr_rate <= 100);
    END IF;
    
    -- Add sponsorship_price constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_sponsorship_price' AND table_name = 'newsletters'
    ) THEN
        ALTER TABLE newsletters ADD CONSTRAINT check_sponsorship_price CHECK (sponsorship_price >= 0);
    END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_newsletters_open_rate ON newsletters(open_rate);
CREATE INDEX IF NOT EXISTS idx_newsletters_sponsorship_price ON newsletters(sponsorship_price);
CREATE INDEX IF NOT EXISTS idx_newsletters_review_status ON newsletters(review_status);

-- Add comments for documentation
COMMENT ON COLUMN newsletters.linkedin_profile IS 'LinkedIn profile URL of the newsletter author';
COMMENT ON COLUMN newsletters.open_rate IS 'Average open rate percentage (0-100)';
COMMENT ON COLUMN newsletters.ctr_rate IS 'Average click-through rate percentage (0-100)';
COMMENT ON COLUMN newsletters.sponsorship_price IS 'Sponsorship price in euros';
COMMENT ON COLUMN newsletters.rejection_reason IS 'Reason for newsletter rejection (only when review_status is rejected)';
COMMENT ON COLUMN newsletters.author_first_name IS 'First name of the newsletter author';
COMMENT ON COLUMN newsletters.author_last_name IS 'Last name of the newsletter author';
COMMENT ON COLUMN newsletters.author_email IS 'Email address of the newsletter author';

-- Update existing records to have default values for new fields
UPDATE newsletters 
SET 
    open_rate = 0,
    ctr_rate = 0,
    sponsorship_price = 0
WHERE 
    open_rate IS NULL 
    OR ctr_rate IS NULL 
    OR sponsorship_price IS NULL;

-- Display final table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'newsletters' 
    AND table_schema = 'public'
ORDER BY 
    ordinal_position;