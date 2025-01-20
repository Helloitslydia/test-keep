/*
  # Add Super-Novae organization

  1. Changes
    - Insert Super-Novae organization with number 016
*/

INSERT INTO organisations (name, number)
VALUES ('Super-Novae', '016')
ON CONFLICT (name) DO NOTHING;