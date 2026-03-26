const env = require("../config/env");
const { verifyAuthToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  const token = req.cookies[env.cookieName];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    req.auth = verifyAuthToken(token);
    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
}

module.exports = {
  requireAuth,
};
