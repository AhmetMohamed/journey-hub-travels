
import React, { useState } from 'react';
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
import { Calendar, Download } from 'lucide-react';

const AdminReports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("last30days");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Sample data for revenue report
  const revenueData = [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 15000 },
    { name: "Mar", value: 18000 },
    { name: "Apr", value: 16500 },
    { name: "May", value: 19000 },
    { name: "Jun", value: 22000 },
  ];

  // Sample data for bookings report
  const bookingsData = [
    { name: "Jan", value: 240 },
    { name: "Feb", value: 280 },
    { name: "Mar", value: 320 },
    { name: "Apr", value: 290 },
    { name: "May", value: 310 },
    { name: "Jun", value: 370 },
  ];

  // Sample data for occupancy report
  const occupancyData = [
    { name: "Jan", value: 78 },
    { name: "Feb", value: 82 },
    { name: "Mar", value: 85 },
    { name: "Apr", value: 80 },
    { name: "May", value: 83 },
    { name: "Jun", value: 88 },
  ];

  // Sample data for route performance
  const routePerformanceData = [
    { name: "New York - Boston", value: 120 },
    { name: "Chicago - Milwaukee", value: 80 },
    { name: "Los Angeles - San Diego", value: 95 },
    { name: "Seattle - Portland", value: 65 },
    { name: "Miami - Orlando", value: 75 },
  ];

  const generateReport = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Report Generated",
        description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for the selected period has been generated.`,
      });
    }, 1500);
  };

  const downloadReport = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded as CSV.",
    });
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
              <div className="text-3xl font-bold">$124,750</div>
              <p className="text-xs text-green-600 flex items-center mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2,856</div>
              <p className="text-xs text-green-600 flex items-center mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">83%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">+5% from last month</p>
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
              <form className="space-y-4">
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
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="flex">
                        <Input
                          id="end-date"
                          type="date"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <Button 
                  type="button"
                  onClick={generateReport}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Report"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={downloadReport}
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
              <Tabs defaultValue={reportType} value={reportType} onValueChange={setReportType}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
                  <TabsTrigger value="route">Routes</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue" className="h-80 mt-4">
                  <BarChart
                    data={revenueData}
                    categories={["value"]}
                    colors={["#8B5CF6"]}
                    valueFormatter={(value) => `$${value.toLocaleString()}`}
                    yAxisWidth={80}
                  />
                </TabsContent>
                <TabsContent value="bookings" className="h-80 mt-4">
                  <LineChart
                    data={bookingsData}
                    categories={["value"]}
                    colors={["#10B981"]}
                    valueFormatter={(value) => `${value} bookings`}
                    yAxisWidth={60}
                  />
                </TabsContent>
                <TabsContent value="occupancy" className="h-80 mt-4">
                  <LineChart
                    data={occupancyData}
                    categories={["value"]}
                    colors={["#F59E0B"]}
                    valueFormatter={(value) => `${value}%`}
                    yAxisWidth={60}
                  />
                </TabsContent>
                <TabsContent value="route" className="h-80 mt-4">
                  <BarChart
                    data={routePerformanceData}
                    categories={["value"]}
                    colors={["#6366F1"]}
                    valueFormatter={(value) => `${value} bookings`}
                    layout="vertical"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
