const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    // Make sure you're using the correct environment variable for JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use process.env.JWT_SECRET

    const user = await User.findById(decoded.userId); // Get the user from the database

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // Attach user to the request object
    next(); // Call the next middleware (route handler)
  } catch (err) {
    console.error('Error in authenticate middleware:', err);
    res.status(401).json({ message: "Invalid token" }); // Token verification failed
  }
};

module.exports = authenticate;
