// client/src/utils/constants.js
export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CLIENT: 'client'
};

export const PROJECT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const SERVICE_TYPES = [
  'Web Development',
  'Mobile App Development',
  'Cloud Services',
  'UI/UX Design',
  'Digital Marketing',
  'SEO Services',
  'IT Consulting',
  'Software Maintenance',
  'Database Management',
  'Network Security'
];

export const COMPANY_SIZE = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees'
];

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Transportation',
  'Media',
  'Other'
];

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export const DATE_FORMATS = {
  DISPLAY: 'MM/DD/YYYY',
  DISPLAY_LONG: 'MMMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MM/DD/YYYY HH:mm'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [10, 25, 50, 100]
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    SEED_ADMIN: '/auth/seed-admin'
  },
  USERS: {
    BASE: '/users',
    BY_ROLE: (role) => `/users/role/${role}`,
    PROFILE: (id) => `/users/${id}`
  },
  PROJECTS: {
    BASE: '/projects',
    ASSIGNED: '/projects/assigned',
    MY_PROJECTS: '/projects/my-projects',
    ASSIGN: (id) => `/projects/${id}/assign`,
    STATUS: (id) => `/projects/${id}/status`
  },
  MESSAGES: {
    BASE: '/messages',
    CONVERSATIONS: '/messages/conversations',
    UNREAD: '/messages/unread/count',
    WITH_USER: (userId) => `/messages/${userId}`
  },
  REQUESTS: {
    BASE: '/service-requests',
    MY_REQUESTS: '/service-requests/my-requests',
    APPROVE: (id) => `/service-requests/${id}/approve`,
    REJECT: (id) => `/service-requests/${id}/reject`
  }
};