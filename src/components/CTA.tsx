
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA: React.FC = () => {
  return (
    <div className="bg-teal-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Book your bus tickets today and experience comfortable, affordable regional travel with JourneyHub.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-white text-teal-800 hover:bg-gray-100 py-6 px-8 text-lg">
            Book Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-teal-700 py-6 px-8 text-lg">
            View Routes
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <h3 className="text-3xl font-bold">1000+</h3>
            <p className="text-sm opacity-90">Daily Routes</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">500+</h3>
            <p className="text-sm opacity-90">Destinations</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">10M+</h3>
            <p className="text-sm opacity-90">Happy Travelers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
