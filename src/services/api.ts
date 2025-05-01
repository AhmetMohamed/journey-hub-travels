
import { toast } from "@/components/ui/use-toast";

const API_URL = '/api';

// Helper function to handle fetch errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred'
    }));
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
};

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Routes API
export const routesApi = {
  getAllRoutes: async () => {
    try {
      const response = await fetch(`${API_URL}/routes`);
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
      const response = await fetch(`${API_URL}/routes/${id}`);
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
      const response = await fetch(`${API_URL}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(routeData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating route:', error);
      toast({
        title: 'Error',
        description: 'Failed to create route. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  updateRoute: async (id: string, routeData: any) => {
    try {
      const response = await fetch(`${API_URL}/routes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(routeData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating route ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to update route. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  deleteRoute: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/routes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting route ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to delete route. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }
};

// Schedules API
export const schedulesApi = {
  getAllSchedules: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params as Record<string, string>);
      const response = await fetch(`${API_URL}/schedules?${queryParams}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch schedules. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getScheduleById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/schedules/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching schedule ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to fetch schedule details. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  createSchedule: async (scheduleData: any) => {
    try {
      const response = await fetch(`${API_URL}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(scheduleData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create schedule. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  updateSchedule: async (id: string, scheduleData: any) => {
    try {
      const response = await fetch(`${API_URL}/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(scheduleData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating schedule ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to update schedule. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  deleteSchedule: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/schedules/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting schedule ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to delete schedule. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }
};

// Bookings API
export const bookingsApi = {
  createBooking: async (bookingData: any) => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(bookingData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getUserBookings: async () => {
    try {
      const response = await fetch(`${API_URL}/bookings/user`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your bookings. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  cancelBooking: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getAllBookings: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/bookings`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  updateBookingStatus: async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ status })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating booking ${id} status:`, error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }
};
