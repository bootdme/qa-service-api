const { Pool } = require('pg');
// require('dotenv').config();

const poolConfig = {
  user: 'postgres',
  password: '',
  host: 'localhost',
  port: '5432',
  database: 'qa',
};

const pool = new Pool(poolConfig);
module.exports = pool;
pool.connect()
  .then(() => {
    console.log('successful connection of postgres database');
  })
  .catch(() => {
    console.log('error connecting to postgres database');
  });
