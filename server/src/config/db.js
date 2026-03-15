require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = (isProduction && process.env.DATABASE_URL)
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'meal_app',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    };

const pool = new Pool(connectionConfig);

pool.on('connect', () => {
  console.log('Connected to PostgreSQL Database');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
