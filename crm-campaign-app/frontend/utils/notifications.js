// utils/notifications.js
export function showNotification(toast, { title, description, type = 'default' }) {
    const variants = {
      default: 'bg-background',
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200',
      warning: 'bg-yellow-50 border-yellow-200'
    }
  
    toast({
      title,
      description,
      className: `border ${variants[type]}`,
      duration: 5000
    })
  }