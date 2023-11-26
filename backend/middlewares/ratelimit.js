const setRateLimit = require("express-rate-limit");

const maxRate = 1000
const rateLimitMiddleware = setRateLimit({
  windowMs: 60 * 1000,
  max: maxRate,
  message: `You have exceeded your ${maxRate} requests per minute limit.`,
  headers: true,
});

module.exports = rateLimitMiddleware;