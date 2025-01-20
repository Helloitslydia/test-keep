/*
  # Add social media and logo fields to organisations table

  1. New Columns
    - `image_url` (text) - For storing the organization's logo URL
    - `facebook_url` (text) - For storing Facebook profile URL
    - `twitter_url` (text) - For storing Twitter/X profile URL
    - `instagram_url` (text) - For storing Instagram profile URL
    - `linkedin_url` (text) - For storing LinkedIn profile URL

  2. Changes
    - Add URL validation constraints for social media fields
*/

-- Add new columns
ALTER TABLE organisations
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS facebook_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text;

-- Add URL validation constraints
ALTER TABLE organisations
ADD CONSTRAINT facebook_url_valid CHECK (facebook_url IS NULL OR facebook_url ~ '^https?:\/\/.*facebook\.com.*$'),
ADD CONSTRAINT twitter_url_valid CHECK (twitter_url IS NULL OR twitter_url ~ '^https?:\/\/.*twitter\.com.*$'),
ADD CONSTRAINT instagram_url_valid CHECK (instagram_url IS NULL OR instagram_url ~ '^https?:\/\/.*instagram\.com.*$'),
ADD CONSTRAINT linkedin_url_valid CHECK (linkedin_url IS NULL OR linkedin_url ~ '^https?:\/\/.*linkedin\.com.*$');