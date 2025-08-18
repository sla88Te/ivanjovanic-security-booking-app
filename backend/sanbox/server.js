require('dotenv').config();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend radi!');
});

/* TEST SERVER */
const verifyToken = require('../middleware/auth');

app.get('/protected', verifyToken, (req, res) => {
  res.send(`Zdravo ${req.user.username}, pristup dozvoljen!`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
