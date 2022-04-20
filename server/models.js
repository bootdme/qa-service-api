const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  // Model routes go here
  getQuestions: (product_id, page, count) => pool.connect()
    .then((client) => client.query(`SELECT * FROM question_info WHERE product_id = ${product_id} LIMIT ${page * count}`)
      .then((res) => {
        client.release();
        return (res.rows);
      })
      .catch((err) => {
        client.release();
        return err;
      })),
  getAnswers: (question_id, page, count) => pool.connect()
    .then((client) => client.query(`SELECT * FROM answers WHERE question_id = ${question_id} LIMIT ${page * count}`)
      .then((res) => {
        client.release();
        return (res.rows);
      })
      .catch((err) => {
        client.release();
        return err;
      })),
};
