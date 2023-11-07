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
    const queries = data.split(';').map(query => query.trim()).filter(query => query);

    for (let query of queries) {
      try {
        await client.query('BEGIN');
        if (!query.endsWith(';')) {
          query += ';';
        }
        await client.query(query);
        await client.query('COMMIT');
        console.log(`Inserção realizada: ${query}`);
      } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') {
          console.error(`Chave duplicada encontrada, pulando inserção: ${error.detail}`);
        } else {
          throw error;
        }
      }
    }
    console.log('Todos os dados válidos foram inseridos com sucesso.');
  } catch (e) {
    console.error('Erro ao inserir dados:', e.message);
  } finally {
    client.release();
  }
};

const filePath = path.join(__dirname, 'dados.txt');
seedDataFromFile(filePath).catch(e => console.error(e.stack));
