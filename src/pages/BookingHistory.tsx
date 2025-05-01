
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin, Bus } from "lucide-react";

interface Booking {
  id: string;
  scheduleId: string;
  userId: string;
  route: {
    from: string;
    to: string;
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  busType: string;
  seatNumbers: string[];
  status: "confirmed" | "cancelled" | "completed";
  bookingDate: string;
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // For now we'll use mock data, but this would be replaced with a real API call
      // const response = await fetch(`/api/bookings/user/${user?.id}`);
      // const data = await response.json();
      // setBookings(data);
      
      // Mock data
      setTimeout(() => {
        setBookings([
          {
            id: "booking1",
            scheduleId: "sch1",
            userId: user?.id || "",
            route: {
              from: "New York",
              to: "Boston"
            },
            departureTime: "08:00 AM",
            arrivalTime: "12:30 PM",
            price: 45.99,
            busType: "Express",
            seatNumbers: ["A1", "A2"],
            status: "confirmed",
            bookingDate: "2025-04-25"
          },
          {
            id: "booking2",
            scheduleId: "sch3",
            userId: user?.id || "",
            route: {
              from: "Chicago",
              to: "Milwaukee"
            },
            departureTime: "10:15 AM",
            arrivalTime: "12:00 PM",
            price: 25.99,
            busType: "Standard",
            seatNumbers: ["C4"],
            status: "completed",
            bookingDate: "2025-04-10"
          },
          {
            id: "booking3",
            scheduleId: "sch4",
            userId: user?.id || "",
            route: {
              from: "Los Angeles",
              to: "San Diego"
            },
            departureTime: "03:45 PM",
            arrivalTime: "06:00 PM",
            price: 32.99,
            busType: "Premium",
            seatNumbers: ["B3"],
            status: "cancelled",
            bookingDate: "2025-03-15"
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch booking history",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      // This would be replaced with a real API call
      // await fetch(`/api/bookings/${bookingId}/cancel`, {
      //   method: 'PUT'
      // });
      
      // For now, we'll just update our local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" as const } 
          : booking
      ));
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Booking History</h1>
          <p className="text-gray-600">View and manage your past and upcoming bookings</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-grow p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>{booking.bookingDate}</span>
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold">{booking.departureTime}</span>
                            <div className="flex-grow border-t border-dashed border-gray-300 mx-2 relative">
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-500">
                                {calculateTravelTime(booking.departureTime, booking.arrivalTime)}
                              </div>
                            </div>
                            <span className="text-2xl font-bold">{booking.arrivalTime}</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{booking.route.from}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{booking.route.to}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className={`mb-2 ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <Bus className="h-4 w-4" />
                            <span>{booking.busType}</span>
                          </div>
                          <div className="text-sm mt-2">
                            <span>Seat(s): {booking.seatNumbers.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                          <div className="text-xs text-gray-500">Total paid</div>
                          <div className="text-2xl font-bold text-bus-600">
                            ${(booking.price * booking.seatNumbers.length).toFixed(2)}
                          </div>
                        </div>
                        {booking.status === "confirmed" && (
                          <Button 
                            variant="destructive"
                            onClick={() => cancelBooking(booking.id)}
                            className="w-full md:w-auto"
                          >
                            Cancel Booking
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button 
                            variant="outline"
                            className="w-full md:w-auto"
                            onClick={() => navigate(`/book-again/${booking.scheduleId}`)}
                          >
                            Book Again
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No booking history</h3>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet</p>
            <Button onClick={() => navigate("/routes")}>Explore Routes</Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

// Helper function to calculate travel time
function calculateTravelTime(departure: string, arrival: string): string {
  // Simple implementation for demo purposes
  // In a real app, you would parse the times and calculate the difference
  return "4h 30m";
}

export default BookingHistory;
