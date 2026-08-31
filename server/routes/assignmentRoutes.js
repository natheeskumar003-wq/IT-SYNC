const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/assignments
router.get('/', async (req, res) => {
  const assignments = await store.getAssignments();
  res.json({ success: true, data: assignments });
});

// POST /api/assignments
router.post('/', async (req, res) => {
  const newAsn = await store.createAssignment(req.body);
  res.json({ success: true, message: 'Assignment created and assigned to students!', data: newAsn });
});

// POST /api/assignments/:id/submit
router.post('/:id/submit', async (req, res) => {
  const { rollNo, fileDetails } = req.body;
  const updated = await store.submitAssignment(req.params.id, rollNo, fileDetails || {});
  if (updated) {
    return res.json({ success: true, message: 'Assignment solution submitted successfully!', data: updated });
  }
  res.status(404).json({ success: false, message: 'Assignment not found' });
});

// PUT /api/assignments/:id/grade
router.put('/:id/grade', async (req, res) => {
  const { studentRollNo, score, remarks } = req.body;
  const updated = await store.gradeAssignment(req.params.id, studentRollNo, score, remarks);
  if (updated) {
    return res.json({ success: true, message: 'Grade and remarks published to student!', data: updated });
  }
  res.status(404).json({ success: false, message: 'Assignment not found' });
});

module.exports = router;
