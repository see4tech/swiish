-- SQLite does not support DROP COLUMN before 3.35.0
-- The column will remain but the index is dropped
DROP INDEX IF EXISTS idx_users_super_admin;
