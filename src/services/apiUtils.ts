import { toast } from "@/components/ui/use-toast";

// API configuration
export const API_BASE_URL = "http://localhost:3000"; // Empty for relative URLs on same domain

// Helper function to handle fetch errors
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Try to get error details from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    } catch (error) {
      // If parsing JSON fails, use status text
      throw new Error(
        `Error: ${response.status} ${
          response.statusText || "An unknown error occurred"
        }`
      );
    }
  }
  return response.json();
};

// Get token from localStorage with more robust handling
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  // Return Authorization header if token exists
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Utility function to ensure authenticated requests
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const headers = {
    ...options.headers,
    ...getAuthHeader(),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("API request failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};
