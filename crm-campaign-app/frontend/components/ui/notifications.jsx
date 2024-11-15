import { useToast } from "@/hooks/use-toast"  // Update this lineimport Loading from "@/components/ui/loading"

export function showNotification(toast, { title, description, type = 'default' }) {
  const variants = {
    default: '',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  }

  toast({
    title,
    description,
    className: variants[type]
  })
}