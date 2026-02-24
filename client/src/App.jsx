// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import AdminDashboard, { AdminHome } from './pages/AdminDashboard';
import EmployeeDashboard, { EmployeeHome } from './pages/EmployeeDashboard';
import ClientDashboard, { ClientHome } from './pages/ClientDashboard';
import EmployeeProjects from './pages/EmployeeProjects';
import ClientProjects from './pages/ClientProjects';

// Components
import PrivateRoute from './components/PrivateRoute';
import ManageUsers from './components/admin/ManageUsers';
import ManageProjects from './components/admin/ManageProjects';
import ServiceRequests from './components/admin/ServiceRequests';
import Messages from './components/Messages';
import Profile from './components/Profile';
import ServiceRequestForm from './components/ServiceRequestForm';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        } >

          <Route index element={<AdminHome />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="requests" element={<ServiceRequests />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Employee Routes */}
        <Route path="/employee/*" element={
          <PrivateRoute role="employee">
            <EmployeeDashboard />
          </PrivateRoute>
        } >

          <Route index element={<EmployeeHome />} />
          <Route path="projects" element={<EmployeeProjects />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Client Routes */}
        <Route path="/client/*" element={
          <PrivateRoute role="client">
            <ClientDashboard />
          </PrivateRoute>
        } >
          <Route index element={<ClientHome />} />
          <Route path="projects" element={<ClientProjects />} />
          <Route path="new-request" element={<ServiceRequestForm />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback for 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
