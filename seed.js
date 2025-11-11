require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/database');
const User = require('./src/models/User');
const Provider = require('./src/models/Provider');
const Service = require('./src/models/Service');

const sampleServices = [
  {
    title: 'Reparación de Fugas de Agua',
    description: 'Reparación profesional de fugas en tuberías, grifos y sanitarios',
    category: 'plumbing',
    type: 'both',
    pricing: { type: 'hourly', amount: 50, currency: 'USD' },
    estimatedDuration: { value: 2, unit: 'hours' }
  },
  {
    title: 'Instalación Eléctrica',
    description: 'Instalación de sistemas eléctricos, outlets y luminarias',
    category: 'electrical',
    type: 'both',
    pricing: { type: 'quote', currency: 'USD' },
    estimatedDuration: { value: 1, unit: 'days' }
  },
  {
    title: 'Construcción de Muebles a Medida',
    description: 'Carpintería personalizada para hogar y oficina',
    category: 'carpentry',
    type: 'both',
    pricing: { type: 'quote', currency: 'USD' },
    estimatedDuration: { value: 1, unit: 'weeks' }
  },
  {
    title: 'Pintura Interior',
    description: 'Pintura profesional de espacios interiores',
    category: 'painting',
    type: 'both',
    pricing: { type: 'fixed', amount: 500, currency: 'USD' },
    estimatedDuration: { value: 3, unit: 'days' }
  },
  {
    title: 'Reparación de Techos',
    description: 'Reparación y mantenimiento de techos',
    category: 'roofing',
    type: 'both',
    pricing: { type: 'quote', currency: 'USD' },
    estimatedDuration: { value: 2, unit: 'days' }
  },
  {
    title: 'Mantenimiento de Aire Acondicionado',
    description: 'Servicio y reparación de sistemas HVAC',
    category: 'hvac',
    type: 'both',
    pricing: { type: 'hourly', amount: 60, currency: 'USD' },
    estimatedDuration: { value: 2, unit: 'hours' }
  },
  {
    title: 'Construcción de Extensiones',
    description: 'Construcción de ampliaciones y nuevas estructuras',
    category: 'construction',
    type: 'both',
    pricing: { type: 'quote', currency: 'USD' },
    estimatedDuration: { value: 4, unit: 'weeks' }
  },
  {
    title: 'Remodelación de Cocinas',
    description: 'Remodelación completa de cocinas',
    category: 'remodeling',
    type: 'residential',
    pricing: { type: 'quote', currency: 'USD' },
    estimatedDuration: { value: 2, unit: 'weeks' }
  },
  {
    title: 'Diseño y Mantenimiento de Jardines',
    description: 'Servicios de jardinería y paisajismo',
    category: 'landscaping',
    type: 'both',
    pricing: { type: 'hourly', amount: 40, currency: 'USD' },
    estimatedDuration: { value: 4, unit: 'hours' }
  },
  {
    title: 'Limpieza Profunda',
    description: 'Servicios de limpieza profesional',
    category: 'cleaning',
    type: 'both',
    pricing: { type: 'fixed', amount: 150, currency: 'USD' },
    estimatedDuration: { value: 4, unit: 'hours' }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Provider.deleteMany({});
    await Service.deleteMany({});

    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@maipro.com',
      password: hashedPassword,
      phone: '+1234567890',
      role: 'admin',
      address: {
        street: 'Admin Street 123',
        city: 'Tech City',
        state: 'CA',
        zipCode: '12345'
      }
    });
    console.log('✓ Admin user created');

    // Create customer user
    const customer = await User.create({
      name: 'María González',
      email: 'maria@example.com',
      password: hashedPassword,
      phone: '+1234567891',
      role: 'customer',
      address: {
        street: 'Customer Street 456',
        city: 'Tech City',
        state: 'CA',
        zipCode: '12345'
      }
    });
    console.log('✓ Customer user created');

    // Create provider users
    const provider1User = await User.create({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: hashedPassword,
      phone: '+1234567892',
      role: 'provider',
      address: {
        street: 'Provider Street 789',
        city: 'Tech City',
        state: 'CA',
        zipCode: '12345'
      },
      rating: { average: 4.8, count: 45 }
    });

    const provider2User = await User.create({
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      password: hashedPassword,
      phone: '+1234567893',
      role: 'provider',
      address: {
        street: 'Provider Avenue 321',
        city: 'Tech City',
        state: 'CA',
        zipCode: '12345'
      },
      rating: { average: 4.5, count: 30 }
    });
    console.log('✓ Provider users created');

    // Create provider profiles
    const provider1 = await Provider.create({
      userId: provider1User._id,
      businessName: 'Plomería Pérez',
      description: 'Servicios profesionales de plomería con más de 10 años de experiencia. Atención 24/7 para emergencias.',
      specialties: ['plumbing', 'hvac'],
      serviceArea: {
        radius: 50,
        cities: ['Tech City', 'Nearby City', 'Another City']
      },
      availability: {
        monday: { available: true, hours: '8:00-18:00' },
        tuesday: { available: true, hours: '8:00-18:00' },
        wednesday: { available: true, hours: '8:00-18:00' },
        thursday: { available: true, hours: '8:00-18:00' },
        friday: { available: true, hours: '8:00-18:00' },
        saturday: { available: true, hours: '9:00-14:00' },
        sunday: { available: false, hours: '' }
      },
      verified: true,
      pricing: {
        hourlyRate: 50,
        minimumCharge: 100
      },
      completedJobs: 45
    });

    const provider2 = await Provider.create({
      userId: provider2User._id,
      businessName: 'Construcciones Rodríguez',
      description: 'Expertos en construcción y remodelación. Proyectos residenciales y comerciales de alta calidad.',
      specialties: ['construction', 'remodeling', 'carpentry'],
      serviceArea: {
        radius: 75,
        cities: ['Tech City', 'Metro City']
      },
      availability: {
        monday: { available: true, hours: '7:00-17:00' },
        tuesday: { available: true, hours: '7:00-17:00' },
        wednesday: { available: true, hours: '7:00-17:00' },
        thursday: { available: true, hours: '7:00-17:00' },
        friday: { available: true, hours: '7:00-17:00' },
        saturday: { available: true, hours: '8:00-13:00' },
        sunday: { available: false, hours: '' }
      },
      verified: true,
      pricing: {
        hourlyRate: 65,
        minimumCharge: 200
      },
      completedJobs: 30
    });
    console.log('✓ Provider profiles created');

    // Create services
    console.log('📋 Creating services...');
    const services = await Service.insertMany(sampleServices);
    console.log(`✓ ${services.length} services created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Sample credentials:');
    console.log('   Admin: admin@maipro.com / password123');
    console.log('   Customer: maria@example.com / password123');
    console.log('   Provider 1: juan@example.com / password123');
    console.log('   Provider 2: carlos@example.com / password123');
    console.log('\n🌐 Start the server with: npm start');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
