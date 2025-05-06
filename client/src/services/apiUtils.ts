import { toast } from "../components/ui/use-toast";

// API configuration
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? window.location.origin // This will use the same origin as the frontend in production
    : "http://localhost:3000";

// Helper function to handle fetch errors
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    console.error("API error:", response.status, response.statusText);

    // Try to get error details from response
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Error: ${response.status} ${response.statusText}`
      );
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
  console.log("Auth token from localStorage:", token ? "Found" : "Not found");

  // Return Authorization header if token exists
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "x-auth-token": token,
      }
    : {};
};

// Utility function to ensure authenticated requests
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  // Ensure headers object exists
  const headers = {
    ...(options.headers || {}),
    ...getAuthHeader(),
    "Content-Type": "application/json",
  };

  try {
    console.log("Making authenticated request to:", url);
    console.log("With auth headers:", getAuthHeader());

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      console.error(
        "API request failed with status:",
        response.status,
        response.statusText
      );

      // Special handling for 401 Unauthorized errors
      if (response.status === 401) {
        // Clear invalid token and notify user
        console.warn("Authentication error, clearing token");
        localStorage.removeItem("token");
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);

        throw new Error("Authentication failed. Please login again.");
      }
    }

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
