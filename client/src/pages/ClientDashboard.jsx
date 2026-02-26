// client/src/pages/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [projectsRes, requestsRes] = await Promise.all([
        axios.get('/api/projects/my-projects', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/service-requests/my-requests', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data?.data || []);
      setServiceRequests(Array.isArray(requestsRes.data) ? requestsRes.data : requestsRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar
        color="blue"
        links={[
          { to: '/client', label: 'Dashboard' },
          { to: '/client/projects', label: 'My Projects' },
          { to: '/client/new-request', label: 'Request Service' },
          { to: '/client/messages', label: 'Messages' },
          { to: '/client/profile', label: 'Profile' },
        ]}
        onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 max-w-4xl mx-auto w-full bg-gray-800">
        <Outlet context={{ projects, serviceRequests, refreshData: fetchClientData }} />
      </div>
    </div>
  );
};

// Client Home Component
export const ClientHome = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-white">Welcome to Client Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* Projects Summary */}
        <div className="bg-gray-700 p-4 sm:p-6 rounded-xl shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Your Projects</h2>
          <p className="text-gray-400">View your projects in the My Projects section</p>
        </div>
        {/* Service Requests */}
        <div className="bg-gray-700 p-4 sm:p-6 rounded-xl shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Service Requests</h2>
          <p className="text-gray-400">View your service requests in the Request Service section</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
