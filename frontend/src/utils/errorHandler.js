import { toast } from 'react-toastify';

export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);
  
  let errorMessage = customMessage || 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        errorMessage = data.message || 'Invalid request data';
        break;
      case 401:
        errorMessage = 'Invalid credentials';
        break;
      case 403:
        errorMessage = 'Access denied';
        break;
      case 404:
        errorMessage = 'Resource not found';
        break;
      case 409:
        errorMessage = data.message || 'Conflict - resource already exists';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later';
        break;
      default:
        errorMessage = data.message || `Error ${status}: ${data.error || 'Unknown error'}`;
    }
  } else if (error.request) {
    // Network error
    errorMessage = 'Network error. Please check your connection and try again';
  } else if (error.message) {
    // Other error
    errorMessage = error.message;
  }
  
  return errorMessage;
};

export const showErrorToast = (error, customMessage = null) => {
  const errorMessage = handleApiError(error, customMessage);
  toast.error(errorMessage);
  return errorMessage;
};

export const showSuccessToast = (message) => {
  toast.success(message);
};