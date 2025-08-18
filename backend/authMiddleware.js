const jwt = require('jsonwebtoken');
const db = require('./config/db'); // ili kako već importuješ konekciju

// ✅ Verifikacija JWT tokena + blacklist provera
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Provera da li je token na blacklisti
    const [rows] = await db.query('SELECT * FROM token_blacklist WHERE token = ?', [token]);
    if (rows.length > 0) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    // Verifikacija tokena
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });

      // Dodaj korisnika u req za dalje korišćenje
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Provera da li je korisnik admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeAdmin
};
