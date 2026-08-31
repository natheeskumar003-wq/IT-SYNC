const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/materials
router.get('/', async (req, res) => {
  const materials = await store.getStudyMaterials();
  res.json({ success: true, data: materials });
});

// POST /api/materials
router.post('/', async (req, res) => {
  const newMat = await store.addStudyMaterial(req.body);
  res.json({ success: true, message: 'Study material uploaded to department repository!', data: newMat });
});

module.exports = router;
