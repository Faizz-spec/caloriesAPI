const db = [];

exports.save = (userId, filename, hash, result) => {
  const record = {
    id: Date.now(),
    user_id: userId,
    image_url: `/uploads/${filename}`,
    image_hash: hash,
    label: result.label,
    calories: result.calories,
    created_at: new Date()
  };
  db.push(record);
  return record;
};

exports.findByHash = (userId, hash) => {
  return db.find(item => item.user_id === userId && item.image_hash === hash);
};

// 🔥 INI YANG KURANG KAMU TADI:
exports.getAllByUser = (userId) => {
  return db.filter(item => item.user_id === userId);
};
