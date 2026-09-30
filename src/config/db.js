const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  password: process.env.DB_PASSWORD
});

pool.on('error', (error) => {
  console.error('Erro inesperado no pool do PostgreSQL:', error.message);
});

module.exports = pool;
