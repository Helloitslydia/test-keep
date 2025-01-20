/*
  # Create organisations table

  1. New Tables
    - `organisations`
      - `id` (uuid, primary key)
      - `name` (text, organisation name)
      - `number` (text, organisation number)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `organisations` table
    - Add policies for authenticated users to manage their organisations
*/

-- Create organisations table
CREATE TABLE IF NOT EXISTS organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  number text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read organisations"
  ON organisations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert organisations"
  ON organisations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update organisations"
  ON organisations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete organisations"
  ON organisations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_organisations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organisations_updated_at
    BEFORE UPDATE ON organisations
    FOR EACH ROW
    EXECUTE FUNCTION update_organisations_updated_at();