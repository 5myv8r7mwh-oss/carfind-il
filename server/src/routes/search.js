const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { getCarRecommendations } = require('../services/ai');
const { scrapeYad2 } = require('../services/scraper');
const { getComplaints } = require('../services/complaints');

const router = express.Router();

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function hashParams(params) {
  return crypto.createHash('sha256').update(JSON.stringify(params)).digest('hex').slice(0, 16);
}

function getSearchCache(hash) {
  const row = db.prepare('SELECT * FROM search_cache WHERE params_hash = ?').get(hash);
  if (!row) return null;
  const age = Date.now() - new Date(row.created_at).getTime();
  if (age > CACHE_TTL_MS) return null;
  return JSON.parse(row.result_json);
}

function saveSearchCache(hash, result) {
  db.prepare(`
    INSERT INTO search_cache (params_hash, result_json)
    VALUES (?, ?)
    ON CONFLICT(params_hash) DO UPDATE SET result_json = excluded.result_json, created_at = CURRENT_TIMESTAMP
  `).run(hash, JSON.stringify(result));
}

function logSearch(params) {
  try {
    db.prepare(`
      INSERT INTO searches (budget, car_type, uses, gear, year_min, priorities, free_text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      params.budget,
      params.types?.join(','),
      params.uses?.join(','),
      params.gears?.join(','),
      params.year,
      params.priority?.join(','),
      params.extra || null
    );
  } catch {}
}

router.post('/', async (req, res) => {
  const params = req.body;
  const { budget, types, uses, gears, year, priority, extra } = params;

  if (!budget || !types || !uses || !gears || !year) {
    return res.status(400).json({ error: 'חסרים פרמטרים' });
  }

  logSearch(params);

  const hash = hashParams(params);
  const cached = getSearchCache(hash);
  if (cached) {
    return res.json({ ...cached, fromCache: true });
  }

  try {
    const aiResult = await getCarRecommendations(params);

    await Promise.all(
      (aiResult.cars || []).map(async car => {
        const make = car.make || '';
        const model = car.model || '';
        const yearMin = parseInt(car.yearMin) || 2015;

        const [priceData, nhtsaIssues] = await Promise.all([
          make && model ? scrapeYad2(make, model, yearMin) : Promise.resolve(null),
          make && model ? getComplaints(make, model, yearMin) : Promise.resolve([]),
        ]);

        if (priceData && priceData.listing_count > 0) {
          const fmt = n => n ? '₪' + Number(n).toLocaleString('he-IL') : null;
          car.livePrice = {
            min: fmt(priceData.price_min),
            max: fmt(priceData.price_max),
            median: fmt(priceData.price_median),
            count: priceData.listing_count,
          };
        }

        if (nhtsaIssues && nhtsaIssues.length) {
          car.issues = [...(car.issues || []), ...nhtsaIssues];
        }
      })
    );

    saveSearchCache(hash, aiResult);
    res.json(aiResult);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
