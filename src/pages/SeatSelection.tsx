
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Check } from 'lucide-react';
import { schedulesApi, bookingsApi } from '@/services';
import { formatTime, formatDate } from '@/lib/utils/dateUtils';

interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
}

interface Schedule {
  _id: string;
  route: {
    name: string;
    origin: string;
    destination: string;
    distance: number;
    estimatedDuration: number;
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  bus: string;
  availableSeats: number;
  totalSeats: number;
  bookedSeats: string[];
}

const SeatSelection = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [seatMap, setSeatMap] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/seat-selection/${scheduleId}` } });
      return;
    }
    
    fetchSchedule();
  }, [scheduleId, isAuthenticated]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      if (!scheduleId) {
        throw new Error('Schedule ID is missing');
      }
      
      const data = await schedulesApi.getScheduleById(scheduleId);
      setSchedule(data);
      
      // Generate seat map based on the schedule data
      generateSeatMap(data.totalSeats, data.bookedSeats || []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast({
        title: "Error",
        description: "Failed to load bus schedule information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSeatMap = (totalSeats: number, bookedSeats: string[]) => {
    const seats: Seat[] = [];
    
    for (let i = 1; i <= totalSeats; i++) {
      const row = Math.ceil(i / 4);
      const position = i % 4 === 0 ? 4 : i % 4;
      let seatNumber;
      
      if (position === 1) seatNumber = `A${row}`;
      else if (position === 2) seatNumber = `B${row}`;
      else if (position === 3) seatNumber = `C${row}`; 
      else seatNumber = `D${row}`;
      
      seats.push({
        id: `seat-${i}`,
        number: seatNumber,
        isAvailable: !bookedSeats.includes(seatNumber)
      });
    }
    
    setSeatMap(seats);
  };

  const toggleSeatSelection = (seatId: string, seatNumber: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue with booking.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!scheduleId || !schedule) {
        throw new Error('Invalid schedule data');
      }
      
      const bookingData = {
        scheduleId,
        seatNumbers: selectedSeats,
        totalAmount: calculateTotalPrice()
      };
      
      await bookingsApi.createBooking(bookingData);

      toast({
        title: "Booking successful!",
        description: `You have booked ${selectedSeats.length} seat(s): ${selectedSeats.join(", ")}`,
      });
      
      // Navigate to booking history
      navigate('/booking-history');
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalPrice = () => {
    return schedule ? (schedule.price * selectedSeats.length) : 0;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Your Seats</h1>
          {schedule && (
            <p className="text-gray-600">
              {schedule.route.origin} to {schedule.route.destination} • {formatDate(schedule.departureTime)} • {formatTime(schedule.departureTime)}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
          </div>
        ) : schedule ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seat Selection Map */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Bus Seating Layout</CardTitle>
                <CardDescription>Select your preferred seats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-200 p-2 rounded-md w-full max-w-md">
                    <div className="bg-gray-300 p-2 rounded-md text-center mb-8">
                      DRIVER
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                      {seatMap.map((seat) => (
                        <div 
                          key={seat.id}
                          onClick={() => toggleSeatSelection(seat.id, seat.number, seat.isAvailable)}
                          className={`
                            aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer relative
                            ${!seat.isAvailable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                              selectedSeats.includes(seat.number) ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'}
                          `}
                        >
                          {seat.number}
                          {selectedSeats.includes(seat.number) && (
                            <Check className="absolute top-1 right-1 h-3 w-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-8">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-white border border-gray-300 rounded-sm mr-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-green-500 rounded-sm mr-2"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-300 rounded-sm mr-2"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Bus Type:</span>
                  <span className="font-medium">{schedule.bus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Departure:</span>
                  <span className="font-medium">{formatTime(schedule.departureTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Arrival:</span>
                  <span className="font-medium">{formatTime(schedule.arrivalTime)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Price per seat:</span>
                    <span className="font-medium">${schedule.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Selected seats:</span>
                    <span className="font-medium">
                      {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between mt-4 text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-bus-600">${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  disabled={selectedSeats.length === 0}
                  onClick={handleBooking}
                >
                  Complete Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Schedule not found</h3>
            <p className="text-gray-500 mb-6">The schedule you're looking for doesn't exist or has been removed</p>
            <Button onClick={() => navigate("/routes")}>Browse Routes</Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SeatSelection;
