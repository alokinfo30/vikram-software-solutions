// client/src/utils/formatting.js
export const formatDate = (date, format = 'MM/DD/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  const options = {
    'MM/DD/YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
    'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
    'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' },
    'full': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  };
  
  return d.toLocaleDateString('en-US', options[format] || options['MM/DD/YYYY']);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phone;
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const capitalizeFirst = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};