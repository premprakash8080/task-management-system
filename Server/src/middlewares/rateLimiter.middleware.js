const RateLimit = require('../models/rateLimit.model');
const { ApiError } = require('../utils/ApiError');

const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes by default
  const max = options.max || 100; // Limit each IP to 100 requests per windowMs

  return async (req, res, next) => {
    try {
      const key = `${req.ip}-${req.originalUrl}`;
      const now = new Date();
      const windowStart = new Date(now.getTime() - windowMs);

      // Find or create rate limit document
      let rateLimit = await RateLimit.findOne({
        key,
        expireAt: { $gt: now },
      });

      if (!rateLimit) {
        rateLimit = await RateLimit.create({
          key,
          expireAt: new Date(now.getTime() + windowMs),
          requests: 1,
        });
        return next();
      }

      // Increment requests
      rateLimit.requests += 1;
      await rateLimit.save();

      // Check if limit exceeded
      if (rateLimit.requests > max) {
        throw new ApiError(429, 'Too many requests from this IP, please try again later.');
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - rateLimit.requests));
      res.setHeader('X-RateLimit-Reset', rateLimit.expireAt.getTime());

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        next(new ApiError(500, 'Internal server error while checking rate limit'));
      }
    }
  };
};

// Different rate limiters for different routes
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes for auth routes
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes for API routes
});

module.exports = {
  authLimiter,
  apiLimiter,
}; 