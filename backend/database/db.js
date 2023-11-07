  const { Client } = require('pg');
  const dotenv = require('dotenv');

  dotenv.config();

  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  });

  client.connect(err => {
    if (err) {
      console.error('Falha na conexão com o banco de dados', err.stack);
    } else {
      console.log('Conectado ao banco de dados');
    }
  });

  module.exports = {
    query: (text, params, callback) => {
      return client.query(text, params, callback);
    },
  };
