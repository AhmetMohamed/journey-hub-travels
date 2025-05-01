
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";
import { schedulesApi } from '@/services/api';
import { formatDate, formatTime } from '@/lib/utils/dateUtils';

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
}

const Schedules: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const from = queryParams.get('from') || '';
    const to = queryParams.get('to') || '';
    const date = queryParams.get('date') || '';
    
    fetchSchedules(from, to, date);
  }, [location.search]);
  
  const fetchSchedules = async (from: string, to: string, date: string) => {
    setLoading(true);
    try {
      // Create params object for API call
      const params: Record<string, string> = {};
      if (from) params.origin = from;
      if (to) params.destination = to;
      if (date) params.date = date;
      
      const data = await schedulesApi.getAllSchedules(params);
      setSchedules(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Failed to load schedules. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const calculateTravelTime = (departure: string, arrival: string): string => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    const diffInMinutes = Math.floor((arrivalDate.getTime() - departureDate.getTime()) / 60000);
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };
  
  const getBusTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'express': return "bg-amber-500";
      case 'premium': return "bg-purple-500";
      default: return "bg-blue-500";
    }
  };

  const handleSelectBus = (scheduleId: string) => {
    navigate(`/seat-selection/${scheduleId}`);
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
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          schedules.length > 0 ? (
            <div className="grid gap-6">
              {schedules.map((schedule) => (
                <Card key={schedule._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Time and Route Information */}
                      <div className="flex-grow p-6">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(schedule.departureTime)}</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                              <span className="text-2xl font-bold">{formatTime(schedule.departureTime)}</span>
                              <div className="flex-grow border-t border-dashed border-gray-300 mx-2 relative">
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-500">
                                  {calculateTravelTime(schedule.departureTime, schedule.arrivalTime)}
                                </div>
                              </div>
                              <span className="text-2xl font-bold">{formatTime(schedule.arrivalTime)}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{schedule.route.origin}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{schedule.route.destination}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge className={`mb-2 ${getBusTypeColor(schedule.bus)}`}>
                              {schedule.bus}
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
                            <Button 
                              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700"
                              onClick={() => handleSelectBus(schedule._id)}
                            >
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

export default Schedules;
