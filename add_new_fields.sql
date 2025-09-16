-- Add new fields to newsletters table
ALTER TABLE newsletters 
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT,
ADD COLUMN IF NOT EXISTS open_rate DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS ctr_rate DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS sponsorship_price INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN newsletters.linkedin_profile IS 'LinkedIn profile URL of the newsletter author';
COMMENT ON COLUMN newsletters.open_rate IS 'Average open rate percentage (0-100)';
COMMENT ON COLUMN newsletters.ctr_rate IS 'Average click-through rate percentage (0-100)';
COMMENT ON COLUMN newsletters.sponsorship_price IS 'Sponsorship price in euros';