/*
  # Add organization fields to auth.users

  1. Changes
    - Add organization_id and organization_name columns to auth.users
    - Add foreign key constraint to organizations table
*/

ALTER TABLE auth.users 
  ADD COLUMN IF NOT EXISTS organization_id uuid,
  ADD COLUMN IF NOT EXISTS organization_name text;

ALTER TABLE auth.users
  ADD CONSTRAINT fk_organization
  FOREIGN KEY (organization_id) 
  REFERENCES organisations(id);