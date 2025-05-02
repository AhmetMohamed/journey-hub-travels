
// Admin middleware to check if the user is an admin
module.exports = function(req, res, next) {
  // Check if user has admin role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};
