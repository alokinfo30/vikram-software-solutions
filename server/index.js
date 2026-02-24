// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from server directory (works when run from server/ or project root)
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env') });
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/vikram-software';
}
// Ensure JWT_SECRET is set (required for login); use dev fallback if .env didn't load
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET must be set in production. Check your .env file.');
    process.exit(1);
  }
  process.env.JWT_SECRET = 'dev-secret-change-in-production-vikram-software';
  console.warn('JWT_SECRET was not set; using development default. Set JWT_SECRET in server/.env for production.');
}


// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import serviceRequestRoutes from './routes/serviceRequestRoutes.js';


const app = express();

// Middleware - allow Vite (5173) and common dev origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, origin || allowedOrigins[0]);
    return cb(null, false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log('MongoDB connected successfully');
    
    // Seed admin user if not exists
    await seedAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed admin function
const seedAdmin = async () => {
  try {
    const User = (await import('./models/User.js')).default;
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@vikram.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/service-requests', serviceRequestRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(path.resolve(), '../client/build')));
  
  // The "catch-all" handler for any request that doesn't match an API route
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(path.resolve(), '../client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});