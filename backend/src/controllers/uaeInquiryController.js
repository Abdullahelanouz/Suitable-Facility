const { UaeInquiry } = require('../models');

exports.createInquiry = async (req, res) => {
  try {
    const inquiry = await UaeInquiry.create(req.body);
    res.status(201).json({ message: 'Inquiry submitted successfully', data: inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
};

exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await UaeInquiry.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await UaeInquiry.update({ status }, { where: { id } });
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
    try {
      const { id } = req.params;
      await UaeInquiry.destroy({ where: { id } });
      res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
    }
  };
