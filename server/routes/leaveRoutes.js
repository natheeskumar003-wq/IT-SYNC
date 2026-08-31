const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/students/leave
router.get('/', async (req, res) => {
  const leaves = await store.getLeaveRequests();
  res.json({ success: true, data: leaves });
});

// POST /api/students/leave/apply
router.post('/apply', async (req, res) => {
  const newLeave = await store.applyLeave(req.body);
  res.json({ success: true, message: 'Leave application submitted for review!', data: newLeave });
});

// PATCH /api/students/leave/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const updated = await store.updateLeaveStatus(req.params.id, status);
  if (updated) {
    return res.json({ success: true, message: `Application status updated to ${status}`, data: updated });
  }
  res.status(404).json({ success: false, message: 'Leave request not found' });
});

module.exports = router;
