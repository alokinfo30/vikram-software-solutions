// server/utils/helpers.js
import crypto from 'crypto';

// Generate random password
export const generateRandomPassword = (length = 8) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Format date
export const formatDate = (date, format = 'MM/DD/YYYY') => {
  const d = new Date(date);
  const options = {
    'MM/DD/YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
    'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
    'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' }
  };
  
  return d.toLocaleDateString('en-US', options[format] || options['MM/DD/YYYY']);
};

// Sanitize user object
export const sanitizeUser = (user) => {
  const sanitized = user.toObject();
  delete sanitized.password;
  delete sanitized.passwordResetToken;
  delete sanitized.passwordResetExpires;
  return sanitized;
};

// Check if user has permission
export const hasPermission = (user, resource, action) => {
  if (user.role === 'admin') return true;
  
  const permissions = {
    employee: {
      project: ['view', 'update-status'],
      message: ['send', 'view']
    },
    client: {
      project: ['view'],
      'service-request': ['create', 'view', 'update', 'delete'],
      message: ['send', 'view']
    }
  };
  
  return permissions[user.role]?.[resource]?.includes(action) || false;
};

// Pagination helper
export const paginateResults = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};