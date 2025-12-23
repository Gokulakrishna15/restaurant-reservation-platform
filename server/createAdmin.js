import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanAndCreateAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ✅ DELETE ALL USERS (to remove double-hashed passwords)
    const result = await User.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} old users`);

    // ✅ Create new admin with plain password (model will hash it once)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@foodiehub.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@foodiehub.com');
    console.log('🔑 Password: admin123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

cleanAndCreateAdmin();