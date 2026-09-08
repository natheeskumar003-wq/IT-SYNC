const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/attendance
router.get('/', async (req, res) => {
  const rollNo = req.query.rollNo || '24IT001';
  const data = await store.getAttendance(rollNo);
  res.json({ success: true, data });
});

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

// GET /api/attendance/:identifier (either subjectCode or rollNo)
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isRollNo = /^[0-9]/.test(identifier) || identifier.toUpperCase().startsWith('2');
    if (isRollNo) {
      const data = await store.getAttendance(identifier);
      res.json({ success: true, rollNo: identifier, data });
    } else {
      const records = await store.getAttendanceRecords(identifier);
      res.json({ success: true, subjectCode: identifier, count: records.length, data: records });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
