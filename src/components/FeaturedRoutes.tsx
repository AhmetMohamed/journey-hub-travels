
import React from "react";
import { MapPin, Clock, Calendar, Bus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const FeaturedRoutes: React.FC = () => {
  const navigate = useNavigate();
  
  const routes = [
    {
      id: 1,
      from: "Hargeisa",
      to: "Borama",
      price: "$15",
      duration: "2h 30m",
      departureTime: "08:00 AM",
      amenities: ["WiFi", "USB Ports", "AC"],
      popular: true,
      description: "Scenic route with comfortable buses and refreshment stops",
    },
    {
      id: 2,
      from: "Hargeisa",
      to: "Berbera",
      price: "$12",
      duration: "3h 15m",
      departureTime: "07:30 AM",
      amenities: ["WiFi", "USB Ports", "Snacks"],
      popular: true,
      description: "Beach-bound journey with ocean views",
    },
    {
      id: 3,
      from: "Burco",
      to: "Hargeisa",
      price: "$20",
      duration: "4h 15m",
      departureTime: "06:00 AM",
      amenities: ["WiFi", "USB Ports", "Reclining Seats", "AC"],
      popular: true,
      description: "Mountain views with luxury seating and amenities",
    },
    {
      id: 4,
      from: "Hargeisa",
      to: "Gabiley",
      price: "$8",
      duration: "1h 15m",
      departureTime: "09:15 AM",
      amenities: ["WiFi", "USB Ports", "AC"],
      popular: true,
      description: "Quick countryside route with regular departures",
    },
  ];

  const handleViewSchedule = (from: string, to: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];
    navigate(`/schedules?from=${from}&to=${to}&date=${formattedDate}&passengers=1`);
  };

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Popular Routes in Somaliland</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most booked routes with comfortable buses, affordable prices, and convenient schedules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {routes.map((route) => (
          <Card 
            key={route.id} 
            className="group relative overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            {route.popular && (
              <Badge className="absolute top-3 right-3 bg-amber-600 z-10">
                Popular
              </Badge>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-bus-800/5 to-bus-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span className="text-lg font-bold text-bus-800">{route.price}</span>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {route.duration}
                </span>
              </CardTitle>
              <CardDescription className="text-lg font-medium flex gap-1 mt-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-bus-800 mr-1" />
                  {route.from}
                </div>
                <span className="mx-2">→</span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-bus-800 mr-1" />
                  {route.to}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Bus className="h-4 w-4 mr-2" />
                <span>Daily departures at {route.departureTime}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {route.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                    {amenity}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 group-hover:text-gray-800 transition-colors">
                {route.description}
              </p>
            </CardContent>
            <CardFooter className="pt-1">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    className="w-full bg-bus-700 hover:bg-bus-800 text-white group-hover:shadow-md transition-all duration-300 flex items-center justify-center"
                    onClick={() => handleViewSchedule(route.from, route.to)}
                  >
                    <span className="mr-2">View Schedule</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 p-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Route Details</h4>
                    <p className="text-xs">Daily departures with comfortable air-conditioned buses.</p>
                    <div className="text-xs text-muted-foreground">
                      <p>Distance: ~{Math.floor(Math.random() * 100) + 50}km</p>
                      <p>Standard fare: {route.price}</p>
                      <p>Premium fare: ${parseInt(route.price.replace('$', '')) + 10}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-10">
        <Button 
          variant="outline" 
          className="border-bus-800 text-bus-800 hover:bg-bus-50 group flex items-center gap-2"
          onClick={() => navigate('/routes')}
        >
          View All Routes
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </div>
  );
};

export default FeaturedRoutes;
