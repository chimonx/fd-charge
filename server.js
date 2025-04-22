const express = require('express');
const cors = require('cors');  // ใช้ CORS package
const Omise = require('omise');
const chargeRoute = require('./charge'); // import charge route
const app = express();

// ตั้งค่า CORS
const allowedOrigins = [
  'https://spiffy-duckanoo-f9b409.netlify.app', // Example: Netlify URL
  // You can add more allowed origins here
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {  // Allowing for localhost and other domains
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],  // อนุญาตเฉพาะ HTTP methods ที่ต้องการ
  allowedHeaders: ['Content-Type', 'Authorization']  // อนุญาตเฉพาะ headers ที่จำเป็น
}));

// Initialize Omise API client
const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: '2020-05-29'
});

// Use JSON parser middleware
app.use(express.json());

// Charge route
app.use('/charge', chargeRoute);  // route สำหรับ charge

// GET Route for checking source status
app.get('/api/source/:id/check-status', async (req, res) => {
  const sourceId = req.params.id;

  // Log ข้อมูลที่รับมา
  console.log('Checking status for source:', sourceId);

  if (!sourceId) {
    console.log('Missing sourceId');
    return res.status(400).json({ error: 'Missing sourceId' });
  }

  try {
    // Retrieve source status from Omise
    const sourceStatus = await omise.sources.retrieve(sourceId);

    // Log ผลลัพธ์จาก Omise
    console.log('Source status retrieved successfully:', sourceStatus);

    res.json(sourceStatus);
  } catch (error) {
    // Log ข้อผิดพลาดที่เกิดขึ้น
    console.error('Failed to retrieve source status:', error);

    res.status(500).json({ error: 'Failed to retrieve source status' });
  }
});

// Error handling middleware for CORS-related issues
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS Error: Access denied.' });
  }
  next(err);
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
