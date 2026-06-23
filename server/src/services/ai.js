const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function getCarRecommendations(params) {
  const { budget, types, uses, gears, year, priority, extra } = params;

  const prompt = `אתה יועץ רכב מומחה לשוק הישראלי. המשתמש מחפש רכב יד שנייה בישראל.

פרטי החיפוש:
- תקציב מקסימלי: ${Number(budget).toLocaleString('he-IL')} שח
- סוג רכב: ${types.join(', ')}
- שימוש עיקרי: ${uses.join(', ')}
- תיבת הילוכים: ${gears.join(', ')}
- שנת ייצור מינימלית: ${year}
- עדיפויות: ${priority.length ? priority.join(', ') : 'לא צוין'}
- הערות: ${extra || 'אין'}

החזר JSON בלבד ללא backticks ולא markdown. מבנה:
{"summary":"תיאור קצר","cars":[{"name":"מותג דגם","subtitle":"שנים מומלצות וסוג מנוע","matchScore":90,"matchReason":"למה זה מתאים","priceRange":"55000-75000 שח","yitzchakLevy":"הערכה לפי יצחק לוי","specs":{"מנוע":"1.6 טבעי","גיר":"אוטומטי","דלק":"7.5 ל100","תאוצה":"11 שניות","מטען":"430L","כריות":"6"},"equipment":["מיזוג","חיישני חניה","בלוטות"],"issues":[{"text":"תיאור","sev":"good"},{"text":"תיאור","sev":"warn"}],"tip":"טיפ לבדיקה","make":"Toyota","model":"Corolla","yearMin":2015}]}
החזר 3 עד 4 רכבים. sev יכול להיות good warn bad. הוסף שדות make, model, yearMin לכל רכב (באנגלית, בשביל scraping). JSON בלבד ללא שום טקסט נוסף.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content.map(b => b.text || '').join('');
  const clean = raw.replace(/```[a-z]*/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    const m = clean.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error('Failed to parse AI response');
  }
}

module.exports = { getCarRecommendations };
