
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Search, Check, X } from 'lucide-react';

interface Booking {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  route: {
    from: string;
    to: string;
  };
  departureDate: string;
  departureTime: string;
  seatNumbers: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/admin/bookings');
      // const data = await response.json();
      // setBookings(data);
      
      // For demo purposes, using mock data
      setTimeout(() => {
        const mockBookings: Booking[] = [
          {
            id: "booking1",
            userId: "user1",
            user: {
              name: "John Doe",
              email: "john@example.com"
            },
            route: {
              from: "New York",
              to: "Boston"
            },
            departureDate: "2025-05-15",
            departureTime: "08:00 AM",
            seatNumbers: ["A1", "A2"],
            totalAmount: 91.98,
            status: "confirmed",
            createdAt: "2025-05-01"
          },
          {
            id: "booking2",
            userId: "user2",
            user: {
              name: "Jane Smith",
              email: "jane@example.com"
            },
            route: {
              from: "Chicago",
              to: "Milwaukee"
            },
            departureDate: "2025-05-10",
            departureTime: "10:15 AM",
            seatNumbers: ["C4"],
            totalAmount: 25.99,
            status: "completed",
            createdAt: "2025-04-25"
          },
          {
            id: "booking3",
            userId: "user3",
            user: {
              name: "Bob Johnson",
              email: "bob@example.com"
            },
            route: {
              from: "Los Angeles",
              to: "San Diego"
            },
            departureDate: "2025-05-20",
            departureTime: "03:45 PM",
            seatNumbers: ["B3"],
            totalAmount: 32.99,
            status: "cancelled",
            createdAt: "2025-04-30"
          },
          {
            id: "booking4",
            userId: "user4",
            user: {
              name: "Alice Brown",
              email: "alice@example.com"
            },
            route: {
              from: "Seattle",
              to: "Portland"
            },
            departureDate: "2025-05-18",
            departureTime: "07:30 AM",
            seatNumbers: ["D5", "D6"],
            totalAmount: 70.00,
            status: "confirmed",
            createdAt: "2025-04-28"
          },
          {
            id: "booking5",
            userId: "user5",
            user: {
              name: "Charlie Wilson",
              email: "charlie@example.com"
            },
            route: {
              from: "Miami",
              to: "Orlando"
            },
            departureDate: "2025-05-25",
            departureTime: "09:00 AM",
            seatNumbers: ["B7"],
            totalAmount: 40.00,
            status: "confirmed",
            createdAt: "2025-05-01"
          }
        ];
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      // In a real app, this would be an actual API call
      // await fetch(`/api/admin/bookings/${bookingId}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus } 
          : booking
      ));
      
      toast({
        title: "Status Updated",
        description: `Booking #${bookingId} status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bookings Management</h1>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="button">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>Manage customer bookings across all routes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div>{booking.user.name}</div>
                            <div className="text-xs text-muted-foreground">{booking.user.email}</div>
                          </TableCell>
                          <TableCell>
                            {booking.route.from} to {booking.route.to}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <div>
                                <div>{booking.departureDate}</div>
                                <div className="text-xs text-muted-foreground">{booking.departureTime}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.seatNumbers.join(", ")}
                            <div className="text-xs text-muted-foreground">
                              {booking.seatNumbers.length} {booking.seatNumbers.length === 1 ? 'seat' : 'seats'}
                            </div>
                          </TableCell>
                          <TableCell>${booking.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {booking.status !== 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                              {booking.status !== 'completed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                                >
                                  <span className="text-xs">✓✓</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
