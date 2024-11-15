// hooks/use-error-handler.js
import { useToast } from "@/hooks/use-toast";

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error) => {
    const message = error.message || 'An unexpected error occurred';
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  return handleError;
};