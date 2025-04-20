// middlewares/limitChecker.js
const logs = {};

module.exports = (req, res, next) => {
  const userId = req.body.userId;
  const today = new Date().toISOString().split('T')[0];

  if (!logs[userId]) logs[userId] = {};
  if (!logs[userId][today]) logs[userId][today] = 0;

  if (logs[userId][today] >= 2) {
    return res.status(429).json({ message: 'Limit harian scan sudah tercapai.' });
  }

  logs[userId][today] += 1;
  next();
};
