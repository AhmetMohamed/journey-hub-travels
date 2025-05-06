
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Users, 
  Calendar, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Route, 
  Settings, 
  User,
  Bus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const initials = user ? 
    `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}` : 
    'AD';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/bookings', icon: <Calendar size={20} />, label: 'Bookings' },
    { path: '/admin/routes', icon: <Route size={20} />, label: 'Routes' },
    { path: '/admin/schedules', icon: <Calendar size={20} />, label: 'Schedules' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/reports', icon: <BarChart size={20} />, label: 'Reports' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar with updated styling */}
      <div
        className={`bg-gradient-to-b from-indigo-900 to-indigo-700 shadow-xl transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-indigo-600">
          <div className={`flex items-center ${sidebarOpen ? 'block' : 'hidden'}`}>
            <Bus size={24} className="text-white mr-2" />
            <h1 className="text-xl font-bold text-white">
              SahalBus
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-600" onClick={toggleSidebar}>
            <Menu size={20} />
          </Button>
        </div>

        <div className="flex flex-col flex-1">
          <nav className="flex-1 pt-4">
            {menuItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <div
                  className={`flex items-center px-4 py-3 mb-2 mx-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 mt-auto border-t border-indigo-600">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full relative flex items-center gap-2 p-2 hover:bg-indigo-600 rounded-lg text-white">
                  <Avatar className="h-9 w-9 border-2 border-white">
                    <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback className="bg-white text-indigo-800">{initials}</AvatarFallback>
                  </Avatar>
                  {sidebarOpen && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{`${user?.firstName} ${user?.lastName}`}</span>
                      <span className="text-xs text-indigo-200">Administrator</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{`${user?.firstName} ${user?.lastName}`}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <Card className="m-4 flex-1 shadow-sm">{children}</Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
