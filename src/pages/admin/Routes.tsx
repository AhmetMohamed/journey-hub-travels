
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
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { routesApi } from '@/services/api';

interface Route {
  _id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedDuration: number;
  description: string;
  isActive: boolean;
}

const emptyRoute: Route = {
  _id: '',
  name: '',
  origin: '',
  destination: '',
  distance: 0,
  estimatedDuration: 0,
  description: '',
  isActive: true
};

const AdminRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route>(emptyRoute);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const data = await routesApi.getAllRoutes();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch routes. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSaveRoute = async () => {
    if (!currentRoute.name || !currentRoute.origin || !currentRoute.destination) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing) {
        // Update existing route
        const updatedRoute = await routesApi.updateRoute(currentRoute._id, currentRoute);
        setRoutes(routes.map(route => 
          route._id === currentRoute._id ? updatedRoute : route
        ));
        toast({
          title: "Route updated",
          description: `${currentRoute.name} has been updated`
        });
      } else {
        // Add new route
        const newRoute = await routesApi.createRoute(currentRoute);
        setRoutes([...routes, newRoute]);
        toast({
          title: "Route added",
          description: `${currentRoute.name} has been added`
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving route:', error);
      toast({
        title: "Error",
        description: isEditing ? "Failed to update route" : "Failed to create route",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRoute = async () => {
    try {
      await routesApi.deleteRoute(currentRoute._id);
      setRoutes(routes.filter(route => route._id !== currentRoute._id));
      toast({
        title: "Route deleted",
        description: `${currentRoute.name} has been deleted`
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const route = routes.find(r => r._id === id);
      if (!route) return;

      const updatedRoute = await routesApi.updateRoute(id, { ...route, isActive });
      setRoutes(routes.map(route => 
        route._id === id ? { ...route, isActive } : route
      ));
      
      toast({
        title: isActive ? "Route activated" : "Route deactivated",
        description: `${route.name} has been ${isActive ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      console.error('Error toggling route active state:', error);
      toast({
        title: "Error",
        description: "Failed to update route status",
        variant: "destructive"
      });
    }
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
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
            </div>
          ) : (
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
                  <TableRow key={route._id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{route.origin}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>{route.distance} miles</TableCell>
                    <TableCell>{formatDuration(route.estimatedDuration)}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={route.isActive}
                        onCheckedChange={(checked) => handleToggleActive(route._id, checked)}
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
          )}
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
            <div className="space-y-2">
              <Label htmlFor="name">Route Name</Label>
              <Input 
                id="name" 
                value={currentRoute.name}
                onChange={(e) => setCurrentRoute({...currentRoute, name: e.target.value})}
              />
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
                  value={currentRoute.distance}
                  onChange={(e) => setCurrentRoute({...currentRoute, distance: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  type="number"
                  value={currentRoute.estimatedDuration}
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
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={currentRoute.isActive}
                onCheckedChange={(checked) => setCurrentRoute({...currentRoute, isActive: checked})}
              />
              <Label htmlFor="isActive">Active Route</Label>
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
              Are you sure you want to delete {currentRoute.name}? This action will deactivate the route.
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
