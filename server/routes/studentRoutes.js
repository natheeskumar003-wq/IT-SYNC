const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/students
router.get('/', async (req, res) => {
  const students = await store.getStudents();
  res.json({ success: true, data: students });
});

// GET /api/students/profile/:rollNo
router.get('/profile/:rollNo', async (req, res) => {
  const profile = await store.getStudentProfile(req.params.rollNo);
  res.json({ success: true, data: profile });
});

// PUT /api/students/profile/:rollNo/contact
router.put('/profile/:rollNo/contact', async (req, res) => {
  const updated = await store.updateStudentContact(req.params.rollNo, req.body);
  res.json({ success: true, message: 'Contact info updated', data: updated });
});

// POST /api/students/achievements
router.post('/achievements', async (req, res) => {
  const achievement = await store.addAchievement(req.body);
  res.json({ success: true, message: 'Achievement added', data: achievement });
});

// POST /api/students/certificates
router.post('/certificates', async (req, res) => {
  const cert = await store.addCertificate(req.body);
  res.json({ success: true, message: 'Certificate uploaded', data: cert });
});

// POST /api/symposium/register (Handled here)
router.post('/symposium/register', (req, res) => {
  const epassCode = 'EPASS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  res.json({
    success: true,
    message: 'Symposium Delegate Pass generated!',
    epassCode,
    ...req.body
  });
});

module.exports = router;
