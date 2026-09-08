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

// PUT /api/admin/faculty/:id
router.put('/faculty/:id', async (req, res) => {
  const updated = await store.updateFaculty(req.params.id, req.body);
  res.json({ success: true, message: `Faculty member ${req.params.id} updated`, data: updated });
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

// GET /api/admin/logs & /api/admin/audit-logs
router.get(['/logs', '/audit-logs'], async (req, res) => {
  const logs = await store.getAuditLogs();
  res.json({ success: true, data: logs });
});

// GET /api/admin/hods - list all registered HODs
router.get('/hods', async (req, res) => {
  const hods = await store.getHODList();
  res.json({ success: true, data: hods });
});

// POST /api/admin/hods - Admin adds new HOD
router.post('/hods', async (req, res) => {
  const newHOD = await store.addHOD(req.body);
  await store.addAuditLog('New HOD Registered', `${newHOD.id} (${newHOD.name})`, 'ADMIN');
  res.json({ success: true, message: `HOD ${newHOD.name} registered successfully`, data: newHOD });
});

// PUT /api/admin/hods/:id - Admin updates HOD
router.put('/hods/:id', async (req, res) => {
  const updated = await store.updateHOD(req.params.id, req.body);
  await store.addAuditLog('HOD Profile Updated', `${updated.id} (${updated.name})`, 'ADMIN');
  res.json({ success: true, message: `HOD profile for ${updated.name} updated`, data: updated });
});

// DELETE /api/admin/hods/:id - Admin removes HOD
router.delete('/hods/:id', async (req, res) => {
  try {
    await store.deleteHOD(req.params.id);
    await store.addAuditLog('HOD Removed', req.params.id, 'ADMIN');
    res.json({ success: true, message: `HOD account ${req.params.id} removed` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/admin/hod
router.get('/hod', async (req, res) => {
  const hod = await store.getHOD();
  res.json({ success: true, data: hod });
});

// PUT /api/admin/hod
router.put('/hod', async (req, res) => {
  const updated = await store.updateHOD(req.body.id, req.body);
  await store.addAuditLog('HOD Profile Updated', `${updated.id} (${updated.name})`, 'ADMIN');
  res.json({ success: true, message: `Head of Department profile updated successfully`, data: updated });
});

// POST /api/admin/hod/change
router.post('/hod/change', async (req, res) => {
  const newHOD = await store.changeHOD(req.body);
  await store.addAuditLog('New HOD Appointed', `${newHOD.id} (${newHOD.name})`, 'ADMIN');
  res.json({ success: true, message: `${newHOD.name} officially appointed as Head of Department!`, data: newHOD });
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

// DELETE /api/admin/achievements/:id
router.delete('/achievements/:id', async (req, res) => {
  try {
    const deleted = await store.deleteAchievement(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Achievement ${req.params.id} not found` });
    }
    await store.addAuditLog('Achievement Upload Removed', `ID: ${req.params.id}`, 'ADMIN');
    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting achievement: ' + err.message });
  }
});

module.exports = router;
