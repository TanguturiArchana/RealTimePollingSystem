const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "Access denied: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in the database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "Access denied: User not found." });
    }

    // Attach the user to the request object
    req.user = user; 
    next(); // Proceed to the next middleware/controller

  } catch (err) {
    console.error('Error in authenticate middleware:', err);

    // Check if error is due to token expiry or other JWT issues
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    
    // Return general error for any other JWT issues
    return res.status(401).json({ message: "Invalid token. Please log in again." });
  }
};

module.exports = authenticate;
