const express = require('express');
const cors = require('cors');  // ใช้ CORS package
const chargeRoute = require('./charge'); // import charge route
const app = express();

// ตั้งค่า CORS
app.use(cors({
  origin: 'https://spiffy-duckanoo-f9b409.netlify.app',  // ให้เฉพาะ Netlify origin เข้าถึงได้
  methods: ['GET', 'POST', 'OPTIONS'],  // อนุญาตเฉพาะ HTTP methods ที่ต้องการ
  allowedHeaders: ['Content-Type', 'Authorization']  // อนุญาตเฉพาะ headers ที่จำเป็น
}));

app.use(express.json());
app.use('/charge', chargeRoute);  // route สำหรับ charge

app.listen(3000, () => console.log('Server running on port 3000'));
