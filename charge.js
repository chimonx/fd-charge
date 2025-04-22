// charge.js
require('dotenv').config();           // โหลด .env ถ้ายังไม่ได้โหลดใน server.js
const express = require('express');
const router = express.Router();
const Omise = require('omise');

// ตรวจว่ามี Secret Key หรือไม่
if (!process.env.OMISE_SECRET_KEY) {
  console.error('❌ Missing OMISE_SECRET_KEY in .env');
  process.exit(1);
}

// สร้าง Omise instance สำหรับ secret operations
const omiseSecret = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: '2020-05-29',
});

// POST /charge
// สร้าง charge จาก sourceId และ amount ที่ส่งเข้ามา
router.post('/', async (req, res) => {
  const { sourceId, amount } = req.body;
  console.log('Received POST /charge:', { sourceId, amount });

  if (!sourceId || !amount) {
    return res.status(400).json({ error: 'Missing sourceId or amount' });
  }

  try {
    const charge = await omiseSecret.charges.create({
      amount,
      currency: 'THB',
      source: sourceId,
    });
    console.log('Charge created:', charge.id);
    res.json(charge);
  } catch (err) {
    console.error('Charge creation failed:', err.message);
    res.status(500).json({ error: 'Failed to create charge', details: err.message });
  }
});

// GET /charge/:id/status
// ถ้า ID ขึ้นต้นด้วย src_ ให้เช็ค source.status
// ถ้าไม่ใช่ ให้เช็ค charge.status
router.get('/:id/status', async (req, res) => {
  const id = req.params.id;
  console.log('Received GET /charge/' + id + '/status');

  if (!id) {
    return res.status(400).json({ error: 'Missing ID parameter' });
  }

  try {
    if (id.startsWith('src_')) {
      // เช็ค source
      const source = await omiseSecret.sources.retrieve(id);
      console.log('Source status:', source.status);
      return res.json({ type: 'source', status: source.status, source });
    } else {
      // เช็ค charge
      const charge = await omiseSecret.charges.retrieve(id);
      console.log('Charge status:', charge.status);
      return res.json({ type: 'charge', status: charge.status, charge });
    }
  } catch (err) {
    console.error('Status retrieval failed:', err.message);
    res.status(500).json({ error: 'Failed to retrieve status', details: err.message });
  }
});

module.exports = router;
