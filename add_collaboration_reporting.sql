-- Adds creator preview link and performance reporting fields to proposal_newsletters
-- Run this in Supabase SQL editor or via migration tool before deploying the code changes

ALTER TABLE proposal_newsletters
  ADD COLUMN IF NOT EXISTS creator_preview_url TEXT,
  ADD COLUMN IF NOT EXISTS creator_results_views INTEGER,
  ADD COLUMN IF NOT EXISTS creator_results_open_rate NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS creator_results_ctr NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS creator_results_clicks INTEGER,
  ADD COLUMN IF NOT EXISTS creator_results_submitted_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN proposal_newsletters.creator_preview_url IS 'Preview link provided by the newsletter author for the sponsored campaign';
COMMENT ON COLUMN proposal_newsletters.creator_results_views IS 'Actual impressions/views reported by the author after the campaign';
COMMENT ON COLUMN proposal_newsletters.creator_results_open_rate IS 'Actual open rate % reported post-campaign';
COMMENT ON COLUMN proposal_newsletters.creator_results_ctr IS 'Actual click-through rate % reported post-campaign';
COMMENT ON COLUMN proposal_newsletters.creator_results_clicks IS 'Actual link clicks reported post-campaign';
COMMENT ON COLUMN proposal_newsletters.creator_results_submitted_at IS 'Timestamp when the author submitted final campaign results';
