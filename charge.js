// charge.js
const express = require('express');
const router = express.Router();
require('dotenv').config();

const Omise = require('omise');

// Initialize Omise
const omiseSecret = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: '2020-05-29',
});

// POST /charge
router.post('/', async (req, res) => {
  const { sourceId, amount } = req.body;
  console.log('Received request:', { sourceId, amount });
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
  } catch (error) {
    console.error('Failed to create charge:', error.message);
    res.status(500).json({ error: 'Failed to create charge', details: error.message });
  }
});


// GET /charge/:id/status
// — ถ้ารหัสขึ้นต้น src_ => เช็ค source status
// — ถ้าขึ้นต้น chrg_ หรืออื่นๆ => เช็ค charge status
router.get('/:id/status', async (req, res) => {
  const id = req.params.id;
  console.log('Checking status for ID:', id);
  if (!id) {
    return res.status(400).json({ error: 'Missing ID parameter' });
  }

  try {
    if (id.startsWith('src_')) {
      // เช็คสถานะ source
      const source = await omiseSecret.sources.retrieve(id);
      console.log('Source status:', source.status);
      return res.json({ type: 'source', status: source.status, source });
    } else {
      // เช็คสถานะ charge
      const charge = await omiseSecret.charges.retrieve(id);
      console.log('Charge status:', charge.status);
      return res.json({ type: 'charge', status: charge.status, charge });
    }
  } catch (error) {
    console.error('Failed to retrieve status:', error.message);
    res.status(500).json({ error: 'Failed to retrieve status', details: error.message });
  }
});

module.exports = router;
