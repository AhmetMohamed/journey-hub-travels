
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, handleResponse, getAuthHeader, authenticatedFetch } from './apiUtils';

export const routesApi = {
  getAllRoutes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/routes`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch routes. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getRouteById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/routes/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching route ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to fetch route details. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  createRoute: async (routeData: any) => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData)
      });
    } catch (error) {
      console.error('Error creating route:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  updateRoute: async (id: string, routeData: any) => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/routes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData)
      });
    } catch (error) {
      console.error(`Error updating route ${id}:`, error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  deleteRoute: async (id: string) => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/routes/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Error deleting route ${id}:`, error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  }
};
