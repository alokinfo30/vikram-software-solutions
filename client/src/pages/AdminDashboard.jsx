// client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaTachometerAlt, FaUsers, FaProjectDiagram, FaEnvelope, FaUserCog } from 'react-icons/fa';

import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    pendingRequests: 0,
    totalMessages: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, projectsRes, requestsRes] = await Promise.all([
          API.get('/users'),
          API.get('/projects/stats'),
          API.get('/service-requests')
        ]);
        const users = usersRes.data?.data ?? [];
        const projectStats = projectsRes.data?.data ?? {};
        const requests = requestsRes.data?.data ?? [];
        setStats({
          totalUsers: usersRes.data?.count ?? users.length,
          totalProjects: projectStats.total ?? 0,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          totalMessages: 0
        });
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar
        color="indigo"
        links={[
          { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt className='w-5 h-5' /> },
          { to: '/admin/users', label: 'Manage Users', icon: <FaUsers className='w-5 h-5' /> },
          { to: '/admin/projects', label: 'Projects', icon: <FaProjectDiagram className='w-5 h-5' /> },
          { to: '/admin/requests', label: 'Service Requests', icon: <FaEnvelope className='w-5 h-5' /> },
          { to: '/admin/messages', label: 'Messages', icon: <FaEnvelope className='w-5 h-5' /> },
          { to: '/admin/profile', label: 'Profile', icon: <FaUserCog className='w-5 h-5' /> },
        ]}
        onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 max-w-6xl mx-auto w-full bg-gray-800">
        <Outlet context={{ stats }} />
      </div>
    </div>
  );
};

export const AdminHome = () => {
  // Get stats from Outlet context
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    pendingRequests: 0,
    totalMessages: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, projectsRes, requestsRes] = await Promise.all([
          API.get('/users'),
          API.get('/projects/stats'),
          API.get('/service-requests')
        ]);
        const users = usersRes.data?.data ?? [];
        const projectStats = projectsRes.data?.data ?? {};
        const requests = requestsRes.data?.data ?? [];
        setStats({
          totalUsers: usersRes.data?.count ?? users.length,
          totalProjects: projectStats.total ?? 0,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          totalMessages: 0
        });
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Dashboard</h1>
      <p className="text-gray-300 mb-8 text-center">Overview of your admin portal</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-700 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">Total Users</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
          <p className="text-xs text-gray-400 mt-1">Manage in Manage Users</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">Projects</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalProjects}</p>
          <p className="text-xs text-gray-400 mt-1">View in Projects</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">Pending Requests</h3>
          <p className="text-3xl font-bold text-amber-400 mt-1">{stats.pendingRequests}</p>
          <p className="text-xs text-gray-400 mt-1">Review in Service Requests</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">Messages</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalMessages}</p>
          <p className="text-xs text-gray-400 mt-1">View in Messages</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-700 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-white mb-4">Quick navigation</h2>
        <p className="text-gray-300">
          Use the sidebar to open <strong className="text-white">Manage Users</strong>, <strong className="text-white">Projects</strong>, <strong className="text-white">Service Requests</strong>, and <strong className="text-white">Messages</strong>.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
