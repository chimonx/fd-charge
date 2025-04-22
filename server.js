const express = require('express');
const cors = require('cors');
const chargeRoute = require('./charge');
const app = express();

// CORS settings
const allowedOrigins = [
  'https://spiffy-duckanoo-f9b409.netlify.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mount all charge-related routes
app.use('/charge', chargeRoute);

// Handle CORS errors
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS Error: Access denied.' });
  }
  next(err);
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
