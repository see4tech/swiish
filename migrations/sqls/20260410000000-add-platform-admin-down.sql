-- Rollback: remove platform admin column (requires SQLite 3.35+)
DROP INDEX IF EXISTS idx_users_platform_admin;
ALTER TABLE users DROP COLUMN is_platform_admin;
