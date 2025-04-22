const express = require('express');
const router = express.Router();
const Omise = require('omise');

const omise = Omise({
  secretKey: 'skey_test_5vtenkvhlas6pps21rz',
  omiseVersion: '2020-05-29'
});

router.post('/', async (req, res) => {
  const { sourceId, amount } = req.body;

  if (!sourceId || !amount) {
    return res.status(400).json({ error: 'Missing sourceId or amount' });
  }

  try {
    const charge = await omise.charges.create({
      amount,
      currency: 'THB',
      source: sourceId
    });

    res.json(charge);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create charge' });
  }
});

module.exports = router;
