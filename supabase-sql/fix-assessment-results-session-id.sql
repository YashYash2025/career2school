-- Fix assessment_results table to make session_id nullable
-- This allows saving results without creating a session first

-- 1. Drop the NOT NULL constraint on session_id
ALTER TABLE assessment_results 
ALTER COLUMN session_id DROP NOT NULL;

-- 2. Drop the UNIQUE constraint on session_id (if exists)
ALTER TABLE assessment_results 
DROP CONSTRAINT IF EXISTS assessment_results_session_id_key;

-- 3. Make the foreign key constraint optional (ON DELETE SET NULL)
ALTER TABLE assessment_results 
DROP CONSTRAINT IF EXISTS assessment_results_session_id_fkey;

ALTER TABLE assessment_results 
ADD CONSTRAINT assessment_results_session_id_fkey 
FOREIGN KEY (session_id) 
REFERENCES assessment_sessions(id) 
ON DELETE SET NULL;

-- Verify the changes
SELECT 
  column_name, 
  is_nullable, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'assessment_results' 
  AND column_name = 'session_id';
