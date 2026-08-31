const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/announcements
router.get('/', async (req, res) => {
  const announcements = await store.getAnnouncements();
  res.json({ success: true, data: announcements });
});

// POST /api/announcements/circular
router.post('/circular', async (req, res) => {
  const newAnn = await store.addAnnouncement(req.body);
  res.json({ success: true, message: 'Department circular published live!', data: newAnn });
});

module.exports = router;
