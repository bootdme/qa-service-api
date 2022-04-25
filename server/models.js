const format = require('pg-format');
const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  getQuestions: (product_id, size) => {
    // TODO: Fix updating helpful/reported, question_id needs to be in the right place (ORDER BY bug)
    const psql = `
    SELECT q.id           AS question_id,
           q.body         AS question_body,
           q.date_written AS question_date,
           q.asker_name,
           q.helpful      AS question_helpfulness,
           q.reported,
           (
                  SELECT Array_to_json(COALESCE(Array_agg(c), array[]::record[]))
                  FROM   (
                                SELECT a.id,
                                      a.body,
                                      a.date_written AS date,
                                      a.answerer_name,
                                      a.helpful AS helpfulness,
                                      (
                                              SELECT Array_to_json(COALESCE(Array_agg(d), array[]::record[]))
                                              FROM   (
                                                                SELECT     ap.id,
                                                                           ap.url
                                                                FROM       answer_photos ap
                                                                INNER JOIN answers a
                                                                ON         ( ap.answer_id = a.id )
                                                                WHERE      a.question_id = q.id ) d ) AS photos
                                FROM   answers a
                        WHERE  a.question_id = q.id ) c ) AS answers
    FROM   question_info q
    WHERE  product_id = $1 LIMIT $2`;
    const results = pool.query(psql, [product_id, size]);
    return results;
  },
  getAnswers: (question_id, size) => {
    const psql = `
    SELECT
    json_agg(
      json_build_object(
      'answer_id', a.id,
      'body', a.body,
      'date', a.date_written,
      'answerer_name', a.answerer_name,
      'helpfulness', a.helpful,
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
  WHERE a.question_id = $1 LIMIT $2`;
    const results = pool.query(psql, [question_id, size]);
    return results;
  },
  // TODO: Figure out date conversion instead of converting when running schema
  addQuestion: (body, name, email, product_id) => {
    const date = new Date();
    const psql = `
      INSERT INTO question_info(product_id, body, date_written, asker_name, asker_email, reported, helpful)
      VALUES ($1, $2, $3, $4, $5, false, 0)
      RETURNING id`;
    const result = pool.query(psql, [product_id, body, date.toISOString(), name, email]);
    return result;
  },
  addAnswer: async (body, name, email, photos, question_id) => {
    const date = new Date();
    const psql = `
      INSERT INTO answers(question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
      VALUES ($1, $2, $3, $4, $5, false, 0)
      RETURNING id`;
    const addA = await pool.query(psql, [question_id, body, date.toISOString(), name, email]);
    const answerId = addA.rows[0].id;
    const insertPhotos = photos.map((url) => [answerId, url]);
    const photoQuery = format('INSERT INTO answer_photos (answer_id, url) VALUES %L RETURNING id', insertPhotos);
    const addPhotos = await pool.query(photoQuery);
  },
  markQHelpful: (question_id) => {
    const psql = 'UPDATE question_info SET helpful = helpful + 1 WHERE id = $1;';
    const markQH = pool.query(psql, [question_id]);
    return markQH;
  },
  markQReported: (question_id) => {
    const psql = 'UPDATE question_info SET reported = true WHERE id = $1;';
    const markQR = pool.query(psql, [question_id]);
    return markQR;
  },
  markAHelpful: (answer_id) => {
    const psql = 'UPDATE answers SET helpful = helpful + 1 WHERE id = $1;';
    const markAH = pool.query(psql, [answer_id]);
    return markAH;
  },
  markAReported: (answer_id) => {
    const psql = 'UPDATE answers SET reported = true WHERE id = $1;';
    const markAR = pool.query(psql, [answer_id]);
    return markAR;
  },
};
