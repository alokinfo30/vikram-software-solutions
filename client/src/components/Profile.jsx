// client/src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaBuilding, FaLock } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.get(`/api/users/${userData._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle both wrapped and unwrapped responses
      const userDataResponse = response.data.data || response.data;
      setUser(userDataResponse);
      // Ensure all values are strings (never undefined)
      setFormData({
        firstName: userDataResponse.firstName || '',
        lastName: userDataResponse.lastName || '',
        email: userDataResponse.email || '',
        companyName: userDataResponse.companyName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyName: formData.companyName
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await axios.put(`/api/users/${user._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Profile updated successfully');
      setEditing(false);
      fetchUserProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  // Helper function to format date safely with better formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is still null, show error
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-white">Unable to load profile data</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-4">
              <FaUser className="text-4xl text-blue-900" />
            </div>
            <div className="ml-6 text-white">
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-blue-200 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-8">
          {!editing ? (
            // View Mode
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400">First Name</label>
                  <p className="mt-1 text-lg text-white">{user.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Last Name</label>
                  <p className="mt-1 text-lg text-white">{user.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Email</label>
                  <p className="mt-1 text-lg text-white">{user.email}</p>
                </div>
                {user.role === 'client' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Company Name</label>
                    <p className="mt-1 text-lg text-white">{user.companyName || 'Not specified'}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-400">Member Since</label>
                  <p className="mt-1 text-lg text-white">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {user.role === 'client' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Password Change Section */}
                <div className="md:col-span-2 border-t border-gray-600 pt-6 mt-4">
                  <h3 className="text-lg font-medium mb-4 text-white">Change Password</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
