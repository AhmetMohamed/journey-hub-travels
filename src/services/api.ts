import { toast } from "@/components/ui/use-toast";

// Mock API implementation
const useMockApi = true; // Set to false when real backend is available
const mockDelay = 500; // Simulate network delay

// Mock data
const mockRoutes = [
  {
    _id: "1",
    name: "NY-BOS",
    origin: "New York",
    destination: "Boston",
    distance: 215,
    estimatedDuration: 270,
    description: "Express service between New York and Boston",
    isActive: true
  },
  {
    _id: "2",
    name: "CHI-MIL",
    origin: "Chicago",
    destination: "Milwaukee",
    distance: 92,
    estimatedDuration: 105,
    description: "Regular service between Chicago and Milwaukee",
    isActive: true
  },
  {
    _id: "3",
    name: "LA-SD",
    origin: "Los Angeles",
    destination: "San Diego",
    distance: 120,
    estimatedDuration: 135,
    description: "Premium service between Los Angeles and San Diego",
    isActive: true
  }
];

const mockSchedules = [
  {
    _id: "1",
    route: {
      _id: "1",
      name: "NY-BOS",
      origin: "New York",
      destination: "Boston",
      distance: 215,
      estimatedDuration: 270
    },
    departureTime: "2025-05-10T07:00:00.000Z",
    arrivalTime: "2025-05-10T11:30:00.000Z",
    price: 45.00,
    bus: "Express",
    availableSeats: 28,
    totalSeats: 40,
    bookedSeats: ["A1", "B2", "C3"]
  },
  {
    _id: "2",
    route: {
      _id: "2",
      name: "CHI-MIL",
      origin: "Chicago",
      destination: "Milwaukee",
      distance: 92,
      estimatedDuration: 105
    },
    departureTime: "2025-05-10T06:30:00.000Z",
    arrivalTime: "2025-05-10T08:15:00.000Z",
    price: 25.00,
    bus: "Premium",
    availableSeats: 32,
    totalSeats: 36,
    bookedSeats: ["A2", "B4"]
  }
];

const mockBookings = [
  {
    _id: "1",
    user: "user123",
    schedule: {
      _id: "1",
      route: {
        origin: "New York",
        destination: "Boston"
      },
      departureTime: "2025-05-10T07:00:00.000Z",
      arrivalTime: "2025-05-10T11:30:00.000Z",
      bus: "Express"
    },
    seatNumbers: ["A4", "B4"],
    totalAmount: 90.00,
    status: "confirmed",
    createdAt: "2025-05-01T10:00:00.000Z"
  },
  {
    _id: "2",
    user: "user123",
    schedule: {
      _id: "2",
      route: {
        origin: "Chicago",
        destination: "Milwaukee"
      },
      departureTime: "2025-05-12T06:30:00.000Z",
      arrivalTime: "2025-05-12T08:15:00.000Z",
      bus: "Premium"
    },
    seatNumbers: ["C2"],
    totalAmount: 25.00,
    status: "completed",
    createdAt: "2025-05-02T14:30:00.000Z"
  }
];

const mockDashboardStats = {
  totalBookings: 156,
  revenue: 5830,
  activeRoutes: 12,
  customerSatisfaction: 4.2,
  bookingsTrend: 15,
  routesAdded: 3
};

const mockRevenueData = [
  { name: "Jan", value: 3400 },
  { name: "Feb", value: 2800 },
  { name: "Mar", value: 4200 },
  { name: "Apr", value: 3800 },
  { name: "May", value: 5200 },
  { name: "Jun", value: 5800 }
];

const mockBookingsTrend = [
  { name: "Week 1", value: 24 },
  { name: "Week 2", value: 18 },
  { name: "Week 3", value: 22 },
  { name: "Week 4", value: 26 },
  { name: "Week 5", value: 30 },
  { name: "Week 6", value: 28 }
];

const mockRouteUsage = [
  { name: "New York - Boston", value: 45 },
  { name: "Chicago - Milwaukee", value: 30 },
  { name: "Los Angeles - San Diego", value: 38 },
  { name: "Seattle - Portland", value: 22 },
  { name: "Miami - Orlando", value: 35 }
];

const mockBusTypeData = [
  { name: "Regular", value: 40 },
  { name: "Premium", value: 35 },
  { name: "Express", value: 25 }
];

