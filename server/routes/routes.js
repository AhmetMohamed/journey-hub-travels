
const express = require('express');
const routeController = require('../controllers/routeController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET api/routes
// @desc    Get all routes
// @access  Public
router.get('/', routeController.getAllRoutes);

// @route   GET api/routes/:id
// @desc    Get route by ID
// @access  Public
router.get('/:id', routeController.getRouteById);

// @route   POST api/routes
// @desc    Create a route
// @access  Private/Admin
router.post('/', auth, routeController.createRoute);

// @route   PUT api/routes/:id
// @desc    Update a route
// @access  Private/Admin
router.put('/:id', auth, routeController.updateRoute);

// @route   DELETE api/routes/:id
// @desc    Delete a route
// @access  Private/Admin
router.delete('/:id', auth, routeController.deleteRoute);

module.exports = router;
