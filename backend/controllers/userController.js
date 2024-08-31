const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");

const getUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id }).populate(
    "recipes follower following"
  );
  return res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  return res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id }).populate("follower following recipes");
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User not present" });
  }
  res.status(StatusCodes.OK).json({ user });
};

const followAndUnfollowUser = async (req, res) => {
  const id = req.params.id;
  const loggedInUser = req.user.id;

  const userToFollow = await User.findOne({ _id: id });

  if (!userToFollow) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not present" });
  }

  console.log(userToFollow, userToFollow.follower, userToFollow.follower.includes(loggedInUser));
  
  //check if loggedInUser is present in follower of user then remove loggedInUser to unfollow, if not present then add to follower
  if (userToFollow.follower.includes(loggedInUser)) {
    const index = userToFollow.follower.indexOf(loggedInUser);
    userToFollow.follower.splice(index, 1);
    await userToFollow.save();
    return res.status(StatusCodes.OK).json({ message: "User unfollowed" });
  } else {
    userToFollow.follower.push(loggedInUser);
    await userToFollow.save();
    return res.status(StatusCodes.OK).json({"message":"User followed successfully"})
  }
};

module.exports = { getUserProfile, getAllUsers, getSingleUser, followAndUnfollowUser };
