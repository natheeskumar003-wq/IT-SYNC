const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/attendance/subjects
router.get('/subjects', async (req, res) => {
  const subjects = await store.getSubjects();
  res.json({ success: true, data: subjects });
});

// POST /api/attendance/batch
router.post('/batch', async (req, res) => {
  const { subjectCode, date, records } = req.body;
  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ success: false, message: 'Invalid attendance records payload' });
  }

  const result = await store.saveAttendanceBatch(subjectCode, date, records);
  res.json({
    success: true,
    message: `Attendance for ${records.length} students recorded successfully!`,
    data: result
  });
});

module.exports = router;
