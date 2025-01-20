/*
  # Add DataViz fields and related tables

  1. Changes to projects table
    - Add DataViz 1-5 fields (title, visualization type, value, icon name, image, description)
    - Add money_spent and mot-rs fields
  
  2. New Tables
    - Key_Milestones (linked to projects)
    - Resources (linked to projects)
    - Team (linked to projects)
    - Photos_projet (linked to projects)
    - Press (linked to projects)

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
*/

-- Add DataViz fields to projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS dv1_titre text,
  ADD COLUMN IF NOT EXISTS dv1_vizualisation_type text,
  ADD COLUMN IF NOT EXISTS dv1_value numeric,
  ADD COLUMN IF NOT EXISTS dv1_nom_icon text,
  ADD COLUMN IF NOT EXISTS image_dv1 text,
  ADD COLUMN IF NOT EXISTS dv1_short_description text,
  
  ADD COLUMN IF NOT EXISTS dv2_titre text,
  ADD COLUMN IF NOT EXISTS dv2_vizualisation_type text,
  ADD COLUMN IF NOT EXISTS dv2_value numeric,
  ADD COLUMN IF NOT EXISTS dv2_nom_icon text,
  ADD COLUMN IF NOT EXISTS image_dv2 text,
  ADD COLUMN IF NOT EXISTS dv2_short_description text,
  
  ADD COLUMN IF NOT EXISTS dv3_titre text,
  ADD COLUMN IF NOT EXISTS dv3_vizualisation_type text,
  ADD COLUMN IF NOT EXISTS dv3_value numeric,
  ADD COLUMN IF NOT EXISTS dv3_nom_icon text,
  ADD COLUMN IF NOT EXISTS image_dv3 text,
  ADD COLUMN IF NOT EXISTS dv3_short_description text,
  
  ADD COLUMN IF NOT EXISTS dv4_titre text,
  ADD COLUMN IF NOT EXISTS dv4_vizualisation_type text,
  ADD COLUMN IF NOT EXISTS dv4_value numeric,
  ADD COLUMN IF NOT EXISTS dv4_nom_icon text,
  ADD COLUMN IF NOT EXISTS image_dv4 text,
  ADD COLUMN IF NOT EXISTS dv4_short_description text,
  
  ADD COLUMN IF NOT EXISTS dv5_titre text,
  ADD COLUMN IF NOT EXISTS dv5_vizualisation_type text,
  ADD COLUMN IF NOT EXISTS dv5_value numeric,
  ADD COLUMN IF NOT EXISTS dv5_nom_icon text,
  ADD COLUMN IF NOT EXISTS image_dv5 text,
  ADD COLUMN IF NOT EXISTS dv5_short_description text,
  
  ADD COLUMN IF NOT EXISTS money_spent numeric,
  ADD COLUMN IF NOT EXISTS "mot-rs" text;

-- Create Key_Milestones table
CREATE TABLE IF NOT EXISTS key_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name_milestone text NOT NULL,
  status_milestone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title_resource text NOT NULL,
  link_resource text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Team table
CREATE TABLE IF NOT EXISTS team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  job_title text NOT NULL,
  linkedin_url text,
  created_at timestamptz DEFAULT now()
);

-- Create Photos_projet table
CREATE TABLE IF NOT EXISTS photos_projet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  la_photo text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Press table
CREATE TABLE IF NOT EXISTS press (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  press_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE key_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos_projet ENABLE ROW LEVEL SECURITY;
ALTER TABLE press ENABLE ROW LEVEL SECURITY;

-- Create policies for key_milestones
CREATE POLICY "Users can manage their project milestones"
  ON key_milestones
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE user_id = auth.uid() 
      AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
    )
  );

-- Create policies for resources
CREATE POLICY "Users can manage their project resources"
  ON resources
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE user_id = auth.uid() 
      AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
    )
  );

-- Create policies for team
CREATE POLICY "Users can manage their project team"
  ON team
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE user_id = auth.uid() 
      AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
    )
  );

-- Create policies for photos_projet
CREATE POLICY "Users can manage their project photos"
  ON photos_projet
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE user_id = auth.uid() 
      AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
    )
  );

-- Create policies for press
CREATE POLICY "Users can manage their project press links"
  ON press
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE user_id = auth.uid() 
      AND organization_id::text = (auth.jwt() -> 'user_metadata' ->> 'organization_id')
    )
  );

-- Add constraints for status values
ALTER TABLE key_milestones
  ADD CONSTRAINT valid_status CHECK (status_milestone IN ('completed', 'in_progress', 'pending'));

-- Add URL validation for linkedin and press
ALTER TABLE team
  ADD CONSTRAINT valid_linkedin_url CHECK (linkedin_url IS NULL OR linkedin_url ~ '^https?:\/\/.*linkedin\.com.*$');

ALTER TABLE press
  ADD CONSTRAINT valid_press_url CHECK (press_url ~ '^https?:\/\/.*$');

-- Add visualization type validation
ALTER TABLE projects
  ADD CONSTRAINT valid_viz_type CHECK (
    (dv1_vizualisation_type IS NULL OR dv1_vizualisation_type IN ('pie', 'progress', 'pictogram', 'image')) AND
    (dv2_vizualisation_type IS NULL OR dv2_vizualisation_type IN ('pie', 'progress', 'pictogram', 'image')) AND
    (dv3_vizualisation_type IS NULL OR dv3_vizualisation_type IN ('pie', 'progress', 'pictogram', 'image')) AND
    (dv4_vizualisation_type IS NULL OR dv4_vizualisation_type IN ('pie', 'progress', 'pictogram', 'image')) AND
    (dv5_vizualisation_type IS NULL OR dv5_vizualisation_type IN ('pie', 'progress', 'pictogram', 'image'))
  );