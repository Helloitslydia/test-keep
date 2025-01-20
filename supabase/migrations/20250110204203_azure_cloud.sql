/*
  # Add updated_at column to projects table

  1. Changes
    - Add updated_at column with default value of now()
    - Add trigger to automatically update the timestamp when a row is modified
*/

-- Add updated_at column
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();