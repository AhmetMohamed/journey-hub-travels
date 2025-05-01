
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, handleResponse, getAuthHeader } from './apiUtils';

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
