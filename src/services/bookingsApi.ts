
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, handleResponse, getAuthHeader } from './apiUtils';

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
