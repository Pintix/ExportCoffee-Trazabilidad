const express = require('express');
const cors = require('cors');
require('dotenv').config();

const lotesRoutes = require('./routes/lotes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/lotes', lotesRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ExportCoffee API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
