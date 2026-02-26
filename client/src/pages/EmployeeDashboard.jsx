// client/src/pages/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const EmployeeDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  const fetchAssignedProjects = async () => {
    try {
      const response = await API.get('/projects/assigned');
      const list = response.data?.data ?? response.data ?? [];
      setProjects(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId, status) => {
    try {
      await API.put(`/projects/${projectId}/status`, { status });
      fetchAssignedProjects();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar
        color="green"
        links={[
          { to: '/employee', label: 'Dashboard' },
          { to: '/employee/projects', label: 'My Projects' },
          { to: '/employee/messages', label: 'Messages' },
          { to: '/employee/profile', label: 'Profile' },
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
        <Outlet context={{ projects, loading, updateProjectStatus }} />
      </div>
    </div>
  );
};

// Employee Home Component
export const EmployeeHome = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white">My Assigned Projects</h1>
      <p className="text-gray-300 text-center">View your assigned projects in the My Projects section</p>
    </div>
  );
};

export default EmployeeDashboard;
