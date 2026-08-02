const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions({ includeMaxAge = true } = {}) {
  const isProduction = process.env.NODE_ENV === "production";

  // Prefer Lax: production frontend proxies /api on the same origin,
  // so cookies are first-party and survive Chrome's third-party cookie blocks.
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
  };

  if (includeMaxAge) {
    cookieOptions.maxAge = SEVEN_DAYS_IN_MS;
  }

  return cookieOptions;
}

function sendAuthCookie(res, accessToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, getCookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, getCookieOptions({ includeMaxAge: false }));
}

module.exports = {
  ACCESS_TOKEN_COOKIE_NAME,
  sendAuthCookie,
  clearAuthCookie,
};
