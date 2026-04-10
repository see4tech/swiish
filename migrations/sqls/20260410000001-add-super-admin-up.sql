ALTER TABLE users ADD COLUMN is_super_admin INTEGER DEFAULT 0 NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_super_admin ON users(is_super_admin);
