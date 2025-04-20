require('dotenv').config(); // ✅ WAJIB baris pertama!

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const foodRoutes = require('./routes/foodRoutes');

const app = express();

app.use((req, res, next) => {
  console.log(`👉 Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

app.use('/api/foods', foodRoutes);

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});
