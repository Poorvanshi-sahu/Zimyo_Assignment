const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customAPIError");

class notFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.NOT_FOUND;
  }
}

module.exports = notFoundError;