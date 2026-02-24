// server/controllers/serviceRequestController.js
import ServiceRequest from '../models/ServiceRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Get all service requests
// @route   GET /api/service-requests
// @access  Private/Admin
export const getServiceRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const requests = await ServiceRequest.find(query)
      .populate('client', 'firstName lastName email companyName')
      .populate('reviewedBy', 'firstName lastName email')
      .sort('-createdDate');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get service requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service requests'
    });
  }
};

// @desc    Get client's service requests
// @route   GET /api/service-requests/my-requests
// @access  Private/Client
export const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ client: req.user.id })
      .sort('-createdDate');

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your requests'
    });
  }
};

// @desc    Get single service request
// @route   GET /api/service-requests/:id
// @access  Private
export const getServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('client', 'firstName lastName email companyName')
      .populate('reviewedBy', 'firstName lastName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Check authorization
    if (req.user.role === 'client' && request.client._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service request'
    });
  }
};

// @desc    Create service request
// @route   POST /api/service-requests
// @access  Private/Client
export const createServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.create({
      ...req.body,
      client: req.user.id,
      createdDate: Date.now()
    });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        type: 'request',
        title: 'New Service Request',
        message: `A new service request "${request.serviceName}" has been submitted.`,
        data: { requestId: request._id }
      });
    }

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating service request'
    });
  }
};

// @desc    Approve service request
// @route   PUT /api/service-requests/:id/approve
// @access  Private/Admin
export const approveRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status}`
      });
    }

    request.status = 'approved';
    request.reviewedAt = Date.now();
    request.reviewedBy = req.user.id;
    request.adminNotes = req.body.notes;
    await request.save();

    // Create project from request
    const project = await Project.create({
      name: request.serviceName,
      description: request.description,
      client: request.client,
      serviceType: request.serviceName,
      status: 'pending',
      createdDate: Date.now()
    });

    // Notify client
    await Notification.create({
      user: request.client,
      type: 'request',
      title: 'Request Approved',
      message: `Your service request "${request.serviceName}" has been approved. A project has been created.`,
      data: { requestId: request._id, projectId: project._id }
    });

    res.status(200).json({
      success: true,
      data: request,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving request'
    });
  }
};

// @desc    Reject service request
// @route   PUT /api/service-requests/:id/reject
// @access  Private/Admin
export const rejectRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status}`
      });
    }

    request.status = 'rejected';
    request.reviewedAt = Date.now();
    request.reviewedBy = req.user.id;
    request.adminNotes = req.body.notes || 'Request rejected';
    await request.save();

    // Notify client
    await Notification.create({
      user: request.client,
      type: 'request',
      title: 'Request Rejected',
      message: `Your service request "${request.serviceName}" has been rejected. Reason: ${request.adminNotes}`,
      data: { requestId: request._id }
    });

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting request'
    });
  }
};

// @desc    Update service request
// @route   PUT /api/service-requests/:id
// @access  Private/Client
export const updateServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Only client can update their pending requests
    if (request.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update request that has been reviewed'
      });
    }

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating request'
    });
  }
};

// @desc    Delete service request
// @route   DELETE /api/service-requests/:id
// @access  Private/Client
export const deleteServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Only client can delete their pending requests
    if (request.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete request that has been reviewed'
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting request'
    });
  }
};