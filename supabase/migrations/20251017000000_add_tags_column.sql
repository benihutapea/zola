-- Add tags column to chats table
ALTER TABLE chats ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';