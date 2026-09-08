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
    message: 'Invalid credentials. Please enter your registered ID and password.'
  });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/demo-credentials
router.get('/demo-credentials', (req, res) => {
  res.json({
    success: true,
    data: store.getCredentials ? store.getCredentials() : {
      student: { id: "25IT001", pass: "1234", role: "student", name: "Naveen Kumar R" },
      staff: { id: "ITSTAFF01", pass: "1234", role: "staff", name: "Prof. B. V. Prakash" },
      hod: { id: "ITHOD01", pass: "1234", role: "hod", name: "Dr.I. Bhuvaneshwarri" },
      admin: { id: "ITADMIN01", pass: "1234", role: "admin", name: "Er. M. Senthil Kumar" }
    }
  });
});

// PUT /api/auth/faculty/:id - Update faculty profile
router.put('/faculty/:id', async (req, res) => {
  try {
    const updated = await store.updateFaculty(req.params.id, req.body);
    if (updated) {
      res.json({ success: true, message: 'Faculty profile updated successfully', data: updated });
    } else {
      res.status(404).json({ success: false, message: 'Faculty member not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
