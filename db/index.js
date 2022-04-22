const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'qa',
};

const pool = new Pool(poolConfig);
module.exports = pool;
// pool.connect()
//   .then(() => {
//     console.log('successful connection of postgres database');
//   })
//   .catch(() => {
//     console.log('error connecting to postgres database');
//   });
