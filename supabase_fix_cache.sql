-- Fix for schema cache issue
-- Run this in Supabase SQL Editor to refresh the schema cache

-- First, drop the table completely and recreate it
DROP TABLE IF EXISTS newsletters CASCADE;

-- Recreate newsletters table with all required columns
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  website TEXT,
  frequency TEXT,
  price DECIMAL,
  subscribers INTEGER DEFAULT 0,
  open_rate DECIMAL,
  ctr DECIMAL,
  email_contatto TEXT,
  linkedin_profile TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletters
CREATE POLICY "Anyone can view approved newsletters" ON newsletters
  FOR SELECT USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Users can insert their own newsletters" ON newsletters
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own newsletters" ON newsletters
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own newsletters" ON newsletters
  FOR DELETE USING (user_id = auth.uid());

-- Verify the table was created correctly
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'newsletters'
ORDER BY ordinal_position;