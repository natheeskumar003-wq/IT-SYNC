const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/marks/internal - Get all internal marks or filter by subjectCode / rollNo query
router.get('/internal', async (req, res) => {
  try {
    const { subjectCode, rollNo } = req.query;
    if (rollNo) {
      const studentMarks = await store.getStudentInternalMarks(rollNo);
      return res.json({ success: true, rollNo, data: studentMarks });
    }
    const marks = await store.getInternalMarks(subjectCode);
    res.json({ success: true, count: marks.length, data: marks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching internal marks: ' + err.message });
  }
});

// GET /api/marks/internal/student/:rollNo - Explicit student roll number route
router.get('/internal/student/:rollNo', async (req, res) => {
  try {
    const studentMarks = await store.getStudentInternalMarks(req.params.rollNo);
    res.json({ success: true, rollNo: req.params.rollNo, data: studentMarks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching student marks: ' + err.message });
  }
});

// GET /api/marks/internal/subject/:subjectCode - Explicit subject code route
router.get('/internal/subject/:subjectCode', async (req, res) => {
  try {
    const marks = await store.getInternalMarks(req.params.subjectCode);
    res.json({ success: true, subjectCode: req.params.subjectCode, data: marks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching subject marks: ' + err.message });
  }
});

// GET /api/marks/internal/:identifier - Flexible route: checks rollNo vs subjectCode
router.get('/internal/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    // Check if identifier is student roll number (e.g., 25IT001 or starts with digit)
    const isRollNo = /^[0-9]/.test(identifier) || identifier.toUpperCase().startsWith('2');
    if (isRollNo) {
      const studentMarks = await store.getStudentInternalMarks(identifier);
      res.json({ success: true, rollNo: identifier, data: studentMarks });
    } else {
      const marks = await store.getInternalMarks(identifier);
      res.json({ success: true, subjectCode: identifier, data: marks });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching internal marks: ' + err.message });
  }
});

// POST /api/marks/internal/batch - Staff publishes / updates internal marks batch
router.post('/internal/batch', async (req, res) => {
  try {
    const { subjectCode, examType, marks } = req.body;
    if (!subjectCode || !examType || !marks || !Array.isArray(marks)) {
      return res.status(400).json({
        success: false,
        message: 'subjectCode, examType, and marks array are required.'
      });
    }

    const result = await store.saveInternalMarksBatch(subjectCode, examType, marks);
    res.status(200).json({
      success: true,
      message: `${examType} marks for ${marks.length} students recorded and published successfully!`,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving internal marks batch: ' + err.message });
  }
});

module.exports = router;
