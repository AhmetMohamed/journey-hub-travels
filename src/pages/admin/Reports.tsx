import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart } from '@/components/ui/chart';
import { useToast } from '@/components/ui/use-toast';
import { Download } from 'lucide-react';
import { reportsApi } from '@/services';

interface ReportData {
  name: string;
  value: number;
}

interface ReportStats {
  totalRevenue: number;
  totalBookings: number;
  averageOccupancy: number;
  revenueChange: number;
  bookingsChange: number;
  occupancyChange: number;
}

const AdminReports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("last30days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    totalRevenue: 0,
    totalBookings: 0,
    averageOccupancy: 0,
    revenueChange: 0,
    bookingsChange: 0,
    occupancyChange: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch initial report data with default settings
      const data = await generateReport();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching initial report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    
    try {
      const customDates = dateRange === 'custom' 
        ? { startDate, endDate } 
        : undefined;
      
      const data = await reportsApi.generateReport(reportType, dateRange, customDates);
      
      // Update stats
      if (data.stats) {
        setStats(data.stats);
      }
      
      // Set chart data
      setReportData(data.chartData || []);
      
      toast({
        title: "Report Generated",
        description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for the selected period has been generated.`,
      });
      
      return data.chartData;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
      return [];
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = async () => {
    try {
      const customDates = dateRange === 'custom' 
        ? { startDate, endDate } 
        : undefined;
        
      await reportsApi.downloadReport(reportType, dateRange, 'csv', customDates);
      
      toast({
        title: "Download Started",
        description: "Your report is being downloaded as CSV.",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">+{stats.revenueChange}% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBookings.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">+{stats.bookingsChange}% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.averageOccupancy}%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">+{stats.occupancyChange}% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Report Options</CardTitle>
              <CardDescription>Configure and generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); generateReport(); }}>
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select 
                    value={reportType} 
                    onValueChange={setReportType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue Report</SelectItem>
                      <SelectItem value="bookings">Bookings Report</SelectItem>
                      <SelectItem value="occupancy">Occupancy Report</SelectItem>
                      <SelectItem value="route">Route Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select 
                    value={dateRange} 
                    onValueChange={setDateRange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 Days</SelectItem>
                      <SelectItem value="last30days">Last 30 Days</SelectItem>
                      <SelectItem value="last90days">Last 90 Days</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {dateRange === 'custom' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="flex">
                        <Input
                          id="start-date"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="flex">
                        <Input
                          id="end-date"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={generating || loading}
                >
                  {generating ? "Generating..." : "Generate Report"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={downloadReport}
                  disabled={generating || loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Report Visualization</CardTitle>
              <CardDescription>
                {reportType === 'revenue' && "Monthly revenue statistics"}
                {reportType === 'bookings' && "Monthly booking statistics"}
                {reportType === 'occupancy' && "Monthly occupancy rates"}
                {reportType === 'route' && "Route performance comparison"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
                </div>
              ) : (
                <Tabs defaultValue={reportType} value={reportType} onValueChange={setReportType}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
                    <TabsTrigger value="route">Routes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="revenue" className="h-80 mt-4">
                    <BarChart
                      data={reportData}
                      categories={["value"]}
                      colors={["#8B5CF6"]}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      yAxisWidth={80}
                    />
                  </TabsContent>
                  <TabsContent value="bookings" className="h-80 mt-4">
                    <LineChart
                      data={reportData}
                      categories={["value"]}
                      colors={["#10B981"]}
                      valueFormatter={(value) => `${value} bookings`}
                      yAxisWidth={60}
                    />
                  </TabsContent>
                  <TabsContent value="occupancy" className="h-80 mt-4">
                    <LineChart
                      data={reportData}
                      categories={["value"]}
                      colors={["#F59E0B"]}
                      valueFormatter={(value) => `${value}%`}
                      yAxisWidth={60}
                    />
                  </TabsContent>
                  <TabsContent value="route" className="h-80 mt-4">
                    <BarChart
                      data={reportData}
                      categories={["value"]}
                      colors={["#6366F1"]}
                      valueFormatter={(value) => `${value} bookings`}
                      layout="vertical"
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
