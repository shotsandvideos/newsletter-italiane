-- Create proposal_chat table for admin-author communication
CREATE TABLE IF NOT EXISTS proposal_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'author')),
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- null for admin messages, user_id for author messages
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposal_chat_proposal_id ON proposal_chat(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_chat_created_at ON proposal_chat(created_at);
CREATE INDEX IF NOT EXISTS idx_proposal_chat_sender ON proposal_chat(sender_id);

-- Add comments for documentation
COMMENT ON TABLE proposal_chat IS 'Chat messages between admin and newsletter authors for proposals';
COMMENT ON COLUMN proposal_chat.proposal_id IS 'Reference to the proposal being discussed';
COMMENT ON COLUMN proposal_chat.message IS 'The chat message content';
COMMENT ON COLUMN proposal_chat.sender_type IS 'Type of sender: admin or author';
COMMENT ON COLUMN proposal_chat.sender_id IS 'User ID for authors, null for admin messages';

-- Enable Row Level Security
ALTER TABLE proposal_chat ENABLE ROW LEVEL SECURITY;

-- Create policies for proposal_chat
CREATE POLICY "Admins can view all chat messages" ON proposal_chat
    FOR SELECT USING (true); -- Admins can see everything via service role

CREATE POLICY "Users can view chat for their proposals" ON proposal_chat
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM proposal_newsletters pn
            WHERE pn.proposal_id = proposal_chat.proposal_id
            AND pn.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can create chat messages" ON proposal_chat
    FOR INSERT WITH CHECK (true); -- Admin panel will handle auth

CREATE POLICY "Authors can create chat messages for their proposals" ON proposal_chat
    FOR INSERT WITH CHECK (
        sender_type = 'author' 
        AND sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM proposal_newsletters pn
            WHERE pn.proposal_id = proposal_chat.proposal_id
            AND pn.user_id = auth.uid()
        )
    );

-- Create trigger to update updated_at on changes
CREATE OR REPLACE FUNCTION update_proposal_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_proposal_chat_updated_at
    BEFORE UPDATE ON proposal_chat
    FOR EACH ROW
    EXECUTE FUNCTION update_proposal_chat_updated_at();

-- Grant permissions
GRANT ALL ON proposal_chat TO postgres, service_role;
GRANT SELECT, INSERT ON proposal_chat TO authenticated;

-- Verify table structure
SELECT 'proposal_chat' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'proposal_chat' AND table_schema = 'public'
ORDER BY ordinal_position;