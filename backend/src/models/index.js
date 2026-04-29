const { sequelize } = require('../config/database');
const User = require('./User');
const Service = require('./Service');
const Booking = require('./Booking');
const UaeInquiry = require('./UaeInquiry');
const Contact = require('./Contact');

// Many-to-Many: Technician <-> Service
User.belongsToMany(Service, { through: 'TechnicianServices', as: 'providedServices', foreignKey: 'userId' });
Service.belongsToMany(User, { through: 'TechnicianServices', as: 'technicians', foreignKey: 'serviceId' });

// Booking Associations
Booking.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Booking.belongsTo(User, { as: 'technician', foreignKey: 'technicianId' });
User.hasMany(Booking, { as: 'clientBookings', foreignKey: 'clientId' });
User.hasMany(Booking, { as: 'techBookings', foreignKey: 'technicianId' });


module.exports = {
  sequelize,
  User,
  Service,
  Booking,
  UaeInquiry,
  Contact
};

