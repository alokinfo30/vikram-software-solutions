// client/src/pages/ClientProjects.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Use /my-projects endpoint for client-specific projects
      const response = await API.get('/projects/my-projects');
      const list = response.data?.data ?? response.data ?? [];
      setProjects(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">My Projects</h1>
      
      {projects.length === 0 ? (
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-300">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map(project => (
            <div key={project._id} className="bg-gray-700 rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  <p className="text-gray-300 mt-1">{project.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-400">Service Type</p>
                  <p className="text-white">{project.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Assigned To</p>
                  <p className="text-white">
                    {project.assignedEmployees?.length > 0 
                      ? project.assignedEmployees.map(e => e.firstName).join(', ')
                      : 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-white">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Deadline</p>
                  <p className="text-white">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProjects;
