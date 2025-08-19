
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) return res.status(401).json({ error: 'User not found' });
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user.role = user.role;
      next();
    } catch (e) {
      next(e);
    }
  };
}

module.exports = { auth, requireRole };
