import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Project from '../models/Project.js';
import ServiceRequest from '../models/ServiceRequest.js';
// These two lines are essential in ES Modules to handle paths correctly

// Load .env from server root (npm run seed runs with cwd = server/)
dotenv.config({ path: path.join(process.cwd(), '.env') });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vikram-software';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};
// Sample data
const getHashedUsers = async () => {
  return [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@vikram.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      companyName: 'Tech Corp'
    },
    {
      firstName: 'Employee',
      lastName: 'User',
      email: 'employee@vikram.com',
      password: await bcrypt.hash('employee123', 10),
      role: 'employee',
      phone: '+1234567890',
      companyName: 'Tech Corp'
    },
    {
      firstName: 'Client',
      lastName: 'User',
      email: 'client@vikram.com',
      password: await bcrypt.hash('client123', 10),
      role: 'client',
      phone: '+1234567891',
      companyName: 'Design Studio'
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.employee@vikram.com',
      password: await bcrypt.hash('employee123', 10),
      role: 'employee',
      phone: '+1234567890',
      companyName: 'Tech Corp'
    },
    {
      firstName: 'Jane',
      lastName: 'Client',
      email: 'jane.employee@vikram.com',
      password: await bcrypt.hash('client123', 10),
      role: 'client',
      phone: '+1234567891',
      companyName: 'Design Studio'
    },
    {
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.client@vikram.com',
      password: await bcrypt.hash('employee123', 10),
      role: 'employee',
      companyName: 'Tech Corp',
      phone: '+1234567892'
    },
    {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.client@vikram.com',
      password: await bcrypt.hash('client123', 10),
      role: 'client',
      companyName: 'Design Studio',
      phone: '+1234567893'
    }
  ];
};


const connectWithRetry = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Connecting to MongoDB (Attempt ${retries + 1})...`);
      await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
      });
      console.log('✅ Connected to local MongoDB');
      return true;
    } catch (err) {
      retries++;
      console.log(`❌ Connection attempt ${retries} failed: ${err.message} . Retrying in 3 seconds...`);
      if (retries < maxRetries) {
        console.log('Retrying in 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  return false;
};

// Seed function
const seedData = async () => {
  try {
    // 1. Explicitly wait for the connection to be established
    await connectDB();
    console.log('Connected successfully!');
    console.log('🌱 Starting database seeding...');

    const connected = await connectWithRetry();
    if (!connected) {
      console.error('❌ Could not connect to MongoDB after multiple attempts');
      console.log('🔧 Make sure MongoDB is running:');
      console.log('   - Windows: Start MongoDB service');
      console.log('   - macOS: brew services start mongodb-community');
      console.log('   - Linux: sudo systemctl start mongod');
      process.exit(1);
    }


    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await ServiceRequest.deleteMany({});
    console.log('🗑️  Cleared existing data');

    console.log('Data cleared...');

    // Create users with hashed passwords
    // Create users
    const users = await getHashedUsers();
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    console.log(`✅ Created ${createdUsers.length} users`);


    // Get IDs
    const admin = createdUsers.find(u => u.role === 'admin');
    const employees = createdUsers.filter(u => u.role === 'employee');
    const clients = createdUsers.filter(u => u.role === 'client');

    const serviceRequests = [
      {
        client: clients[0]._id,
        serviceName: 'Website Development',
        description: 'Need a modern responsive website for our company',
        status: 'pending',
        timeline: 'normal'
      },
      {
        client: clients[1]._id,
        serviceName: 'Mobile App Development',
        description: 'iOS and Android app for our e-commerce platform',
        status: 'approved',
        timeline: 'urgent',
        reviewedBy: admin._id,
        reviewedAt: new Date()
      },
      {
        client: clients[0]._id,
        serviceName: 'Cloud Migration',
        description: 'Move our infrastructure to AWS',
        status: 'rejected',
        timeline: 'flexible',
        adminNotes: 'Need more details about current infrastructure',
        reviewedBy: admin._id,
        reviewedAt: new Date()

      }
    ];

    const projects = [
      {
        name: 'Corporate Website Redesign',
        description: 'Complete redesign of corporate website with modern UI/UX',
        client: clients[0]._id,
        assignedEmployees: [employees[0]._id],
        serviceType: 'Web Development',
        status: 'in-progress',
        priority: 'high',
        startDate: new Date()

      },
      {
        name: 'Inventory Management App',
        description: 'Mobile app for inventory tracking',
        client: clients[1]._id,
        assignedEmployees: [employees[1]._id, employees[0]._id],
        status: 'pending',
        serviceType: 'Mobile App Development',
        priority: 'medium'
      },
      {
        name: 'Database Optimization',
        description: 'Optimize database queries and indexing',
        client: clients[0]._id,
        assignedEmployees: [employees[0]._id],
        status: 'completed',
        serviceType: 'Database Management',
        priority: 'high',
        endDate: new Date()
      },
      {
        name: 'E-commerce Mobile App',
        description: 'Native mobile app for iOS and Android',
        serviceType: 'Mobile App Development',
        status: 'pending',
        priority: 'medium'
      }
    ];

    // Create service requests with client references
    const requestsWithClients = serviceRequests.map((request, index) => ({
      ...request,
      client: clients[index % clients.length]._id,
      reviewedBy: request.status !== 'pending' ? admin._id : undefined,
      reviewedAt: request.status !== 'pending' ? new Date() : undefined
    }));

    const createdRequests = await ServiceRequest.insertMany(requestsWithClients);
    console.log(`${createdRequests.length} service requests created`);
    console.log(`✅ Created ${createdRequests.length} service requests`);


    // Create projects with client and employee references
    const projectsWithRefs = projects.map((project, index) => ({
      ...project,
      client: clients[index % clients.length]._id,
      assignedEmployees: [employees[index % employees.length]._id]
    }));

    const createdProjects = await Project.insertMany(projectsWithRefs);
    console.log(`${createdProjects.length} projects created`);
    console.log(`✅ Created ${createdProjects.length} projects`);
    console.log('\n📊 Database Seeding Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Service Requests: ${createdRequests.length}`);
    console.log(`   Projects: ${createdProjects.length}`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('Database seeded successfully!');
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@vikram.com / admin123');
    console.log('   Employee: employee@vikram.com / employee123');
    console.log('   Client: client@vikram.com / client123');

    await mongoose.connection.close(); // Close the DB connection safely
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    console.error('❌ Error seeding database:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedData();