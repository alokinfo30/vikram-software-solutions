// client/src/components/ServiceRequestForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';

const ServiceRequestForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/service-requests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Service request submitted successfully');
      navigate('/client');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white">Request New Service</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Service Name
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-500 bg-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g., Web Development, Mobile App, Cloud Services"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Service Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4 sm:6"
              className="w-full px-4 py-2 border border-gray-500 bg-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Please describe your requirements in detail..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => navigate('/client')}
              className="px-6 py-2 border border-gray-500 rounded-lg text-gray-300 hover:bg-gray-600 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <FaPaperPlane className="mr-2" />
              )}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
