# Vikram Software Solutions - Management Portal

A comprehensive role-based software company management system with three user roles: Admin, Employee, and Client.

## 🚀 Live Demo
[Live Application URL](your-deployed-link)

## 📋 Features

### Admin Portal
- Create/remove employees and client companies
- Manage services and approve service requests
- Assign employees to projects
- View dashboard with statistics
- Messaging with employees and clients
- Profile management

### Employee Portal
- View assigned projects
- Update project status
- Message admin and clients
- Profile management

### Client Portal
- View projects
- Request new services
- Message admin and assigned employees
- Profile management

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- React Icons
- React Toastify for notifications

## 💾 Database Setup

1. Create a MongoDB database (MongoDB Atlas recommended)
2. Copy the connection string
3. Add to environment variables

## 🔧 Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/vikram-software-solutions.git
cd vikram-software-solutions


# Complete Guide to Test Your Application Locally

I'll guide you through testing your Vikram Software Solutions application locally with detailed baby steps. Follow these instructions carefully to ensure everything works correctly.

## **Prerequisites Checklist**

Before starting, ensure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ npm or yarn installed
- ✅ MongoDB installed and running locally
- ✅ Git (optional, for cloning)
- ✅ A code editor (VS Code recommended)
- ✅ Postman or similar tool (optional, for API testing)

## **Step 1: Start MongoDB Locally**

### **Windows:**
```bash
# Open Command Prompt as Administrator
# Method 1: Start MongoDB service
net start MongoDB

# Method 2: If service isn't installed, run directly
mongod --dbpath C:\data\db

# Verify MongoDB is running
mongo --eval "db.runCommand({connectionStatus:1})"
```

### **macOS:**
```bash
# Using Homebrew
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb

# Or check if port is listening
lsof -i :27017
```

### **Linux (Ubuntu/Debian):**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Check status
sudo systemctl status mongod

# Enable auto-start on boot
sudo systemctl enable mongod
```

## **Step 2: Get the Project Code**

### **Option A: Clone from GitHub (if you have the repo)**
```bash
# Clone your repository
git clone <your-repository-url>
cd vikram-software-solutions
```

### **Option B: Create project structure from scratch**
```bash
# Create project directory
mkdir vikram-software-solutions
cd vikram-software-solutions

# Create subdirectories
mkdir -p server client
```

## **Step 3: Set Up Backend (Server)**

### **3.1 Navigate to server directory**
```bash
cd server
```

### **3.2 Install backend dependencies**
```bash
# Initialize package.json if not exists
npm init -y

# Install all required dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv express-validator
npm install express-async-handler multer nodemailer

# Install development dependencies
npm install -D nodemon
```

### **3.3 Create environment file**
```bash
# Create .env file
touch .env

# Or on Windows:
# type nul > .env
```

### **3.4 Add environment variables to .env**
Open the `.env` file and add:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Local Connection
MONGODB_URI=mongodb://localhost:27017/vikram-software

# JWT Secrets (change these to secure values)
JWT_SECRET=my-super-secret-jwt-key-2024-vikram-software
JWT_REFRESH_SECRET=my-refresh-secret-key-2024-vikram-software
JWT_EXPIRE=30d

# Client URL
CLIENT_URL=http://localhost:3000

# Optional Email Configuration (for testing, you can skip)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@vikramsoftware.com
```

### **3.5 Create necessary directories**
```bash
# Create uploads directory for file uploads
mkdir uploads

# Create logs directory
mkdir logs
```

### **3.6 Test MongoDB connection**
```bash
# Create a test connection script or use mongosh
mongosh --eval "db.runCommand({ping:1})"

# If you created the test-local-db.js file
node test-local-db.js
```

### **3.7 Seed the database with initial data**
```bash
# Run the seed script
node seeders/seed.js

# You should see output like:
# ✅ Connected to local MongoDB
# ✅ Created 5 users
# ✅ Created 3 service requests
# ✅ Created 3 projects
# 🎉 Database seeded successfully!
```

