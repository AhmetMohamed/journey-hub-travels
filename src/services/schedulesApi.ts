
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, handleResponse, getAuthHeader } from './apiUtils';

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
