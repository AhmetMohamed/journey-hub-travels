
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Search, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-bus-800" />
            <span className="text-xl font-bold text-bus-800">JourneyHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-bus-800 transition-colors">
            Home
          </Link>
          <Link to="/routes" className="text-sm font-medium hover:text-bus-800 transition-colors">
            Routes
          </Link>
          <Link to="/schedules" className="text-sm font-medium hover:text-bus-800 transition-colors">
            Schedules
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-bus-800 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-bus-800 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <Button className="bg-bus-800 hover:bg-bus-700 text-white">
            <User className="mr-2 h-4 w-4" />
            <span>Sign In</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex md:hidden p-2"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background flex flex-col md:hidden">
            <nav className="flex flex-col p-6 gap-6">
              <Link
                to="/"
                className="text-lg font-medium hover:text-bus-800 transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/routes"
                className="text-lg font-medium hover:text-bus-800 transition-colors"
                onClick={toggleMenu}
              >
                Routes
              </Link>
              <Link
                to="/schedules"
                className="text-lg font-medium hover:text-bus-800 transition-colors"
                onClick={toggleMenu}
              >
                Schedules
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium hover:text-bus-800 transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium hover:text-bus-800 transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </Link>

              <div className="flex flex-col gap-4 mt-4">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search</span>
                </Button>
                <Button className="w-full bg-bus-800 hover:bg-bus-700 justify-start">
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
