const StatusCodes = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  const customError = {
    customMessage: err.message || "Something went wrong",
    customStatusCodes: err.statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name && err.name === "ValidationError") {
    customError.customMessage = `${Object.values(err.errors)
      .map((oneError) => oneError.message)
      .join(",")}`;
    customError.customStatusCodes = 400;
  }

  res
    .status(customError.customStatusCodes)
    .json({ success: false, msg: customError.customMessage });
};

module.exports = errorHandler;