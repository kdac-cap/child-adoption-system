import React from 'react';

const ErrorHandler = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unexpected error occurred';
  };

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error:</strong> {getErrorMessage(error)}
      
      <div className="mt-2">
        {onRetry && (
          <button 
            className="btn btn-sm btn-outline-danger me-2" 
            onClick={onRetry}
          >
            Retry
          </button>
        )}
        
        {onDismiss && (
          <button 
            type="button" 
            className="btn-close" 
            onClick={onDismiss}
            aria-label="Close"
          ></button>
        )}
      </div>
    </div>
  );
};

export default ErrorHandler;