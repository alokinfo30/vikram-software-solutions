// client/src/pages/EmployeeProjects.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import API from '../services/api';

const EmployeeProjects = () => {
  const { projects, loading, updateProjectStatus } = useOutletContext();
  const [localProjects, setLocalProjects] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects/assigned');
      const list = response.data?.data ?? response.data ?? [];
      setLocalProjects(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await API.put(`/projects/${projectId}/status`, { status: newStatus });
      fetchProjects();
    } catch (error) {
      console.error('Error updating status:', error);
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

  if (localLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">My Assigned Projects</h1>
      
      {localProjects.length === 0 ? (
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-300">No projects assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {localProjects.map(project => (
            <div key={project._id} className="bg-gray-700 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{project.name}</h3>
                  <p className="text-gray-300 mt-1">{project.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-400">Client</p>
                  <p className="text-white">{project.client?.firstName} {project.client?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Service Type</p>
                  <p className="text-white">{project.serviceType}</p>
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

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleStatusChange(project._id, 'in-progress')}
                  disabled={project.status === 'in-progress'}
                  className={`px-4 py-2 rounded ${project.status === 'in-progress' 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  Start Progress
                </button>
                <button
                  onClick={() => handleStatusChange(project._id, 'completed')}
                  disabled={project.status === 'completed'}
                  className={`px-4 py-2 rounded ${project.status === 'completed' 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  Mark Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeProjects;
