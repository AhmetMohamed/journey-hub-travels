
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, handleResponse, getAuthHeader, authenticatedFetch } from './apiUtils';

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
      return await authenticatedFetch(`${API_BASE_URL}/api/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData)
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  updateSchedule: async (id: string, scheduleData: any) => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData)
      });
    } catch (error) {
      console.error(`Error updating schedule ${id}:`, error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  deleteSchedule: async (id: string) => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/schedules/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Error deleting schedule ${id}:`, error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  }
};
