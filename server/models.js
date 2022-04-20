const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  // Model routes go here
  getQuestions: () => pool.connect()
    .then((client) => client.query('SELECT * FROM question_info LIMIT 5')
      .then((res) => {
        client.release();
        return (res.rows);
      })
      .catch((err) => {
        client.release();
        return err;
      })),
};
