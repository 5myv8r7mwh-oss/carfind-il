const { chromium } = require('playwright');
const db = require('../db');

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const YAD2_MAKES = {
  toyota: 'טויוטה', honda: 'הונדה', mazda: 'מאזדה', hyundai: 'יונדאי',
  kia: 'קיה', volkswagen: 'פולקסווגן', vw: 'פולקסווגן', skoda: 'סקודה',
  seat: 'סיאט', ford: 'פורד', nissan: 'ניסאן', mitsubishi: 'מיצובישי',
  suzuki: 'סוזוקי', subaru: 'סובארו', chevrolet: 'שברולט', opel: 'אופל',
  renault: 'רנו', peugeot: 'פיז\'ו', citroen: 'סיטרואן', fiat: 'פיאט',
  bmw: 'ב.מ.וו', mercedes: 'מרצדס', audi: 'אאודי', volvo: 'וולוו',
  jeep: 'ג\'יפ', 'land rover': 'לנד רובר', landrover: 'לנד רובר',
  mini: 'מיני', daihatsu: 'דייהטסו', isuzu: 'איסוזו',
};

function getCacheKey(make, model, yearMin) {
  return `${make.toLowerCase()}_${model.toLowerCase()}_${yearMin}`;
}

function getFromCache(key) {
  const row = db.prepare('SELECT * FROM prices_cache WHERE car_key = ?').get(key);
  if (!row) return null;
  const age = Date.now() - new Date(row.scraped_at).getTime();
  if (age > CACHE_TTL_MS) return null;
  return row;
}

function saveToCache(key, data) {
  db.prepare(`
    INSERT INTO prices_cache (car_key, price_min, price_max, price_median, listing_count)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(car_key) DO UPDATE SET
      price_min = excluded.price_min,
      price_max = excluded.price_max,
      price_median = excluded.price_median,
      listing_count = excluded.listing_count,
      scraped_at = CURRENT_TIMESTAMP
  `).run(key, data.price_min, data.price_max, data.price_median, data.listing_count);
}

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

async function scrapeYad2(make, model, yearMin) {
  const key = getCacheKey(make, model, yearMin);
  const cached = getFromCache(key);
  if (cached) return cached;

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      locale: 'he-IL',
      extraHTTPHeaders: { 'Accept-Language': 'he-IL,he;q=0.9' },
    });
    const page = await ctx.newPage();

    const hebrewMake = YAD2_MAKES[make.toLowerCase()] || make;
    const searchUrl = `https://www.yad2.co.il/vehicles/cars?manufacturer=${encodeURIComponent(hebrewMake)}&model=${encodeURIComponent(model)}&year=${yearMin}-0`;

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2500);

    const prices = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid="feed-item"], .feeditem, [class*="price"]');
      const found = [];
      items.forEach(el => {
        const txt = el.textContent || '';
        const m = txt.match(/[\d,]{4,7}/g);
        if (m) {
          m.forEach(p => {
            const n = parseInt(p.replace(/,/g, ''), 10);
            if (n >= 15000 && n <= 600000) found.push(n);
          });
        }
      });
      return found;
    });

    const uniquePrices = [...new Set(prices)].slice(0, 30);

    const result = {
      price_min: uniquePrices.length ? Math.min(...uniquePrices) : null,
      price_max: uniquePrices.length ? Math.max(...uniquePrices) : null,
      price_median: median(uniquePrices),
      listing_count: uniquePrices.length,
    };

    if (result.listing_count > 0) saveToCache(key, result);

    return result;
  } catch (err) {
    console.error(`Scraper error for ${make} ${model}:`, err.message);
    return { price_min: null, price_max: null, price_median: null, listing_count: 0 };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeYad2 };
