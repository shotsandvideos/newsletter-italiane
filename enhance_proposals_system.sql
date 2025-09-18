-- Enhance proposals system for multi-newsletter targeting
-- Execute this in Supabase SQL Editor

-- First, let's add the new fields to proposals table
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS admin_assets_images TEXT[], -- Array of image URLs/files
ADD COLUMN IF NOT EXISTS admin_copy_text TEXT,
ADD COLUMN IF NOT EXISTS admin_brief_text TEXT,
ADD COLUMN IF NOT EXISTS admin_tracking_links TEXT[]; -- Array of tracking URLs

-- Create proposal_newsletters junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS proposal_newsletters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    newsletter_id UUID REFERENCES newsletters(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    selected_run_date DATE NULL,
    decline_reason TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(proposal_id, newsletter_id) -- Prevent duplicate entries
);

-- Create calendar_events table for scheduling
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    newsletter_id UUID REFERENCES newsletters(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposal_newsletters_proposal_id ON proposal_newsletters(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_newsletters_newsletter_id ON proposal_newsletters(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_proposal_newsletters_user_id ON proposal_newsletters(user_id);
CREATE INDEX IF NOT EXISTS idx_proposal_newsletters_status ON proposal_newsletters(status);

CREATE INDEX IF NOT EXISTS idx_calendar_events_proposal_id ON calendar_events(proposal_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_newsletter_id ON calendar_events(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_date ON calendar_events(event_date);

-- Add comments for documentation
COMMENT ON COLUMN proposals.admin_assets_images IS 'Array of image URLs/files provided by admin';
COMMENT ON COLUMN proposals.admin_copy_text IS 'Copy text provided by admin for the campaign';
COMMENT ON COLUMN proposals.admin_brief_text IS 'Brief/instructions provided by admin';
COMMENT ON COLUMN proposals.admin_tracking_links IS 'Array of tracking URLs provided by admin';

COMMENT ON TABLE proposal_newsletters IS 'Junction table linking proposals to specific newsletters';
COMMENT ON COLUMN proposal_newsletters.proposal_id IS 'Reference to the proposal';
COMMENT ON COLUMN proposal_newsletters.newsletter_id IS 'Reference to the target newsletter';
COMMENT ON COLUMN proposal_newsletters.user_id IS 'Owner of the newsletter';
COMMENT ON COLUMN proposal_newsletters.status IS 'Status for this specific proposal-newsletter pair';
COMMENT ON COLUMN proposal_newsletters.selected_run_date IS 'Date selected by newsletter owner for execution';
COMMENT ON COLUMN proposal_newsletters.decline_reason IS 'Reason for rejection by newsletter owner';

COMMENT ON TABLE calendar_events IS 'Calendar events created from accepted proposals';
COMMENT ON COLUMN calendar_events.proposal_id IS 'Reference to the original proposal';
COMMENT ON COLUMN calendar_events.newsletter_id IS 'Reference to the newsletter';
COMMENT ON COLUMN calendar_events.user_id IS 'Owner of the newsletter/event';
COMMENT ON COLUMN calendar_events.event_date IS 'Scheduled date for the campaign execution';

-- Enable Row Level Security
ALTER TABLE proposal_newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for proposal_newsletters
CREATE POLICY "Users can view proposals for their newsletters" ON proposal_newsletters
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can create proposal-newsletter links" ON proposal_newsletters
    FOR INSERT WITH CHECK (true); -- API will handle auth

CREATE POLICY "Users can update their proposal status" ON proposal_newsletters
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Create policies for calendar_events
CREATE POLICY "Users can view their calendar events" ON calendar_events
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can create calendar events" ON calendar_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their calendar events" ON calendar_events
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Remove the old single-target fields from proposals since we now use proposal_newsletters
-- Note: We keep them for backward compatibility, but new proposals will use the junction table
-- ALTER TABLE proposals DROP COLUMN IF EXISTS status;
-- ALTER TABLE proposals DROP COLUMN IF EXISTS selected_run_date;
-- ALTER TABLE proposals DROP COLUMN IF EXISTS decline_reason;

-- Display final table structures
SELECT 'proposals' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'proposals' AND table_schema = 'public'
UNION ALL
SELECT 'proposal_newsletters' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'proposal_newsletters' AND table_schema = 'public'
UNION ALL
SELECT 'calendar_events' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'calendar_events' AND table_schema = 'public'
ORDER BY table_name, column_name;