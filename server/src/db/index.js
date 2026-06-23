const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DB_PATH
  ? path.dirname(process.env.DB_PATH)
  : path.join(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const SEARCH_FILE  = path.join(DATA_DIR, 'search_cache.json');
const PRICES_FILE  = path.join(DATA_DIR, 'prices_cache.json');

function load(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data), 'utf8');
}

const db = {
  prepare(sql) {
    if (sql.includes('search_cache')) {
      return {
        get(hash)         { return load(SEARCH_FILE)[hash] || null; },
        run(hash, json)   { const d = load(SEARCH_FILE); d[hash] = { params_hash: hash, result_json: json, created_at: new Date().toISOString() }; save(SEARCH_FILE, d); },
      };
    }
    if (sql.includes('prices_cache')) {
      return {
        get(key)            { return load(PRICES_FILE)[key] || null; },
        run(key, ...vals)   {
          const d = load(PRICES_FILE);
          d[key] = { car_key: key, price_min: vals[0], price_max: vals[1], price_median: vals[2], listing_count: vals[3], scraped_at: new Date().toISOString() };
          save(PRICES_FILE, d);
        },
      };
    }
    // searches log — no-op in file mode
    return { run() {}, get() { return null; } };
  },
  exec() {},
};

module.exports = db;
