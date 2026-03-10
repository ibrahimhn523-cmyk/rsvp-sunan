import bcrypt from 'bcryptjs';
import { json, parseBody } from '../lib/http.js';
import { signAdminToken } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method Not Allowed' });

  try {
    const { username, password } = await parseBody(req);
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!username || !password || !expectedUser || !expectedHash) {
      return json(res, 400, { error: 'Missing credentials or env vars' });
    }

    const userOk = username === expectedUser;
    const passOk = await bcrypt.compare(password, expectedHash);

    if (!userOk || !passOk) return json(res, 401, { error: 'بيانات الدخول غير صحيحة' });

    const token = signAdminToken({ role: 'admin', username });
    return json(res, 200, { token });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
