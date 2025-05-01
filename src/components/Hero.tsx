import React, { useState } from "react";
import { MapPin, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Hero: React.FC = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!departure.trim() || !destination.trim() || !date.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API endpoint
    // We'll redirect to schedules page with query parameters
    navigate(
      `/schedules?from=${departure}&to=${destination}&date=${date}&passengers=${passengers}`
    );
  };

  return (
    <div className="relative bg-bus-800 text-white">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-bus-800/90 to-bus-800/70 z-0"></div>

      {/* Background image would be here in production */}
      <div className="relative z-10 px-4 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Your Journey Begins Here
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover affordable and comfortable bus travel across all regions
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto animate-slide-up">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="departure"
                  className="text-sm font-medium text-gray-700"
                >
                  Departure
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="departure"
                    placeholder="From: City or Station"
                    className="pl-10 bg-gray-5 text-black"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="destination"
                  className="text-sm font-medium text-gray-700"
                >
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="destination"
                    placeholder="To: City or Station"
                    className="pl-10 bg-gray-50 text-black"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-gray-700"
                >
                  Travel Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10 bg-gray-50 text-black"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="passengers"
                  className="text-sm font-medium text-gray-700"
                >
                  Passengers
                </label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger className="bg-gray-50 text-black">
                    <SelectValue placeholder="Number of passengers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-bus-800 hover:bg-bus-700 w-full md:w-auto text-white py-6 px-8 text-lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Buses
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
