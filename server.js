const express = require('express');
const chargeRoute = require('./charge'); // ✅ ต้องมี './' เพื่อชี้ไปยังไฟล์ charge.js
const app = express();

app.use(express.json());
app.use('/charge', chargeRoute); // เช่น POST /charge

app.listen(3000, () => console.log('Server running on port 3000'));
