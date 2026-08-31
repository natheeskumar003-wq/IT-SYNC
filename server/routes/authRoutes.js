const express = require('express');
const router = express.Router();
const store = require('../data/store');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { role, userId, password } = req.body;
  if (!role || !userId || !password) {
    return res.status(400).json({ success: false, message: 'Please provide role, userId, and password.' });
  }

  const user = await store.validateUser(role, userId, password);
  if (user) {
    await store.addAuditLog('User Login', `${user.id} (${user.name})`, role);
    return res.json({
      success: true,
      message: 'Login successful',
      token: `gce_token_${Date.now()}`,
      user
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Check demo credentials on the login screen.'
  });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  return res.json({ success: true, valid: true });
});

module.exports = router;
