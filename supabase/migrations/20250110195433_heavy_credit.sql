/*
  # Add Project Fields

  1. Changes
    - Add new columns to the projects table to match the project editor form fields:
      - is_online (boolean)
      - status (enum)
      - budget (numeric)
      - start_date (timestamptz)
      - end_date (timestamptz)
      - countries (text[])
      - cities (text)
      - continent (text)
      - beneficiaries (integer)
      - short_description (text)
      - long_description (text)

  2. Constraints
    - Add character limits for descriptions
    - Add check constraints for valid values
*/

-- Create enum for project status
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('just_started', 'in_progress', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS status project_status DEFAULT 'just_started',
  ADD COLUMN IF NOT EXISTS budget numeric(15, 2),
  ADD COLUMN IF NOT EXISTS start_date timestamptz,
  ADD COLUMN IF NOT EXISTS end_date timestamptz,
  ADD COLUMN IF NOT EXISTS countries text[],
  ADD COLUMN IF NOT EXISTS cities text,
  ADD COLUMN IF NOT EXISTS continent text,
  ADD COLUMN IF NOT EXISTS beneficiaries integer,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS long_description text;

-- Add constraints
ALTER TABLE projects
  ADD CONSTRAINT short_description_length CHECK (char_length(short_description) <= 150),
  ADD CONSTRAINT long_description_length CHECK (char_length(long_description) <= 500),
  ADD CONSTRAINT valid_continent CHECK (
    continent IN ('africa', 'asia', 'europe', 'north_america', 'south_america', 'oceania', 'antarctica')
  ),
  ADD CONSTRAINT valid_dates CHECK (start_date <= end_date),
  ADD CONSTRAINT valid_budget CHECK (budget >= 0),
  ADD CONSTRAINT valid_beneficiaries CHECK (beneficiaries >= 0);