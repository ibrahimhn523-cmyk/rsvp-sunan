import { json, parseBody } from '../lib/http.js';
import { readSheet, rowsToObjects, writeSheet } from '../lib/sheets.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = rowsToObjects(await readSheet('settings!A:Z'));
      const settings = rows[0] || {};
      return json(res, 200, settings);
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req)) return json(res, 401, { error: 'Unauthorized' });
      const { logo_url = '', sponsor1_url = '', sponsor2_url = '' } = await parseBody(req);
      await writeSheet('settings!A2:D2', [[1, logo_url, sponsor1_url, sponsor2_url]]);
      return json(res, 200, { message: 'Saved' });
    }

    return json(res, 405, { error: 'Method Not Allowed' });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
