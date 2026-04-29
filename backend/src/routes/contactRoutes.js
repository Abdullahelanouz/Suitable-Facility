const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', contactController.submitContact);
router.get('/', protect, authorize('Admin'), contactController.getContacts);
router.patch('/:id/status', protect, authorize('Admin'), contactController.updateContactStatus);
router.delete('/:id', protect, authorize('Admin'), contactController.deleteContact);

module.exports = router;
