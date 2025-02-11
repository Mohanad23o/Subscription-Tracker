import aj from '../config/arcjet.js';

const arjectMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {requested: 1});
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({error: 'Rate limit exceeded',});
      }

      if (decision.reason.isBot()) {
        res.status(403).json({error: 'Bot detected',});
      }

      return res.status(403).json({error: 'Access denied',});
    }

    next();
  } catch (error) {
    console.log(`Arjet Middleware Error: ${error}`);
    next();
  }
}

export default arjectMiddleware;