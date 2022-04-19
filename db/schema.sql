DROP DATABASE IF EXISTS qa;
CREATE DATABASE qa;

CREATE TABLE question_overview (
  id INTEGER PRIMARY KEY NOT NULL,
);

-- SERIAL data type allows you to automatically generate unique integer numbers (IDs, identity, auto-increment, sequence) for a column.
CREATE TABLE question_info (
  question_id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER REFERENCES question_overview(id),
  question_body VARCHAR(100),
  -- question_date VARCHAR(24),
  asker_name: VARCHAR(50),
                            -- DEAFAULT NULL?
  question_helpfulness INTEGER NOT NULL,
  reported BOOLEAN
)