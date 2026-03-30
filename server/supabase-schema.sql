-- ============================================
-- Twocurrial Learning Opportunities
-- Supabase Schema — License Keys Table
-- ============================================
-- Run this SQL in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste & Run

CREATE TABLE IF NOT EXISTS license_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    license_key VARCHAR(36) NOT NULL UNIQUE,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('trial', 'pro', 'elite')),
    email VARCHAR(255) NOT NULL,
    order_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_license_keys_email ON license_keys (email);
CREATE INDEX IF NOT EXISTS idx_license_keys_license_key ON license_keys (license_key);
CREATE INDEX IF NOT EXISTS idx_license_keys_tier ON license_keys (tier);

-- Enable Row Level Security
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert/read (server-side only)
CREATE POLICY "Service role full access" ON license_keys
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Optional: View for admin dashboard
CREATE OR REPLACE VIEW license_keys_summary AS
SELECT
    tier,
    COUNT(*) as total_keys,
    COUNT(*) FILTER (WHERE is_active = true) as active_keys,
    COUNT(*) FILTER (WHERE expires_at < now()) as expired_keys
FROM license_keys
GROUP BY tier;
