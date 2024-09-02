require("express-async-errors");
const express = require("express");
const app = express();
const {authRoutes, cartRoutes, orderRoutes, productRoutes} = require("./routes")
const { notFoundMiddleware } = require("./middlewares");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();

// middleware setup
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("Ecommerce platform");
});

// routes setup
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);


// setup of middlewares for not found page and error handling
app.use(notFoundMiddleware);

const startApp = async () => {
  try {
    // listening to port
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to server", error);
  }
};

startApp();
