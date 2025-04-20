require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const mime = require('mime-types');

// Membaca credential dari .env
const credential = {
  type: 'service_account',
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER,
  client_x509_cert_url: process.env.GOOGLE_CERT_URL,
};

const auth = new google.auth.GoogleAuth({
  credentials: credential,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1FUAgr3Vtki6jhnTWHU65imncclqyoShb'; // Ganti sesuai folder kamu

async function uploadToDrive(filePath, fileName) {
  console.log("File Path:", filePath);  // Log file path
  
  // Pastikan file bisa diakses
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error("Error accessing file:", err);
    } else {
      console.log("File size:", stats.size);
    }
  });

  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType: mime.lookup(filePath),
    body: fs.createReadStream(filePath),
  };

  console.log("MIME Type:", mime.lookup(filePath));  // Log MIME type

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    const fileId = file.data.id;

    // Log fileId to check if file is uploaded correctly
    console.log('File ID:', fileId);

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return `https://drive.google.com/uc?id=${fileId}`;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
  }
}

module.exports = uploadToDrive;
