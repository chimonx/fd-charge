const express = require('express');
const router = express.Router();
require('dotenv').config();

const Omise = require('omise');

// Initialize Omise with both secret and public keys
const omisePublic = Omise({
  publicKey: 'pkey_test_5vtenkt0w8cggb5t33q',  // Public key for public operations
  omiseVersion: '2020-05-29',
});

const omiseSecret = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,  // Secret key for authenticated operations
  omiseVersion: '2020-05-29',
});

// POST Route for creating charge
router.post('/', async (req, res) => {
  const { sourceId, amount } = req.body;

  // Log the received data
  console.log('Received request:', { sourceId, amount });

  if (!sourceId || !amount) {
    console.error('Error: Missing sourceId or amount');
    return res.status(400).json({ error: 'Missing sourceId or amount' });
  }

  try {
    // Create charge using the secret key
    const charge = await omiseSecret.charges.create({
      amount,
      currency: 'THB',
      source: sourceId,
    });

    // Log the result from Omise
    console.log('Charge created successfully:', charge);

    res.json(charge);
  } catch (error) {
    // Detailed error logging
    console.error('Failed to create charge:', error.response || error.message);

    res.status(500).json({ error: 'Failed to create charge', details: error.message });
  }
});

// GET Route for checking source status and capture charge if authorized
router.get('/source/:id/check-status', async (req, res) => {
  const sourceId = req.params.id;

  // Log the received sourceId
  console.log('Checking status for source:', sourceId);

  if (!sourceId) {
    console.error('Error: Missing sourceId');
    return res.status(400).json({ error: 'Missing sourceId' });
  }

  try {
    // Retrieve charge list to find charges using this source
    const charges = await omiseSecret.charges.list({ limit: 20 });
    const targetCharge = charges.data.find(charge => charge.source && charge.source.id === sourceId);

    if (!targetCharge) {
      return res.status(404).json({ error: 'Charge not found for this source' });
    }

    // Check if the charge is authorized
    if (targetCharge.status !== 'authorized') {
      return res.json({ id: targetCharge.id, status: targetCharge.status });
    }

    // Capture the charge if it is authorized
    const captured = await omiseSecret.charges.capture(targetCharge.id);

    console.log('Charge captured successfully:', captured);

    // Return only id and status of the captured charge
    res.json({ id: captured.id, status: captured.status });
  } catch (error) {
    // Detailed error logging
    console.error('Failed to capture charge:', error.response || error.message);

    res.status(500).json({ error: 'Failed to capture charge', details: error.message });
  }
});

module.exports = router;
