const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/carfind.db');

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new DatabaseSync(DB_PATH);

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
// Run each statement separately
schema.split(';').map(s => s.trim()).filter(Boolean).forEach(s => db.exec(s + ';'));

// Wrap to match better-sqlite3 API used in routes/services
const wrapped = {
  prepare(sql) {
    const stmt = db.prepare(sql);
    return {
      get(...args) { return stmt.get(...args); },
      run(...args) { return stmt.run(...args); },
      all(...args) { return stmt.all(...args); },
    };
  },
  exec(sql) { return db.exec(sql); },
};

module.exports = wrapped;
