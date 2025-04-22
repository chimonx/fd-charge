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

// GET Route for checking payment status using charge ID
router.get('/charge/:id/status', async (req, res) => {
  const chargeId = req.params.id;

  console.log('Checking payment status for charge ID:', chargeId);

  if (!chargeId) {
    console.error('Error: Missing charge ID');
    return res.status(400).json({ error: 'Missing charge ID' });
  }

  try {
    const charge = await omiseSecret.charges.retrieve(chargeId);

    console.log('Charge status retrieved:', charge.status);

    res.json({ status: charge.status, charge });
  } catch (error) {
    console.error('Failed to retrieve charge status:', error.response || error.message);

    res.status(500).json({ error: 'Failed to retrieve charge status', details: error.message });
  }
});

module.exports = router;
