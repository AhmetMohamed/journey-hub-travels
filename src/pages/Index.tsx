
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedRoutes from '@/components/FeaturedRoutes';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedRoutes />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
