import jwt from 'jsonwebtoken';

// Middleware to ensure the user is authenticated
export function authRequired(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Verify token and attach user info to request
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Middleware to ensure the user has admin role
export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}
