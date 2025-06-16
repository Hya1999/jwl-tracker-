
const { google } = require('googleapis');
const functions = require('@google-cloud/functions-framework');
const { JWT } = require('google-auth-library');

functions.http('appendToSheet', async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const data = req.body;
  const sheetId = '1Dniv7bXpgUzgCnkeh5CA92-wSB_xc1r3oor-tDCgrvY';
  const sheetName = 'Sheet1';

  const jwtClient = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth: jwtClient });

  try {
    const values = [Object.values(data)];
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: sheetName,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });
    res.status(200).send('Data appended');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to append data');
  }
});
