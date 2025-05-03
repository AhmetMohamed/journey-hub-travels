
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, handleResponse, getAuthHeader, authenticatedFetch } from './apiUtils';

export const reportsApi = {
  generateReport: async (reportType: string, dateRange: string, customDates?: { startDate: string, endDate: string }) => {
    try {
      let url = `${API_BASE_URL}/api/reports/${reportType}?dateRange=${dateRange}`;
      
      if (dateRange === 'custom' && customDates) {
        url += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
      }
      
      return await authenticatedFetch(url);
    } catch (error) {
      console.error('Error generating report:', error);
      throw error; // authenticatedFetch already handles the toast notification
    }
  },
  
  generateAllReports: async (dateRange: string, customDates?: { startDate: string, endDate: string }) => {
    try {
      let url = `${API_BASE_URL}/api/reports/all?dateRange=${dateRange}`;
      
      if (dateRange === 'custom' && customDates) {
        url += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
      }
      
      return await authenticatedFetch(url);
    } catch (error) {
      console.error('Error generating all reports:', error);
      throw error;
    }
  },
  
  downloadReport: async (reportType: string, dateRange: string, format: string = 'csv', customDates?: { startDate: string, endDate: string }) => {
    try {
      let url = `${API_BASE_URL}/api/reports/${reportType}/download?format=${format}&dateRange=${dateRange}`;
      
      if (dateRange === 'custom' && customDates) {
        url += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
      }
      
      const headers = getAuthHeader();
      const response = await fetch(url, { headers });
      
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
  },
  
  downloadAllReports: async (dateRange: string, format: string = 'csv', customDates?: { startDate: string, endDate: string }) => {
    try {
      let url = `${API_BASE_URL}/api/reports/all/download?format=${format}&dateRange=${dateRange}`;
      
      if (dateRange === 'custom' && customDates) {
        url += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
      }
      
      const headers = getAuthHeader();
      const response = await fetch(url, { headers });
      
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
      link.download = `all-reports.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: 'Download Complete',
        description: 'All reports have been downloaded successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error downloading all reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to download all reports. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }
};
