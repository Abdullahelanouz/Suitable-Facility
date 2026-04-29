const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // Optional: link to authenticated client
  clientId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: User, key: 'id' }
  },
  technicianId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: User, key: 'id' }
  },
  // For public/guest bookings (UAE corporate form)
  clientName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clientPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'),
    defaultValue: 'Pending',
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Booking;

