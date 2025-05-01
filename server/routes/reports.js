
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');

// Generate report
router.get('/:type', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { type } = req.params;
    const { dateRange, startDate, endDate } = req.query;
    
    // Calculate date range for filtering
    let startDateTime, endDateTime;
    
    switch (dateRange) {
      case 'last7days':
        startDateTime = new Date();
        startDateTime.setDate(startDateTime.getDate() - 7);
        endDateTime = new Date();
        break;
      case 'last30days':
        startDateTime = new Date();
        startDateTime.setDate(startDateTime.getDate() - 30);
        endDateTime = new Date();
        break;
      case 'last90days':
        startDateTime = new Date();
        startDateTime.setDate(startDateTime.getDate() - 90);
        endDateTime = new Date();
        break;
      case 'thisYear':
        startDateTime = new Date(new Date().getFullYear(), 0, 1);
        endDateTime = new Date();
        break;
      case 'custom':
        if (!startDate || !endDate) {
          return res.status(400).json({ message: 'Start and end dates are required for custom range' });
        }
        startDateTime = new Date(startDate);
        endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1); // Include the end date
        break;
      default:
        startDateTime = new Date();
        startDateTime.setDate(startDateTime.getDate() - 30); // Default to last 30 days
        endDateTime = new Date();
    }
    
    // Calculate report stats
    const [
      confirmedBookings,
      previousPeriodBookings,
      routes,
      schedules
    ] = await Promise.all([
      Booking.find({ 
        createdAt: { $gte: startDateTime, $lt: endDateTime },
        status: { $in: ['confirmed', 'completed'] }
      }),
      Booking.find({
        createdAt: { 
          $gte: new Date(startDateTime.getTime() - (endDateTime - startDateTime)),
          $lt: startDateTime
        },
        status: { $in: ['confirmed', 'completed'] }
      }),
      Route.find(),
      Schedule.find()
    ]);
    
    // Calculate revenue
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const previousRevenue = previousPeriodBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // Calculate total bookings
    const totalBookings = confirmedBookings.length;
    const previousBookings = previousPeriodBookings.length;
    
    // Calculate occupancy
    let totalSeats = 0;
    let bookedSeats = 0;
    
    schedules.forEach(schedule => {
      totalSeats += schedule.totalSeats;
      bookedSeats += schedule.totalSeats - schedule.availableSeats;
    });
    
    const averageOccupancy = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;
    
    // Calculate changes
    const revenueChange = previousRevenue > 0 
      ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100)
      : 100;
      
    const bookingsChange = previousBookings > 0
      ? Math.round(((totalBookings - previousBookings) / previousBookings) * 100)
      : 100;
      
    const occupancyChange = 5; // Placeholder for now
    
    // Chart data based on report type
    let chartData = [];
    
    switch (type) {
      case 'revenue':
        // Group by day/week/month depending on date range
        chartData = generateTimeSeriesData(confirmedBookings, startDateTime, endDateTime, 'totalAmount');
        break;
      
      case 'bookings':
        chartData = generateTimeSeriesData(confirmedBookings, startDateTime, endDateTime, 'count');
        break;
      
      case 'occupancy':
        // For occupancy we'd need more complex calculation
        chartData = generateOccupancyData(schedules, startDateTime, endDateTime);
        break;
      
      case 'route':
        // Group by route
        chartData = await generateRouteData(confirmedBookings);
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    res.json({
      stats: {
        totalRevenue,
        totalBookings,
        averageOccupancy,
        revenueChange,
        bookingsChange,
        occupancyChange
      },
      chartData
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate time series data grouped by appropriate intervals
function generateTimeSeriesData(bookings, startDate, endDate, valueType) {
  const data = [];
  const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Choose appropriate grouping based on date range
  let groupFormat;
  if (diffDays <= 31) {
    // Daily for up to a month
    groupFormat = date => `${date.getDate()}/${date.getMonth() + 1}`;
  } else if (diffDays <= 90) {
    // Weekly for up to 3 months
    groupFormat = date => `W${Math.ceil(date.getDate() / 7)}-${date.toLocaleString('default', { month: 'short' })}`;
  } else {
    // Monthly for longer periods
    groupFormat = date => date.toLocaleString('default', { month: 'short' });
  }
  
  // Group bookings
  const groups = {};
  bookings.forEach(booking => {
    const date = new Date(booking.createdAt);
    const groupKey = groupFormat(date);
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        name: groupKey,
        value: 0
      };
    }
    
    if (valueType === 'totalAmount') {
      groups[groupKey].value += booking.totalAmount;
    } else { // count
      groups[groupKey].value += 1;
    }
  });
  
  // Convert to array and sort
  return Object.values(groups).sort((a, b) => {
    // Basic lexicographic sorting should work for our format
    return a.name.localeCompare(b.name);
  });
}

// Generate occupancy data
function generateOccupancyData(schedules, startDate, endDate) {
  // Simplified implementation - in real app would need to calculate occupancy over time
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // For demo, generate some data
  const data = [];
  const currentMonth = new Date().getMonth();
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    data.push({
      name: monthNames[monthIndex],
      value: Math.floor(65 + Math.random() * 20) // Random between 65-85%
    });
  }
  
  return data;
}

// Generate route performance data
async function generateRouteData(bookings) {
  // Group bookings by route
  const scheduleIds = bookings.map(booking => booking.schedule);
  const schedules = await Schedule.find({ _id: { $in: scheduleIds } }).populate('route');
  
  // Map schedule IDs to route names
  const scheduleToRoute = {};
  schedules.forEach(schedule => {
    if (schedule.route) {
      scheduleToRoute[schedule._id] = `${schedule.route.origin} - ${schedule.route.destination}`;
    }
  });
  
  // Count bookings per route
  const routeCounts = {};
  bookings.forEach(booking => {
    const routeName = scheduleToRoute[booking.schedule];
    if (!routeName) return;
    
    if (!routeCounts[routeName]) {
      routeCounts[routeName] = {
        name: routeName,
        value: 0
      };
    }
    
    routeCounts[routeName].value += 1;
  });
  
  // Convert to array and sort by count
  return Object.values(routeCounts)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 routes
}

// Download report endpoint
router.get('/:type/download', auth, async (req, res) => {
  // This would generate a downloadable file in real implementation
  // For this example, we'll just return a success message
  res.json({ message: 'Report download would be implemented here' });
});

module.exports = router;
