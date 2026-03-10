import { json, parseBody } from '../lib/http.js';
import { appendSheet, getTodayISO, readSheet, rowsToObjects } from '../lib/sheets.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  const today = getTodayISO();

  try {
    if (req.method === 'GET') {
      const rows = await readSheet('questions!A:Z');
      const questions = rowsToObjects(rows)
        .filter((q) => q.quiz_date === today && `${q.is_active}` !== 'false')
        .sort((a, b) => Number(a.question_order || 0) - Number(b.question_order || 0))
        .map(({ question_id, quiz_date, question_order, question_text, option_a, option_b, option_c, option_d }) => ({
          question_id,
          quiz_date,
          question_order: Number(question_order),
          question_text,
          options: { a: option_a, b: option_b, c: option_c, d: option_d }
        }));

      return json(res, 200, { quiz_date: today, questions });
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req)) return json(res, 401, { error: 'Unauthorized' });
      const { quiz_date = today, questions = [] } = await parseBody(req);
      if (!Array.isArray(questions) || questions.length === 0) {
        return json(res, 400, { error: 'questions is required' });
      }

      for (let i = 0; i < questions.length; i += 1) {
        const q = questions[i];
        await appendSheet('questions!A:Z', [
          crypto.randomUUID(),
          quiz_date,
          q.question_order || i + 1,
          q.question_text || '',
          q.option_a || '',
          q.option_b || '',
          q.option_c || '',
          q.option_d || '',
          q.correct_opt || '',
          'true',
          new Date().toISOString()
        ]);
      }
      return json(res, 200, { message: 'Questions saved' });
    }

    return json(res, 405, { error: 'Method Not Allowed' });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
