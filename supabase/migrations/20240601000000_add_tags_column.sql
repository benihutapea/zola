-- Add tags column to chats table
ALTER TABLE chats ADD COLUMN tags text[] DEFAULT '{}';