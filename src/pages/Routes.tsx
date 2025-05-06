import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Map, Clock, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { routesApi } from "@/services/routesApi";

interface Route {
  id: number;
  name: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  price: string;
  departureTime: string[];
  frequency: string;
  popular: boolean;
}

interface Location {
  name: string;
  lat: number;
  lng: number;
}

const Routes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [routesData, setRoutesData] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Somaliland city coordinates
  const locations: Location[] = [
    { name: "Hargeisa", lat: 9.5582, lng: 44.0625 },
    { name: "Gabiley", lat: 9.7761, lng: 43.3464 },
    { name: "Wajale", lat: 9.6043, lng: 43.3333 },
    { name: "Borama", lat: 9.9311, lng: 43.1897 },
    { name: "Burco", lat: 9.5236, lng: 45.5336 },
    { name: "Berbera", lat: 10.4347, lng: 45.0165 },
    { name: "Erigavo", lat: 10.6267, lng: 47.3731 },
    { name: "Las anod", lat: 8.4774, lng: 47.3597 },
  ];

  // Initialize the map
  useEffect(() => {
    if (mapRef.current) {
      // Create a basic SVG map
      const mapContainer = mapRef.current;
      const width = mapContainer.clientWidth;
      const height = 400;
      
      // Calculate map bounds
      const minLng = Math.min(...locations.map(loc => loc.lng)) - 1;
      const maxLng = Math.max(...locations.map(loc => loc.lng)) + 1;
      const minLat = Math.min(...locations.map(loc => loc.lat)) - 0.5;
      const maxLat = Math.max(...locations.map(loc => loc.lat)) + 0.5;
      
      // Function to convert geo coordinates to SVG coordinates
      const projectToSvg = (lat: number, lng: number) => {
        const x = ((lng - minLng) / (maxLng - minLng)) * width;
        const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
        return [x, y];
      };
      
      // Create SVG element
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", `${height}px`);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      
      // Add a background
      const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      background.setAttribute("width", "100%");
      background.setAttribute("height", "100%");
      background.setAttribute("fill", "#e5f7ff");
      svg.appendChild(background);
      
      // Create a group for the border outline (simplified Somaliland shape)
      const border = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      // Very simplified border path (placeholder - not accurate)
      const borderPoints = [
        projectToSvg(11.5, 42.5),
        projectToSvg(11.0, 44.0),
        projectToSvg(10.5, 46.0),
        projectToSvg(11.0, 48.0),
        projectToSvg(10.0, 49.0),
        projectToSvg(8.0, 48.0),
        projectToSvg(8.0, 46.0),
        projectToSvg(9.0, 44.0),
        projectToSvg(9.0, 43.0),
        projectToSvg(10.0, 43.0),
        projectToSvg(11.0, 42.5),
      ];
      
      const path = `M${borderPoints.map(point => point.join(',')).join(' L')} Z`;
      border.setAttribute("d", path);
      border.setAttribute("fill", "#f0f9ff");
      border.setAttribute("stroke", "#93c5fd");
      border.setAttribute("stroke-width", "2");
      svg.appendChild(border);
      
      // Add markers and labels for each location
      locations.forEach((location, index) => {
        const [x, y] = projectToSvg(location.lat, location.lng);
        
        // Create marker group
        const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Add pulse animation
        const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pulse.setAttribute("cx", x.toString());
        pulse.setAttribute("cy", y.toString());
        pulse.setAttribute("r", "8");
        pulse.setAttribute("fill", "rgba(30, 64, 175, 0.3)");
        pulse.setAttribute("class", "pulse-animation");
        
        // Add animation
        const animatePulse = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animatePulse.setAttribute("attributeName", "r");
        animatePulse.setAttribute("values", "8;16;8");
        animatePulse.setAttribute("dur", "3s");
        animatePulse.setAttribute("repeatCount", "indefinite");
        pulse.appendChild(animatePulse);
        
        const animateOpacity = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animateOpacity.setAttribute("attributeName", "opacity");
        animateOpacity.setAttribute("values", "0.6;0.2;0.6");
        animateOpacity.setAttribute("dur", "3s");
        animateOpacity.setAttribute("repeatCount", "indefinite");
        pulse.appendChild(animateOpacity);
        
        markerGroup.appendChild(pulse);
        
        // Add marker
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        marker.setAttribute("cx", x.toString());
        marker.setAttribute("cy", y.toString());
        marker.setAttribute("r", "5");
        marker.setAttribute("fill", "#1e40af");
        marker.setAttribute("stroke", "white");
        marker.setAttribute("stroke-width", "2");
        markerGroup.appendChild(marker);
        
        // Add label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", (x + 10).toString());
        label.setAttribute("y", (y + 5).toString());
        label.setAttribute("font-size", "12px");
        label.setAttribute("font-family", "Arial, sans-serif");
        label.setAttribute("fill", "#1e3a8a");
        label.textContent = location.name;
        markerGroup.appendChild(label);
        
        // Make markers interactive
        markerGroup.setAttribute("style", "cursor: pointer;");
        markerGroup.addEventListener("click", () => {
          toast({
            title: location.name,
            description: `View routes from ${location.name}`,
          });
          setSearchTerm(location.name);
          handleSearch(new Event("submit") as any);
        });
        
        svg.appendChild(markerGroup);
      });
      
      // Add routes between major cities
      const routePairs = [
        ["Hargeisa", "Borama"],
        ["Hargeisa", "Berbera"],
        ["Hargeisa", "Burco"],
        ["Hargeisa", "Gabiley"],
        ["Hargeisa", "Wajale"],
        ["Burco", "Erigavo"],
        ["Burco", "Las anod"]
      ];
      
      // Draw route lines
      routePairs.forEach(pair => {
        const from = locations.find(l => l.name === pair[0]);
        const to = locations.find(l => l.name === pair[1]);
        
        if (from && to) {
          const [x1, y1] = projectToSvg(from.lat, from.lng);
          const [x2, y2] = projectToSvg(to.lat, to.lng);
          
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", x1.toString());
          line.setAttribute("y1", y1.toString());
          line.setAttribute("x2", x2.toString());
          line.setAttribute("y2", y2.toString());
          line.setAttribute("stroke", "#93c5fd");
          line.setAttribute("stroke-width", "2");
          line.setAttribute("stroke-dasharray", "4,2");
          svg.appendChild(line);
        }
      });
      
      // Add the SVG to the container
      mapContainer.innerHTML = '';
      mapContainer.appendChild(svg);
      
      // Add CSS for animations
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { r: 5; opacity: 0.6; }
          50% { r: 15; opacity: 0.2; }
          100% { r: 5; opacity: 0.6; }
        }
        .pulse-animation {
          animation: pulse 3s infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, [mapRef, toast]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  // 👇 Place this helper function outside fetchRoutes but inside Routes component
  const generateDepartureTimes = (routeName: string): string[] => {
    const baseTimes = [
      "06:00 AM",
      "09:00 AM",
      "12:00 PM",
      "03:00 PM",
      "06:00 PM",
    ];
    const offset = routeName.length % baseTimes.length;
    return [...baseTimes.slice(offset), ...baseTimes.slice(0, offset)];
  };

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      // Try to fetch from real API
      const data = await routesApi.getAllRoutes();
      const formattedRoutes = data.map((route) => ({
        id: route._id,
        name: route.name,
        from: route.origin,
        to: route.destination,
        duration: `${Math.floor(route.estimatedDuration / 60)}h ${
          route.estimatedDuration % 60
        }m`,
        distance: `${route.distance} miles`,
        price: `$${(
          route.price || 25 + Math.floor(route.distance / 10)
        ).toFixed(0)}`,
        departureTime: generateDepartureTimes(route.name),
        frequency: "Daily",
        popular: route.isPopular || Math.random() > 0.5,
      }));
      setRoutesData(formattedRoutes);
      setFilteredRoutes(formattedRoutes);

      setRoutesData(formattedRoutes);
      setFilteredRoutes(formattedRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast({
        title: "Error",
        description: "Failed to load routes data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const filtered = routesData.filter(
      (route) =>
        route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.to.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRoutes(filtered);
  };

  const handleViewSchedule = (from: string, to: string) => {
    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];

    navigate(
      `/schedules?from=${from}&to=${to}&date=${formattedDate}&passengers=1`
    );
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
              Discover our extensive network of bus routes connecting major
              cities and regional destinations across Somaliland.
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
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
          </div>
        ) : (
          <>
            {/* Popular Routes */}
            <section className="py-12 px-4">
              <div className="container mx-auto max-w-6xl">
                <h2 className="text-2xl font-bold mb-8">Popular Routes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRoutes
                    .filter((route) => route.popular)
                    .map((route) => (
                      <Card key={route.id} className="overflow-hidden">
                        <div className="h-2 bg-bus-800"></div>
                        <CardHeader>
                          <CardTitle className="flex justify-between items-start">
                            <span className="text-lg font-semibold">
                              {route.from} to {route.to}
                            </span>
                            <span className="text-lg font-bold text-bus-800">
                              {route.price}
                            </span>
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
                            <h4 className="text-sm font-medium mb-2">
                              Departure Times
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {route.departureTime.map((time, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-xs px-2 py-1 rounded"
                                >
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>

                          <Button
                            className="w-full mt-6"
                            onClick={() =>
                              handleViewSchedule(route.from, route.to)
                            }
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
                    <p className="text-xl text-muted-foreground">
                      No routes found matching your search criteria.
                    </p>
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
                                <h3 className="text-xl font-semibold">
                                  {route.from} to {route.to}
                                </h3>
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
                                <span className="text-xl font-bold text-bus-800">
                                  {route.price}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {route.frequency}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">
                                Departure Times
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {route.departureTime.map((time, timeIdx) => (
                                  <Button
                                    key={timeIdx}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <Button
                                onClick={() =>
                                  handleViewSchedule(route.from, route.to)
                                }
                              >
                                Book Now
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleViewSchedule(route.from, route.to)
                                }
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                          {idx < filteredRoutes.length - 1 && (
                            <Separator className="my-4" />
                          )}
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
                <h2 className="text-2xl font-bold mb-8">Somaliland Route Network</h2>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div ref={mapRef} className="w-full h-[400px] relative">
                    {/* SVG Map will be inserted here */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm text-muted-foreground text-center">
                      Click on any city to view available routes from that location
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Routes;
