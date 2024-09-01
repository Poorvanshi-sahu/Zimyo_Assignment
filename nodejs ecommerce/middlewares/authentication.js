const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { StatusCodes } = require('http-status-codes');

const authentication = async (req, res, next) => {
    console.log("auth");
    
    try {
        const { accessToken } = req.signedCookies;

        const token = accessToken;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findByPk(decoded.id);
        
        next();
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized, Please login first' });
    }
};

module.exports = authentication