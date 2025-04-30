
const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET api/schedules
// @desc    Get all schedules
// @access  Public
router.get('/', scheduleController.getAllSchedules);

// @route   GET api/schedules/:id
// @desc    Get schedule by ID
// @access  Public
router.get('/:id', scheduleController.getScheduleById);

// @route   POST api/schedules
// @desc    Create a schedule
// @access  Private/Admin
router.post('/', auth, scheduleController.createSchedule);

// @route   PUT api/schedules/:id
// @desc    Update a schedule
// @access  Private/Admin
router.put('/:id', auth, scheduleController.updateSchedule);

// @route   DELETE api/schedules/:id
// @desc    Delete a schedule
// @access  Private/Admin
router.delete('/:id', auth, scheduleController.deleteSchedule);

module.exports = router;
