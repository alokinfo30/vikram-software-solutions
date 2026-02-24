// client/src/utils/errorHandler.js
import { toast } from 'react-toastify';

class ErrorHandler {
  handle(error, customMessage = null) {
    console.error('Error:', error);

    if (customMessage) {
      toast.error(customMessage);
      return customMessage;
    }

    let message = 'An unexpected error occurred';

    if (error.response) {
      // Server responded with error
      message = error.response.data?.message || 
                error.response.data?.error || 
                `Error ${error.response.status}: ${error.response.statusText}`;
      
      // Handle specific status codes
      switch (error.response.status) {
        case 400:
          message = 'Bad request. Please check your input.';
          break;
        case 401:
          message = 'Your session has expired. Please login again.';
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }
    } else if (error.request) {
      // Request made but no response
      message = 'Network error. Please check your internet connection.';
    } else if (error.message) {
      // Something else happened
      message = error.message;
    }

    toast.error(message);
    return message;
  }

  handleValidation(errors) {
    const messages = Object.values(errors).join(', ');
    toast.warning(messages);
    return messages;
  }

  handleSuccess(message) {
    toast.success(message);
  }

  handleInfo(message) {
    toast.info(message);
  }

  handleWarning(message) {
    toast.warning(message);
  }
}

export default new ErrorHandler();