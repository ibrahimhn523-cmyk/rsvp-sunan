import { appendSheet, getTodayISO, readSheet, rowsToObjects } from '../lib/sheets.js';
import { json } from '../lib/http.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method Not Allowed' });
  if (!requireAdmin(req)) return json(res, 401, { error: 'Unauthorized' });

  try {
    const today = getTodayISO();
    const participants = rowsToObjects(await readSheet('participants!A:Z')).filter(
      (p) => p.quiz_date === today && `${p.is_eligible}` === 'true'
    );
    const winners = rowsToObjects(await readSheet('winners!A:Z')).filter((w) => w.quiz_date === today);

    const winnerIds = new Set(winners.map((w) => w.participant_id));
    const pool = participants.filter((p) => !winnerIds.has(p.participant_id));
    if (!pool.length) return json(res, 400, { error: 'لا يوجد مشاركون مؤهلون متبقون' });

    const selected = pool[Math.floor(Math.random() * pool.length)];
    const prizeNumber = winners.length + 1;

    await appendSheet('winners!A:Z', [
      crypto.randomUUID(),
      today,
      selected.participant_id,
      selected.name,
      selected.phone,
      prizeNumber,
      new Date().toISOString()
    ]);

    return json(res, 200, { winner: selected.name, prize_number: prizeNumber });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
