-- Migration: Add AI optimization columns

-- 1. Add ai_summary to businesses
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- 2. Add summary to conversations
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS summary TEXT;
