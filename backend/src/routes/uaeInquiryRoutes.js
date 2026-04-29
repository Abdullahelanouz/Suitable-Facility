const express = require('express');
const router = express.Router();
const uaeInquiryController = require('../controllers/uaeInquiryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Public route for submitting inquiries
router.post('/', uaeInquiryController.createInquiry);

// Admin routes for managing inquiries
router.get('/', authMiddleware, adminMiddleware, uaeInquiryController.getAllInquiries);
router.patch('/:id/status', authMiddleware, adminMiddleware, uaeInquiryController.updateStatus);
router.delete('/:id', authMiddleware, adminMiddleware, uaeInquiryController.deleteInquiry);

module.exports = router;
