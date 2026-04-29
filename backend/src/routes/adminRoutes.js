const express = require('express');
const { getUsers, getBookings } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/users', getUsers);
router.get('/bookings', getBookings);

module.exports = router;
