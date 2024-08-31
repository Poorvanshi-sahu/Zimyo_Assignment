const mongoose = require('mongoose');

// method to connect application with database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('MongoDB Connected');
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
