const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  signup,
  login,
  logout,
  getAuthenticatedUser,
} = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");
const attachCurrentUser = require("../middleware/attachCurrentUser");

const authRoutes = express.Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many auth attempts. Please try again later.",
  },
});

authRoutes.post("/signup", authRateLimiter, signup);
authRoutes.post("/login", authRateLimiter, login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAuth, attachCurrentUser, getAuthenticatedUser);

module.exports = authRoutes;
