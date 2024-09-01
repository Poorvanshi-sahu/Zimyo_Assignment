const authMiddleware = require("./authentication");
const notFoundMiddleware = require("./notFound")
const errorHandlerMiddleware = require("./errorHandler");

module.exports = {authMiddleware, notFoundMiddleware, errorHandlerMiddleware};