const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const store = require('../data/store');

// Auto-create directory for study materials
const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads/study_materials');
if (!fs.existsSync(UPLOADS_ROOT)) {
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_ROOT)) {
      fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
    }
    cb(null, UPLOADS_ROOT);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${cleanBase || 'material'}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

// GET /api/materials - Retrieve all study materials
router.get('/', async (req, res) => {
  try {
    const materials = await store.getStudyMaterials();
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/materials - Upload new study material (supports multipart FormData and JSON)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const b = req.body || {};
    let fileUrl = b.fileUrl || '';
    let size = b.size || '1.5 MB';
    let type = b.type || 'PDF';

    if (req.file) {
      fileUrl = `/uploads/study_materials/${req.file.filename}`;
      size = formatBytes(req.file.size);
      const ext = path.extname(req.file.originalname).replace('.', '').toUpperCase();
      type = ext || 'PDF';
    }

    const teacherName = b.teacherName || b.teacher || b.author || b.faculty || 'Prof. B. V. Prakash';
    const uploadDate = b.uploadDate || b.date || new Date().toISOString().split('T')[0];

    const materialData = {
      title: b.title || 'Untitled Material',
      subject: b.subject || b.subjectName || b.subjectCode || 'IT Core',
      subjectName: b.subjectName || b.subject || 'Database Management Systems',
      code: b.code || b.subjectCode || 'IT8401',
      subjectCode: b.subjectCode || b.code || 'IT8401',
      unit: b.unit || 'Unit 1',
      author: teacherName,
      teacher: teacherName,
      teacherName: teacherName,
      faculty: teacherName,
      department: b.department || 'Information Technology',
      semester: b.semester || 'Semester 4',
      type: type,
      size: size,
      fileUrl: fileUrl,
      fileName: req.file ? req.file.originalname : (b.fileName || 'document.pdf'),
      downloads: 0,
      date: uploadDate,
      uploadDate: uploadDate
    };

    const newMat = await store.addStudyMaterial(materialData);
    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully!',
      data: newMat
    });
  } catch (error) {
    console.error('Error in POST /api/materials:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/materials/:id - Delete study material
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await store.deleteStudyMaterial(id);
    if (removed) {
      res.json({ success: true, message: 'Material deleted successfully', data: removed });
    } else {
      res.status(404).json({ success: false, message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
