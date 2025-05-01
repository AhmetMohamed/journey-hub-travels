
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, MoreHorizontal, Plus, Search, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { schedulesApi, routesApi } from '@/services/api';
import { formatDate, formatTime } from '@/lib/utils/dateUtils';

interface Route {
  _id: string;
  name: string;
  origin: string;
  destination: string;
}

interface Schedule {
  _id: string;
  route: Route;
  departureTime: string;
  arrivalTime: string;
  bus: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  isActive: boolean;
}

const emptySchedule = {
  _id: '',
  route: {
    _id: '',
    name: '',
    origin: '',
    destination: ''
  },
  departureTime: '',
  arrivalTime: '',
  bus: 'Standard',
  price: 0,
  availableSeats: 0,
  totalSeats: 36,
  isActive: true
};

const AdminSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<any>(emptySchedule);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedulesData, routesData] = await Promise.all([
        schedulesApi.getAllSchedules(),
        routesApi.getAllRoutes()
      ]);
      
      setSchedules(schedulesData);
      setRoutes(routesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch schedules or routes.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSchedules = schedules.filter(schedule =>
    schedule.route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.bus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddScheduleClick = () => {
    setCurrentSchedule({
      ...emptySchedule,
      departureTime: new Date().toISOString().substring(0, 16),
      arrivalTime: new Date().toISOString().substring(0, 16)
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditScheduleClick = (schedule: Schedule) => {
    // Format datetime for input element
    const formattedDeparture = new Date(schedule.departureTime)
      .toISOString().substring(0, 16);
    const formattedArrival = new Date(schedule.arrivalTime)
      .toISOString().substring(0, 16);

    setCurrentSchedule({
      ...schedule,
      departureTime: formattedDeparture,
      arrivalTime: formattedArrival
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteScheduleClick = (schedule: Schedule) => {
    setCurrentSchedule(schedule);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSaveSchedule = async () => {
    if (!currentSchedule.route._id || !currentSchedule.departureTime || !currentSchedule.arrivalTime) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate that arrival is after departure
    if (new Date(currentSchedule.arrivalTime) <= new Date(currentSchedule.departureTime)) {
      toast({
        title: "Invalid times",
        description: "Arrival time must be after departure time",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare data for API
      const scheduleData = {
        routeId: currentSchedule.route._id,
        departureTime: currentSchedule.departureTime,
        arrivalTime: currentSchedule.arrivalTime,
        bus: currentSchedule.bus,
        price: currentSchedule.price,
        availableSeats: currentSchedule.availableSeats,
        totalSeats: currentSchedule.totalSeats,
        isActive: currentSchedule.isActive
      };
      
      if (isEditing) {
        // Update existing schedule
        const updatedSchedule = await schedulesApi.updateSchedule(currentSchedule._id, scheduleData);
        setSchedules(schedules.map(schedule => 
          schedule._id === currentSchedule._id ? updatedSchedule : schedule
        ));
        toast({
          title: "Schedule updated",
          description: `Schedule for ${updatedSchedule.route.origin} to ${updatedSchedule.route.destination} has been updated`
        });
      } else {
        // Add new schedule
        const newSchedule = await schedulesApi.createSchedule(scheduleData);
        setSchedules([...schedules, newSchedule]);
        toast({
          title: "Schedule added",
          description: `New schedule from ${newSchedule.route.origin} to ${newSchedule.route.destination} has been added`
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Error",
        description: isEditing ? "Failed to update schedule" : "Failed to create schedule",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      await schedulesApi.deleteSchedule(currentSchedule._id);
      setSchedules(schedules.filter(schedule => schedule._id !== currentSchedule._id));
      toast({
        title: "Schedule deleted",
        description: `Schedule from ${currentSchedule.route.origin} to ${currentSchedule.route.destination} has been deleted`
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const schedule = schedules.find(s => s._id === id);
      if (!schedule) return;

      const updatedSchedule = await schedulesApi.updateSchedule(id, { isActive });
      setSchedules(schedules.map(schedule => 
        schedule._id === id ? { ...schedule, isActive } : schedule
      ));
      
      toast({
        title: isActive ? "Schedule activated" : "Schedule deactivated",
        description: `Schedule from ${schedule.route.origin} to ${schedule.route.destination} has been ${isActive ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      console.error('Error toggling schedule active state:', error);
      toast({
        title: "Error",
        description: "Failed to update schedule status",
        variant: "destructive"
      });
    }
  };

  const handleRouteChange = (routeId: string) => {
    const selectedRoute = routes.find(r => r._id === routeId);
    if (selectedRoute) {
      setCurrentSchedule({
        ...currentSchedule,
        route: selectedRoute,
        availableSeats: currentSchedule.totalSeats
      });
    }
  };

  // Get bus type badge color
  const getBusTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'express': return "bg-amber-500";
      case 'premium': return "bg-purple-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Schedules</h1>
          <Button className="bg-bus-800" onClick={handleAddScheduleClick}>
            <Plus className="h-4 w-4 mr-2" /> Add New Schedule
          </Button>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search schedules..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="bg-white rounded-md shadow">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Bus Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule._id}>
                    <TableCell>
                      <div className="font-medium">{schedule.route.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {schedule.route.origin} to {schedule.route.destination}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(schedule.departureTime)}</div>
                      <div className="text-xs font-medium">{formatTime(schedule.departureTime)}</div>
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(schedule.arrivalTime)}</div>
                      <div className="text-xs font-medium">{formatTime(schedule.arrivalTime)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBusTypeColor(schedule.bus)}>
                        {schedule.bus}
                      </Badge>
                    </TableCell>
                    <TableCell>${schedule.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {schedule.availableSeats}/{schedule.totalSeats}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-bus-800 h-1.5 rounded-full" 
                          style={{ width: `${(schedule.availableSeats / schedule.totalSeats) * 100}%` }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={schedule.isActive}
                        onCheckedChange={(checked) => handleToggleActive(schedule._id, checked)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditScheduleClick(schedule)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteScheduleClick(schedule)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSchedules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No schedules found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add/Edit Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the schedule information' 
                : 'Fill in the details for the new schedule'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Select 
                value={currentSchedule.route._id} 
                onValueChange={handleRouteChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(route => (
                    <SelectItem key={route._id} value={route._id}>
                      {route.name} ({route.origin} to {route.destination})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input 
                  id="departureTime" 
                  type="datetime-local"
                  value={currentSchedule.departureTime}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, departureTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input 
                  id="arrivalTime" 
                  type="datetime-local"
                  value={currentSchedule.arrivalTime}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, arrivalTime: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bus">Bus Type</Label>
                <Select 
                  value={currentSchedule.bus} 
                  onValueChange={(value) => setCurrentSchedule({...currentSchedule, bus: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bus type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Ticket Price ($)</Label>
                <Input 
                  id="price" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentSchedule.price}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, price: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalSeats">Total Seats</Label>
                <Input 
                  id="totalSeats" 
                  type="number"
                  min="1"
                  value={currentSchedule.totalSeats}
                  onChange={(e) => {
                    const seats = parseInt(e.target.value);
                    setCurrentSchedule({
                      ...currentSchedule, 
                      totalSeats: seats,
                      availableSeats: isEditing ? Math.min(currentSchedule.availableSeats, seats) : seats
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableSeats">Available Seats</Label>
                <Input 
                  id="availableSeats" 
                  type="number"
                  min="0"
                  max={currentSchedule.totalSeats}
                  value={currentSchedule.availableSeats}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, availableSeats: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={currentSchedule.isActive}
                onCheckedChange={(checked) => setCurrentSchedule({...currentSchedule, isActive: checked})}
              />
              <Label htmlFor="isActive">Active Schedule</Label>
            </div>

            {currentSchedule.availableSeats > currentSchedule.totalSeats && (
              <div className="flex items-center p-3 bg-amber-50 text-amber-700 rounded-md">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Available seats cannot exceed total seats.</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
            <Button 
              className="bg-bus-800" 
              onClick={handleSaveSchedule}
              disabled={currentSchedule.availableSeats > currentSchedule.totalSeats}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the schedule from {currentSchedule.route.origin} to {currentSchedule.route.destination}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSchedule}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSchedules;
