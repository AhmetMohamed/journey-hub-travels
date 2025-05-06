
import React, { useState, useEffect } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Animation trigger after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
    navigate(
      `/schedules?from=${departure}&to=${destination}&date=${date}&passengers=${passengers}`
    );
  };

  return (
    <div className="relative min-h-[85vh] flex items-center bg-gradient-to-r from-bus-800 to-bus-700 text-white overflow-hidden">
      {/* Abstract shapes for background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-bus-600/30 blur-3xl transform animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl transform animate-pulse delay-1000"></div>
      </div>

      <div className={`absolute inset-0 bg-bus-800/50 backdrop-blur-sm z-0 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="relative z-10 px-4 py-20 md:py-32 max-w-7xl mx-auto w-full">
        <div className={`text-center mb-12 transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-primary">
            Your Journey Begins Here
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Discover affordable and comfortable bus travel across all regions with SahalBus
          </p>
        </div>

        {/* Search Form */}
        <div className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} border border-white/20`}>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="departure"
                  className="text-sm font-medium text-white/90"
                >
                  Departure
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                  <Input
                    id="departure"
                    placeholder="From: City or Station"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="destination"
                  className="text-sm font-medium text-white/90"
                >
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                  <Input
                    id="destination"
                    placeholder="To: City or Station"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-white/90"
                >
                  Travel Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10 bg-white/10 border-white/20 text-white focus:bg-white/20 transition-all"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="passengers"
                  className="text-sm font-medium text-white/90"
                >
                  Passengers
                </label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:bg-white/20 transition-all">
                    <SelectValue placeholder="Number of passengers" />
                  </SelectTrigger>
                  <SelectContent className="bg-bus-800 border-white/20 text-white">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="focus:bg-white/20 focus:text-white">
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 w-full md:w-auto text-white py-6 px-8 text-lg shadow-lg hover:shadow-amber-500/20 transition-all duration-300 rounded-xl"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Buses
              </Button>
            </div>
          </form>
        </div>
        
        {/* Floating badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {[
            { text: "24/7 Customer Support", delay: "delay-500" },
            { text: "500+ Routes Available", delay: "delay-600" },
            { text: "100% Safe Travels", delay: "delay-700" },
          ].map((badge, index) => (
            <div 
              key={index}
              className={`bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg transition-all duration-1000 transform ${badge.delay} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <span className="text-white/90">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
