const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Service } = require('../models');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, experience, hourlyRate, bio, avatar } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Client',
      phone,
      location,
      experience,
      hourlyRate,
      bio,
      avatar
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        phone: user.phone,
        location: user.location,
        skills: user.skills, 
        experience: user.experience, 
        hourlyRate: user.hourlyRate, 
        bio: user.bio, 
        avatar: user.avatar 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, skills, experience, hourlyRate, bio, avatar, services } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ name, phone, skills, experience, hourlyRate, bio, avatar });

    if (services && Array.isArray(services)) {
      await user.setProvidedServices(services);
    }

    const updatedUser = await User.findByPk(req.user.id, {
      include: [{ model: Service, as: 'providedServices', attributes: ['id', 'name_en'] }]
    });

    res.json({
      success: true,
      user: { 
        id: updatedUser.id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        role: updatedUser.role, 
        skills: updatedUser.skills, 
        experience: updatedUser.experience, 
        hourlyRate: updatedUser.hourlyRate, 
        bio: updatedUser.bio, 
        avatar: updatedUser.avatar,
        providedServices: updatedUser.providedServices
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


