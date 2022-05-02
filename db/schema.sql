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

\copy question_info FROM './csv/questions.csv' WITH (FORMAT CSV, DELIMITER ",", HEADER);
\copy answers FROM './csv/answers.csv' WITH (FORMAT CSV, DELIMITER ",", HEADER);
\copy answer_photos FROM './csv/answers_photos.csv' WITH (FORMAT CSV, DELIMITER ",", HEADER);

CREATE INDEX idx_qi_product_id ON question_info(product_id);
CREATE INDEX idx_a_question_id ON answers(question_id);
CREATE INDEX idx_ap_answer_photos ON answer_photos(answer_id);

-- TODO: Change this
UPDATE question_info SET date_written=date_written/1000;
ALTER TABLE question_info ALTER date_written TYPE TIMESTAMP WITHOUT TIME ZONE USING to_timestamp(date_written) AT TIME ZONE 'UTC';

UPDATE answers SET date_written=date_written/1000;
ALTER TABLE answers ALTER date_written TYPE TIMESTAMP WITHOUT TIME ZONE USING to_timestamp(date_written) AT TIME ZONE 'UTC';

SELECT setval('question_info_id_seq', (SELECT MAX(id) FROM question_info));
SELECT setval('answers_id_seq', (SELECT MAX(id) FROM answers));
SELECT setval('answer_photos_id_seq', (SELECT MAX(id) FROM answer_photos));

-- psql -U postgres -f db/schema.sql
-- psql -U postgres -f db/test.sql

SELECT
  Json_agg(
    Json_build_object(
      'question_id',          q.id,
      'question_body',        q.body,
      'question_date',        q.date_written,
      'asker_name',           q.asker_name,
      'question_helpfulness', q.helpful,
      'reported',             q.reported,
      'answers', (
        SELECT COALESCE(a, '{}'::json)
        FROM (
          SELECT Json_object_agg(
            a.id,
            Json_build_object(
              'id',            a.id,
              'body',          a.body,
              'date',          a.date_written,
              'answerer_name', a.answerer_name,
              'helpfulness',   a.helpful,
              'photos', (
                SELECT COALESCE(p, '[]'::json)
                FROM (
                  SELECT
                    Json_agg(
                      Json_build_object(
                        'id',  ap.id,
                        'url', ap.url
                      )
                    ) AS p
                  FROM answer_photos ap
                  WHERE ap.answer_id = a.id
                ) AS myPhotos
              )
            )
          ) AS a
          FROM answers a
          WHERE a.question_id = q.id
        ) AS myAnswers
      )
    )
  ) AS results
FROM (
  SELECT *
  FROM question_info
  WHERE product_id = $1
  LIMIT $2
) AS q;

SELECT
  json_agg(
    json_build_object(
      'answer_id',     a.id,
      'body',          a.body,
      'date',          a.date_written,
      'answerer_name', a.answerer_name,
      'helpfulness',   a.helpful,
      'photos', (
        SELECT COALESCE(json_agg(d), '[]'::json)
        FROM (
          SELECT ap.id,
                ap.url
          FROM   answer_photos ap
          WHERE ap.answer_id = a.id
        ) d
      )
    )
  ) AS results
FROM answers a
WHERE a.question_id = $1 LIMIT $2