
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Map, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// This is demo data that would be fetched from your backend
const routesData = [
  {
    id: 1,
    from: "New York",
    to: "Boston",
    duration: "4h 30m",
    distance: "215 miles",
    price: "$45",
    departureTime: ["07:00 AM", "09:30 AM", "12:00 PM", "03:30 PM", "06:00 PM"],
    frequency: "Daily",
    popular: true
  },
  {
    id: 2,
    from: "Chicago",
    to: "Milwaukee",
    duration: "1h 45m",
    distance: "92 miles",
    price: "$25",
    departureTime: ["06:30 AM", "10:00 AM", "02:30 PM", "06:00 PM"],
    frequency: "Daily",
    popular: true
  },
  {
    id: 3,
    from: "Los Angeles",
    to: "San Diego",
    duration: "2h 15m",
    distance: "120 miles",
    price: "$30",
    departureTime: ["08:00 AM", "11:30 AM", "03:00 PM", "07:30 PM"],
    frequency: "Daily",
    popular: true
  },
  {
    id: 4,
    from: "Seattle",
    to: "Portland",
    duration: "3h 00m",
    distance: "174 miles",
    price: "$35",
    departureTime: ["07:30 AM", "12:30 PM", "05:00 PM"],
    frequency: "Daily",
    popular: false
  },
  {
    id: 5,
    from: "Miami",
    to: "Orlando",
    duration: "3h 45m",
    distance: "235 miles",
    price: "$40",
    departureTime: ["06:00 AM", "09:00 AM", "01:00 PM", "04:30 PM"],
    frequency: "Daily",
    popular: true
  },
  {
    id: 6,
    from: "Dallas",
    to: "Houston",
    duration: "3h 30m",
    distance: "239 miles",
    price: "$35",
    departureTime: ["07:00 AM", "11:30 AM", "04:00 PM", "08:00 PM"],
    frequency: "Daily",
    popular: false
  },
  {
    id: 7,
    from: "Denver",
    to: "Colorado Springs",
    duration: "1h 15m",
    distance: "70 miles",
    price: "$20",
    departureTime: ["08:30 AM", "01:00 PM", "06:30 PM"],
    frequency: "Daily",
    popular: false
  },
  {
    id: 8,
    from: "Philadelphia",
    to: "Washington DC",
    duration: "2h 30m",
    distance: "139 miles",
    price: "$30",
    departureTime: ["06:45 AM", "10:15 AM", "02:45 PM", "07:15 PM"],
    frequency: "Daily",
    popular: true
  }
];

const Routes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState(routesData);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = routesData.filter(route => 
      route.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
      route.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredRoutes(filtered);
  };

  const handleViewSchedule = (from: string, to: string) => {
    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    
    navigate(`/schedules?from=${from}&to=${to}&date=${formattedDate}&passengers=1`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="bg-bus-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">Our Routes</h1>
            <p className="text-xl max-w-3xl mx-auto text-center">
              Discover our extensive network of bus routes connecting major cities and regional destinations.
            </p>
            
            <div className="max-w-xl mx-auto mt-8">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search by origin or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white text-black"
                />
                <Button type="submit">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Popular Routes */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-8">Popular Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutes
                .filter(route => route.popular)
                .map(route => (
                  <Card key={route.id} className="overflow-hidden">
                    <div className="h-2 bg-bus-800"></div>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span className="text-lg font-semibold">{route.from} to {route.to}</span>
                        <span className="text-lg font-bold text-bus-800">{route.price}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{route.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Map className="h-4 w-4 mr-1" />
                          <span>{route.distance}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{route.frequency}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Departure Times</h4>
                        <div className="flex flex-wrap gap-2">
                          {route.departureTime.map((time, idx) => (
                            <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-6"
                        onClick={() => handleViewSchedule(route.from, route.to)}
                      >
                        View Schedule
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
        
        <Separator />
        
        {/* All Routes */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-8">All Routes</h2>
            
            {filteredRoutes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No routes found matching your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFilteredRoutes(routesData)}
                >
                  View All Routes
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[600px] rounded-md border">
                <div className="p-4">
                  {filteredRoutes.map((route, idx) => (
                    <React.Fragment key={route.id}>
                      <div className="py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-xl font-semibold">{route.from} to {route.to}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{route.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <Map className="h-4 w-4 mr-1" />
                                <span>{route.distance}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:items-end">
                            <span className="text-xl font-bold text-bus-800">{route.price}</span>
                            <span className="text-sm text-muted-foreground">{route.frequency}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Departure Times</h4>
                          <div className="flex flex-wrap gap-2">
                            {route.departureTime.map((time, timeIdx) => (
                              <Button key={timeIdx} variant="outline" size="sm" className="text-xs">
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button onClick={() => handleViewSchedule(route.from, route.to)}>Book Now</Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleViewSchedule(route.from, route.to)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      {idx < filteredRoutes.length - 1 && <Separator className="my-4" />}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </section>
        
        {/* Route Map */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-8">Our Route Network</h2>
            <div className="aspect-[16/9] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive route map would be displayed here</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Routes;
