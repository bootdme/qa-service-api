const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'qa',
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = pool;
