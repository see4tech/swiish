-- Add platform admin flag to users table
ALTER TABLE users ADD COLUMN is_platform_admin INTEGER DEFAULT 0 NOT NULL;

-- Index to quickly find platform admins
CREATE INDEX IF NOT EXISTS idx_users_platform_admin ON users(is_platform_admin);

-- Promote the earliest user (existing installs) to platform admin
UPDATE users SET is_platform_admin = 1
WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1);
