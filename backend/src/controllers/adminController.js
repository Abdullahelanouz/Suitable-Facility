const { User, Service, Booking } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: 'client', attributes: ['name', 'email'] },
        { model: User, as: 'technician', attributes: ['name', 'email'] }
      ]
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
