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
    }).on('error', () => resolve(null));
  });
}

const COMPLAINT_MAP = {
  'ENGINE': 'בעיות מנוע',
  'TRANSMISSION': 'תיבת הילוכים',
  'BRAKES': 'בלמים',
  'STEERING': 'הגה',
  'ELECTRICAL': 'חשמל',
  'FUEL SYSTEM': 'מערכת דלק',
  'AIR BAGS': 'כריות אוויר',
  'SUSPENSION': 'מתלים',
};

async function getComplaints(make, model, yearMin) {
  const key = `${make}_${model}_${yearMin}`.toLowerCase();
  if (cache.has(key)) return cache.get(key);

  const years = [yearMin, yearMin + 1, yearMin + 2].filter(y => y <= new Date().getFullYear());
  const allComplaints = [];

  for (const year of years) {
    try {
      const url = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`;
      const data = await fetchJSON(url);
      if (data?.results) allComplaints.push(...data.results);
    } catch {
      // silent
    }
  }

  const grouped = {};
  allComplaints.forEach(c => {
    const cat = c.components || 'OTHER';
    grouped[cat] = (grouped[cat] || 0) + 1;
  });

  const issues = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, count]) => ({
      text: `${COMPLAINT_MAP[cat] || cat}: ${count} תלונות (NHTSA)`,
      sev: count > 20 ? 'bad' : count > 8 ? 'warn' : 'good',
    }));

  cache.set(key, issues);
  return issues;
}

module.exports = { getComplaints };
