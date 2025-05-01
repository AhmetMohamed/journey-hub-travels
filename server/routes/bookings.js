
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { scheduleId, seatNumbers, totalAmount } = req.body;
    
    // Validate schedule exists
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    // Check if seats are available
    const bookedSeatsSet = new Set(schedule.bookedSeats);
    for (const seat of seatNumbers) {
      if (bookedSeatsSet.has(seat)) {
        return res.status(400).json({ message: `Seat ${seat} is already booked` });
      }
    }
    
    // Create booking
    const booking = new Booking({
      user: req.user.id,
      schedule: scheduleId,
      seatNumbers,
      totalAmount,
      status: 'confirmed',
    });
    
    const savedBooking = await booking.save();
    
    // Update schedule's booked seats
    schedule.bookedSeats = [...schedule.bookedSeats, ...seatNumbers];
    schedule.availableSeats = schedule.totalSeats - schedule.bookedSeats.length;
    await schedule.save();
    
    // Populate schedule details for response
    await savedBooking.populate('schedule').execPopulate();
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings (admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'schedule',
        populate: {
          path: 'route',
          select: 'origin destination'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'schedule',
        populate: {
          path: 'route',
          select: 'origin destination'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user owns booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already cancelled or completed
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Update schedule's booked seats
    const schedule = await Schedule.findById(booking.schedule);
    if (schedule) {
      schedule.bookedSeats = schedule.bookedSeats.filter(
        seat => !booking.seatNumbers.includes(seat)
      );
      schedule.availableSeats = schedule.totalSeats - schedule.bookedSeats.length;
      await schedule.save();
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { status } = req.body;
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // If changing to/from cancelled, update seat availability
    if (booking.status !== 'cancelled' && status === 'cancelled') {
      // Cancelling booking - make seats available
      const schedule = await Schedule.findById(booking.schedule);
      if (schedule) {
        schedule.bookedSeats = schedule.bookedSeats.filter(
          seat => !booking.seatNumbers.includes(seat)
        );
        schedule.availableSeats = schedule.totalSeats - schedule.bookedSeats.length;
        await schedule.save();
      }
    } else if (booking.status === 'cancelled' && status !== 'cancelled') {
      // Un-cancelling booking - make seats unavailable again
      const schedule = await Schedule.findById(booking.schedule);
      if (schedule) {
        schedule.bookedSeats = [...schedule.bookedSeats, ...booking.seatNumbers];
        schedule.availableSeats = schedule.totalSeats - schedule.bookedSeats.length;
        await schedule.save();
      }
    }
    
    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
