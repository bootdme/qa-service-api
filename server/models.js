const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  getQuestions: (product_id, page, count) => pool.connect()
    .then((client) => client.query(`
      SELECT
        q.product_id,
        q.id AS question_id,
        q.body AS question_body,
        q.date_written AS question_date,
        q.asker_name,
        q.helpful AS question_helpfulness,
        q.reported,
        a.id,
        a.body,
        a.date_written AS date,
        a.answerer_name,
        a.answerer_email,
        a.helpful AS helpfulness,
        a.reported AS answer_reported,
        p.url
      FROM
        question_info q
        LEFT JOIN answers a ON (q.id = a.question_id)
        LEFT JOIN answer_photos p ON (a.id = p.answer_id)
      WHERE
        q.product_id = ${product_id}
      ORDER BY
        q.id ASC
      LIMIT
        ${page * count}
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
      SELECT
        a.id AS answer_id,
        a.body,
        a.date_written AS date,
        a.answerer_name,
        a.helpful AS helpfulness,
        a.reported AS answerer_reported,
        p.url,
        p.id AS photo_id
      FROM
        answers a
        LEFT JOIN answer_photos p on (a.id = p.answer_id)
      WHERE
        a.question_id = ${question_id}
      ORDER BY
        a.id ASC
      LIMIT
        ${page * count}
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
