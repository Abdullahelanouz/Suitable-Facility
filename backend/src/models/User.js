const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
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
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Client', 'Technician'),
    defaultValue: 'Client',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  skills: {
    type: DataTypes.JSON, // Array of strings
    allowNull: true,
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Busy'),
    defaultValue: 'Active',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  }

}, {
  timestamps: true,
});

module.exports = User;
