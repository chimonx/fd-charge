const express = require('express');
const chargeRoute = require('./routes/charge');
const app = express();

app.use(express.json());
app.use('/charge', chargeRoute);

app.listen(3000, () => console.log('Server running on port 3000'));
