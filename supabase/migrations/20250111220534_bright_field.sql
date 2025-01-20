/*
  # Add milestones JSON column with validation
  
  1. Changes
    - Add milestones JSONB column to projects table
    - Add validation for milestone status values
    - Add validation for required milestone fields
  
  2. Implementation Notes
    - Uses simpler CHECK constraints that don't require subqueries
    - Validates JSON structure using jsonb_path_exists
*/

-- Add milestones column
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]'::jsonb;

-- Add check constraint for valid JSON array
ALTER TABLE projects
ADD CONSTRAINT valid_milestones_array
CHECK (jsonb_typeof(milestones) = 'array');

-- Add trigger function to validate milestone entries
CREATE OR REPLACE FUNCTION validate_milestone()
RETURNS trigger AS $$
DECLARE
  milestone jsonb;
BEGIN
  -- Check each milestone in the array
  FOR milestone IN SELECT jsonb_array_elements(NEW.milestones)
  LOOP
    -- Validate status values
    IF NOT (milestone->>'status' IN ('completed', 'in_progress', 'pending')) THEN
      RAISE EXCEPTION 'Invalid milestone status. Must be completed, in_progress, or pending';
    END IF;

    -- Validate required fields exist
    IF NOT (
      milestone ? 'id' AND
      milestone ? 'name' AND
      milestone ? 'status' AND
      milestone ? 'created_at'
    ) THEN
      RAISE EXCEPTION 'Missing required milestone fields';
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate milestones on insert or update
DROP TRIGGER IF EXISTS validate_milestone_trigger ON projects;
CREATE TRIGGER validate_milestone_trigger
  BEFORE INSERT OR UPDATE OF milestones ON projects
  FOR EACH ROW
  EXECUTE FUNCTION validate_milestone();