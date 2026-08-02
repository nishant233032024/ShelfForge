function attachCurrentUser(req, res, next) {
  if (!req.auth) {
    return next();
  }

  req.currentUser = {
    userId: req.auth.userId,
    email: req.auth.email,
  };

  return next();
}

module.exports = attachCurrentUser;
