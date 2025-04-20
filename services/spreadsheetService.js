require('dotenv').config();
const { google } = require('googleapis');

// Membaca credential dari .env
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Mengganti \\n dengan newline
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER,
    client_x509_cert_url: process.env.GOOGLE_CERT_URL
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const sheetName = 'DataKalori';

// Fungsi untuk menambahkan data ke spreadsheet
exports.appendData = async ({ user_id, image_url, label, calories }) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const timestamp = new Date().toISOString();
    const values = [[user_id, image_url, label, calories, timestamp]];
    const resource = { values };

    // Menambahkan data ke spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:E`,
      valueInputOption: 'USER_ENTERED',
      resource
    });

    console.log('✅ Data berhasil ditambahkan ke Spreadsheet.');
  } catch (err) {
    console.error('❌ Gagal nulis ke spreadsheet:', err.message);
  }
};