## **Step 4: Set Up Frontend (Client)**

### **4.1 Open a new terminal and navigate to client directory**
```bash
# From the project root, go to client folder
cd client
```

### **4.2 Create React app (if not already created)**
```bash
# Create new React app
npx create-react-app .

# Or if you already have the code, just install dependencies
npm install
```

### **4.3 Install frontend dependencies**
```bash
# Install required packages
npm install axios react-router-dom react-redux @reduxjs/toolkit
npm install react-toastify react-icons jwt-decode
npm install redux-persist

# Install all at once
npm install axios react-router-dom react-redux @reduxjs/toolkit react-toastify react-icons jwt-decode redux-persist
```

### **4.4 Create environment file for client**
```bash
# Create .env file in client directory
touch .env
# On Windows: type nul > .env
```

Add to `client/.env`:
```env
# API URL for development
REACT_APP_API_URL=http://localhost:5000/api

# Other environment variables if needed
```

### **4.5 Update package.json proxy**
In `client/package.json`, add:
```json
{
  "proxy": "http://localhost:5000",
  // ... other existing configurations
}
```

## **Step 5: Start the Application**

### **5.1 Start Backend Server**
```bash
# In the server directory (first terminal)
npm run dev

# You should see:
# ✅ Local MongoDB Connected: localhost:27017
# 📊 Database: vikram-software
# Server running on port 5000
```

### **5.2 Start Frontend React App**
```bash
# In the client directory (second terminal)
npm start

# This will open http://localhost:3000 automatically
# You should see the login page
```

## **Step 6: Test the Application**

### **6.1 Test Login with Different Roles**

Open your browser and go to `http://localhost:3000`

Try these credentials:

#### **Admin Login:**
- Email: `admin@vikram.com`
- Password: `admin123`

**Expected Result:** Redirected to Admin Dashboard with:
- Sidebar showing: Dashboard, Manage Users, Projects, Service Requests, Messages
- Stats cards showing counts
- Navigation menu for admin functions

#### **Employee Login:**
- Email: `employee@vikram.com`
- Password: `employee123`

**Expected Result:** Redirected to Employee Dashboard with:
- List of assigned projects
- Status update dropdown for each project
- Messaging interface
- Profile editing

#### **Client Login:**
- Email: `client@vikram.com`
- Password: `client123`

**Expected Result:** Redirected to Client Dashboard with:
- View their projects
- Create new service requests
- Message admin and employees
- View request status

### **6.2 Test Admin Features**

#### **Test User Management:**
1. Login as admin
2. Go to "Manage Users" from sidebar
3. Click "Add User" button
4. Fill the form:
   - First Name: "Test"
   - Last Name: "Employee"
   - Email: "test.employee@test.com"
   - Password: "test123"
   - Role: "employee"
5. Click "Create"
6. Verify new user appears in the list
7. Try editing or deleting a user

#### **Test Project Management:**
1. Go to "Projects" section
2. Click "Create Project"
3. Fill project details:
   - Name: "Test Project"
   - Description: "This is a test project"
   - Client: Select a client from dropdown
   - Service Type: "Web Development"
4. Create project
5. Click "Assign Employees" on a project
6. Assign an employee
7. Verify employee appears in assigned list

#### **Test Service Requests:**
1. Go to "Service Requests"
2. You should see pending requests
3. Click "Approve" on a pending request
4. Verify it creates a new project
5. Check "Projects" section for the new project

#### **Test Messaging:**
1. Go to "Messages"
2. Select a user from the list
3. Type a message and send
4. Verify message appears in chat
5. Logout and login as that user to check received message

### **6.3 Test Employee Features**

1. Login as employee (`employee@vikram.com`)
2. View assigned projects
3. Change project status using dropdown:
   - Pending → In Progress
   - Verify status updates
4. Go to Messages
5. Send message to admin
6. Send message to a client
7. Update profile

### **6.4 Test Client Features**

