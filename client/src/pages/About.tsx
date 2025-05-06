
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="bg-bus-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">About JourneyHub</h1>
            <p className="text-xl max-w-3xl mx-auto text-center">
              Connecting regions and bringing people together with safe, reliable, and comfortable bus transportation since 2010.
            </p>
          </div>
        </div>
        
        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="mb-4">
                  JourneyHub began with a simple vision: to connect communities through accessible and reliable transportation. What started as a small fleet of buses serving just three regions has grown into a nationwide network connecting hundreds of destinations.
                </p>
                <p className="mb-4">
                  Our founder, Sarah Johnson, recognized the need for better regional bus services after experiencing firsthand the challenges of traveling between smaller cities. She launched JourneyHub in 2010 with just 5 buses and a commitment to customer satisfaction.
                </p>
                <p>
                  Today, we operate over 500 buses serving more than 300 destinations, but our core values remain unchanged: safety, reliability, comfort, and excellent customer service.
                </p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-6">Our Growth</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Destinations</span>
                      <span>300+</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Fleet Size</span>
                      <span>500+</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Daily Passengers</span>
                      <span>25,000+</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Team Members</span>
                      <span>1,200+</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Separator />
        
        {/* Mission & Vision */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-2xl font-semibold mb-4 text-bus-800">Our Mission</h3>
                <p>
                  To provide safe, affordable, and reliable bus transportation that connects communities and enhances mobility for all. We strive to make regional travel accessible, comfortable, and environmentally sustainable while delivering exceptional customer service.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-2xl font-semibold mb-4 text-bus-800">Our Vision</h3>
                <p>
                  To be the preferred transportation provider connecting every region of the country, recognized for our commitment to innovation, sustainability, and customer satisfaction. We aim to transform how people think about bus travel by making it the smart choice for regional transportation.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  position: "Founder & CEO",
                  bio: "Founded JourneyHub in 2010 with a vision to connect communities through accessible transportation."
                },
                {
                  name: "Michael Chen",
                  position: "Chief Operations Officer",
                  bio: "Oversees the daily operations of our fleet and ensures the highest standards of service and safety."
                },
                {
                  name: "Priya Patel",
                  position: "Chief Technology Officer",
                  bio: "Leads our digital transformation and innovation initiatives to enhance the customer experience."
                },
                {
                  name: "Robert Martinez",
                  position: "Chief Financial Officer",
                  bio: "Manages the financial health of JourneyHub and drives sustainable growth strategies."
                }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-bus-800 mb-2">{member.position}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-bus-800 text-white px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Safety First</h3>
                <p className="text-white/80">
                  We prioritize the safety of our passengers, employees, and everyone on the road. Our rigorous maintenance schedules and driver training programs ensure the highest safety standards.
                </p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Customer Satisfaction</h3>
                <p className="text-white/80">
                  We're committed to providing exceptional service at every touchpoint, from booking to arrival. Our goal is to exceed expectations and make every journey memorable.
                </p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Environmental Responsibility</h3>
                <p className="text-white/80">
                  We're dedicated to reducing our carbon footprint through fuel-efficient vehicles, route optimization, and sustainable business practices that protect our planet.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
