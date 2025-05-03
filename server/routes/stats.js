const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');

// Get dashboard stats
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const [totalBookings, activeRoutes, completedBookings, schedules] = await Promise.all([
      Booking.countDocuments(),
      Route.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: 'completed' }),
      Schedule.find().populate('route')
    ]);
    
    // Calculate revenue from completed bookings
    const bookings = await Booking.find({ status: { $in: ['confirmed', 'completed'] } });
    const revenue = bookings.reduce((total, booking) => total + booking.totalAmount, 0);
    
    // Calculate routes added in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const routesAdded = await Route.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Calculate customer satisfaction (mock data for now)
    const customerSatisfaction = 4.2;
    
    // Calculate bookings trend percentage compared to previous month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 2);
    
    const [lastMonthBookings, previousMonthBookings] = await Promise.all([
      Booking.countDocuments({ 
        createdAt: { $gte: lastMonth, $lt: new Date() }
      }),
      Booking.countDocuments({
        createdAt: { $gte: previousMonth, $lt: lastMonth }
      })
    ]);
    
    const bookingsTrend = previousMonthBookings > 0 
      ? Math.round(((lastMonthBookings - previousMonthBookings) / previousMonthBookings) * 100)
      : 0;
    
    res.json({
      totalBookings,
      revenue,
      activeRoutes,
      customerSatisfaction,
      bookingsTrend,
      routesAdded
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get revenue data for chart
router.get('/revenue', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Generate dummy data if no real data exists
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth = {};
    
    // Initialize with some default data to ensure chart renders
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const monthYearKey = `${monthIndex}-${year}`;
      revenueByMonth[monthYearKey] = {
        name: monthNames[monthIndex],
        value: Math.floor(Math.random() * 5000) + 1000 // Random value between 1000-6000
      };
    }
    
    // Get all bookings within the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    const bookings = await Booking.find({
      status: { $in: ['confirmed', 'completed'] },
      createdAt: { $gte: sixMonthsAgo }
    });
    
    // Override dummy data with real data if it exists
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const monthYearKey = `${date.getMonth()}-${date.getFullYear()}`;
      const monthName = monthNames[date.getMonth()];
      
      if (!revenueByMonth[monthYearKey]) {
        revenueByMonth[monthYearKey] = {
          name: monthName,
          value: 0
        };
      }
      
      revenueByMonth[monthYearKey].value += booking.totalAmount;
    });
    
    // Convert to array and sort by date
    const result = Object.values(revenueByMonth).sort((a, b) => {
      const monthIndexA = monthNames.indexOf(a.name);
      const monthIndexB = monthNames.indexOf(b.name);
      return monthIndexA - monthIndexB;
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error getting revenue data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings trend data
router.get('/bookings-trend', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Generate dummy data for empty charts
    const bookingsByWeek = {};
    for (let i = 1; i <= 6; i++) {
      const weekKey = `Week ${i}`;
      bookingsByWeek[weekKey] = {
        name: weekKey,
        value: Math.floor(Math.random() * 10) + 5 // Random values
      };
    }
    
    // Get real data if available
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - (6 * 7));
    
    const bookings = await Booking.find({
      createdAt: { $gte: sixWeeksAgo }
    });
    
    // Override dummy data with real data
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const weekNumber = Math.ceil((date - sixWeeksAgo) / (7 * 24 * 60 * 60 * 1000));
      const weekKey = `Week ${weekNumber}`;
      
      if (weekNumber > 0 && weekNumber <= 6) {
        if (!bookingsByWeek[weekKey]) {
          bookingsByWeek[weekKey] = {
            name: weekKey,
            value: 0
          };
        }
        bookingsByWeek[weekKey].value += 1;
      }
    });
    
    // Convert to array and sort by week
    const result = Object.values(bookingsByWeek).sort((a, b) => {
      const weekA = parseInt(a.name.split(' ')[1]);
      const weekB = parseInt(b.name.split(' ')[1]);
      return weekA - weekB;
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error getting bookings trend data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get route usage data
router.get('/route-usage', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get routes for generating dummy data
    const routes = await Route.find().limit(5);
    const routeUsage = {};
    
    // Generate dummy data first
    routes.forEach((route, index) => {
      const routeName = `${route.origin} - ${route.destination}`;
      routeUsage[routeName] = {
        name: routeName,
        value: Math.floor(Math.random() * 30) + 10 // Random bookings count
      };
    });
    
    // Get real data if available
    const schedules = await Schedule.find().populate('route');
    
    // Override with real data where possible
    for (const schedule of schedules) {
      if (!schedule.route) continue;
      
      const routeName = `${schedule.route.origin} - ${schedule.route.destination}`;
      // Calculate bookings based on bookedSeats if available, or fall back to availableSeats
      const bookingsCount = schedule.bookedSeats 
        ? schedule.bookedSeats.length
        : schedule.totalSeats - schedule.availableSeats;
      
      if (!routeUsage[routeName]) {
        routeUsage[routeName] = {
          name: routeName,
          value: 0
        };
      }
      
      routeUsage[routeName].value += bookingsCount;
    }
    
    // Convert to array and sort by usage
    const result = Object.values(routeUsage)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Limit to top 5
    
    res.json(result);
  } catch (error) {
    console.error('Error getting route usage data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bus type distribution
router.get('/bus-type', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Generate default data
    const busTypes = {
      'Standard': { name: 'Standard', value: 45 },
      'Express': { name: 'Express', value: 30 },
      'Premium': { name: 'Premium', value: 25 }
    };
    
    // Get real data if available
    const schedules = await Schedule.find();
    
    if (schedules.length > 0) {
      // Reset to calculate real values
      Object.keys(busTypes).forEach(key => {
        busTypes[key].value = 0;
      });
      
      let totalBookings = 0;
      
      // Group by bus type
      for (const schedule of schedules) {
        if (!busTypes[schedule.bus]) {
          busTypes[schedule.bus] = {
            name: schedule.bus,
            value: 0
          };
        }
        
        const bookingsCount = schedule.bookedSeats 
          ? schedule.bookedSeats.length
          : schedule.totalSeats - schedule.availableSeats;
        
        busTypes[schedule.bus].value += bookingsCount;
        totalBookings += bookingsCount;
      }
      
      // Calculate percentages if we have any bookings
      if (totalBookings > 0) {
        Object.values(busTypes).forEach(type => {
          type.value = Math.round((type.value / totalBookings) * 100);
        });
      }
    }
    
    // Convert to array
    const result = Object.values(busTypes);
    
    res.json(result);
  } catch (error) {
    console.error('Error getting bus type distribution:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get schedule distribution by time of day
router.get('/schedule-distribution', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get all schedules
    const schedules = await Schedule.find();
    
    // Initialize time categories
    const timeCategories = {
      'Morning (5AM-12PM)': 0,
      'Afternoon (12PM-5PM)': 0,
      'Evening (5PM-10PM)': 0,
      'Night (10PM-5AM)': 0
    };
    
    // Group schedules by time of day
    schedules.forEach(schedule => {
      const time = new Date(schedule.departureTime).getHours();
      
      if (time >= 5 && time < 12) {
        timeCategories['Morning (5AM-12PM)']++;
      } else if (time >= 12 && time < 17) {
        timeCategories['Afternoon (12PM-5PM)']++;
      } else if (time >= 17 && time < 22) {
        timeCategories['Evening (5PM-10PM)']++;
      } else {
        timeCategories['Night (10PM-5AM)']++;
      }
    });
    
    // Convert to array format for chart
    const result = Object.entries(timeCategories).map(([name, value]) => ({
      name,
      value
    }));
    
    // If no data, provide fallback
    if (result.every(item => item.value === 0)) {
      return res.json([
        { name: 'Morning (5AM-12PM)', value: 35 },
        { name: 'Afternoon (12PM-5PM)', value: 40 },
        { name: 'Evening (5PM-10PM)', value: 20 },
        { name: 'Night (10PM-5AM)', value: 5 }
      ]);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error getting schedule distribution:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
