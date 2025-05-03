
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from './ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.'
    });
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Routes', path: '/routes' },
    { name: 'Schedules', path: '/schedules' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-bus-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 17h2V5H3v12h2" />
                  <path d="M14 17H9" />
                  <circle cx="6.5" cy="17.5" r="2.5" />
                  <circle cx="16.5" cy="17.5" r="2.5" />
                  <path d="M3 9h18" />
                </svg>
                <span className="ml-2 text-xl font-bold text-bus-800">JourneyHub</span>
              </div>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "border-bus-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 bg-gradient-to-r from-bus-700 to-bus-800 text-white rounded-full pl-3 pr-2 py-1.5 hover:shadow-lg transition-all duration-300 ring-offset-2 hover:ring-2 ring-bus-300 hover:opacity-90">
                    <span className="font-medium text-sm">{user.firstName}</span>
                    <Avatar className="h-7 w-7 border-2 border-white bg-bus-600">
                      <AvatarFallback className="text-xs bg-bus-600 text-white">
                        {getInitials(user.firstName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 p-1">
                  <div className="flex items-center gap-2 p-2 mb-1 bg-bus-50 rounded-md">
                    <Avatar className="h-9 w-9 border border-bus-100">
                      <AvatarFallback className="bg-bus-600 text-white">
                        {getInitials(user.firstName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  
                  <DropdownMenuItem className="py-2 cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="py-2 cursor-pointer" onClick={() => navigate('/booking-history')}>
                    <History className="mr-2 h-4 w-4" />
                    <span>Booking History</span>
                  </DropdownMenuItem>
                  
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="py-2 cursor-pointer font-medium" onClick={() => navigate('/admin')}>
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-bus-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "bg-bus-50 border-bus-500 text-bus-700 block pl-3 pr-4 py-2 border-l-4 font-medium"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 font-medium"
                }
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center px-4 py-2 bg-bus-50">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10 border-2 border-white">
                      <AvatarFallback className="bg-bus-600 text-white">
                        {getInitials(user.firstName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm font-medium text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/booking-history"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Booking History
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-2 space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate('/register');
                    setIsOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
