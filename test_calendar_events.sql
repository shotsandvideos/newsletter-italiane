-- Test calendar events for dashboard
-- Note: You'll need to replace the UUIDs with actual values from your database

-- Insert some test calendar events for the current user
-- First, get current user ID and some newsletter IDs
-- Replace these UUIDs with actual values from your profiles and newsletters tables

INSERT INTO calendar_events (
    proposal_id, 
    newsletter_id, 
    user_id,
    event_date, 
    title, 
    description, 
    status
) VALUES 
(
    gen_random_uuid(), -- proposal_id (can be null for now)
    (SELECT id FROM newsletters LIMIT 1), -- Use first available newsletter
    '5dd0b7e0-10c1-4776-a7f6-d9d5a76bbf43', -- antoniobellu@gmail.com user ID
    CURRENT_DATE + INTERVAL '2 days',
    'Newsletter Tech Weekly - Sponsorizzazione Apple',
    'Campagna sponsorizzazione per il nuovo iPhone',
    'scheduled'
),
(
    gen_random_uuid(), -- proposal_id
    (SELECT id FROM newsletters LIMIT 1),
    '5dd0b7e0-10c1-4776-a7f6-d9d5a76bbf43',
    CURRENT_DATE + INTERVAL '5 days',
    'Marketing News - Campagna Google',
    'Promozione prodotti Google Workspace',
    'scheduled'
),
(
    gen_random_uuid(), -- proposal_id
    (SELECT id FROM newsletters OFFSET 1 LIMIT 1), -- Use second newsletter if available
    '5dd0b7e0-10c1-4776-a7f6-d9d5a76bbf43',
    CURRENT_DATE + INTERVAL '1 week',
    'Startup Italia - Evento Microsoft',
    'Partnership strategica con Microsoft Azure',
    'scheduled'
);