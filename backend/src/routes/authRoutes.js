const express = require('express');
const { register, login, updateProfile } = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.put('/update-profile', protect, updateProfile);
router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

router.get('/services', async (req, res) => {
  try {
    const { Service, User, sequelize } = require('../models');
    
    const services = await Service.findAll({
      where: { isActive: true },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM TechnicianServices AS ts
              WHERE ts.serviceId = Service.id
            )`),
            'techsCount'
          ]
        ]
      }
    });
    
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/technicians', async (req, res) => {
  try {
    const { User, Service } = require('../models');
    const { service } = req.query;
    
    console.log('Filter Service Name:', service);

    const includeClause = { 
      model: Service, 
      as: 'providedServices', 
      attributes: ['id', 'name_en'],
      through: { attributes: [] }
    };

    const techs = await User.findAll({ 
      where: { role: 'Technician' },
      attributes: ['id', 'name', 'skills', 'experience', 'hourlyRate', 'bio', 'avatar'],
      include: [includeClause]
    });

    // Filter by service name_en (case-insensitive)
    let filteredTechs = techs;
    if (service && service !== 'undefined') {
      const svcName = decodeURIComponent(service).toLowerCase();
      filteredTechs = techs.filter(t => 
        t.providedServices && t.providedServices.some(s => s.name_en.toLowerCase() === svcName)
      );
    }

    console.log(`Found ${techs.length} total techs, ${filteredTechs.length} after filter.`);
    res.json(filteredTechs);
  } catch (error) {
    console.error('FETCH TECH ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});






module.exports = router;
