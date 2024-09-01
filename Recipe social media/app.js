require("express-async-errors");
const express = require("express")
const app = express()
const connectDB = require("./config/connect")
const {userRoutes, recipeRoutes, authRoutes} = require("./routes");
const { notFoundMiddleware } = require("./middlewares");
const cors = require("cors")

const errorHandlerMiddleware =  require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

// for security
const rateLimiter= require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "./config/.env" });
}

// Middleware setup
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.get("/",(req,res)=>{
    res.send("Receipe Social Media")
})

// routes setup
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/recipes", recipeRoutes) 

// setup of middlewares for not found page and error handling
app.use(notFoundMiddleware)

// all kind of API error will handle here
app.use(errorHandlerMiddleware);

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60
}))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

const startApp = ()=>{
    // connection to database establish
    connectDB();

    // listening to port
    app.listen(process.env.PORT,()=>{
        console.log(`Listening on port ${process.env.PORT}`);
    })
}

startApp()