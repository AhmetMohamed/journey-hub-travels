
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
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, MoreHorizontal, Plus, Search, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Mock data from our Routes API
const routes = [
  { id: 1, name: 'NYC-BOS-01', origin: 'New York', destination: 'Boston' },
  { id: 2, name: 'CHI-MIL-01', origin: 'Chicago', destination: 'Milwaukee' },
  { id: 3, name: 'LA-SD-01', origin: 'Los Angeles', destination: 'San Diego' },
  { id: 4, name: 'SEA-POR-01', origin: 'Seattle', destination: 'Portland' },
  { id: 5, name: 'MIA-ORL-01', origin: 'Miami', destination: 'Orlando' }
];

// Mock data for bus types
const busTypes = ['Standard', 'Express', 'Premium'];

// Mock data for schedules
const initialSchedules = [
  {
    id: 1,
    routeId: 1,
    departureTime: '2025-05-01T07:00:00',
    arrivalTime: '2025-05-01T11:30:00',
    bus: 'Express',
    price: 45,
    availableSeats: 23,
    totalSeats: 50,
    isActive: true
  },
  {
    id: 2,
    routeId: 1,
    departureTime: '2025-05-01T12:00:00',
    arrivalTime: '2025-05-01T16:30:00',
    bus: 'Standard',
    price: 40,
    availableSeats: 31,
    totalSeats: 50,
    isActive: true
  },
  {
    id: 3,
    routeId: 2,
    departureTime: '2025-05-01T06:30:00',
    arrivalTime: '2025-05-01T08:15:00',
    bus: 'Express',
    price: 25,
    availableSeats: 18,
    totalSeats: 40,
    isActive: true
  },
  {
    id: 4,
    routeId: 3,
    departureTime: '2025-05-01T08:00:00',
    arrivalTime: '2025-05-01T10:15:00',
    bus: 'Premium',
    price: 30,
    availableSeats: 22,
    totalSeats: 35,
    isActive: true
  },
  {
    id: 5,
    routeId: 5,
    departureTime: '2025-05-01T09:00:00',
    arrivalTime: '2025-05-01T12:45:00',
    bus: 'Express',
    price: 40,
    availableSeats: 27,
    totalSeats: 50,
    isActive: false
  }
];

interface Schedule {
  id: number;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  bus: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  isActive: boolean;
}

const emptySchedule: Schedule = {
  id: 0,
  routeId: 0,
  departureTime: '',
  arrivalTime: '',
  bus: '',
  price: 0,
  availableSeats: 0,
  totalSeats: 0,
  isActive: true
};

const AdminSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule>(emptySchedule);
  const [isEditing, setIsEditing] = useState(false);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>(initialSchedules);
  const { toast } = useToast();

  // Format datetime for display
  const formatDateTime = (dateTimeStr: string) => {
    const datetime = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(datetime);
  };

  // Format datetime for input
  const formatDateTimeForInput = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    const datetime = new Date(dateTimeStr);
    return datetime.toISOString().slice(0, 16);
  };

  // Get route name by ID
  const getRouteName = (routeId: number) => {
    const route = routes.find(r => r.id === routeId);
    return route 
      ? `${route.origin} to ${route.destination}` 
      : 'Unknown Route';
  };

  useEffect(() => {
    // Filter schedules by search term
    const filtered = schedules.filter(schedule => {
      const route = routes.find(r => r.id === schedule.routeId);
      return route ? (
        route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.bus.toLowerCase().includes(searchTerm.toLowerCase())
      ) : false;
    });
    setFilteredSchedules(filtered);
  }, [searchTerm, schedules]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddScheduleClick = () => {
    setCurrentSchedule(emptySchedule);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditScheduleClick = (schedule: Schedule) => {
    setCurrentSchedule(schedule);
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

  const handleSaveSchedule = () => {
    // Basic validation
    if (
      currentSchedule.routeId === 0 || 
      !currentSchedule.departureTime || 
      !currentSchedule.arrivalTime ||
      !currentSchedule.bus ||
      currentSchedule.price <= 0 ||
      currentSchedule.totalSeats <= 0
    ) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if arrival time is after departure time
    if (new Date(currentSchedule.arrivalTime) <= new Date(currentSchedule.departureTime)) {
      toast({
        title: "Invalid times",
        description: "Arrival time must be after departure time",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      // Update existing schedule
      setSchedules(schedules.map(schedule => 
        schedule.id === currentSchedule.id ? currentSchedule : schedule
      ));
      toast({
        title: "Schedule updated",
        description: `Schedule has been updated`
      });
    } else {
      // Add new schedule
      const newId = Math.max(...schedules.map(schedule => schedule.id)) + 1;
      setSchedules([...schedules, { ...currentSchedule, id: newId }]);
      toast({
        title: "Schedule added",
        description: `New schedule has been added`
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteSchedule = () => {
    setSchedules(schedules.filter(schedule => schedule.id !== currentSchedule.id));
    toast({
      title: "Schedule deleted",
      description: `Schedule has been deleted`
    });
    setIsDeleteDialogOpen(false);
  };

  const handleToggleActive = (id: number, isActive: boolean) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, isActive } : schedule
    ));
    
    toast({
      title: isActive ? "Schedule activated" : "Schedule deactivated",
      description: `Schedule has been ${isActive ? 'activated' : 'deactivated'}`
    });
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
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{getRouteName(schedule.routeId)}</TableCell>
                  <TableCell>{formatDateTime(schedule.departureTime)}</TableCell>
                  <TableCell>{formatDateTime(schedule.arrivalTime)}</TableCell>
                  <TableCell>{schedule.bus}</TableCell>
                  <TableCell>${schedule.price}</TableCell>
                  <TableCell>{schedule.availableSeats}/{schedule.totalSeats}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={schedule.isActive}
                      onCheckedChange={(checked) => handleToggleActive(schedule.id, checked)}
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
                value={currentSchedule.routeId.toString()}
                onValueChange={(value) => setCurrentSchedule({...currentSchedule, routeId: Number(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(route => (
                    <SelectItem key={route.id} value={route.id.toString()}>
                      {route.name} - {route.origin} to {route.destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="departureTime"
                    type="datetime-local"
                    className="pl-10"
                    value={formatDateTimeForInput(currentSchedule.departureTime)}
                    onChange={(e) => setCurrentSchedule({...currentSchedule, departureTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="arrivalTime"
                    type="datetime-local"
                    className="pl-10"
                    value={formatDateTimeForInput(currentSchedule.arrivalTime)}
                    onChange={(e) => setCurrentSchedule({...currentSchedule, arrivalTime: e.target.value})}
                  />
                </div>
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
                    <SelectValue placeholder="Select Bus Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {busTypes.map(busType => (
                      <SelectItem key={busType} value={busType}>
                        {busType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentSchedule.price.toString()}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, price: Number(e.target.value)})}
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
                  value={currentSchedule.totalSeats.toString()}
                  onChange={(e) => setCurrentSchedule({
                    ...currentSchedule, 
                    totalSeats: Number(e.target.value),
                    availableSeats: isEditing 
                      ? Math.min(currentSchedule.availableSeats, Number(e.target.value))
                      : Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableSeats">Available Seats</Label>
                <Input
                  id="availableSeats"
                  type="number"
                  min="0"
                  max={currentSchedule.totalSeats}
                  value={currentSchedule.availableSeats.toString()}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= currentSchedule.totalSeats) {
                      setCurrentSchedule({...currentSchedule, availableSeats: value});
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={currentSchedule.isActive}
                onCheckedChange={(checked) => setCurrentSchedule({...currentSchedule, isActive: checked})}
                className="data-[state=checked]:bg-green-500"
              />
              <Label htmlFor="active">
                {currentSchedule.isActive ? 'Active' : 'Inactive'}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
            <Button className="bg-bus-800" onClick={handleSaveSchedule}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this schedule? 
              This action cannot be undone.
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
