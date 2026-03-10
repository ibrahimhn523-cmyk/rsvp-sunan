import { readSheet, rowsToObjects } from '../lib/sheets.js';
import { json } from '../lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method Not Allowed' });

  try {
    const rows = rowsToObjects(await readSheet('participants!A:Z'));
    const totals = rows.reduce((acc, row) => {
      acc[row.name] = (acc[row.name] || 0) + Number(row.correct_count || 0);
      return acc;
    }, {});

    const data = Object.entries(totals)
      .map(([name, total_correct]) => ({ name, total_correct }))
      .sort((a, b) => b.total_correct - a.total_correct);

    return json(res, 200, { data });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
