
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Bus, LayoutDashboard, Map, Calendar, Users, LogOut, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.'
    });
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Routes', path: '/admin/routes', icon: <Map className="h-5 w-5" /> },
    { name: 'Schedules', path: '/admin/schedules', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 -ml-64 md:w-20 md:ml-0'
        } fixed md:relative inset-y-0 left-0 z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center p-4 ${!isSidebarOpen && 'md:justify-center'}`}>
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-6 w-6 text-bus-800" />
              {isSidebarOpen && <span className="text-xl font-bold text-bus-800">JourneyHub</span>}
            </Link>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 mt-6">
            <div className="px-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? 'bg-bus-800 text-white' 
                      : 'hover:bg-gray-100'
                  } ${!isSidebarOpen && 'md:justify-center'}`}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              ))}
            </div>
          </nav>
          
          {/* Logout */}
          <div className={`p-4 ${!isSidebarOpen && 'md:flex md:justify-center'}`}>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="ml-4 text-lg font-medium">Admin Panel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    View Website
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
