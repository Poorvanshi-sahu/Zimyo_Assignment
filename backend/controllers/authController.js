const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const validator = require("validator")

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new CustomError.BadRequestError("User already exists");
  }

  const user = await User.create({ name, email, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", token ,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.status(StatusCodes.CREATED).json({ message: "User created", token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  if (!validator.isEmail(email)) {
    throw new CustomError.BadRequestError("Please provide a valid email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.notFoundError("User not found");
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", token ,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  // from above code cookies will be created and added to the res
  res.status(StatusCodes.CREATED).json({ user, token });
};

const logOut = (req, res) => {
  console.log("logout");
};
module.exports = { registerUser, loginUser, logOut };
