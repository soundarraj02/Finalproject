
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, username, staffName, dateOfJoining, comments } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
    const normalizedUsername = username ? username.trim() : undefined;
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }
    if (normalizedEmail) {
      const existingEmail = await User.findOne({ email: normalizedEmail });
      if (existingEmail) return res.status(400).json({ message: 'Email already in use' });
    }
    if (normalizedUsername) {
      const existingUsername = await User.findOne({ username: normalizedUsername });
      if (existingUsername) return res.status(400).json({ message: 'Username already in use' });
    }
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      username: normalizedUsername,
      staffName,
      dateOfJoining,
      comments,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, identifier } = req.body;
    const rawLookup = (identifier || email || '').trim();
    const lookup = rawLookup.includes('@') ? rawLookup.toLowerCase() : rawLookup;
    if (!lookup || !password) {
      return res.status(400).json({ message: 'Username or email and password are required' });
    }
    const user = await User.findOne({
      $or: [{ email: lookup }, { username: lookup }],
    });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/admins
router.get('/admins', require('../middleware/auth').protect, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
