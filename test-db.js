require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:bUbTIytQUdYfQjIV@db.fjybpudqngxqmopepkxz.supabase.co:5432/postgres'
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Successfully connected to the database at:', res.rows[0].now);
  }
  pool.end();
});
