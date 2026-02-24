// server/test-local-db.js
// Run this to test your local MongoDB connection
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vikram-software';

const testLocalConnection = async () => {
  console.log('🔍 Testing Local MongoDB Connection...');
  console.log('Connection URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });

    console.log('✅ SUCCESS: Connected to local MongoDB!');

    // Get database info
    const admin = mongoose.connection.db.admin();
    const serverInfo = await admin.serverInfo();
    console.log('📊 MongoDB Version:', serverInfo.version);

    // List databases
    const dbs = await admin.listDatabases();
    console.log('📁 Available Databases:', dbs.databases.map(db => db.name).join(', '));

    // Current database info
    const dbName = mongoose.connection.db.databaseName;
    console.log('🎯 Current Database:', dbName);

    // List collections in current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections:', collections.map(c => c.name).join(', ') || 'No collections yet');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ FAILED: Could not connect to local MongoDB');
    console.error('Error:', error.message);

    // Troubleshooting tips
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Is MongoDB installed? Run: mongod --version');
    console.log('2. Is MongoDB running?');
    console.log('   - Windows: Check Services (services.msc) for MongoDB');
    console.log('   - macOS: brew services list | grep mongodb');
    console.log('   - Linux: sudo systemctl status mongod');
    console.log('3. Check if port 27017 is available');
    console.log('4. Verify your connection string in .env file');
  }
};

testLocalConnection();
