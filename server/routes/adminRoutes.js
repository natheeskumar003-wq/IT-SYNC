const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/admin/faculty
router.get('/faculty', async (req, res) => {
  const faculty = await store.getFacultyList();
  res.json({ success: true, data: faculty });
});

// POST /api/admin/faculty
router.post('/faculty', async (req, res) => {
  const newF = await store.addFaculty(req.body);
  res.json({ success: true, message: `Faculty member ${newF.name} added`, data: newF });
});

// DELETE /api/admin/faculty/:id
router.delete('/faculty/:id', async (req, res) => {
  await store.deleteFaculty(req.params.id);
  res.json({ success: true, message: 'Faculty member removed' });
});

// POST /api/admin/students
router.post('/students', async (req, res) => {
  const newS = await store.addStudent(req.body);
  res.json({ success: true, message: `Student ${newS.name} enrolled`, data: newS });
});

// PUT /api/admin/students/:rollNo
router.put('/students/:rollNo', async (req, res) => {
  const updated = await store.updateStudent(req.params.rollNo, req.body);
  res.json({ success: true, message: `Student ${req.params.rollNo} updated`, data: updated });
});

// DELETE /api/admin/students/:rollNo
router.delete('/students/:rollNo', async (req, res) => {
  await store.deleteStudent(req.params.rollNo);
  res.json({ success: true, message: `Student ${req.params.rollNo} removed` });
});

// GET /api/admin/logs
router.get('/logs', async (req, res) => {
  const logs = await store.getAuditLogs();
  res.json({ success: true, data: logs });
});

// POST /api/admin/backup/export
router.post('/backup/export', (req, res) => {
  res.json({
    success: true,
    message: 'System database snapshot generated successfully!',
    filename: `gce_it_hub_dump_${new Date().toISOString().split('T')[0]}.sql`,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
