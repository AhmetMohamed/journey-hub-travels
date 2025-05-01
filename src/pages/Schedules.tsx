
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Schedule {
  id: string;
  route: {
    from: string;
    to: string;
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  busType: string;
  availableSeats: number;
}

const Schedules: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating API call with demo data
    const from = queryParams.get('from') || '';
    const to = queryParams.get('to') || '';
    const date = queryParams.get('date') || '';
    
    // Simulate loading
    setTimeout(() => {
      setScheduleData([
        {
          id: "sch1",
          route: {
            from: from || "New York",
            to: to || "Boston"
          },
          departureTime: "08:00 AM",
          arrivalTime: "12:30 PM",
          price: 45.99,
          busType: "Express",
          availableSeats: 23
        },
        {
          id: "sch2",
          route: {
            from: from || "New York",
            to: to || "Boston"
          },
          departureTime: "10:15 AM",
          arrivalTime: "02:45 PM",
          price: 39.99,
          busType: "Standard",
          availableSeats: 31
        },
        {
          id: "sch3",
          route: {
            from: from || "New York",
            to: to || "Boston"
          },
          departureTime: "12:30 PM",
          arrivalTime: "05:00 PM",
          price: 42.99,
          busType: "Express",
          availableSeats: 15
        },
        {
          id: "sch4",
          route: {
            from: from || "New York",
            to: to || "Boston"
          },
          departureTime: "03:45 PM",
          arrivalTime: "08:15 PM",
          price: 52.99,
          busType: "Premium",
          availableSeats: 8
        }
      ]);
      setLoading(false);
    }, 1000);
    
    // Uncomment for real API implementation
    /*
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`/api/schedules?from=${from}&to=${to}&date=${date}`);
        const data = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedules();
    */
  }, [location.search]);
  
  const getBusTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'express': return "bg-amber-500";
      case 'premium': return "bg-purple-500";
      default: return "bg-blue-500";
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Available Bus Schedules</h1>
            {queryParams.get('from') && queryParams.get('to') && (
              <p className="text-gray-600">
                <span className="font-medium">{queryParams.get('from')}</span> to{" "}
                <span className="font-medium">{queryParams.get('to')}</span>
                {queryParams.get('date') && (
                  <> · <span>{queryParams.get('date')}</span></>
                )}
                {queryParams.get('passengers') && (
                  <> · <span>{queryParams.get('passengers')} passenger{parseInt(queryParams.get('passengers') || '1') > 1 ? 's' : ''}</span></>
                )}
              </p>
            )}
          </div>
          {/* Filter button could go here */}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          scheduleData.length > 0 ? (
            <div className="grid gap-6">
              {scheduleData.map((schedule) => (
                <Card key={schedule.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Time and Route Information */}
                      <div className="flex-grow p-6">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <Calendar className="h-4 w-4" />
                              <span>{queryParams.get('date') || "Today"}</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                              <span className="text-2xl font-bold">{schedule.departureTime}</span>
                              <div className="flex-grow border-t border-dashed border-gray-300 mx-2 relative">
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-500">
                                  {calculateTravelTime(schedule.departureTime, schedule.arrivalTime)}
                                </div>
                              </div>
                              <span className="text-2xl font-bold">{schedule.arrivalTime}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{schedule.route.from}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{schedule.route.to}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge className={`mb-2 ${getBusTypeColor(schedule.busType)}`}>
                              {schedule.busType}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="h-4 w-4" />
                              <span>{schedule.availableSeats} seats left</span>
                            </div>
                          </div>
                        </div>
                        <div className="border-t pt-4 flex flex-col md:flex-row justify-between items-center">
                          <div className="mb-4 md:mb-0">
                            <div className="text-xs text-gray-500">Price per person</div>
                            <div className="text-3xl font-bold text-teal-600">${schedule.price.toFixed(2)}</div>
                          </div>
                          <div className="w-full md:w-auto">
                            <Button className="w-full md:w-auto bg-teal-600 hover:bg-teal-700">
                              Select This Bus
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2">No schedules found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          )
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

export default Schedules;