1. Login as client (`client@vikram.com`)
2. View your projects
3. Click "Request New Service"
4. Fill service request form:
   - Service Name: "New Feature Request"
   - Description: "Need additional features for my project"
5. Submit request
6. Verify request appears in list with "pending" status
7. Login as admin to approve the request
8. Login back as client to see approved status and new project

## **Step 7: Test API Endpoints (Using Postman)**

### **7.1 Install Postman (Optional but Recommended)**
Download from [postman.com](https://www.postman.com/downloads/)

### **7.2 Test Authentication API**

#### **Login:**
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "admin@vikram.com",
  "password": "admin123"
}
```
**Expected Response:** Status 200 with user data and token

#### **Get Current User:**
- **Method:** GET
- **URL:** `http://localhost:5000/api/auth/me`
- **Headers:** 
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`

### **7.3 Test Users API**

#### **Get All Users (Admin only):**
- **Method:** GET
- **URL:** `http://localhost:5000/api/users`
- **Headers:** `Authorization: Bearer <admin_token>`

#### **Create User (Admin only):**
- **Method:** POST
- **URL:** `http://localhost:5000/api/users`
- **Headers:** 
  - `Authorization: Bearer <admin_token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "firstName": "API",
  "lastName": "Test",
  "email": "api.test@test.com",
  "password": "test123",
  "role": "employee"
}
```

## **Step 8: Test Edge Cases**

### **8.1 Test Authorization**
1. Try accessing admin routes with employee token
2. Expected: 403 Forbidden

### **8.2 Test Validation**
1. Try creating user without required fields
2. Expected: 400 Bad Request with validation errors

### **8.3 Test Error Handling**
1. Try logging in with wrong password
2. Expected: 401 Unauthorized with error message

### **8.4 Test Concurrent Users**
1. Login as admin in one browser
2. Login as employee in another browser (or incognito)
3. Send messages between them
4. Verify real-time updates

## **Step 9: Common Issues and Solutions**

### **Issue 1: MongoDB Connection Error**
```bash
Error: MongoDB connection error: ECONNREFUSED ::1:27017
```
**Solution:**
```bash
# Start MongoDB service
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### **Issue 2: Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### **Issue 3: React Build Errors**
```bash
Failed to compile
```
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### **Issue 4: CORS Errors**
If you see CORS errors in browser console:
```javascript
// Check server/middleware/cors.js is properly configured
// Ensure CLIENT_URL in .env matches http://localhost:3000
```

## **Step 10: Monitoring and Debugging**

### **10.1 Check MongoDB Data**
```bash
# Open MongoDB shell
mongosh

# Use your database
use vikram-software

# View collections
show collections

# View users
db.users.find().pretty()

# View projects
db.projects.find().pretty()
```

### **10.2 Check Server Logs**
```bash
# In server terminal, watch for:
- Database queries
- API requests
- Error messages
- Authentication attempts
```

### **10.3 Check Browser Console**
Press F12 in browser to open Developer Tools:
- Console tab for JavaScript errors
- Network tab for API requests
- Application tab for localStorage/token

## **Step 11: Quick Test Checklist**

Use this checklist to verify everything works:

### **Authentication:**
- [ ] Login page loads at http://localhost:3000
- [ ] Admin login redirects to /admin
- [ ] Employee login redirects to /employee
- [ ] Client login redirects to /client
- [ ] Invalid credentials show error toast

### **Admin Functions:**
- [ ] Dashboard stats load
- [ ] Can create new user
- [ ] Can create project
- [ ] Can approve service request
- [ ] Can assign employees to project
- [ ] Can send messages

### **Employee Functions:**
- [ ] Can view assigned projects
- [ ] Can update project status
- [ ] Can send messages to admin
- [ ] Can send messages to client
- [ ] Can edit profile

### **Client Functions:**
- [ ] Can view their projects
- [ ] Can create service request
- [ ] Can send messages
- [ ] Can edit profile

### **Messaging:**
- [ ] Can start conversation
- [ ] Messages appear in chat
- [ ] Unread indicators work
- [ ] Messages persist after refresh

## **Step 12: Stop the Application**

When done testing:

```bash
# Stop React app (Ctrl+C in client terminal)
Ctrl+C

