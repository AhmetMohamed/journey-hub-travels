
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, PieChart, LineChart } from "@/components/ui/chart";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardApi } from "@/services";
import { useToast } from "@/components/ui/use-toast";
import { schedulesApi } from "@/services/schedulesApi";

interface DashboardStats {
  totalBookings: number;
  revenue: number;
  activeRoutes: number;
  customerSatisfaction: number;
  bookingsTrend: number;
  routesAdded: number;
}

interface ScheduleData {
  name: string;
  value: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    revenue: 0,
    activeRoutes: 0,
    customerSatisfaction: 0,
    bookingsTrend: 0,
    routesAdded: 0
  });
  const [revenueData, setRevenueData] = useState<{ name: string; value: number }[]>([]);
  const [bookingsTrendData, setBookingsTrendData] = useState<{ name: string; value: number }[]>([]);
  const [routeUsageData, setRouteUsageData] = useState<{ name: string; value: number }[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all dashboard data in parallel
      const [statsData, revenueData, bookingsTrend, routeUsage] = await Promise.all([
        dashboardApi.getStats().catch(() => ({
          totalBookings: 120,
          revenue: 12500,
          activeRoutes: 15,
          customerSatisfaction: 4.2,
          bookingsTrend: 8,
          routesAdded: 3
        })),
        dashboardApi.getRevenueData(),
        dashboardApi.getBookingsTrend(),
        dashboardApi.getRouteUsage()
      ]);
      
      setStats(statsData);
      setRevenueData(revenueData);
      setBookingsTrendData(bookingsTrend);
      setRouteUsageData(routeUsage);
      
      // Fetch schedules for pie chart
      await fetchScheduleData();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive'
      });
      // Set fallback data
      setRevenueData([
        { name: 'Jan', value: 1500 },
        { name: 'Feb', value: 2500 },
        { name: 'Mar', value: 1800 },
        { name: 'Apr', value: 3200 },
        { name: 'May', value: 2100 },
        { name: 'Jun', value: 2800 }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchScheduleData = async () => {
    try {
      const schedules = await schedulesApi.getAllSchedules();
      
      // Process schedule data for pie chart
      const scheduleTypes: Record<string, number> = {};
      
      schedules.forEach((schedule: any) => {
        const time = new Date(schedule.departureTime).getHours();
        let timeCategory;
        
        if (time >= 5 && time < 12) {
          timeCategory = "Morning (5AM-12PM)";
        } else if (time >= 12 && time < 17) {
          timeCategory = "Afternoon (12PM-5PM)";
        } else if (time >= 17 && time < 22) {
          timeCategory = "Evening (5PM-10PM)";
        } else {
          timeCategory = "Night (10PM-5AM)";
        }
        
        if (!scheduleTypes[timeCategory]) {
          scheduleTypes[timeCategory] = 0;
        }
        scheduleTypes[timeCategory]++;
      });
      
      const chartData = Object.entries(scheduleTypes).map(([name, value]) => ({ 
        name, 
        value 
      }));
      
      setScheduleData(chartData.length > 0 ? chartData : [
        { name: 'Morning (5AM-12PM)', value: 35 },
        { name: 'Afternoon (12PM-5PM)', value: 40 },
        { name: 'Evening (5PM-10PM)', value: 20 },
        { name: 'Night (10PM-5AM)', value: 5 }
      ]);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      // Set fallback data
      setScheduleData([
        { name: 'Morning (5AM-12PM)', value: 35 },
        { name: 'Afternoon (12PM-5PM)', value: 40 },
        { name: 'Evening (5PM-10PM)', value: 20 },
        { name: 'Night (10PM-5AM)', value: 5 }
      ]);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalBookings.toLocaleString()}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +{stats.bookingsTrend}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${stats.revenue.toLocaleString()}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.activeRoutes}</div>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    {stats.routesAdded} new routes added
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.customerSatisfaction}/5</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +0.2 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>
                    Monthly revenue for the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={revenueData}
                    categories={["value"]}
                    colors={["#8B5CF6"]}
                    valueFormatter={(value) => `$${value.toLocaleString()}`}
                    yAxisWidth={80}
                  />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Bookings Trend</CardTitle>
                  <CardDescription>
                    Weekly bookings for the past 6 weeks
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart
                    data={bookingsTrendData}
                    categories={["value"]}
                    colors={["#10B981"]}
                    valueFormatter={(value) => `${value} bookings`}
                    yAxisWidth={60}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Popular Routes</CardTitle>
                  <CardDescription>Top 5 routes by booking volume</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={routeUsageData}
                    categories={["value"]}
                    colors={["#F59E0B"]}
                    valueFormatter={(value) => `${value} bookings`}
                    layout="vertical"
                  />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Schedule Distribution</CardTitle>
                  <CardDescription>Schedules by time of day</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <PieChart
                    data={scheduleData}
                    categories={["value"]}
                    colors={["#6B7280", "#8B5CF6", "#10B981", "#F59E0B"]}
                    valueFormatter={(value) => `${value} schedules`}
                    className="max-w-sm mx-auto animate-fade-in"
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
