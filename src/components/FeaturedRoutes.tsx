
import React from "react";
import { MapPin, Clock, Calendar, Bus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FeaturedRoutes: React.FC = () => {
  const routes = [
    {
      id: 1,
      from: "New York",
      to: "Boston",
      price: "$45",
      duration: "4h 30m",
      departureTime: "08:00 AM",
      amenities: ["WiFi", "USB Ports", "AC"],
      popular: true,
    },
    {
      id: 2,
      from: "Chicago",
      to: "Detroit",
      price: "$35",
      duration: "5h 15m",
      departureTime: "07:30 AM",
      amenities: ["WiFi", "USB Ports", "Snacks"],
      popular: false,
    },
    {
      id: 3,
      from: "Los Angeles",
      to: "San Francisco",
      price: "$65",
      duration: "7h 45m",
      departureTime: "06:00 AM",
      amenities: ["WiFi", "USB Ports", "Reclining Seats", "AC"],
      popular: true,
    },
    {
      id: 4,
      from: "Dallas",
      to: "Houston",
      price: "$30",
      duration: "3h 45m",
      departureTime: "09:15 AM",
      amenities: ["WiFi", "USB Ports", "AC"],
      popular: false,
    },
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Popular Routes</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most booked routes with comfortable buses, affordable prices, and convenient schedules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {routes.map((route) => (
          <Card key={route.id} className="bus-card hover:-translate-y-1 transition-all duration-200">
            {route.popular && (
              <Badge className="absolute top-3 right-3 bg-amber-800">
                Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-lg font-semibold">{route.price}</span>
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
              <div className="flex flex-wrap gap-2">
                {route.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-bus-800 hover:bg-bus-700 text-white">
                View Schedule
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-10">
        <Button variant="outline" className="border-bus-800 text-bus-800 hover:bg-bus-50">
          View All Routes
        </Button>
      </div>
    </div>
  );
};

export default FeaturedRoutes;
