
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
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    // Get all bookings within the last 6 months
    const bookings = await Booking.find({
      status: { $in: ['confirmed', 'completed'] },
      createdAt: { $gte: sixMonthsAgo }
    });
    
    // Group by month and calculate revenue
    const revenueByMonth = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
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
    
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - (6 * 7));
    
    // Get all bookings within the last 6 weeks
    const bookings = await Booking.find({
      createdAt: { $gte: sixWeeksAgo }
    });
    
    // Group by week
    const bookingsByWeek = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const weekNumber = Math.ceil((date - sixWeeksAgo) / (7 * 24 * 60 * 60 * 1000));
      const weekKey = `Week ${weekNumber}`;
      
      if (!bookingsByWeek[weekKey]) {
        bookingsByWeek[weekKey] = {
          name: weekKey,
          value: 0
        };
      }
      
      bookingsByWeek[weekKey].value += 1;
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
    
    const schedules = await Schedule.find().populate('route');
    
    // Group bookings by route
    const routeUsage = {};
    
    for (const schedule of schedules) {
      if (!schedule.route) continue;
      
      const routeName = `${schedule.route.origin} - ${schedule.route.destination}`;
      const bookingsCount = schedule.totalSeats - schedule.availableSeats;
      
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
    
    const schedules = await Schedule.find();
    
    // Group by bus type
    const busTypes = {};
    const totalBookings = schedules.reduce(
      (sum, schedule) => sum + (schedule.totalSeats - schedule.availableSeats), 
      0
    );
    
    for (const schedule of schedules) {
      if (!busTypes[schedule.bus]) {
        busTypes[schedule.bus] = {
          name: schedule.bus,
          value: 0
        };
      }
      
      busTypes[schedule.bus].value += schedule.totalSeats - schedule.availableSeats;
    }
    
    // Convert to array, calculate percentages
    const result = Object.values(busTypes).map(type => {
      return {
        name: type.name,
        value: Math.round((type.value / (totalBookings || 1)) * 100)
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error getting bus type distribution:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
