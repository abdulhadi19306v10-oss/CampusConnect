const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secret_token');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};

const adminOrFaculty = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'FACULTY')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized' });
  }
};

module.exports = { auth, admin, adminOrFaculty };
