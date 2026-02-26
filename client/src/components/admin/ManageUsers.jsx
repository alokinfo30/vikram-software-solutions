// client/src/components/admin/ManageUsers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaUserPlus } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee',
    companyName: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle different response formats
      const userList = Array.isArray(response.data) ? response.data : 
                       (Array.isArray(response.data?.data) ? response.data.data : []);
      setUsers(userList);
    } catch (error) {
      toast.error('Error fetching users');
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
    try {
      const token = localStorage.getItem('token');
      
      if (editingUser) {
        await axios.put(`/api/users/${editingUser._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('User updated successfully');
      } else {
        await axios.post('/api/users', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('User created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Error deleting user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      role: user.role || 'employee',
      companyName: user.companyName || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'employee',
      companyName: ''
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center w-full sm:w-auto justify-center"
        >
          <FaUserPlus className="mr-2" /> Add User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-300">No users found.</p>
        </div>
      ) : (
        <div className="bg-gray-700 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-600">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Role</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden lg:table-cell">Company</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-600">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-white">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-300 hidden md:table-cell">{user.email}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-purple-600 text-white' : 
                        user.role === 'employee' ? 'bg-green-600 text-white' : 
                        'bg-blue-600 text-white'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-300 hidden lg:table-cell">{user.companyName || '-'}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-400 hover:text-indigo-200 mr-3"
                    >
                      <FaEdit />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-200"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-4 sm:p-5 border w-full sm:w-96 shadow-lg rounded-md bg-gray-700">
            <h3 className="text-lg font-medium leading-6 text-white mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">First Name</label>
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
                <label className="block text-gray-300 text-sm font-bold mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="client">Client</option>
                </select>
              </div>

              {formData.role === 'client' && (
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
