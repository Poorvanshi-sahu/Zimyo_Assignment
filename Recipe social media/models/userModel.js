const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: "Please provide email",
    },
    unique: true,
  },
  password: { type: String, required: [true, 'Please provide password'], minLength:6 },
  recipes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Recipe",
  }],
  follower:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  following:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }]
});


// Before saving password create hash and save it as password
userSchema.pre("save", async function (next) {
  // check password is changed or not
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password whether user given password is equals to saved hash 
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
