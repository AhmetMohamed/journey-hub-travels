
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
  
  downloadReport: async (reportType: string, dateRange: string, format: string = 'xlsx', customDates?: { startDate: string, endDate: string }) => {
    try {
      let url = `${API_BASE_URL}/api/reports/${reportType}/download?format=${format}&dateRange=${dateRange}`;
      
      if (dateRange === 'custom' && customDates) {
        url += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
      }
      
      // Generate actual CSV data based on report type
      const headers = getAuthHeader();
      
      // For demo purposes, we'll generate CSV content locally since the backend isn't fully implemented
      const reportData = await authenticatedFetch(`${API_BASE_URL}/api/reports/${reportType}?dateRange=${dateRange}`);
      let csvContent;
      
      if (reportType === 'revenue') {
        csvContent = generateRevenueCsvContent(reportData.chartData);
      } else if (reportType === 'bookings') {
        csvContent = generateBookingsCsvContent(reportData.chartData);
      } else if (reportType === 'occupancy') {
        csvContent = generateOccupancyCsvContent(reportData.chartData);
      } else if (reportType === 'route') {
        csvContent = generateRouteCsvContent(reportData.chartData);
      } else {
        csvContent = "No data available for this report type";
      }
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${reportType}-report.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: 'Download Complete',
        description: 'Report has been downloaded successfully.',
      });
      
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
  
  downloadAllReports: async (dateRange: string, format: string = 'xlsx', customDates?: { startDate: string, endDate: string }) => {
    try {
      // For all reports, we'll generate a single CSV file with all report data
      const allReportsData = await authenticatedFetch(`${API_BASE_URL}/api/reports/all?dateRange=${dateRange}`);
      
      // Generate combined CSV content for all reports
      let csvContent = "# BusGo Combined Reports\n\n";
      
      // Add revenue data
      csvContent += "## REVENUE REPORT\n";
      csvContent += generateRevenueCsvContent(allReportsData.allReports?.revenue || []);
      csvContent += "\n\n";
      
      // Add bookings data
      csvContent += "## BOOKINGS REPORT\n";
      csvContent += generateBookingsCsvContent(allReportsData.allReports?.bookings || []);
      csvContent += "\n\n";
      
      // Add occupancy data
      csvContent += "## OCCUPANCY REPORT\n";
      csvContent += generateOccupancyCsvContent(allReportsData.allReports?.occupancy || []);
      csvContent += "\n\n";
      
      // Add route data
      csvContent += "## ROUTE PERFORMANCE REPORT\n";
      csvContent += generateRouteCsvContent(allReportsData.allReports?.route || []);
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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

// Helper function to generate CSV content for revenue reports
function generateRevenueCsvContent(data: any[]) {
  if (!data || data.length === 0) {
    return "Period,Revenue\nNo data available,0";
  }
  
  let csvContent = "Period,Revenue\n";
  data.forEach(item => {
    csvContent += `${item.name},${item.value}\n`;
  });
  
  return csvContent;
}

// Helper function to generate CSV content for bookings reports
function generateBookingsCsvContent(data: any[]) {
  if (!data || data.length === 0) {
    return "Period,Bookings\nNo data available,0";
  }
  
  let csvContent = "Period,Bookings\n";
  data.forEach(item => {
    csvContent += `${item.name},${item.value}\n`;
  });
  
  return csvContent;
}

// Helper function to generate CSV content for occupancy reports
function generateOccupancyCsvContent(data: any[]) {
  if (!data || data.length === 0) {
    return "Period,Occupancy Rate (%)\nNo data available,0";
  }
  
  let csvContent = "Period,Occupancy Rate (%)\n";
  data.forEach(item => {
    csvContent += `${item.name},${item.value}\n`;
  });
  
  return csvContent;
}

// Helper function to generate CSV content for route reports
function generateRouteCsvContent(data: any[]) {
  if (!data || data.length === 0) {
    return "Route,Bookings\nNo data available,0";
  }
  
  let csvContent = "Route,Bookings\n";
  data.forEach(item => {
    csvContent += `${item.name},${item.value}\n`;
  });
  
  return csvContent;
}
