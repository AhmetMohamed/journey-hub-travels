
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CalendarDays, MapPin, AlertCircle } from 'lucide-react';
import { bookingsApi } from '@/services/api';
import { formatDate, formatTime } from '@/lib/utils/dateUtils';

interface Booking {
  _id: string;
  user: string;
  schedule: {
    _id: string;
    route: {
      origin: string;
      destination: string;
    };
    departureTime: string;
    arrivalTime: string;
    bus: string;
  };
  seatNumbers: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/booking-history' } });
      return;
    }
    
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your booking history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsApi.cancelBooking(bookingId);
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' as 'cancelled' } 
          : booking
      ));
      
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const isBookingCancellable = (booking: Booking) => {
    // Check if booking is confirmed and departure time is in the future
    return (
      booking.status === 'confirmed' &&
      new Date(booking.schedule.departureTime) > new Date()
    );
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking._id} className={`
                overflow-hidden
                ${booking.status === 'cancelled' ? 'opacity-75' : ''}
              `}>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xl font-semibold mb-1">
                          {booking.schedule.route.origin} to {booking.schedule.route.destination}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span>{formatDate(booking.schedule.departureTime)} • {formatTime(booking.schedule.departureTime)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {getStatusBadge(booking.status)}
                          <Badge variant="outline" className="ml-2">{booking.schedule.bus}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Amount</div>
                        <div className="text-xl font-bold text-teal-600">${booking.totalAmount.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-b py-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <div>
                          <div className="font-medium mb-1">Seats</div>
                          <div>{booking.seatNumbers.join(', ')}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium mb-1">Booking Reference</div>
                          <div className="font-mono">{booking._id.substring(0, 8).toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Booked on {formatDate(booking.createdAt)}
                      </div>
                      <div>
                        {isBookingCancellable(booking) && (
                          <Button 
                            variant="outline" 
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {booking.status === 'cancelled' && (
                      <div className="mt-4 flex items-center p-3 bg-red-50 text-red-700 rounded-md">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>This booking has been cancelled.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-medium mb-2">No bookings found</h2>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet</p>
            <Button asChild>
              <Link to="/routes">Browse Routes</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookingHistory;
