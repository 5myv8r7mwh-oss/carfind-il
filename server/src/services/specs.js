const https = require('https');

const cache = new Map();

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on('error', reject);
  });
}

async function getSpecs(make, model, year) {
  const key = `${make}_${model}_${year}`.toLowerCase();
  if (cache.has(key)) return cache.get(key);

  try {
    const url = `https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModels&make=${encodeURIComponent(make)}&year=${year}&sold_in_us=0`;
    const data = await fetchJSON(url.replace('callback=?&', ''));
    const models = data?.Models || [];
    const match = models.find(m =>
      m.model_name.toLowerCase().includes(model.toLowerCase())
    );
    if (match) {
      const result = {
        engine: match.model_engine_cc ? `${Math.round(match.model_engine_cc / 100) / 10}L` : null,
        fuel: match.model_engine_fuel || null,
        doors: match.model_doors || null,
        seats: match.model_seats || null,
        weight: match.model_weight_kg || null,
      };
      cache.set(key, result);
      return result;
    }
  } catch {
    // silent fail — specs are supplementary
  }

  cache.set(key, null);
  return null;
}

module.exports = { getSpecs };
