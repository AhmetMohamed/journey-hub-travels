
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, handleResponse, getAuthHeader, authenticatedFetch } from './apiUtils';

export const dashboardApi = {
  getStats: async () => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/stats`);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  getRevenueData: async () => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/stats/revenue`);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  getBookingsTrend: async () => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/stats/bookings-trend`);
    } catch (error) {
      console.error('Error fetching bookings trend:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  getRouteUsage: async () => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/stats/route-usage`);
    } catch (error) {
      console.error('Error fetching route usage data:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  getBusTypeDistribution: async () => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/stats/bus-type`);
    } catch (error) {
      console.error('Error fetching bus type distribution:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  }
};