# Stop Node server (Ctrl+C in server terminal)
Ctrl+C

# Stop MongoDB (optional)
# Windows
net stop MongoDB

# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod
```

## **Quick Start Commands Summary**

For quick reference, here are all commands in one place:

```bash
# Terminal 1: Start MongoDB
# Windows
net start MongoDB
# macOS
brew services start mongodb-community

# Terminal 2: Start Backend
cd server
npm install
npm run seed  # First time only
npm run dev

# Terminal 3: Start Frontend
cd client
npm install
npm start

# Access the app at http://localhost:3000
```

## **Success Criteria**

Your application is working correctly if:
1. ✅ Login page loads without errors
2. ✅ You can login with all three roles
3. ✅ Each role sees appropriate dashboard
4. ✅ Admin can create users and projects
5. ✅ Service requests can be created and approved
6. ✅ Messaging works between users
7. ✅ Data persists in MongoDB
8. ✅ No console errors in browser
9. ✅ API requests return proper status codes

Congratulations! 🎉 You've successfully tested your Vikram Software Solutions application locally. The application is now ready for development or demonstration.


# 🚀 Tech Stack Used in Vikram Software Solutions

## **Frontend (Client)**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.2.0 | Core UI library |
| **React Router DOM** | 6.14.0 | Navigation and routing |
| **Redux Toolkit** | 1.9.5 | State management |
| **React Redux** | 8.1.1 | React bindings for Redux |
| **Axios** | 1.4.0 | HTTP client for API calls |
| **Tailwind CSS** | 3.3.2 | Utility-first CSS framework |
| **React Icons** | 4.10.1 | Icon library |
| **React Toastify** | 9.1.3 | Toast notifications |
| **JWT Decode** | 3.1.2 | JWT token decoding |
| **Chart.js** | 4.3.0 | Charts and graphs |
| **React Chartjs 2** | 5.2.0 | React wrapper for Chart.js |

## **Backend (Server)**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | JavaScript runtime |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | 6.0 | Database |
| **Mongoose** | 7.3.0 | ODM for MongoDB |
| **JSON Web Token** | 9.0.0 | Authentication |
| **Bcryptjs** | 2.4.3 | Password hashing |
| **Express Validator** | 7.0.1 | Input validation |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Dotenv** | 16.1.4 | Environment variables |
| **Multer** | 1.4.5 | File upload handling |
| **Nodemailer** | 6.9.3 | Email sending |
| **Passport** | 0.6.0 | Authentication middleware |
| **Passport JWT** | 4.0.1 | JWT strategy for Passport |
| **Express Async Handler** | 1.2.0 | Async error handling |
| **Crypto** | 1.0.1 | Built-in encryption module |

## **Development Tools**
| Tool | Version | Purpose |
|------|---------|---------|
| **Nodemon** | 2.0.22 | Auto-restart server during development |
| **Concurrently** | 8.2.0 | Run multiple commands simultaneously |
| **Git** | Latest | Version control |
| **Postman** | Latest | API testing |

## **Database**
| Component | Details |
|-----------|---------|
| **Database** | MongoDB (local or Atlas) |
| **ODM** | Mongoose with schemas |
| **Collections** | users, projects, messages, servicerequests, notifications |

## **Project Structure**
```
vikram-software-solutions/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store & slices
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Images, fonts, etc.
│   └── public/             # Static files
│
└── server/                 # Node.js backend
    ├── models/             # Database models
    ├── controllers/        # Business logic
    ├── routes/             # API routes
    ├── middleware/         # Custom middleware
    ├── config/             # Configuration files
    ├── utils/              # Helper functions
    ├── seeders/            # Database seeding
    └── uploads/            # File uploads
