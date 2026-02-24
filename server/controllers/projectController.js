// server/controllers/projectController.js
import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private/Admin
export const getProjects = async (req, res) => {
  try {
    const { status, client } = req.query;
    let query = {};
    if (status) query.status = status;
    if (client) query.client = client;

    const projects = await Project.find(query)
      .populate('client', 'firstName lastName email companyName')
      .populate('assignedEmployees', 'firstName lastName email')
      .sort('-createdDate');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'firstName lastName email companyName')
      .populate('assignedEmployees', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Client can only view own projects; employee can view assigned
    if (req.user.role === 'client' && project.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this project'
      });
    }
    if (req.user.role === 'employee') {
      const assignedIds = project.assignedEmployees.map(e => e._id.toString());
      if (!assignedIds.includes(req.user._id.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this project'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdDate: Date.now()
    });

    const populated = await Project.findById(project._id)
      .populate('client', 'firstName lastName email companyName')
      .populate('assignedEmployees', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: populated
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
      message: 'Error creating project'
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('client', 'firstName lastName email companyName')
      .populate('assignedEmployees', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
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
      message: 'Error updating project'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project'
    });
  }
};

// @desc    Get projects assigned to current employee
// @route   GET /api/projects/assigned
// @access  Private/Employee
export const getAssignedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ assignedEmployees: req.user._id })
      .populate('client', 'firstName lastName email companyName')
      .sort('-createdDate');

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assigned projects'
    });
  }
};

// @desc    Get current client's projects
// @route   GET /api/projects/my-projects
// @access  Private/Client
export const getClientProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user._id })
      .populate('assignedEmployees', 'firstName lastName email')
      .sort('-createdDate');

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your projects'
    });
  }
};

// @desc    Update project status (employee)
// @route   PUT /api/projects/:id/status
// @access  Private/Employee
export const updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isAssigned = project.assignedEmployees.some(
      id => id.toString() === req.user._id.toString()
    );
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const { status } = req.body;
    if (!['pending', 'in-progress', 'completed', 'on-hold'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    project.status = status;
    project.updatedAt = Date.now();
    if (status === 'in-progress' && !project.startDate) project.startDate = Date.now();
    if (status === 'completed') project.endDate = Date.now();
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('client', 'firstName lastName email companyName')
      .populate('assignedEmployees', 'firstName lastName email');

    res.status(200).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project status'
    });
  }
};

// @desc    Assign employee to project
// @route   POST /api/projects/:id/assign
// @access  Private/Admin
export const assignEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({
        success: false,
        message: 'Valid employee is required'
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.assignedEmployees.some(id => id.toString() === employeeId)) {
      return res.status(400).json({
        success: false,
        message: 'Employee already assigned'
      });
    }

    project.assignedEmployees.push(employeeId);
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('client', 'firstName lastName email companyName')
      .populate('assignedEmployees', 'firstName lastName email');

    res.status(200).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning employee'
    });
  }
};

// @desc    Remove employee from project
// @route   DELETE /api/projects/:id/assign/:employeeId
// @access  Private/Admin
export const removeEmployee = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.assignedEmployees = project.assignedEmployees.filter(
      id => id.toString() !== req.params.employeeId
    );
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('client', 'firstName lastName email companyName')
      .populate('assignedEmployees', 'firstName lastName email');

    res.status(200).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing employee'
    });
  }
};

// @desc    Get project stats
// @route   GET /api/projects/stats
// @access  Private/Admin
export const getProjectStats = async (req, res) => {
  try {
    const [total, byStatus] = await Promise.all([
      Project.countDocuments(),
      Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const statusCounts = { pending: 0, 'in-progress': 0, completed: 0, 'on-hold': 0 };
    byStatus.forEach(s => { statusCounts[s._id] = s.count; });

    res.status(200).json({
      success: true,
      data: {
        total,
        ...statusCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project stats'
    });
  }
};
