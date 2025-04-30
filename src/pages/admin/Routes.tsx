
import React, { useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Mock data for routes
const initialRoutes = [
  {
    id: 1,
    name: 'NYC-BOS-01',
    origin: 'New York',
    destination: 'Boston',
    distance: 215,
    estimatedDuration: 270, // in minutes
    description: 'Express route via I-95',
    isActive: true
  },
  {
    id: 2,
    name: 'CHI-MIL-01',
    origin: 'Chicago',
    destination: 'Milwaukee',
    distance: 92,
    estimatedDuration: 105, // in minutes
    description: 'Direct route via I-94',
    isActive: true
  },
  {
    id: 3,
    name: 'LA-SD-01',
    origin: 'Los Angeles',
    destination: 'San Diego',
    distance: 120,
    estimatedDuration: 135, // in minutes
    description: 'Coastal route via I-5',
    isActive: true
  },
  {
    id: 4,
    name: 'SEA-POR-01',
    origin: 'Seattle',
    destination: 'Portland',
    distance: 174,
    estimatedDuration: 180, // in minutes
    description: 'Scenic route via I-5',
    isActive: false
  },
  {
    id: 5,
    name: 'MIA-ORL-01',
    origin: 'Miami',
    destination: 'Orlando',
    distance: 235,
    estimatedDuration: 225, // in minutes
    description: 'Direct route via Florida Turnpike',
    isActive: true
  }
];

interface Route {
  id: number;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedDuration: number;
  description: string;
  isActive: boolean;
}

const emptyRoute: Route = {
  id: 0,
  name: '',
  origin: '',
  destination: '',
  distance: 0,
  estimatedDuration: 0,
  description: '',
  isActive: true
};

const AdminRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route>(emptyRoute);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRouteClick = () => {
    setCurrentRoute(emptyRoute);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditRouteClick = (route: Route) => {
    setCurrentRoute(route);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteRouteClick = (route: Route) => {
    setCurrentRoute(route);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSaveRoute = () => {
    if (!currentRoute.name || !currentRoute.origin || !currentRoute.destination) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      // Update existing route
      setRoutes(routes.map(route => 
        route.id === currentRoute.id ? currentRoute : route
      ));
      toast({
        title: "Route updated",
        description: `${currentRoute.name} has been updated`
      });
    } else {
      // Add new route
      const newId = Math.max(...routes.map(route => route.id)) + 1;
      setRoutes([...routes, { ...currentRoute, id: newId }]);
      toast({
        title: "Route added",
        description: `${currentRoute.name} has been added`
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteRoute = () => {
    setRoutes(routes.filter(route => route.id !== currentRoute.id));
    toast({
      title: "Route deleted",
      description: `${currentRoute.name} has been deleted`
    });
    setIsDeleteDialogOpen(false);
  };

  const handleToggleActive = (id: number, isActive: boolean) => {
    setRoutes(routes.map(route => 
      route.id === id ? { ...route, isActive } : route
    ));
    
    const route = routes.find(r => r.id === id);
    toast({
      title: isActive ? "Route activated" : "Route deactivated",
      description: `${route?.name} has been ${isActive ? 'activated' : 'deactivated'}`
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Routes</h1>
          <Button className="bg-bus-800" onClick={handleAddRouteClick}>
            <Plus className="h-4 w-4 mr-2" /> Add New Route
          </Button>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search routes..."
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
                <TableHead>Name</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>{route.origin}</TableCell>
                  <TableCell>{route.destination}</TableCell>
                  <TableCell>{route.distance} miles</TableCell>
                  <TableCell>{formatDuration(route.estimatedDuration)}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={route.isActive}
                      onCheckedChange={(checked) => handleToggleActive(route.id, checked)}
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
                        <DropdownMenuItem onClick={() => handleEditRouteClick(route)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteRouteClick(route)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRoutes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No routes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Route Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Route' : 'Add New Route'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the route information' 
                : 'Fill in the details for the new route'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Route Name</Label>
                <Input
                  id="name"
                  value={currentRoute.name}
                  onChange={(e) => setCurrentRoute({...currentRoute, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="active"
                    checked={currentRoute.isActive}
                    onCheckedChange={(checked) => setCurrentRoute({...currentRoute, isActive: checked})}
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="active">
                    {currentRoute.isActive ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={currentRoute.origin}
                  onChange={(e) => setCurrentRoute({...currentRoute, origin: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={currentRoute.destination}
                  onChange={(e) => setCurrentRoute({...currentRoute, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (miles)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={currentRoute.distance.toString()}
                  onChange={(e) => setCurrentRoute({...currentRoute, distance: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={currentRoute.estimatedDuration.toString()}
                  onChange={(e) => setCurrentRoute({...currentRoute, estimatedDuration: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={currentRoute.description}
                onChange={(e) => setCurrentRoute({...currentRoute, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
            <Button className="bg-bus-800" onClick={handleSaveRoute}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Route</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the route "{currentRoute.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRoute}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminRoutes;
