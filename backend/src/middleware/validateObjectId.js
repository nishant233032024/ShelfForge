const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

function validateObjectId(paramName = "bookId") {
  return function validateObjectIdMiddleware(req, res, next) {
    const candidateId = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return next(new ApiError(400, `Invalid ${paramName}`));
    }

    return next();
  };
}

module.exports = validateObjectId;
