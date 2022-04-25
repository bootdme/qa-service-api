DROP DATABASE IF EXISTS qa;
CREATE DATABASE qa;

\c qa;

-- id is question_id
CREATE TABLE question_info (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  body VARCHAR(1024),
  date_written BIGINT,
  asker_name VARCHAR(40),
  asker_email VARCHAR(40),
  reported BOOLEAN, -- CAST (1 AS BOOLEAN), CAST (0 AS BOOLEAN)
  helpful INTEGER
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES question_info(id) ON DELETE CASCADE,
  body VARCHAR(1024),
  date_written BIGINT,
  answerer_name VARCHAR(40),
  answerer_email VARCHAR(40),
  reported BOOLEAN, -- CAST (1 AS BOOLEAN), CAST (0 AS BOOLEAN)
  helpful INTEGER
);

CREATE TABLE answer_photos (
  id SERIAL PRIMARY KEY,
  answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE,
  url VARCHAR(200)
);

CREATE INDEX idx_qi_product_id ON question_info(product_id);
CREATE INDEX idx_qi_reported ON question_info(reported);
CREATE INDEX idx_qi_helpful ON question_info(helpful);

CREATE INDEX idx_a_question_id ON answers(question_id);
CREATE INDEX idx_a_reported ON answers(reported);
CREATE INDEX idx_a_helpful ON answers(helpful);

CREATE INDEX idx_ap_answer_photos ON answer_photos(answer_id);

\copy question_info FROM './csv/questions.csv' WITH (FORMAT CSV, DELIMITER ",", HEADER);
\copy answers FROM './csv/answers.csv' WITH (FORMAT CSV, DELIMITER ",", HEADER);
\copy answer_photos FROM './csv/answers_photos.csv' WITH (FORMAT CSV, DELIMITER ",", HEADER);

-- TODO: Change this
UPDATE question_info SET date_written=date_written/1000;
ALTER TABLE question_info ALTER date_written TYPE TIMESTAMP WITHOUT TIME ZONE USING to_timestamp(date_written) AT TIME ZONE 'UTC';

UPDATE answers SET date_written=date_written/1000;
ALTER TABLE answers ALTER date_written TYPE TIMESTAMP WITHOUT TIME ZONE USING to_timestamp(date_written) AT TIME ZONE 'UTC';

-- psql -U postgres -f db/schema.sql