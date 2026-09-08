const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await store.getAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper handler for posting announcements
const postAnnouncementHandler = async (req, res) => {
  try {
    const newAnn = await store.addAnnouncement(req.body);
    res.status(201).json({
      success: true,
      message: 'Department circular / notice published live!',
      data: newAnn
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/announcements and POST /api/announcements/circular
router.post('/', postAnnouncementHandler);
router.post('/circular', postAnnouncementHandler);

// DELETE /api/announcements/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await store.deleteAnnouncement(req.params.id);
    if (removed) {
      res.json({ success: true, message: 'Announcement deleted successfully', data: removed });
    } else {
      res.status(404).json({ success: false, message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
