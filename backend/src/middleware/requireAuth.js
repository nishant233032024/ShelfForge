const { expressjwt: expressJwt } = require("express-jwt");
const { ACCESS_TOKEN_COOKIE_NAME } = require("../utils/sendAuthCookie");

const requireAuth = expressJwt({
  secret: () => process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
  getToken(req) {
    if (req.cookies && req.cookies[ACCESS_TOKEN_COOKIE_NAME]) {
      return req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    }

    return null;
  },
});

module.exports = requireAuth;
