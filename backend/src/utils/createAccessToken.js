const jwt = require("jsonwebtoken");

function createAccessToken(authenticatedUser) {
  return jwt.sign(
    {
      userId: authenticatedUser._id.toString(),
      email: authenticatedUser.email,
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "7d",
    }
  );
}

module.exports = createAccessToken;
