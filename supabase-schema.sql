-- Newsletter Italiane Database Schema
-- Run this in your Supabase SQL editor

-- Enable RLS (Row Level Security) 
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create newsletters table
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  nome_newsletter VARCHAR(80) NOT NULL,
  url_archivio TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  numero_iscritti_tier VARCHAR(20) NOT NULL,
  open_rate DECIMAL(5,2) NOT NULL CHECK (open_rate >= 0 AND open_rate <= 100),
  ctr DECIMAL(5,2) NOT NULL CHECK (ctr >= 0 AND ctr <= 100),
  prezzo_sponsorizzazione INTEGER NOT NULL CHECK (prezzo_sponsorizzazione >= 10), -- Euro cents
  email_contatto TEXT NOT NULL,
  descrizione TEXT NOT NULL CHECK (length(descrizione) >= 50 AND length(descrizione) <= 300),
  frequenza_invio VARCHAR(20),
  linkedin_profile TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX newsletters_user_id_idx ON newsletters (user_id);
CREATE INDEX newsletters_status_idx ON newsletters (status);
CREATE INDEX newsletters_categoria_idx ON newsletters (categoria);

-- Enable RLS
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only read their own newsletters
CREATE POLICY "Users can read their own newsletters" ON newsletters
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

-- Users can only create newsletters for themselves
CREATE POLICY "Users can create their own newsletters" ON newsletters
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can only update their own newsletters (but not status - that's admin only)
CREATE POLICY "Users can update their own newsletters" ON newsletters
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletters_updated_at 
  BEFORE UPDATE ON newsletters 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample categories (for reference)
COMMENT ON COLUMN newsletters.categoria IS 
'Valid categories: Business & Startup, Marketing & Growth, Tecnologia & AI, Design & Creatività, Lifestyle & Cultura, Finanza & Investimenti, Food & Travel, Sport & Fitness, Informazione & Attualità';

COMMENT ON COLUMN newsletters.numero_iscritti_tier IS 
'Valid tiers: 0 - 500, 500 - 1.000, 1.000 - 2.500, 2.500 - 5.000, 5.000 - 10.000, 10.000+';

COMMENT ON COLUMN newsletters.frequenza_invio IS 
'Valid frequencies: Quotidiana, Settimanale, Bisettimanale, Mensile, Irregolare';