export function setupErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
      console.error('Unhandled promise rejection:', event.reason)
      // You could send this to your error tracking service
    })
  
    // Handle general errors
    window.addEventListener('error', function(event) {
      console.error('Global error:', event.error)
      // You could send this to your error tracking service
    })
  }
  
  export function handleApiError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response.data.message || 'An error occurred'
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response from server'
    } else {
      // Something happened in setting up the request that triggered an Error
      return 'Error setting up request'
    }
  }