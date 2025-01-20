/*
  # Fix RLS policies for projects table

  1. Changes
    - Update RLS policies to properly handle organization_id
    - Simplify policy conditions
    - Ensure policies work with user metadata
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Create new policies with simplified conditions
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
  );

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
  );

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
  );

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
  );