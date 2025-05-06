
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedRoutes from '@/components/FeaturedRoutes';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animation for sections as they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe all section elements
    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main>
        <div ref={el => sectionsRef.current[0] = el} 
             className="opacity-0 transition-all duration-700 ease-out">
          <Hero />
        </div>
        
        <div ref={el => sectionsRef.current[1] = el} 
             className="opacity-0 transition-all duration-700 ease-out delay-100">
          <FeaturedRoutes />
        </div>
        
        <div ref={el => sectionsRef.current[2] = el} 
             className="opacity-0 transition-all duration-700 ease-out delay-200">
          <Features />
        </div>
        
        <div ref={el => sectionsRef.current[3] = el} 
             className="opacity-0 transition-all duration-700 ease-out delay-300">
          <CTA />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
