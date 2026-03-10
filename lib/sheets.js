import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let sheetsClient;

async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  if (!SHEET_ID || !EMAIL || !PRIVATE_KEY) {
    throw new Error('Missing Google Sheets environment variables');
  }

  const auth = new google.auth.JWT({
    email: EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  await auth.authorize();
  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

export function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function readSheet(range) {
  const sheets = await getSheetsClient();
  const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range });
  return data.values || [];
}

export async function appendSheet(range, values) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] }
  });
}

export async function writeSheet(range, values) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }
  });
}

export function rowsToObjects(rows) {
  if (!rows.length) return [];
  const [header, ...body] = rows;
  return body.map((row) => Object.fromEntries(header.map((k, i) => [k, row[i] ?? ''])));
}
