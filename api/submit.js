import { appendSheet, getTodayISO, readSheet, rowsToObjects } from '../lib/sheets.js';
import { json, parseBody } from '../lib/http.js';

function calculateScore(questions, answers) {
  let correct = 0;
  for (const q of questions) {
    if ((answers[q.question_id] || '').toLowerCase() === (q.correct_opt || '').toLowerCase()) correct += 1;
  }
  return correct;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method Not Allowed' });

  try {
    const today = getTodayISO();
    const { name, phone, answers = {} } = await parseBody(req);
    if (!name || !phone) return json(res, 400, { error: 'الاسم والجوال مطلوبان' });

    const settingsRows = rowsToObjects(await readSheet('quiz_settings!A:Z'));
    const setting = settingsRows.find((s) => s.quiz_date === today);
    if (setting && `${setting.is_open}` === 'false') return json(res, 400, { error: 'انتهى وقت المشاركة' });

    const participantRows = rowsToObjects(await readSheet('participants!A:Z'));
    const duplicate = participantRows.some((p) => p.quiz_date === today && p.phone === phone);
    if (duplicate) return json(res, 200, { message: 'شاركت مسبقاً', duplicate: true });

    const questions = rowsToObjects(await readSheet('questions!A:Z')).filter((q) => q.quiz_date === today && `${q.is_active}` !== 'false');
    const correctCount = calculateScore(questions, answers);
    const isEligible = questions.length > 0 && correctCount === questions.length;

    await appendSheet('participants!A:Z', [
      crypto.randomUUID(),
      today,
      name,
      phone,
      JSON.stringify(answers),
      String(correctCount),
      String(isEligible),
      new Date().toISOString()
    ]);

    return json(res, 200, { message: 'تم تسجيل مشاركتك، وشكراً', duplicate: false });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
