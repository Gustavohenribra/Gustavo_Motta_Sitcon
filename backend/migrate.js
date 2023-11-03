require('dotenv').config({ path: './database/.env' });
const path = require('path');
const migrate = require('node-pg-migrate').default;

const runMigrations = async () => {
  try {
    const dbConfig = {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    };

    await migrate({
      direction: 'up',
      migrationsTable: 'pgmigrations',
      singleTransaction: true,
      count: Infinity,
      databaseUrl: dbConfig,
      dir: path.join(__dirname, 'database/migrations'),
      log: console.log,
    });

    console.log('Migrations were successful!');
  } catch (error) {
    console.error('Failed to run migrations:', error);
    process.exit(1);
  }
};

runMigrations();
