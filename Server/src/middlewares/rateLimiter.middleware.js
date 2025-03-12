import { RateLimit } from '../models/rateLimit.model.js';
import { ApiError } from '../utils/ApiError.js';

const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes by default
  const max = options.max || 10000; // Limit each IP to 100 requests per windowMs

  return async (req, res, next) => {
    try {
      // Log current environment
      console.log('Current NODE_ENV:', process.env.NODE_ENV);

      // Skip rate limiting for development and test environments
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.log('Rate limiting bypassed for development/test environment');
        return next();
      }

      const key = `${req.ip}-${req.originalUrl}`;
      const now = new Date();

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
        console.log(`Rate limit exceeded: ${rateLimit.requests} requests (max: ${max})`);
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
        console.error('Rate limiter error:', error);
        next(new ApiError(500, 'Internal server error while checking rate limit'));
      }
    }
  };
};

// Different rate limiters for different routes with more lenient development limits
const authLimiter = createRateLimiter({
  windowMs: process.env.NODE_ENV === 'production' 
    ? 15 * 60 * 1000  // 15 minutes in production
    : 5 * 60 * 1000,  // 5 minutes in development/test
  max: process.env.NODE_ENV === 'production' 
    ? 5  // 5 requests per 15 minutes in production
    : 500 // 500 requests per 5 minutes in development/test
});

const apiLimiter = createRateLimiter({
  windowMs: process.env.NODE_ENV === 'production'
    ? 15 * 60 * 1000  // 15 minutes in production
    : 5 * 60 * 1000,  // 5 minutes in development/test
  max: process.env.NODE_ENV === 'production'
    ? 100  // 100 requests per 15 minutes in production
    : 5000 // 5000 requests per 5 minutes in development/test
});

export {
  authLimiter,
  apiLimiter,
}; 