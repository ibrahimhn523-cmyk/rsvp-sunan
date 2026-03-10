import { getTodayISO, readSheet, rowsToObjects } from '../lib/sheets.js';
import { json } from '../lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method Not Allowed' });

  try {
    const today = getTodayISO();
    const participants = rowsToObjects(await readSheet('participants!A:Z'))
      .filter((p) => p.quiz_date === today)
      .map((p) => ({ name: p.name, correct_count: Number(p.correct_count || 0) }));

    return json(res, 200, { date: today, participants });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
