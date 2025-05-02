
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, handleResponse, getAuthHeader, authenticatedFetch } from './apiUtils';

export const bookingsApi = {
  createBooking: async (bookingData: any) => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  getUserBookings: async () => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/bookings/user`);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  cancelBooking: async (id: string) => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/bookings/${id}/cancel`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  getAllBookings: async () => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/bookings`);
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  updateBookingStatus: async (id: string, status: string) => {
    try {
      return await authenticatedFetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error(`Error updating booking ${id} status:`, error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  }
};
