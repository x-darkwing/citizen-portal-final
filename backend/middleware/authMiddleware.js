const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

exports.verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role === 'admin') {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Admin access required' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
