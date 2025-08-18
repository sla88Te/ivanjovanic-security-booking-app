// index.js
require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const authRoutes = require('./middleware/auth'); // putanja do auth.js
const testDb = require('./config/db');
const adminRoutes = require('./routes/admin');
const { authenticateToken, authorizeAdmin } = require('./authMiddleware');
const db = require('./config/db');
const path = require('path');


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/user', authRoutes);
app.use('/api', require('./routes/upload-image'));
app.use('/images', express.static(path.join(__dirname, 'uploads/images')));

const cors = require('cors');
app.use(cors({ origin: 'https://localhost:4200', credentials: true }))
app.use(cors());

// Sertifikati (isti kao za frontend)
const key = fs.readFileSync('../frontend/ssl/key.pem');
const cert = fs.readFileSync('../frontend/ssl/cert.pem');

app.get('/', (req, res) => {
  res.send('API radi! Dobrodošao na početnu rutu.');
});

app.use('/admin', adminRoutes);

const jwt = require('jsonwebtoken');

// LOGIN ruta
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    // Ovdje je bezbedno destruktuirati jer user postoji
    const { id, email: userEmail, role, name, lastName, phoneNumber } = user;

    res.json({
      token,
      user: {
        id,
        email: userEmail,
        role,
        name,
        lastName, 
        phoneNumber
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/refresh-token', authenticateToken, async (req, res) => {
  const user = req.user;

  const newToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber
    },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );

  res.json({ token: newToken });
});

app.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    // Dodaj token u blacklist bazu
    db.query('INSERT INTO token_blacklist (token) VALUES (?)', [token]);
  }
  res.status(200).json({ message: 'Logged out' });
});


app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Zdravo, ${req.user.username}! Ovo je zaštićena ruta.` });
});

testDb.query('SELECT 1')
  .then(() => console.log('DB connection works'))
  .catch(err => console.error('DB error:', err));
/*
  const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};
*/
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    console.error('❌ Greška pri dobijanju svih korisnika:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Greška pri dobijanju korisnika po ID-u:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/*------------------ Destinations ---------------*/

app.get('/destinations', async (req, res) => {
  try {
    const query = 'SELECT * FROM destinations';
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/destinations/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM destinations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/destinations', authenticateToken, async (req, res) => {
  console.log('📥 Received body:', req.body);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  const { destinations, type, description, price } = req.body;

  try {
    const [result] = await db.execute(
        'INSERT INTO destinations (destinations, type, description, price) VALUES (?, ?, ?, ?)',
        [destinations, type, description, price]
      );

    res.status(201).json({
      id: result.insertId,
      destinations,
      type,
      description,
      price
    });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/destinations/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    // Prvo uzmi naziv destinacije
    const [rows] = await db.execute(
      'SELECT destinations FROM destinations WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const destinationName = rows[0].destinations.toLowerCase(); // osiguraj malo slovo
    const imagePath = path.join(__dirname, 'uploads/images', `${destinationName}.jpg`);

    // Pokušaj da obrišeš sliku
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.warn(`⚠️ Slika nije obrisana: ${imagePath}`);
      } else {
        console.log(`🗑️ Slika obrisana: ${imagePath}`);
      }
    });

    // Zatim obriši destinaciju iz baze
    const [result] = await db.execute(
      'DELETE FROM destinations WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Destination and image deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/*----------- Booking ---------------------------*/

app.get('/booking', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const userId = req.user.id;

    const query = isAdmin
      ? 'SELECT * FROM bookings'
      : 'SELECT * FROM bookings WHERE _userId = ?';

    const params = isAdmin ? [] : [userId];

    const [rows] = await db.execute(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/booking/:id', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const isAdmin = req.user.role === 'admin';
    const userId = req.user.id;

    const query = isAdmin
      ? 'SELECT * FROM bookings WHERE id = ?'
      : 'SELECT * FROM bookings WHERE id = ? AND user_id = ?';

    const params = isAdmin ? [bookingId] : [bookingId, userId];

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or access denied' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/destinations/book-now', authenticateToken, async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      numberOfGuests,
      name,
      lastName,
      phoneNumber,
      email
    } = req.body;

    const _userId = req.user.id;

    const query = `
      INSERT INTO bookings (
        destination, startDate, endDate, numberOfGuests,
        name, lastName, phoneNumber, email, _userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      destination,
      startDate,
      endDate,
      numberOfGuests,
      name,
      lastName,
      phoneNumber,
      email,
      _userId
    ];

    const [result] = await db.execute(query, params);

    const newBooking = {
      id: result.insertId,
      destination,
      startDate,
      endDate,
      numberOfGuests,
      name,
      lastName,
      phoneNumber,
      email,
      _userId,
      created_at: new Date().toISOString()
    };
    console.log('📥 Booking request received:', req.body);
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/booking/:id', authenticateToken, async (req, res) => {
  const bookingId = req.params.id;

  try {
    const [result] = await db.execute('DELETE FROM bookings WHERE id = ?', [bookingId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json({ message: '✅ Booking successfully deleted.' });
  } catch (error) {
    console.error('❌ Error deleting booking:', error);
    res.status(500).json({ message: 'Server error while deleting booking.' });
  }
});

app.use((req, res, next) => {
  console.log('🔍 Incoming request:', req.method, req.url);
  console.log('🧾 Headers:', req.headers);
  next();
});
app.get('/debug', (req, res) => {
  console.log('🔍 Headers:', req.headers);
  res.json({ headers: req.headers });
});


// Pokretanje HTTPS servera
https.createServer({ key, cert }, app).listen(3000, () => {
  console.log('✅ Backend radi na https://localhost:3000');
});

//app.listen(3000, () => console.log('Server running on port 3000'));
