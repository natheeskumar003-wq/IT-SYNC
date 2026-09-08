/**
 * IT DIGITAL HUB - Messaging & Requests Express Route Handlers
 * Department of Information Technology - GCE Erode
 */

const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/messages?userId=...&role=...
router.get('/', async (req, res) => {
  try {
    const { userId, role } = req.query;
    const messages = await store.getMessages(userId, role);
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/messages (Send new message / request / DM / broadcast)
router.post('/', async (req, res) => {
  try {
    const { fromId, fromName, fromRole, toId, toName, toRole, type, subject, content } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ success: false, message: 'Subject and content are required.' });
    }
    const newMsg = await store.addMessage({
      fromId,
      fromName,
      fromRole,
      toId,
      toName,
      toRole,
      type: type || 'DM',
      subject,
      content
    });
    await store.addAuditLog(`Message Sent (${type || 'DM'})`, fromId || 'User', fromRole || 'USER');
    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMsg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/messages/:id/status (Approve / Reject / Mark read)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await store.updateMessageStatus(req.params.id, status || 'Approved');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: `Message marked as ${status}`, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/messages/class-advisors
router.get('/class-advisors', async (req, res) => {
  try {
    const advisors = await store.getClassAdvisors();
    res.json({ success: true, data: advisors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/messages/class-advisors/:year
router.put('/class-advisors/:year', async (req, res) => {
  try {
    const { staffId } = req.body;
    const updated = await store.updateClassAdvisor(req.params.year, staffId);
    res.json({ success: true, message: 'Class Advisor updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
