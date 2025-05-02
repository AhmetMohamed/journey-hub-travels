
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET_KEY"; // Use environment variable in production

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token") || req.header("Authorization");

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Remove Bearer prefix if it exists
    const tokenString = token.startsWith("Bearer ") ? token.slice(7) : token;
    
    // Verify token
    const decoded = jwt.verify(tokenString, JWT_SECRET);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
