-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('creator', 'admin')) DEFAULT 'creator',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletters table if not exists
CREATE TABLE IF NOT EXISTS newsletters (
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

-- Enable Row Level Security (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view approved newsletters" ON newsletters;
DROP POLICY IF EXISTS "Users can insert their own newsletters" ON newsletters;
DROP POLICY IF EXISTS "Users can update their own newsletters" ON newsletters;
DROP POLICY IF EXISTS "Users can delete their own newsletters" ON newsletters;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for newsletters
CREATE POLICY "Anyone can view approved newsletters" ON newsletters
  FOR SELECT USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Users can insert their own newsletters" ON newsletters
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own newsletters" ON newsletters
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own newsletters" ON newsletters
  FOR DELETE USING (user_id = auth.uid());