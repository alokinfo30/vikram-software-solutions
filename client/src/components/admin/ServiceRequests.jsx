// client/src/components/admin/ServiceRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/service-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle different response formats
      const requestList = Array.isArray(response.data) ? response.data : 
                         (Array.isArray(response.data?.data) ? response.data.data : []);
      setRequests(requestList);
    } catch (error) {
      toast.error('Error fetching service requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/service-requests/${requestId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Service request approved and project created');
      fetchRequests();
    } catch (error) {
      toast.error('Error approving request');
    }
  };

  const handleReject = async (requestId) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/service-requests/${requestId}/reject`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Service request rejected');
        fetchRequests();
      } catch (error) {
        toast.error('Error rejecting request');
      }
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
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 sm:mb-6 text-white">Service Requests</h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-700 rounded-lg shadow">
          <p className="text-gray-400">No service requests found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-gray-700 rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{request.serviceName || request.serviceType}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit
                      ${request.status === 'pending' ? 'bg-yellow-600 text-white' : 
                        request.status === 'approved' ? 'bg-green-600 text-white' : 
                        'bg-red-600 text-white'}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mt-2">{request.description}</p>
                  
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 gap-2 sm:gap-4">
                    <span>
                      <span className="font-medium text-gray-300">Client:</span>{' '}
                      {request.client?.firstName} {request.client?.lastName}
                      {request.client?.companyName && ` (${request.client.companyName})`}
                    </span>
                    <span>
                      <span className="font-medium text-gray-300">Requested:</span>{' '}
                      {formatDate(request.createdDate || request.createdAt)}
                    </span>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 ml-auto sm:ml-4">
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      title="Approve & Create Project"
                    >
                      <FaCheck size={16} />
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                      title="Reject"
                    >
                      <FaTimes size={16} />
                      <span className="hidden sm:inline">Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
