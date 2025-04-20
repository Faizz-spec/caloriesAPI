require('dotenv').config(); // Memuat variabel lingkungan dari .env file
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Mengambil API key dari .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Fungsi untuk mengirim gambar
exports.detectFood = async (imagePath) => {
  const apiKey = OPENAI_API_KEY; // Menggunakan API key dari .env

  // 🔥 Convert image ke base64
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: 'Gambar ini makanan apa kira kira berapa gram beratnya dan berapa estimasi kalorinya (dalam angka saja)?'
          },
          {
            role: 'system',  // Tentukan role sebagai 'system' atau lainnya sesuai keperluan
            content: `data:image/png;base64,${base64Image}` // Kirim gambar dalam format base64
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`, // Menyertakan API key
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;

    // 🔍 Coba ambil angka kalori dari teks (misal "105", "300 kcal", dll)
    const match = content.match(/([0-9]{2,5})\s*(kcal|kalori)?/i);
    const estimatedCalories = match ? parseInt(match[1]) : null;

    return {
      label: content,
      calories: estimatedCalories,
      raw: content
    };

  } catch (error) {
    console.error('❌ GPT ERROR:', error.response?.data || error.message);
    return {
      label: '[ERROR] Gagal menghubungi GPT',
      calories: null,
      raw: '[GPT tidak merespon atau format base64 tidak valid]'
    };
  }
};
