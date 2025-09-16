-- Update newsletters table to align with requirements
-- Add new columns and update existing ones to match UI field names

ALTER TABLE newsletters 
-- Rename existing columns to match UI field names
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS rss_url TEXT,
ADD COLUMN IF NOT EXISTS signup_url TEXT,
ADD COLUMN IF NOT EXISTS cadence TEXT,
ADD COLUMN IF NOT EXISTS audience_size INTEGER,
ADD COLUMN IF NOT EXISTS monetization TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'it',
ADD COLUMN IF NOT EXISTS review_status TEXT CHECK (review_status IN ('in_review', 'approved', 'rejected')) DEFAULT 'in_review',
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Copy data from old columns to new columns if needed
UPDATE newsletters SET 
  title = name,
  website_url = website,
  contact_email = email_contatto,
  cadence = frequency,
  audience_size = subscribers,
  review_status = CASE 
    WHEN status = 'pending' THEN 'in_review'
    ELSE status
  END
WHERE title IS NULL;

-- Drop old columns after data migration (optional, keep for now for safety)
-- ALTER TABLE newsletters DROP COLUMN IF EXISTS name;
-- ALTER TABLE newsletters DROP COLUMN IF EXISTS website;
-- ALTER TABLE newsletters DROP COLUMN IF EXISTS email_contatto;
-- ALTER TABLE newsletters DROP COLUMN IF EXISTS frequency;
-- ALTER TABLE newsletters DROP COLUMN IF EXISTS subscribers;
-- ALTER TABLE newsletters DROP COLUMN IF EXISTS status;

-- Update RLS policies to use new review_status field
DROP POLICY IF EXISTS "Anyone can view approved newsletters" ON newsletters;
CREATE POLICY "Anyone can view approved newsletters" ON newsletters
  FOR SELECT USING (review_status = 'approved' OR user_id = auth.uid());

-- Add admin policy for newsletter management
DROP POLICY IF EXISTS "Admins can update newsletter status" ON newsletters;
CREATE POLICY "Admins can update newsletter status" ON newsletters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );