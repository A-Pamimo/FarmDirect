#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL must be set to run migrations or seeds.');
  process.exit(1);
}

const targetDir = process.argv[2];
if (!targetDir) {
  console.error('Usage: node run-sql.js <relative-directory>');
  process.exit(1);
}

const absoluteDir = path.resolve(__dirname, '..', targetDir);
const files = fs
  .readdirSync(absoluteDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    for (const file of files) {
      const filePath = path.join(absoluteDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`\n> Running ${file}`);
      await pool.query(sql);
    }
    console.log('\nAll SQL scripts executed successfully.');
  } catch (error) {
    console.error('Failed to run SQL scripts', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