```

## **Key Features Implemented**

Authentication System - JWT-based with password reset

User Management - CRUD operations with role-based access

Project Management - Full project lifecycle

Service Requests - Client requests with admin approval

Messaging System - Real-time like messaging between users

Notifications - System notifications for important events

File Upload Ready - Structure prepared for file uploads

Database Indexes - Optimized for performance

### **Frontend Features:**
- ✅ Role-based routing (Admin/Employee/Client)
- ✅ Responsive design with Tailwind CSS
- ✅ State management with Redux Toolkit
- ✅ Real-time like messaging
- ✅ Form validation
- ✅ Toast notifications
- ✅ Loading states and spinners
- ✅ Charts and analytics
- ✅ File upload ready

✅ Admin can create users and projects

✅ Service requests can be created and approved

✅ Messaging works between users

✅ Data persists in MongoDB

### **Backend Features:**
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ MongoDB with Mongoose ODM
- ✅ RESTful API design
- ✅ Input validation
- ✅ Error handling middleware
- ✅ Database indexing for performance
- ✅ Email service ready
- ✅ File upload handling
- ✅ Database seeding

Server Structure:
✅ Complete models with validation and relationships

✅ Full CRUD controllers for all entities

✅ Protected routes with role-based access

✅ Authentication middleware

✅ Request validation middleware

✅ Error handling

✅ Email service (optional)

✅ Database seeding

✅ Environment configuration


## **API Endpoints Structure**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/seed-admin` | Seed admin user | Public |
| GET | `/api/users` | Get all users | Admin |
| POST | `/api/users` | Create user | Admin |
| PUT | `/api/users/:id` | Update user | User/Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| GET | `/api/projects` | Get all projects | Admin |
| POST | `/api/projects` | Create project | Admin |
| GET | `/api/projects/assigned` | Get assigned projects | Employee |
| GET | `/api/projects/my-projects` | Get client projects | Client |
| POST | `/api/messages` | Send message | All |
| GET | `/api/messages/conversations` | Get conversations | All |
| POST | `/api/service-requests` | Create request | Client |
| PUT | `/api/service-requests/:id/approve` | Approve request | Admin |

## **Environment Variables**

```env
# Server
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vikram-software
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
```

## **Dependencies Installation Commands**

```bash
# Backend
cd server
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install express-validator multer nodemailer passport passport-jwt
npm install express-async-handler
npm install -D nodemon

# Frontend
cd client
npm install axios react-router-dom react-redux @reduxjs/toolkit
npm install react-toastify react-icons jwt-decode
npm install chart.js react-chartjs-2
npm install -D tailwindcss postcss autoprefixer




Step 1: Create MongoDB Atlas Account
Go to MongoDB Atlas website

Click "Try Free" or "Start Free" 

Sign up using:

Google account (fastest), OR

Email and password

Verify your email through the confirmation link

Step 2: Create Your First Cluster
After login, click "Build a Database" 

Select the FREE tier (M0 Sandbox) - perfect for learning/development 

Choose your cloud provider:

AWS, Google Cloud, or Azure

Select the region closest to you (e.g., Mumbai if you're in India)

Keep default cluster name or customize it

Click "Create Cluster" (takes 1-3 minutes to deploy) 

Step 3: Set Up Database Access
Go to "Security" → "Database Access" in left sidebar 

Click "Add New Database User"

Create credentials:

Username: vikram_admin (or your choice)

Password: Click "Autogenerate Secure Password" OR create your own

SAVE THESE CREDENTIALS SECURELY (you'll need them)

Set privileges: Select "Atlas Admin" 

Click "Add User"

Step 4: Configure Network Access
Go to "Security" → "Network Access" 

Click "Add IP Address"

For development (quick setup):

Click "Allow Access from Anywhere" (sets 0.0.0.0/0) 

OR add your current IP only for better security

Click "Confirm"

Step 5: Get Your Connection String
Click "Connect" button on your cluster 

Choose "Connect your application"

Select:

Driver: Node.js

Version: Latest

Copy the connection string - it looks like:

text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

This tech stack provides a modern, scalable, and maintainable application architecture suitable for a production-grade software company management portal.
