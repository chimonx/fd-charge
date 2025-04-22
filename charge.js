const express = require('express');
const router = express.Router();
require('dotenv').config();

const Omise = require('omise');

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: '2020-05-29'
});

// POST Route for creating charge
router.post('/', async (req, res) => {
  const { sourceId, amount } = req.body;

  // Log ข้อมูลที่รับมา
  console.log('Received request:', { sourceId, amount });

  if (!sourceId || !amount) {
    console.log('Missing sourceId or amount');
    return res.status(400).json({ error: 'Missing sourceId or amount' });
  }

  try {
    // สร้าง charge
    const charge = await omise.charges.create({
      amount,
      currency: 'THB',
      source: sourceId
    });

    // Log ผลลัพธ์จาก Omise
    console.log('Charge created successfully:', charge);

    res.json(charge);
  } catch (error) {
    // Log ข้อผิดพลาดที่เกิดขึ้น
    console.error('Failed to create charge:', error);

    res.status(500).json({ error: 'Failed to create charge' });
  }
});

// GET Route for checking source status
router.get('/source/:id/check-status', async (req, res) => {
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

module.exports = router;
