import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestAccounts = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const testAccounts = [
      {
        name: 'Admin User',
        email: 'admin@foodiehub.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Test User',
        email: 'user@test.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'Restaurant Owner',
        email: 'owner@test.com',
        password: 'owner123',
        role: 'restaurant_owner'
      }
    ];

    console.log('\n🎯 Creating test accounts...\n');

    for (const account of testAccounts) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: account.email });
      
      if (existingUser) {
        console.log(`⚠️  ${account.role.toUpperCase()} already exists: ${account.email}`);
      } else {
        // Create new user (password will be hashed by pre-save hook)
        await User.create(account);
        console.log(`✅ ${account.role.toUpperCase()} created: ${account.email}`);
      }
    }

    console.log('\n📋 TEST ACCOUNTS SUMMARY:');
    console.log('═══════════════════════════════════════════');
    console.log('⚡ ADMIN:');
    console.log('   📧 Email: admin@foodiehub.com');
    console.log('   🔑 Password: admin123');
    console.log('   🎯 Access: Manage all restaurants, reservations, reviews');
    console.log('');
    console.log('👤 CUSTOMER:');
    console.log('   📧 Email: user@test.com');
    console.log('   🔑 Password: user123');
    console.log('   🎯 Access: Browse, book, review restaurants');
    console.log('');
    console.log('🏪 RESTAURANT OWNER:');
    console.log('   📧 Email: owner@test.com');
    console.log('   🔑 Password: owner123');
    console.log('   🎯 Access: Add and manage own restaurants');
    console.log('═══════════════════════════════════════════');
    console.log('\n🎉 All test accounts ready!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createTestAccounts();