const ApiError = require("../utils/ApiError");

function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "Authentication required. Please log in again.",
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err.name === "ValidationError") {
    const firstValidationMessage = Object.values(err.errors)[0]?.message;
    return res.status(400).json({
      message: firstValidationMessage || "Validation failed",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "An account with this email already exists",
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Something went wrong on the server",
  });
}

module.exports = errorHandler;
