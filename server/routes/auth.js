const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple single-user auth for studio owner
// In production, store in DB. For now hardcoded via env.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@clikzweddingfilms.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('clikz@123', 10);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, email });
});

module.exports = router;
