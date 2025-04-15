const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user; 
    next();
  } catch (err) {
    console.error('Error in authenticate middleware:', err);
    res.status(401).json({ message: "Invalid token" }); 
  }
};

module.exports = authenticate;
