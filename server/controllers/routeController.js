
const Route = require('../models/Route');

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true });
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get route by ID
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new route
exports.createRoute = async (req, res) => {
  try {
    const { name, origin, destination, distance, estimatedDuration, description } = req.body;
    
    const newRoute = new Route({
      name,
      origin,
      destination,
      distance,
      estimatedDuration,
      description
    });

    const route = await newRoute.save();
    res.status(201).json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update route
exports.updateRoute = async (req, res) => {
  try {
    const { name, origin, destination, distance, estimatedDuration, description, isActive } = req.body;
    
    // Find and update
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        origin, 
        destination, 
        distance, 
        estimatedDuration, 
        description,
        isActive
      },
      { new: true }
    );
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete route
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Soft delete - just mark as inactive
    route.isActive = false;
    await route.save();

    res.json({ message: 'Route removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
