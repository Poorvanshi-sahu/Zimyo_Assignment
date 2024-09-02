
const { userServices: User } = require("../services");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  try {
    const reqData = { userName, email, password } = req.body;
    const resp = await User.register(reqData);
    return res.status(resp.httpStatus).json(resp.body);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
  }
};

const login = async (req, res) => {
  try {
    const reqData = { email, password } = req.body;
    const resp = await User.login(reqData);
    return res.status(resp.httpStatus).json(resp.body);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req._decoded.id;
    const resp = await User.getProfile(userId);

    return res.status(resp.httpStatus).json(resp.body);
  } catch (error) {
    res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, msg: "Something Went Wrong", data: {} });
  }
};


const getAllProfiles = async (req, res) => {
  try {
    const reqData = req._decoded.id;
    const resp = await User.getAllProfiles(reqData);

    return res.status(resp.httpStatus).json(resp.body);
  } catch (error) {
    res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, msg: "Something Went Wrong", data: {} });
  }

};

module.exports = { register, login, getProfile, getAllProfiles };
