
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from 'lucide-react';

const Schedules = () => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
    // This would connect to your backend API to get actual schedules
  };

  // Demo data for schedules - this would come from your API
  const schedules = [
    {
      id: 1,
      from: "New York",
      to: "Boston",
      departureTime: "07:00 AM",
      arrivalTime: "11:30 AM",
      duration: "4h 30m",
      price: "$45",
      busType: "Express",
      availableSeats: 23
    },
    {
      id: 2,
      from: "New York",
      to: "Boston",
      departureTime: "09:30 AM",
      arrivalTime: "02:00 PM",
      duration: "4h 30m",
      price: "$45",
      busType: "Express",
      availableSeats: 15
    },
    {
      id: 3,
      from: "New York",
      to: "Boston",
      departureTime: "12:00 PM",
      arrivalTime: "04:30 PM",
      duration: "4h 30m",
      price: "$45",
      busType: "Express",
      availableSeats: 31
    },
    {
      id: 4,
      from: "New York",
      to: "Boston",
      departureTime: "03:30 PM",
      arrivalTime: "08:00 PM",
      duration: "4h 30m",
      price: "$45",
      busType: "Standard",
      availableSeats: 28
    },
    {
      id: 5,
      from: "New York",
      to: "Boston",
      departureTime: "06:00 PM",
      arrivalTime: "10:30 PM",
      duration: "4h 30m",
      price: "$55",
      busType: "Premium",
      availableSeats: 12
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="bg-bus-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">Bus Schedules</h1>
            <p className="text-xl max-w-3xl mx-auto text-center">
              Find and book the perfect bus schedule for your regional travel needs.
            </p>
          </div>
        </div>
        
        {/* Search Form */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Find Bus Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fromCity">From</Label>
                      <Input 
                        id="fromCity" 
                        placeholder="Departure city" 
                        value={fromCity} 
                        onChange={(e) => setFromCity(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="toCity">To</Label>
                      <Input 
                        id="toCity" 
                        placeholder="Arrival city" 
                        value={toCity} 
                        onChange={(e) => setToCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Label htmlFor="date">Departure Date</Label>
                    <div className="relative">
                      <Input 
                        id="date" 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                        className="pl-10"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Label>Bus Type (Optional)</Label>
                    <RadioGroup defaultValue="all" className="flex space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express">Express</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="premium" id="premium" />
                        <Label htmlFor="premium">Premium</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6">Search Schedules</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Schedule Results */}
        {searchPerformed && (
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold mb-6">
                Available Schedules: {fromCity} to {toCity}
              </h2>
              
              <div className="space-y-4">
                {schedules.map(schedule => (
                  <Card key={schedule.id} className="overflow-hidden">
                    <div className="h-1 bg-bus-800"></div>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-6 flex flex-col justify-center items-center">
                          <span className="text-sm text-muted-foreground">Departure</span>
                          <span className="text-2xl font-bold">{schedule.departureTime}</span>
                          <span className="text-sm mt-2">{schedule.from}</span>
                        </div>
                        
                        <div className="p-6 flex flex-col justify-center">
                          <span className="text-sm text-muted-foreground">Duration</span>
                          <span className="font-medium">{schedule.duration}</span>
                          <div className="flex items-center mt-2">
                            <div className="h-0.5 flex-grow bg-gray-300"></div>
                            <span className="mx-2 text-xs text-muted-foreground">Direct</span>
                            <div className="h-0.5 flex-grow bg-gray-300"></div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 flex flex-col justify-center items-center">
                          <span className="text-sm text-muted-foreground">Arrival</span>
                          <span className="text-2xl font-bold">{schedule.arrivalTime}</span>
                          <span className="text-sm mt-2">{schedule.to}</span>
                        </div>
                        
                        <div className="p-6 flex flex-col justify-between items-center border-t md:border-t-0 md:border-l border-gray-100">
                          <div className="text-center mb-2">
                            <span className="text-2xl font-bold text-bus-800">{schedule.price}</span>
                            <div className="text-sm text-muted-foreground">{schedule.busType}</div>
                            <div className="text-xs mt-1">
                              {schedule.availableSeats} seats available
                            </div>
                          </div>
                          <Button className="w-full">Book Now</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm">
                        <div className="flex justify-between">
                          <div>
                            <span className="text-muted-foreground">Amenities:</span>
                            <span className="ml-2">WiFi, Power outlets, Air conditioning</span>
                          </div>
                          <Button variant="link" size="sm" className="text-bus-800">
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {schedules.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">No schedules found for your search criteria.</p>
                  <p className="mt-2">Try different dates or locations.</p>
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Schedule Info */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 text-center">Schedule Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Bus Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Standard</h3>
                    <p className="text-muted-foreground">
                      Our basic service with comfortable seating, air conditioning, and onboard restrooms.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Express</h3>
                    <p className="text-muted-foreground">
                      Fewer stops and faster travel times, with all Standard amenities plus free WiFi.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Premium</h3>
                    <p className="text-muted-foreground">
                      Our luxury service with extra legroom, power outlets, complimentary snacks, and priority boarding.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Check-in</h3>
                    <p className="text-muted-foreground">
                      Please arrive at least 30 minutes before departure for check-in and boarding.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Baggage</h3>
                    <p className="text-muted-foreground">
                      Each passenger is allowed one suitcase (max 50lbs) and one carry-on item.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Schedule Changes</h3>
                    <p className="text-muted-foreground">
                      Schedules may vary on holidays. Check for updates before your travel date.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Schedules;
