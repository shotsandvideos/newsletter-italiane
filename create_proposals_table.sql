-- Create proposals table for campaign management
-- Execute this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    sponsorship_type TEXT NOT NULL,
    campaign_start_date DATE NOT NULL,
    campaign_end_date DATE NOT NULL,
    product_type TEXT NOT NULL,
    ideal_target_audience TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    selected_run_date DATE NULL,
    decline_reason TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table if it doesn't exist (for chat functionality)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    from_admin BOOLEAN DEFAULT FALSE,
    to_email TEXT,
    newsletter_id UUID NULL,
    subject TEXT,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_proposal_id ON messages(proposal_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- Add comments for documentation
COMMENT ON TABLE proposals IS 'Campaign proposals from admin to users';
COMMENT ON COLUMN proposals.brand_name IS 'Name of the brand/company making the proposal';
COMMENT ON COLUMN proposals.sponsorship_type IS 'Type of sponsorship offered';
COMMENT ON COLUMN proposals.campaign_start_date IS 'Start date of the campaign period';
COMMENT ON COLUMN proposals.campaign_end_date IS 'End date of the campaign period';
COMMENT ON COLUMN proposals.product_type IS 'Type of product being promoted';
COMMENT ON COLUMN proposals.ideal_target_audience IS 'Description of ideal target audience';
COMMENT ON COLUMN proposals.status IS 'Current status: pending, accepted, rejected';
COMMENT ON COLUMN proposals.selected_run_date IS 'Date selected by user for campaign execution';
COMMENT ON COLUMN proposals.decline_reason IS 'Reason provided when proposal is rejected';

COMMENT ON TABLE messages IS 'Messages exchanged between admin and users';
COMMENT ON COLUMN messages.proposal_id IS 'Reference to proposal (nullable for non-proposal messages)';
COMMENT ON COLUMN messages.user_id IS 'User who sent/received the message';
COMMENT ON COLUMN messages.from_admin IS 'True if message is from admin to user';

-- Enable Row Level Security
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for proposals
CREATE POLICY "Users can view all proposals" ON proposals
    FOR SELECT USING (true);

CREATE POLICY "Admins can create proposals" ON proposals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        ) OR auth.uid() IS NULL -- Allow API calls without user context
    );

CREATE POLICY "Authenticated users can update proposals" ON proposals
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create policies for messages
CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can insert messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Display final table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name IN ('proposals', 'messages')
    AND table_schema = 'public'
ORDER BY 
    table_name, ordinal_position;