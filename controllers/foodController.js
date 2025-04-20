const openaiService = require('../services/openaiService');
const foodModel = require('../models/foodModel');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const sheetService = require('../services/spreadsheetService');
const driveUploader = require('../services/driveUploader'); // Pastikan Anda import driveUploader

exports.scanFood = async (req, res) => {
  console.log('🔥 REQUEST MASUK'); // <--- Tambahan log

  try {
    const userId = req.body.userId;
    const image = req.files.image;

    const hash = crypto.createHash('sha256').update(image.data).digest('hex');
    const existing = await foodModel.findByHash(userId, hash);
    if (existing) return res.json(existing);

    // Simpan gambar ke server lokal
    const uploadPath = path.join(__dirname, '../uploads', image.name);
    await image.mv(uploadPath);

    // Upload gambar ke Google Drive
    const driveUrl = await driveUploader(uploadPath, image.name);  // Mengambil URL file di Google Drive

    // Deteksi makanan dengan OpenAI
    const result = await openaiService.detectFood(uploadPath);

    // Simpan informasi makanan ke database
    const saved = await foodModel.save(userId, image.name, hash, {
      label: result.label,
      calories: result.calories,
      raw: result.raw
    });

    // Simpan ke spreadsheet
    await sheetService.appendData({
      user_id: userId,
      image_url: driveUrl,  // Update dengan URL yang dihasilkan dari Google Drive
      label: result.label,
      calories: result.calories
    });

    // Return response dengan data yang telah disimpan
    res.json(saved);
  } catch (err) {
    console.error('❌ Error di controller:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserFoods = (req, res) => {
  const foods = foodModel.getAllByUser(req.params.userId);
  res.json(foods);
};
