/*
  # Add organization relationship to projects table

  1. Changes
    - Add organization_id column to projects table
    - Add foreign key constraint to organizations table
    - Update RLS policies to include organization check
*/

-- Add organization_id column
ALTER TABLE projects
ADD COLUMN organization_id uuid REFERENCES organisations(id);

-- Update RLS policies to include organization check
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND organization_id = (auth.jwt() ->> 'organization_id')::uuid
  );

DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND organization_id = (auth.jwt() ->> 'organization_id')::uuid
  );

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND organization_id = (auth.jwt() ->> 'organization_id')::uuid
  );

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND organization_id = (auth.jwt() ->> 'organization_id')::uuid
  );