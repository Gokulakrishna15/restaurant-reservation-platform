import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@foodiehub.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('📧 Email: admin@foodiehub.com');
      console.log('🔑 Password: admin123');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@foodiehub.com',
      password: 'admin123',  // Will be hashed by pre-save hook
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@foodiehub.com');
    console.log('🔑 Password: admin123');
    console.log('\n🎯 Use these credentials to login as admin');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();