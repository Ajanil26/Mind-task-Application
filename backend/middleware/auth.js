const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      console.log('No Authorization header');
      return res.status(401).json({ message: 'No authentication token found' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('No token found in header');
      return res.status(401).json({ message: 'No authentication token found' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      // Add user id to request
      req.userId = decoded.userId;
      console.log('User ID set:', req.userId);
      
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth; 