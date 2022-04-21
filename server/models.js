const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  getQuestions: (product_id, page, count) => pool.connect()
    .then((client) => client.query(`
    SELECT q.id                                                     AS question_id,
           q.body                                                   AS question_body,
           q.date_written                                           AS question_date,
           q.asker_name,
           q.helpful                                                AS question_helpfulness,
           q.reported,
           Coalesce((SELECT Array_to_json(Array_agg(Row_to_json(c)))
                     FROM   (SELECT a.id,
                                    a.body,
                                    a.date_written                                    AS date,
                                    a.answerer_name,
                                    a.helpful                                         AS helpfulness,
                             Coalesce((SELECT Array_to_json(Array_agg(Row_to_json(d)))
                                       FROM   (SELECT ap.id,
                                                      ap.url
                                               FROM   answer_photos ap
                                       INNER JOIN answers a
                                       ON ( ap.answer_id = a.id )
                                       WHERE  a.question_id = q.id) d), '[]') AS photos
                             FROM   answers a
                             WHERE  a.question_id = q.id) c), '[]') AS answers
    FROM   question_info q
    WHERE  product_id = ${product_id}
    LIMIT  ${page * count}
    `)
      .then((res) => {
        client.release();
        return (res.rows);
      })
      .catch((err) => {
        client.release();
        return err;
      })),
  getAnswers: (question_id, page, count) => pool.connect()
    .then((client) => client.query(`
    SELECT a.id                                                    AS answer_id,
           a.body,
           a.date_written                                          AS date,
           a.answerer_name,
           a.helpful                                               AS helpfulness,
           Coalesce((SELECT Array_to_json(Array_agg(Row_to_json(d)))
                     FROM   (SELECT ap.id,
                                    ap.url
                             FROM   answer_photos ap
                             WHERE  ap.answer_id = a.id) d), '[]') AS photos
    FROM   answers a
    WHERE  a.question_id = ${question_id}
    LIMIT  ${page * count}
    `)
      .then((res) => {
        client.release();
        return (res.rows);
      })
      .catch((err) => {
        client.release();
        return err;
      })),
};
