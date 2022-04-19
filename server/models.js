const pool = require('../db/index');

pool.on('error', (err, client) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  // Model routes go here
};
