
import React from "react";
import { MapPin, Shield, Ticket, Heart, Phone, Star } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="mb-4 p-3 rounded-full bg-bus-100 text-bus-800">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Extensive Network",
      description: "Access to hundreds of destinations across the country with our vast bus network.",
    },
    {
      icon: <Ticket className="h-8 w-8" />,
      title: "Easy Booking",
      description: "Book your tickets in minutes with our simple and user-friendly booking system.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe Travel",
      description: "Your safety is our priority with regular vehicle maintenance and professional drivers.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Comfort First",
      description: "Travel in comfort with spacious seating, climate control, and modern amenities.",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Loyalty Rewards",
      description: "Earn points on every trip and redeem them for free tickets and special offers.",
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Our customer support team is available round the clock to assist you.",
    },
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose JourneyHub</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing you with the best bus travel experience across all regions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
