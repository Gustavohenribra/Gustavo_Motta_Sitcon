require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const seedDataFromFile = async (filePath) => {
  const client = await pool.connect();

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const queries = data.split(';');

    await client.query('BEGIN');

    for (let query of queries) {
        query = query.trim();
        if (query) {
          if (!query.endsWith(';')) {
            query += ';';
          }
          console.log(query);
          await client.query(query);
        }
      }

    await client.query('COMMIT');
    console.log('Seed data inserted successfully.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error inserting seed data:', e.message);
    throw e;
  } finally {
    client.release();
  }
};

const filePath = path.join(__dirname, 'dados.txt');
seedDataFromFile(filePath).catch(e => console.error(e.stack));
