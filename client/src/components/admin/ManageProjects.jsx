// client/src/components/admin/ManageProjects.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaUserCheck } from 'react-icons/fa';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: '',
    serviceType: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle different response formats
      const projectList = Array.isArray(response.data) ? response.data : 
                         (Array.isArray(response.data?.data) ? response.data.data : []);
      setProjects(projectList);
    } catch (error) {
      toast.error('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

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
      
      if (selectedProject) {
        await axios.put(`/api/projects/${selectedProject._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Project updated successfully');
      } else {
        await axios.post('/api/projects', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Project created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving project');
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Error deleting project');
      }
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name || '',
      description: project.description || '',
      client: project.client?._id || '',
      serviceType: project.serviceType || '',
      status: project.status || 'pending'
    });
    setShowModal(true);
  };

  const handleAssignEmployees = (project) => {
    setSelectedProject(project);
    setShowAssignModal(true);
  };

  const assignEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/projects/${selectedProject._id}/assign`, 
        { employeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Employee assigned successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Error assigning employee');
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setFormData({
      name: '',
      description: '',
      client: '',
      serviceType: '',
      status: 'pending'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-600 text-white';
      case 'in-progress': return 'bg-blue-600 text-white';
      case 'completed': return 'bg-green-600 text-white';
      case 'on-hold': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Helper function to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Create Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-700 rounded-lg shadow">
          <p className="text-gray-400">No projects found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-gray-700 rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  <p className="text-gray-300 mt-1">{project.description}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-400">Client:</span>
                      <p className="font-medium text-white">{project.client?.companyName || project.client?.firstName + ' ' + project.client?.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Service Type:</span>
                      <p className="font-medium text-white">{project.serviceType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Created:</span>
                      <p className="font-medium text-white">{formatDate(project.createdDate || project.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Status:</span>
                      <p className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-gray-400">Assigned Employees:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.assignedEmployees?.map((emp) => (
                        <span key={emp._id} className="px-2 py-1 bg-gray-600 rounded-full text-sm text-white">
                          {emp.firstName} {emp.lastName}
                        </span>
                      ))}
                      {(!project.assignedEmployees || project.assignedEmployees.length === 0) && (
                        <span className="text-sm text-gray-400">No employees assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAssignEmployees(project)}
                    className="text-green-400 hover:text-green-200"
                    title="Assign Employees"
                  >
                    <FaUserCheck size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-indigo-400 hover:text-indigo-200"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-400 hover:text-red-200"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-700">
            <h3 className="text-lg font-medium leading-6 text-white mb-4">
              {selectedProject ? 'Edit Project' : 'Create New Project'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">Client</label>
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Client</option>
                  {users.filter(u => u.role === 'client').map(client => (
                    <option key={client._id} value={client._id}>
                      {client.companyName || `${client.firstName} ${client.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">Service Type</label>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-500 bg-gray-600 text-white rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Employees Modal */}
      {showAssignModal && selectedProject && (
        <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-700">
            <h3 className="text-lg font-medium leading-6 text-white mb-4">
              Assign Employees to {selectedProject.name}
            </h3>
            
            <div className="max-h-96 overflow-y-auto">
              {users.filter(u => u.role === 'employee').map(employee => (
                <div key={employee._id} className="flex items-center justify-between p-3 border-b border-gray-600">
                  <div>
                    <p className="font-medium text-white">{employee.firstName} {employee.lastName}</p>
                    <p className="text-sm text-gray-400">{employee.email}</p>
                  </div>
                  <button
                    onClick={() => assignEmployee(employee._id)}
                    disabled={selectedProject.assignedEmployees?.some(e => e._id === employee._id)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedProject.assignedEmployees?.some(e => e._id === employee._id)
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedProject.assignedEmployees?.some(e => e._id === employee._id) ? 'Assigned' : 'Assign'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
