const { sequelize, User, Service } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    // 1. Seed Services
    const servicesData = [
      { name_en: 'AC Maintenance', name_ar: 'صيانة تكييف', category: 'HVAC', basePrice: 150 },
      { name_en: 'Plumbing Works', name_ar: 'أعمال سباكة', category: 'Plumbing', basePrice: 80 },
      { name_en: 'Electrical Repair', name_ar: 'إصلاح كهرباء', category: 'Electrical', basePrice: 100 },
      { name_en: 'Painting & Decor', name_ar: 'دهانات وديكور', category: 'Interior', basePrice: 300 },
      { name_en: 'Pest Control', name_ar: 'مكافحة حشرات', category: 'Cleaning', basePrice: 120 },
      { name_en: 'Cleaning Services', name_ar: 'خدمات تنظيف', category: 'Cleaning', basePrice: 50 },
      { name_en: 'Carpentry', name_ar: 'نجارة', category: 'Furniture', basePrice: 90 },
      { name_en: 'Gardening', name_ar: 'تنسيق حدائق', category: 'Outdoor', basePrice: 200 }
    ];

    const createdServices = await Service.bulkCreate(servicesData);
    console.log('Services seeded');

    // 2. Seed Technicians
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const techNames = [
      'Carlos Mendes', 'Ahmed Ali', 'John Smith', 'Ricardo Silva', 'Mohamed Hassan',
      'Marco Polo', 'Steve Jobs', 'Luis Figo', 'Zinedine Zidane', 'Cristiano Ronaldo',
      'Lionel Messi', 'Roberto Carlos', 'David Beckham', 'Paolo Maldini', 'Andrea Pirlo',
      'Xavi Hernandez', 'Andres Iniesta', 'Luka Modric', 'Karim Benzema', 'Sergio Ramos'
    ];

    for (let i = 0; i < techNames.length; i++) {
      const tech = await User.create({
        name: techNames[i],
        email: `tech${i+1}@example.com`,
        password: hashedPassword,
        role: 'Technician',
        experience: Math.floor(Math.random() * 15) + 2,
        hourlyRate: Math.floor(Math.random() * 100) + 30,
        bio: `Experienced professional technician with over ${i+2} years of industry experience. Specialized in high-quality facility maintenance and repair.`,
        avatar: `https://i.pravatar.cc/150?u=${techNames[i].replace(' ', '')}`,
        status: 'Active'
      });

      // Link random 1-3 services
      const randomServices = [];
      const numServices = Math.floor(Math.random() * 3) + 1;
      for(let j=0; j<numServices; j++) {
        const randomSrv = createdServices[Math.floor(Math.random() * createdServices.length)];
        if(!randomServices.includes(randomSrv.id)) randomServices.push(randomSrv.id);
      }
      await tech.setProvidedServices(randomServices);
    }

    console.log('20 Technicians seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
