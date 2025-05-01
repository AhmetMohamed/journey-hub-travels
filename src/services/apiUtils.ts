
import { toast } from "@/components/ui/use-toast";

// API configuration
export const API_BASE_URL = ''; // Empty for relative URLs on same domain

// Helper function to handle fetch errors
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred'
    }));
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
};

// Get token from localStorage
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
