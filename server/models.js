const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  getQuestions: (product_id, page, count) => pool.connect()
    .then((client) => client.query(`
      SELECT
        *
      FROM
        question_info
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
      (
        SELECT
        array_to_json(
          array_agg(
            row_to_json(d)
          )
        )
        FROM
          (
            SELECT
              ap.id,
              ap.url
            FROM
              answer_photos ap
            WHERE
              ap.id = a.id
          ) d
      ) AS photos
    FROM
      answers a
    WHERE
      a.question_id = ${question_id}
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
