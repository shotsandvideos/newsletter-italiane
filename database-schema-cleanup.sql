-- Database Schema Cleanup Script
-- This script resolves field name inconsistencies in the newsletters table
-- Run this in Supabase SQL Editor

-- 1. First, let's see the current structure
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

-- 2. Add missing columns that are expected by the application
ALTER TABLE newsletters 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'it',
ADD COLUMN IF NOT EXISTS signup_url TEXT,
ADD COLUMN IF NOT EXISTS cadence TEXT,
ADD COLUMN IF NOT EXISTS audience_size INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monetization TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT,
ADD COLUMN IF NOT EXISTS open_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ctr_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sponsorship_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS author_first_name TEXT,
ADD COLUMN IF NOT EXISTS author_last_name TEXT,
ADD COLUMN IF NOT EXISTS author_email TEXT,
ADD COLUMN IF NOT EXISTS review_status TEXT CHECK (review_status IN ('in_review', 'approved', 'rejected')) DEFAULT 'in_review';

-- 3. Migrate data from old columns to new columns if they exist
DO $$
BEGIN
    -- Migrate name to title if title is empty
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'name') THEN
        UPDATE newsletters SET title = name WHERE title IS NULL OR title = '';
    END IF;
    
    -- Migrate website to signup_url if signup_url is empty  
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'website') THEN
        UPDATE newsletters SET signup_url = website WHERE signup_url IS NULL OR signup_url = '';
    END IF;
    
    -- Migrate frequency to cadence if cadence is empty
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'frequency') THEN
        UPDATE newsletters SET cadence = frequency WHERE cadence IS NULL OR cadence = '';
    END IF;
    
    -- Migrate subscribers to audience_size if audience_size is 0
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'subscribers') THEN
        UPDATE newsletters SET audience_size = subscribers WHERE audience_size = 0 AND subscribers > 0;
    END IF;
    
    -- Migrate price to sponsorship_price if sponsorship_price is 0
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'price') THEN
        UPDATE newsletters SET sponsorship_price = price WHERE sponsorship_price = 0 AND price > 0;
    END IF;
    
    -- Migrate status to review_status
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletters' AND column_name = 'status') THEN
        UPDATE newsletters SET review_status = CASE 
            WHEN status = 'pending' THEN 'in_review'
            WHEN status = 'approved' THEN 'approved'
            WHEN status = 'rejected' THEN 'rejected'
            ELSE 'in_review'
        END WHERE review_status = 'in_review';
    END IF;
END $$;

-- 4. Set default values for required fields that might be NULL
UPDATE newsletters SET
    title = COALESCE(title, name, 'Untitled Newsletter'),
    contact_email = COALESCE(contact_email, author_email, 'noreply@example.com'),
    author_email = COALESCE(author_email, contact_email, 'noreply@example.com'),
    open_rate = COALESCE(open_rate, 0),
    ctr_rate = COALESCE(ctr_rate, 0), 
    sponsorship_price = COALESCE(sponsorship_price, 0),
    audience_size = COALESCE(audience_size, 0),
    review_status = COALESCE(review_status, 'in_review')
WHERE 
    title IS NULL 
    OR contact_email IS NULL 
    OR author_email IS NULL
    OR open_rate IS NULL
    OR ctr_rate IS NULL
    OR sponsorship_price IS NULL
    OR audience_size IS NULL
    OR review_status IS NULL;

-- 5. Add constraints for data validation
ALTER TABLE newsletters 
ADD CONSTRAINT IF NOT EXISTS check_open_rate CHECK (open_rate >= 0 AND open_rate <= 100),
ADD CONSTRAINT IF NOT EXISTS check_ctr_rate CHECK (ctr_rate >= 0 AND ctr_rate <= 100),
ADD CONSTRAINT IF NOT EXISTS check_sponsorship_price CHECK (sponsorship_price >= 0),
ADD CONSTRAINT IF NOT EXISTS check_audience_size CHECK (audience_size >= 0);

-- 6. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_newsletters_title ON newsletters(title);
CREATE INDEX IF NOT EXISTS idx_newsletters_category ON newsletters(category);
CREATE INDEX IF NOT EXISTS idx_newsletters_review_status ON newsletters(review_status);
CREATE INDEX IF NOT EXISTS idx_newsletters_open_rate ON newsletters(open_rate);
CREATE INDEX IF NOT EXISTS idx_newsletters_sponsorship_price ON newsletters(sponsorship_price);
CREATE INDEX IF NOT EXISTS idx_newsletters_user_id ON newsletters(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at);

-- 7. Update RLS policies to use new field names
DROP POLICY IF EXISTS "Anyone can view approved newsletters" ON newsletters;
CREATE POLICY "Anyone can view approved newsletters" ON newsletters
    FOR SELECT USING (review_status = 'approved' OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own newsletters" ON newsletters;
CREATE POLICY "Users can insert their own newsletters" ON newsletters
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own newsletters" ON newsletters;
CREATE POLICY "Users can update their own newsletters" ON newsletters
    FOR UPDATE USING (user_id = auth.uid());

-- Admin policy for newsletter management
DROP POLICY IF EXISTS "Admins can update all newsletters" ON newsletters;
CREATE POLICY "Admins can update all newsletters" ON newsletters
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 8. Add comments for documentation
COMMENT ON COLUMN newsletters.title IS 'Newsletter title/name';
COMMENT ON COLUMN newsletters.signup_url IS 'URL where users can sign up for the newsletter';
COMMENT ON COLUMN newsletters.cadence IS 'How often the newsletter is sent (daily, weekly, etc.)';
COMMENT ON COLUMN newsletters.audience_size IS 'Number of subscribers';
COMMENT ON COLUMN newsletters.monetization IS 'How the newsletter monetizes (ads, subscriptions, etc.)';
COMMENT ON COLUMN newsletters.contact_email IS 'Contact email for the newsletter';
COMMENT ON COLUMN newsletters.linkedin_profile IS 'LinkedIn profile URL of the newsletter author';
COMMENT ON COLUMN newsletters.open_rate IS 'Average open rate percentage (0-100)';
COMMENT ON COLUMN newsletters.ctr_rate IS 'Average click-through rate percentage (0-100)';
COMMENT ON COLUMN newsletters.sponsorship_price IS 'Sponsorship price in euros';
COMMENT ON COLUMN newsletters.author_first_name IS 'First name of the newsletter author';
COMMENT ON COLUMN newsletters.author_last_name IS 'Last name of the newsletter author';
COMMENT ON COLUMN newsletters.author_email IS 'Email address of the newsletter author';
COMMENT ON COLUMN newsletters.review_status IS 'Review status: in_review, approved, or rejected';

-- 9. Display final table structure
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

-- 10. Show sample data to verify migration
SELECT 
    id,
    title,
    signup_url,
    cadence,
    audience_size,
    open_rate,
    ctr_rate,
    sponsorship_price,
    review_status,
    created_at
FROM newsletters
LIMIT 5;