const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { Booking, User } = require('../models');

// Create Booking (public — for UAE corporate enquiries)
// Create Authenticated Booking (Portugal flow)
router.post('/auth', protect, async (req, res) => {
  try {
    const { service, scheduledDate, description, technicianId, location, clientPhone } = req.body;

    const booking = await Booking.create({
      service,
      scheduledDate,
      description,
      location,
      clientName: req.user.name,       // Fallback from authenticated user
      clientEmail: req.user.email,     // Fallback from authenticated user
      clientPhone: clientPhone || req.user.phone, // Might be provided in form or taken from user
      clientId: req.user.id,
      technicianId: technicianId || null,
      status: 'Pending'
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get My Bookings (authenticated client)
router.get('/mine', protect, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { clientId: req.user.id },
      include: [{ model: User, as: 'technician', attributes: ['id', 'name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Technician Bookings
router.get('/tech', protect, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { technicianId: req.user.id },
      include: [{ model: User, as: 'client', attributes: ['id', 'name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Booking Status (Technician)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Basic authorization: ensure the tech updating it is the assigned tech
    if (booking.technicianId !== req.user.id && req.user.role !== 'Admin') {
       return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

