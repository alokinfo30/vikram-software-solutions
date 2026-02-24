// server/models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: [3, 'Project name must be at least 3 characters'],
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client is required']
  },
  assignedEmployees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed', 'on-hold'],
      message: 'Status must be pending, in-progress, completed, or on-hold'
    },
    default: 'pending'
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  attachments: [{
    filename: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update timestamps on save
projectSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Indexes
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ assignedEmployees: 1 });
projectSchema.index({ createdDate: -1 });


const Project = mongoose.model('Project', projectSchema);
export default Project;