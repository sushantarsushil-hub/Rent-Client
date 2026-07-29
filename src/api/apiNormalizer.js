/**
 * 
 * 
 *
 * @param {Error} error - Axios error instance or native JavaScript error
 * @returns {{ message: string, status: number|null, errors: object|array|null, isNetworkError: boolean }}
 */
export const normalizeApiError = (error) => {
  if (!error) {
    return {
      message: 'An unknown error occurred.',
      status: null,
      errors: null,
      isNetworkError: false,
    };
  }

  
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    let message = 'Request failed. Please try again.';
    let fieldErrors = null;

    if (typeof data === 'string') {
      message = data;
    } else if (data && typeof data === 'object') {
      message = data.message || data.error || data.msg || message;
      fieldErrors = data.errors || data.details || null;
    }

    return {
      message,
      status,
      errors: fieldErrors,
      isNetworkError: false,
    };
  }

  
  if (error.request) {
    return {
      message: 'Network error. Please check your internet connection or server status.',
      status: null,
      errors: null,
      isNetworkError: true,
    };
  }

  
  return {
    message: error.message || 'An unexpected error occurred.',
    status: null,
    errors: null,
    isNetworkError: false,
  };
};

export default normalizeApiError;
