import { json } from '../lib/http.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method Not Allowed' });
  if (!requireAdmin(req)) return json(res, 401, { error: 'Unauthorized' });

  return json(res, 501, {
    error: 'رفع الملفات غير مفعل حالياً. استخدم روابط Google Drive المباشرة عبر /api/settings.'
  });
}
