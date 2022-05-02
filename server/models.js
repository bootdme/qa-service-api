const format = require('pg-format');
const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  getQuestions: (productId, size) => {
    // TODO: Fix updating helpful/reported, question_id needs to be in the right place (ORDER BY bug)
    const psql = `
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
    ) AS q;`;
    return pool.query(psql, [productId, size]);
  },
  getAnswers: (questionId, size) => {
    const psql = `
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
    WHERE a.question_id = $1 LIMIT $2`;
    return pool.query(psql, [questionId, size]);
  },
  // TODO: Figure out date conversion instead of converting when running schema
  addQuestion: (body, name, email, productId) => {
    const date = new Date();
    const psql = `
      INSERT INTO question_info(product_id, body, date_written, asker_name, asker_email, reported, helpful)
      VALUES ($1, $2, $3, $4, $5, false, 0)
      RETURNING id`;
    return pool.query(psql, [productId, body, date.toISOString(), name, email]);
  },
  addAnswer: async (body, name, email, photos, questionId) => {
    const date = new Date();
    const psql = `
      INSERT INTO answers(question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
      VALUES ($1, $2, $3, $4, $5, false, 0)
      RETURNING id`;
    const addA = await pool.query(psql, [questionId, body, date.toISOString(), name, email]);
    const answerId = addA.rows[0].id;
    const insertPhotos = photos.map((url) => [answerId, url]);
    const photoQuery = format('INSERT INTO answer_photos (answer_id, url) VALUES %L RETURNING id', insertPhotos);
    const addPhotos = await pool.query(photoQuery);
  },
  markQHelpful: (questionId) => {
    const psql = 'UPDATE question_info SET helpful = helpful + 1 WHERE id = $1;';
    return pool.query(psql, [questionId]);
  },
  markQReported: (questionId) => {
    const psql = 'UPDATE question_info SET reported = true WHERE id = $1;';
    return pool.query(psql, [questionId]);
  },
  markAHelpful: (answerId) => {
    const psql = 'UPDATE answers SET helpful = helpful + 1 WHERE id = $1;';
    return pool.query(psql, [answerId]);
  },
  markAReported: (answerId) => {
    const psql = 'UPDATE answers SET reported = true WHERE id = $1;';
    return pool.query(psql, [answerId]);
  },
};
