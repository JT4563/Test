
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const interviewRoutes = require('./src/routes/interviewRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api', interviewRoutes);
app.use('/api', feedbackRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch((e) => {
  console.error('DB connection failed', e);
  process.exit(1);
});
