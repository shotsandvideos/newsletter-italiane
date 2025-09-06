-- Newsletter Italiane Database Schema - Supabase Auth Version
-- Run this in your Supabase SQL editor

-- Enable RLS (Row Level Security) 
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create profiles table for user data
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  email TEXT,
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletters table (updated for Supabase auth)
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL, -- Supabase user ID
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
CREATE INDEX profiles_email_idx ON profiles (email);
CREATE INDEX profiles_username_idx ON profiles (username);
CREATE INDEX profiles_role_idx ON profiles (role);
CREATE INDEX newsletters_user_id_idx ON newsletters (user_id);
CREATE INDEX newsletters_status_idx ON newsletters (status);
CREATE INDEX newsletters_categoria_idx ON newsletters (categoria);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Newsletter RLS Policies
-- Users can read their own newsletters
CREATE POLICY "Users can read their own newsletters" ON newsletters
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create newsletters for themselves
CREATE POLICY "Users can create their own newsletters" ON newsletters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own newsletters
CREATE POLICY "Users can update their own newsletters" ON newsletters
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can read all newsletters
CREATE POLICY "Admins can read all newsletters" ON newsletters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any newsletter
CREATE POLICY "Admins can update any newsletter" ON newsletters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_newsletters_updated_at 
  BEFORE UPDATE ON newsletters 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample categories (for reference)
COMMENT ON COLUMN newsletters.categoria IS 
'Valid categories: Business & Startup, Marketing & Growth, Tecnologia & AI, Design & Creatività, Lifestyle & Cultura, Finanza & Investimenti, Food & Travel, Sport & Fitness, Informazione & Attualità';

COMMENT ON COLUMN newsletters.numero_iscritti_tier IS 
'Valid tiers: 0 - 500, 500 - 1.000, 1.000 - 2.500, 2.500 - 5.000, 5.000 - 10.000, 10.000+';

COMMENT ON COLUMN newsletters.frequenza_invio IS 
'Valid frequencies: Quotidiana, Settimanale, Bisettimanale, Mensile, Irregolare';