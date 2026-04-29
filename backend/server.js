const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./src/config/database');
const { sequelize } = require('./src/models');

const app = express();

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const uaeInquiryRoutes = require('./src/routes/uaeInquiryRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  credentials: true
}));
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/uae-inquiries', uaeInquiryRoutes);
app.use('/api/contacts', contactRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Suitable Facility API v1.0', status: 'running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Database Connection & Sync
connectDB();
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synced'))
  .catch(err => console.error('❌ DB sync failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
