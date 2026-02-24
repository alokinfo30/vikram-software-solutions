// server/config/database.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,      // Max 10 simultaneous connections
      minPoolSize: 2,       // Keep at least 2 connections open
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // List all collections (optional)
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', ') || 'No collections yet');

// Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });


    // Create indexes
    await createIndexes();
  } catch (error) {
    console.error(`Error: ${error.message}`);
        console.error('❌ Local MongoDB connection error:', error.message);

        // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.log('🔧 FIX: Make sure MongoDB is running:');
      console.log('   - Windows: Check if MongoDB service is running');
      console.log('   - macOS: Run "brew services start mongodb-community"');
      console.log('   - Linux: Run "sudo systemctl start mongod"');
    } else if (error.message.includes('Authentication failed')) {
      console.log('🔧 FIX: Check your username and password in MONGODB_URI');
    }
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const User = (await import('../models/User.js')).default;
    const Project = (await import('../models/Project.js')).default;
    const Message = (await import('../models/Message.js')).default;
    const ServiceRequest = (await import('../models/ServiceRequest.js')).default;

    // Create indexes for better query performance
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });

    await Project.collection.createIndex({ client: 1 });
    await Project.collection.createIndex({ status: 1 });
    await Project.collection.createIndex({ assignedEmployees: 1 });

    await Message.collection.createIndex({ sender: 1, receiver: 1 });
    await Message.collection.createIndex({ receiver: 1, read: 1 });

    await ServiceRequest.collection.createIndex({ client: 1 });
    await ServiceRequest.collection.createIndex({ status: 1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

export default connectDB;