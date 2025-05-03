
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
  User
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
      {/* Sidebar */}
      <div
        className={`bg-white border-r transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className={`text-xl font-bold ${sidebarOpen ? 'block' : 'hidden'}`}>
            Admin Panel
          </h1>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu size={20} />
          </Button>
        </div>

        <div className="flex flex-col flex-1">
          <nav className="flex-1">
            {menuItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <div
                  className={`flex items-center px-4 py-3 hover:bg-gray-100 ${
                    location.pathname === item.path
                      ? 'bg-gray-100 border-l-4 border-blue-500'
                      : ''
                  }`}
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full relative flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback className="bg-purple-600 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  {sidebarOpen && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{`${user?.firstName} ${user?.lastName}`}</span>
                      <span className="text-xs text-gray-500">Administrator</span>
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
