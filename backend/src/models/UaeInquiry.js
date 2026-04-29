const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UaeInquiry = sequelize.define('UaeInquiry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Reviewed', 'Contacted', 'Closed'),
    defaultValue: 'Pending',
  }
}, {
  timestamps: true,
});

module.exports = UaeInquiry;
