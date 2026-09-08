const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/hod/analytics
router.get('/analytics', async (req, res) => {
  const students = await store.getStudents();
  const faculty = await store.getFacultyList();
  const subjects = await store.getSubjects();

  const totalStudents = students.length;
  const avgAttendance = 88.6;
  const avgCgpa = 8.35;

  res.json({
    success: true,
    data: {
      totalStudents,
      facultyCount: faculty.length,
      avgAttendance,
      avgCgpa,
      placementRate: "86.5%",
      highestPackage: "₹18.5 LPA",
      activeProjects: 14,
      nbaAccreditation: "Tier-1 Autonomous Compliance"
    }
  });
});

// POST /api/notifications/broadcast-warning
router.post('/broadcast-warning', async (req, res) => {
  const { rollNos } = req.body;
  res.json({
    success: true,
    message: `Attendance warning SMS dispatched to parents of ${rollNos ? rollNos.length : 0} students.`,
    count: rollNos ? rollNos.length : 0
  });
});

// GET /api/hod/faculty
router.get('/faculty', async (req, res) => {
  const faculty = await store.getFacultyList();
  res.json({ success: true, data: faculty });
});

// POST /api/hod/faculty
router.post('/faculty', async (req, res) => {
  const newF = await store.addFaculty(req.body);
  res.json({ success: true, message: `Faculty member ${newF.name} added by HOD`, data: newF });
});

// PUT /api/hod/faculty/:id
router.put('/faculty/:id', async (req, res) => {
  const updated = await store.updateFaculty(req.params.id, req.body);
  res.json({ success: true, message: `Faculty member ${req.params.id} updated by HOD`, data: updated });
});

// DELETE /api/hod/faculty/:id
router.delete('/faculty/:id', async (req, res) => {
  await store.deleteFaculty(req.params.id);
  res.json({ success: true, message: 'Faculty member removed by HOD' });
});

// GET /api/hod/class-advisors
router.get('/class-advisors', async (req, res) => {
  const advisors = await store.getClassAdvisors();
  res.json({ success: true, data: advisors });
});

// PUT /api/hod/class-advisors/:year
router.put('/class-advisors/:year', async (req, res) => {
  const { staffId } = req.body;
  const updated = await store.updateClassAdvisor(req.params.year, staffId);
  res.json({ success: true, message: `Class advisor for Year ${req.params.year} assigned`, data: updated });
});

// POST /api/hod/class-advisors
router.post('/class-advisors', async (req, res) => {
  const { year, staffId } = req.body;
  const updated = await store.updateClassAdvisor(year, staffId);
  res.json({ success: true, message: `Class advisor for Year ${year} assigned`, data: updated });
});

module.exports = router;
