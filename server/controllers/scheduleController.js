
const Schedule = require('../models/Schedule');
const Route = require('../models/Route');

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ isActive: true })
      .populate('route', 'name origin destination');
      
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('route', 'name origin destination distance estimatedDuration');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new schedule
exports.createSchedule = async (req, res) => {
  try {
    const { 
      routeId, 
      departureTime, 
      arrivalTime, 
      bus, 
      price,
      availableSeats,
      totalSeats
    } = req.body;
    
    // Check if route exists
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const newSchedule = new Schedule({
      route: routeId,
      departureTime,
      arrivalTime,
      bus,
      price,
      availableSeats,
      totalSeats,
      bookedSeats: [] // Initialize empty bookedSeats array
    });

    const schedule = await newSchedule.save();
    
    // Populate the route information before sending the response
    await schedule.populate('route', 'name origin destination');
    
    res.status(201).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { 
      routeId, 
      departureTime, 
      arrivalTime, 
      bus, 
      price,
      availableSeats,
      totalSeats,
      isActive
    } = req.body;
    
    // Build schedule object
    const scheduleFields = {};
    if (routeId) scheduleFields.route = routeId;
    if (departureTime) scheduleFields.departureTime = departureTime;
    if (arrivalTime) scheduleFields.arrivalTime = arrivalTime;
    if (bus) scheduleFields.bus = bus;
    if (price !== undefined) scheduleFields.price = price;
    if (availableSeats !== undefined) scheduleFields.availableSeats = availableSeats;
    if (totalSeats) scheduleFields.totalSeats = totalSeats;
    if (isActive !== undefined) scheduleFields.isActive = isActive;

    // Find and update
    let schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { $set: scheduleFields },
      { new: true }
    );
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Populate the route information before sending the response
    schedule = await Schedule.findById(schedule._id).populate('route', 'name origin destination');
    
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    // Use findByIdAndDelete instead of just changing isActive to properly remove from DB
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ message: 'Schedule removed', scheduleId: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
