const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth requests. Please try again in 10 minutes.",
  },
});

module.exports = {
  authRateLimiter,
};
