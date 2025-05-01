
import { toast } from "@/components/ui/use-toast";

// API configuration
const API_BASE_URL = ''; // Empty for relative URLs on same domain
const useMockApi = false; // Set to false to use real backend

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
      const response = await fetch(`${API_BASE_URL}/api/routes`, {
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
      const response = await fetch(`${API_BASE_URL}/api/routes/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/routes/${id}`, {
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
  getAllSchedules: async (params: Record<string, any> = {}) => {
    try {
      const queryParams = new URLSearchParams(params as Record<string, string>);
      const response = await fetch(`${API_BASE_URL}/api/schedules?${queryParams}`);
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
      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`);
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
      const response = await fetch(`${API_BASE_URL}/api/schedules`, {
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
      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
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
      const response = await fetch(`${API_BASE_URL}/api/bookings/user`, {
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
      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}/cancel`, {
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
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
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
      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
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

// Dashboard and Analytics API
export const dashboardApi = {
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getRevenueData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/revenue`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch revenue data.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getBookingsTrend: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/bookings-trend`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching bookings trend:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings trend data.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getRouteUsage: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/route-usage`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching route usage data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch route usage data.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getBusTypeDistribution: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/bus-type`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching bus type distribution:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bus type distribution data.',
        variant: 'destructive',
      });
      throw error;
    }
  }
};

// Reports API
export const reportsApi = {
  generateReport: async (reportType: string, dateRange: string, customDates?: { startDate: string, endDate: string }) => {
    try {
      let url = `${API_BASE_URL}/api/reports/${reportType}?dateRange=${dateRange}`;
      
      if (dateRange === 'custom' && customDates) {
        url += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
      }
      
      const response = await fetch(url, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  downloadReport: async (reportType: string, dateRange: string, format: string = 'csv', customDates?: { startDate: string, endDate: string }) => {
    try {
      let url = `${API_BASE_URL}/api/reports/${reportType}/download?format=${format}&dateRange=${dateRange}`;
      
      if (dateRange === 'custom' && customDates) {
        url += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
      }
      
      const response = await fetch(url, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'An unknown error occurred'
        }));
        throw new Error(error.message || `Error: ${response.status}`);
      }
      
      // For file download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${reportType}-report.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: 'Error',
        description: 'Failed to download report. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }
};
