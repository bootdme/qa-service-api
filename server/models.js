const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  getQuestions: (product_id, size) => {
    const questionQuery = new Promise((resolve, reject) => {
      pool.query(`
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
          WHERE  product_id = $1 LIMIT $2
      `, [product_id, size], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results.rows);
      });
    });
    return questionQuery;
  },
  getAnswers: (question_id, size) => {
    const answerQuery = new Promise((resolve, reject) => {
      pool.query(`
          SELECT a.id             AS answer_id,
                 a.body,
                 a.date_written  AS date,
                 a.answerer_name,
                 a.helpful        AS helpfulness,
                 (
                        SELECT Array_to_json(COALESCE(Array_agg(d), array[]::record[]))
                        FROM   (
                                      SELECT ap.id,
                                             ap.url
                                      FROM   answer_photos ap
                                      WHERE  ap.answer_id = a.id ) d ) AS photos
          FROM   answers a
          WHERE  a.question_id = $1 LIMIT $2
      `, [question_id, size], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results.rows);
      });
    });
    return answerQuery;
  },
  // TODO: Figure out date conversion instead of converting when running schema
  addQuestion: (body, name, email, product_id) => {
    const date = new Date();
    const questionQuery = new Promise((resolve, reject) => {
      pool.query(`
      WITH addQuestion AS (
        INSERT INTO question_info (product_id, body, date_written, asker_name, asker_email, reported, helpful)
        VALUES ($1, $2, $3, $4, $5, false, 0)
        RETURNING *
      )
      SELECT nextval('question_info_id_seq');
      `, [product_id, body, date.toISOString(), name, email], (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.rows);
      });
    });
    return questionQuery;
  },
};