const mockReportStats = {
  totalRevenue: 12680,
  totalBookings: 328,
  averageOccupancy: 76,
  revenueChange: 12,
  bookingsChange: 8,
  occupancyChange: 5
};

// Mock API function
const mockApiCall = (data: any, errorRate = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random errors if specified
      if (errorRate > 0 && Math.random() < errorRate) {
        reject(new Error("Simulated API error"));
        return;
      }
      resolve(data);
    }, mockDelay);
  });
};

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
      if (useMockApi) {
        return await mockApiCall(mockRoutes);
      }
      
      const response = await fetch(`/api/routes`);
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
      if (useMockApi) {
        const route = mockRoutes.find(r => r._id === id);
        if (!route) throw new Error('Route not found');
        return await mockApiCall(route);
      }
      
      const response = await fetch(`/api/routes/${id}`);
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
      if (useMockApi) {
        const newRoute = {
          _id: (mockRoutes.length + 1).toString(),
          ...routeData,
          isActive: true
        };
        mockRoutes.push(newRoute);
        return await mockApiCall(newRoute);
      }
      
      const response = await fetch(`/api/routes`, {
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
      if (useMockApi) {
        const index = mockRoutes.findIndex(r => r._id === id);
        if (index === -1) throw new Error('Route not found');
        mockRoutes[index] = { ...mockRoutes[index], ...routeData };
        return await mockApiCall(mockRoutes[index]);
      }
      
      const response = await fetch(`/api/routes/${id}`, {
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
      if (useMockApi) {
        const index = mockRoutes.findIndex(r => r._id === id);
        if (index === -1) throw new Error('Route not found');
        mockRoutes[index].isActive = false;
        return await mockApiCall({ message: 'Route removed' });
      }
      
      const response = await fetch(`/api/routes/${id}`, {
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
      if (useMockApi) {
        // Filter mock schedules based on params
        let filteredSchedules = [...mockSchedules];
        
        if (params.origin) {
          filteredSchedules = filteredSchedules.filter(s => 
            s.route.origin.toLowerCase().includes(params.origin.toLowerCase())
          );
        }
        
        if (params.destination) {
          filteredSchedules = filteredSchedules.filter(s => 
            s.route.destination.toLowerCase().includes(params.destination.toLowerCase())
          );
        }
        
        return await mockApiCall(filteredSchedules);
      }
      
      const queryParams = new URLSearchParams(params as Record<string, string>);
      const response = await fetch(`/api/schedules?${queryParams}`);
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
      if (useMockApi) {
        const schedule = mockSchedules.find(s => s._id === id);
        if (!schedule) throw new Error('Schedule not found');
        return await mockApiCall(schedule);
      }
      
      const response = await fetch(`/api/schedules/${id}`);
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
      if (useMockApi) {
        const newSchedule = {
          _id: (mockSchedules.length + 1).toString(),
          ...scheduleData,
          availableSeats: scheduleData.totalSeats - (scheduleData.bookedSeats?.length || 0),
          bookedSeats: scheduleData.bookedSeats || []
        };
        mockSchedules.push(newSchedule);
        return await mockApiCall(newSchedule);
      }
      
      const response = await fetch(`/api/schedules`, {
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
      if (useMockApi) {
        const index = mockSchedules.findIndex(s => s._id === id);
        if (index === -1) throw new Error('Schedule not found');
        mockSchedules[index] = { 
          ...mockSchedules[index], 
          ...scheduleData,
          availableSeats: scheduleData.totalSeats - (scheduleData.bookedSeats?.length || 0)
        };
        return await mockApiCall(mockSchedules[index]);
      }
      
      const response = await fetch(`/api/schedules/${id}`, {
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
      if (useMockApi) {
        const index = mockSchedules.findIndex(s => s._id === id);
        if (index === -1) throw new Error('Schedule not found');
        mockSchedules.splice(index, 1);
        return await mockApiCall({ message: 'Schedule removed' });
      }
      
      const response = await fetch(`/api/schedules/${id}`, {
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
      if (useMockApi) {
        // Update available seats in schedule
        const scheduleIndex = mockSchedules.findIndex(s => s._id === bookingData.scheduleId);
        if (scheduleIndex !== -1) {
          mockSchedules[scheduleIndex].bookedSeats = [
            ...mockSchedules[scheduleIndex].bookedSeats,
            ...bookingData.seatNumbers
          ];
          mockSchedules[scheduleIndex].availableSeats -= bookingData.seatNumbers.length;
        }
        
        // Create new booking
        const newBooking = {
          _id: (mockBookings.length + 1).toString(),
          user: "user123",
          schedule: mockSchedules.find(s => s._id === bookingData.scheduleId),
          seatNumbers: bookingData.seatNumbers,
          totalAmount: bookingData.totalAmount,
          status: "confirmed",
          createdAt: new Date().toISOString()
        };
        mockBookings.push(newBooking);
        return await mockApiCall(newBooking);
      }
      
      const response = await fetch(`/api/bookings`, {
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
      if (useMockApi) {
        return await mockApiCall(mockBookings);
      }
      
      const response = await fetch(`/api/bookings/user`, {
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
      if (useMockApi) {
        const index = mockBookings.findIndex(b => b._id === id);
        if (index === -1) throw new Error('Booking not found');
        mockBookings[index].status = "cancelled";
        
        // Update available seats in schedule
        const scheduleId = mockBookings[index].schedule._id;
        const scheduleIndex = mockSchedules.findIndex(s => s._id === scheduleId);
        if (scheduleIndex !== -1) {
          mockBookings[index].seatNumbers.forEach(seat => {
            const seatIndex = mockSchedules[scheduleIndex].bookedSeats.indexOf(seat);
            if (seatIndex !== -1) {
              mockSchedules[scheduleIndex].bookedSeats.splice(seatIndex, 1);
            }
          });
          mockSchedules[scheduleIndex].availableSeats += mockBookings[index].seatNumbers.length;
        }
        
        return await mockApiCall(mockBookings[index]);
      }
      
      const response = await fetch(`/api/bookings/${id}/cancel`, {
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
      if (useMockApi) {
        return await mockApiCall(mockBookings);
      }
      
      const response = await fetch(`/api/admin/bookings`, {
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
      if (useMockApi) {
        const index = mockBookings.findIndex(b => b._id === id);
        if (index === -1) throw new Error('Booking not found');
        mockBookings[index].status = status as 'confirmed' | 'cancelled' | 'completed';
        return await mockApiCall(mockBookings[index]);
      }
      
      const response = await fetch(`/api/admin/bookings/${id}/status`, {
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

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    try {
      if (useMockApi) {
        return await mockApiCall(mockDashboardStats);
      }
      
      const response = await fetch(`/api/admin/dashboard/stats`, {
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
      if (useMockApi) {
        return await mockApiCall(mockRevenueData);
      }
      
      const response = await fetch(`/api/admin/dashboard/revenue`, {
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
      if (useMockApi) {
        return await mockApiCall(mockBookingsTrend);
      }
      
      const response = await fetch(`/api/admin/dashboard/bookings-trend`, {
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
      if (useMockApi) {
        return await mockApiCall(mockRouteUsage);
      }
      
      const response = await fetch(`/api/admin/dashboard/route-usage`, {
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
      if (useMockApi) {
        return await mockApiCall(mockBusTypeData);
      }
      
      const response = await fetch(`/api/admin/dashboard/bus-type`, {
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
      if (useMockApi) {
        // Return mock report data based on type
        let chartData;
        
        switch (reportType) {
          case 'revenue':
            chartData = mockRevenueData;
            break;
          case 'bookings':
            chartData = mockBookingsTrend;
            break;
          case 'occupancy':
            chartData = [
              { name: "Jan", value: 68 },
              { name: "Feb", value: 72 },
              { name: "Mar", value: 65 },
              { name: "Apr", value: 70 },
              { name: "May", value: 76 },
              { name: "Jun", value: 82 }
            ];
            break;
          case 'route':
            chartData = mockRouteUsage;
            break;
          default:
            chartData = [];
        }
        
        return await mockApiCall({
          stats: mockReportStats,
          chartData
        });
      }
      
      let url = `/api/admin/reports/${reportType}?dateRange=${dateRange}`;
      
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
      if (useMockApi) {
        // Simulate a download by creating a mock CSV content
        const content = 'Date,Value\n2023-01,3400\n2023-02,2800\n2023-03,4200';
        const blob = new Blob([content], { type: 'text/csv' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${reportType}-report.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        return true;
      }
      
      let url = `/api/admin/reports/${reportType}/download?format=${format}&dateRange=${dateRange}`;
      
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
