const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({
          success: false,
          msg: "Not authorized, Please login",
          data: {},
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req._decoded = { id: decoded.id };
    return next();
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "Token is invalid, Login First", data: {} });
  }
};

module.exports = verifyToken;
