const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeAdmin } = require('../authMiddleware');
const cors = require('cors');

router.use(cors({ origin: 'https://localhost:4200' }));

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return res.status(403).json({ message: 'Token nije prosleđen' });

  const parts = bearerHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).json({ message: 'Neispravan format tokena' });
  }

  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Nevažeći token' });
    req.user = decoded;
    next();
  });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ✅ Ovde dodaješ JWT generisanje sa role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken: token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout ruta
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });

  await db.query('INSERT INTO token_blacklist (token) VALUES (?)', [token]);
  res.status(200).json({ message: 'Logged out successfully' });
});

// Test ruta za profil
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Dobrodošao na svoj profil!',
    user: req.user,
  });
});

/* Register ruta
 * Ova ruta omogućava registraciju novog korisnika.
 * Proverava da li korisnik već postoji i ako ne, kreira ga.
 */
router.post('/register', async (req, res) => {
  const { name, lastName, phoneNumber, email, password } = req.body;

  if (!name || !lastName || !phoneNumber || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 👇 1. Provera da li email već postoji
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 👇 2. Hashovanje lozinke
    const password_hash = await bcrypt.hash(password, 10);
    const role = 'user';

    // 👇 3. Upis u bazu
    const query = `
      INSERT INTO users (name, lastName, phoneNumber, role, email, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [name, lastName, phoneNumber, role, email, password_hash];

    console.log('📥 Executing DB insert...');
    const [result] = await db.query(query, values);
    console.log('✅ DB insert result:', result);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('❌ DB insert error:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

router.post('/register-admin', async (req, res) => {
  const { email, password, name, lastName, phoneNumber } = req.body;

  try {
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (email, password, name, lastName, phoneNumber, role) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name, lastName, phoneNumber, 'admin']
    );

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
