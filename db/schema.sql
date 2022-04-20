DROP DATABASE IF EXISTS qa;
CREATE DATABASE qa;

\c qa;

CREATE TABLE question_info (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER NOT NULL,
  body VARCHAR(1024),
  date_written VARCHAR(13),
  asker_name VARCHAR(40),
  asker_email VARCHAR(40),
  reported BOOLEAN, -- CAST (1 AS BOOLEAN), CAST (0 AS BOOLEAN)
  helpful INTEGER NOT NULL
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY NOT NULL,
  question_id INTEGER NOT NULL REFERENCES question_info(id) ON DELETE CASCADE,
  body VARCHAR(1024),
  date_written VARCHAR(13),
  answerer_name VARCHAR(40),
  answerer_email VARCHAR(40),
  reported BOOLEAN, -- CAST (1 AS BOOLEAN), CAST (0 AS BOOLEAN)
  helpful INTEGER NOT NULL
);

CREATE TABLE answer_photos (
  id SERIAL PRIMARY KEY NOT NULL,
  answer_id INTEGER NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
  url VARCHAR(200) NOT NULL
);

-- psql -U postgres -f db/schema.sql
-- psql -U postgres -f db/import.sql
-- psql -U postgres -f db/select.sql