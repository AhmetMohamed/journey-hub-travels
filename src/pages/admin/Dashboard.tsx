
import React from "react";
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

const AdminDashboard = () => {
  const { user } = useAuth();

  // Mock data for the charts
  const routeUsageData = [
    { name: "New York - Boston", value: 120 },
    { name: "Chicago - Milwaukee", value: 80 },
    { name: "Los Angeles - San Diego", value: 95 },
    { name: "Seattle - Portland", value: 65 },
    { name: "Miami - Orlando", value: 75 },
  ];

  const revenueData = [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 15000 },
    { name: "Mar", value: 18000 },
    { name: "Apr", value: 16500 },
    { name: "May", value: 19000 },
    { name: "Jun", value: 22000 },
  ];

  const bookingsTrendData = [
    { name: "Week 1", value: 40 },
    { name: "Week 2", value: 45 },
    { name: "Week 3", value: 60 },
    { name: "Week 4", value: 78 },
    { name: "Week 5", value: 58 },
    { name: "Week 6", value: 65 },
  ];

  const busTypeData = [
    { name: "Standard", value: 35 },
    { name: "Express", value: 45 },
    { name: "Premium", value: 20 },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2,856</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +12% from last month
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
              <div className="text-3xl font-bold">$124,750</div>
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
              <div className="text-3xl font-bold">42</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                2 new routes added
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
              <div className="text-3xl font-bold">4.7/5</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +0.2 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
              <CardTitle>Bus Type Distribution</CardTitle>
              <CardDescription>Bookings by bus type</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <PieChart
                data={busTypeData}
                categories={["value"]}
                colors={["#6B7280", "#8B5CF6", "#10B981"]}
                valueFormatter={(value) => `${value}%`}
                className="max-w-sm mx-auto"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
