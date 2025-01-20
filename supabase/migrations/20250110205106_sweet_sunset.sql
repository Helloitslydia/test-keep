/*
  # Add organisations

  1. Changes
    - Add unique constraint on organisation name
    - Insert 15 predefined organizations

  2. Organizations Added:
    - Action Education
    - BSF
    - ESSOR
    - SIPAR
    - Partage
    - Fondation Good Planet
    - IECD
    - Fédération Humanité et Inclusion
    - Planning familial
    - Play International
    - Groupe enfance
    - Agence micro-projet
    - CLONG Volontariat
    - Acted
    - Solidarités International
*/

-- First add a unique constraint on the name column
ALTER TABLE organisations
ADD CONSTRAINT organisations_name_key UNIQUE (name);

-- Now insert the organizations
INSERT INTO organisations (name, number)
VALUES
  ('Action Education', '001'),
  ('BSF', '002'),
  ('ESSOR', '003'),
  ('SIPAR', '004'),
  ('Partage', '005'),
  ('Fondation Good Planet', '006'),
  ('IECD', '007'),
  ('Fédération Humanité et Inclusion', '008'),
  ('Planning familial', '009'),
  ('Play International', '010'),
  ('Groupe enfance', '011'),
  ('Agence micro-projet', '012'),
  ('CLONG Volontariat', '013'),
  ('Acted', '014'),
  ('Solidarités International', '015')
ON CONFLICT (name) DO NOTHING;