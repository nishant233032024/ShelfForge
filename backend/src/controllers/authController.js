const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const createAccessToken = require("../utils/createAccessToken");
const { sendAuthCookie, clearAuthCookie } = require("../utils/sendAuthCookie");

const BCRYPT_SALT_ROUNDS = 10;

function buildPublicUser(userDocument) {
  return {
    id: userDocument._id.toString(),
    fullName: userDocument.fullName,
    email: userDocument.email,
  };
}

function validateSignupPayload({ fullName, email, password, confirmPassword }) {
  if (!fullName || fullName.trim().length < 2 || fullName.trim().length > 60) {
    throw new ApiError(400, "Full name must be between 2 and 60 characters");
  }

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "A valid email is required");
  }

  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password must match");
  }
}

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  validateSignupPayload({ fullName, email, password, confirmPassword });

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const createdUser = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  const accessToken = createAccessToken(createdUser);
  sendAuthCookie(res, accessToken);

  res.status(201).json({
    user: buildPublicUser(createdUser),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (!existingUser) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, existingUser.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = createAccessToken(existingUser);
  sendAuthCookie(res, accessToken);

  res.status(200).json({
    user: buildPublicUser(existingUser),
  });
});

const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);

  res.status(200).json({
    message: "Logged out successfully",
  });
});

const getAuthenticatedUser = asyncHandler(async (req, res) => {
  const authenticatedUser = await User.findById(req.currentUser.userId).select(
    "fullName email"
  );

  if (!authenticatedUser) {
    throw new ApiError(401, "Authentication required. Please log in again.");
  }

  res.status(200).json({
    user: buildPublicUser(authenticatedUser),
  });
});

module.exports = {
  signup,
  login,
  logout,
  getAuthenticatedUser,
};
