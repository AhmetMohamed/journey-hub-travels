
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Routes from "./pages/Routes";
import Schedules from "./pages/Schedules";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRoutes from "./pages/admin/Routes";
import AdminSchedules from "./pages/admin/Schedules";
import AdminUsers from "./pages/admin/Users";
import AdminBookings from "./pages/admin/Bookings";
import AdminReports from "./pages/admin/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingHistory from "./pages/BookingHistory";
import SeatSelection from "./pages/SeatSelection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <RouterRoutes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/routes" element={<Routes />} />
            <Route path="/schedules" element={<Schedules />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking-history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
            <Route path="/seat-selection/:scheduleId" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
            
            {/* Admin Routes with Protection */}
            <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/routes" element={<ProtectedRoute allowedRole="admin"><AdminRoutes /></ProtectedRoute>} />
            <Route path="/admin/schedules" element={<ProtectedRoute allowedRole="admin"><AdminSchedules /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute allowedRole="admin"><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><AdminReports /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
