const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../authMiddleware');

router.get('/dashboard', authenticateToken, authorizeAdmin, (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

module.exports = router;