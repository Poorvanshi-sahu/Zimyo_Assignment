const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { StatusCodes } = require('http-status-codes');

const protect = async (req, res, next) => {
  
  try {
    const { accessToken } = req.signedCookies;

    const token = accessToken

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized, Please login first' });
  }
};

module.exports = { protect }
