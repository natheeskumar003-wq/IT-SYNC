const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const store = require('../data/store');

// Multer storage for student certificates
const certUploadDir = path.join(__dirname, '../../uploads/certificates');
fs.mkdirSync(certUploadDir, { recursive: true });

const certStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, certUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `cert_${Date.now()}_${safeBase}${ext}`);
  }
});

const certUpload = multer({
  storage: certStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid format. Only JPG, PNG, and PDF certificate files are allowed.'));
    }
  }
});

// Multer storage for student achievements (Photo Upload Gallery)
const achieveUploadDir = path.join(__dirname, '../../uploads/achievements');
fs.mkdirSync(achieveUploadDir, { recursive: true });

const achieveStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, achieveUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `ach_${Date.now()}_${safeBase}${ext}`);
  }
});

const achieveUpload = multer({
  storage: achieveStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid format. Only JPG, PNG, and PDF achievement files are allowed.'));
    }
  }
});

// GET /api/students
router.get('/', async (req, res) => {
  const students = await store.getStudents();
  res.json({ success: true, data: students });
});

// GET /api/students/all
router.get('/all', async (req, res) => {
  const students = await store.getStudents();
  res.json({ success: true, data: students });
});

// GET /api/students/profile
router.get('/profile', async (req, res) => {
  const rollNo = req.query.rollNo || '24IT001';
  const profile = await store.getStudentProfile(rollNo);
  res.json({ success: true, data: profile });
});

// GET /api/students/profile/:rollNo
router.get('/profile/:rollNo', async (req, res) => {
  const profile = await store.getStudentProfile(req.params.rollNo);
  res.json({ success: true, data: profile });
});

// PUT /api/students/profile/:rollNo/contact
router.put('/profile/:rollNo/contact', async (req, res) => {
  const updated = await store.updateStudentContact(req.params.rollNo, req.body);
  res.json({ success: true, message: 'Contact info updated', data: updated });
});

// ============================================================
// STUDENT CRUD OPERATIONS (Add, Update, Delete Students)
// ============================================================

// POST /api/students - Create new student
router.post('/', async (req, res) => {
  try {
    if (!req.body.rollNo || !req.body.name) {
      return res.status(400).json({
        success: false,
        message: 'Roll No and Name are required'
      });
    }
    
    const newStudent = await store.addStudent(req.body);
    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: newStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student: ' + error.message
    });
  }
});

// PUT /api/students/:rollNo - Update student record
router.put('/:rollNo', async (req, res) => {
  try {
    const updated = await store.updateStudent(req.params.rollNo, req.body);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Student ${req.params.rollNo} not found`
      });
    }
    
    res.json({
      success: true,
      message: 'Student record updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student: ' + error.message
    });
  }
});

// DELETE /api/students/:rollNo - Remove student from system
router.delete('/:rollNo', async (req, res) => {
  try {
    const deleted = await store.deleteStudent(req.params.rollNo);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Student ${req.params.rollNo} not found`
      });
    }
    
    res.json({
      success: true,
      message: `Student ${req.params.rollNo} removed from database`,
      data: { rollNo: req.params.rollNo }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student: ' + error.message
    });
  }
});

// GET /api/students/achievements
router.get('/achievements', async (req, res) => {
  const achievements = await store.getAchievements();
  res.json({ success: true, data: achievements });
});

// GET /api/students/materials (Study materials alias)
router.get('/materials', async (req, res) => {
  const materials = await store.getStudyMaterials();
  res.json({ success: true, data: materials });
});

// POST /api/students/achievements (Supports multipart file upload or JSON)
router.post('/achievements', (req, res) => {
  achieveUpload.any()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
      const title = (req.body.title || (file ? path.parse(file.originalname).name : 'Student Achievement')).trim();
      const description = (req.body.description || req.body.desc || '').trim();
      const ext = file ? path.extname(file.originalname).toLowerCase() : (req.body.fileName ? path.extname(req.body.fileName).toLowerCase() : '.png');
      const isPdf = ext === '.pdf';

      const achData = {
        title,
        description: description || 'Special recognition & achievement award',
        category: req.body.category || 'Achievement',
        issuedBy: req.body.issuedBy || 'Institutional Recognition',
        uploadDate: new Date().toISOString().split('T')[0],
        date: req.body.date || new Date().toISOString().split('T')[0],
        fileName: file ? file.originalname : (req.body.fileName || `${title.replace(/\s+/g, '_')}${ext}`),
        fileUrl: file ? `/uploads/achievements/${file.filename}` : (req.body.fileUrl || ''),
        fileType: isPdf ? 'pdf' : 'image',
        studentName: req.body.studentName || 'Student',
        studentRoll: req.body.studentRoll || req.body.rollNo || ''
      };

      const newAch = await store.addAchievement(achData);
      res.status(201).json({ success: true, message: 'Achievement photo uploaded successfully', data: newAch });
    } catch (uploadErr) {
      res.status(500).json({ success: false, message: uploadErr.message });
    }
  });
});

// DELETE /api/students/achievements/:id
router.delete('/achievements/:id', async (req, res) => {
  try {
    const deleted = await store.deleteAchievement(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Achievement ${req.params.id} not found` });
    }
    res.json({ success: true, message: 'Achievement deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting achievement: ' + err.message });
  }
});

// GET /api/students/certificates
router.get('/certificates', async (req, res) => {
  const certs = await store.getCertificates();
  res.json({ success: true, data: certs });
});

// POST /api/students/certificates (Supports multipart file upload or JSON)
router.post('/certificates', (req, res) => {
  certUpload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const file = req.file;
      const title = (req.body.title || req.body.name || (file ? path.parse(file.originalname).name : 'Professional Certificate')).trim();
      const ext = file ? path.extname(file.originalname).toLowerCase() : (req.body.fileName ? path.extname(req.body.fileName).toLowerCase() : '.pdf');
      const isPdf = ext === '.pdf';

      const certData = {
        title: title,
        name: title,
        issuer: req.body.issuer || 'Institutional Verification Cell',
        credentialId: req.body.credentialId || `CRED-${Math.floor(100000 + Math.random() * 900000)}`,
        uploadDate: new Date().toISOString().split('T')[0],
        fileName: file ? file.originalname : (req.body.fileName || `${title.replace(/\s+/g, '_')}${ext}`),
        fileUrl: file ? `/uploads/certificates/${file.filename}` : (req.body.fileUrl || ''),
        fileType: isPdf ? 'pdf' : 'image',
        rollNo: req.body.rollNo || ''
      };

      const savedCert = await store.addCertificate(certData);
      res.json({
        success: true,
        message: 'Certificate uploaded successfully!',
        data: savedCert
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// DELETE /api/students/certificates/:id
router.delete('/certificates/:id', async (req, res) => {
  const success = await store.deleteCertificate(req.params.id);
  res.json({ success: true, message: 'Certificate deleted successfully' });
});

// POST /api/symposium/register (Handled here)
router.post('/symposium/register', (req, res) => {
  const epassCode = 'EPASS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  res.json({
    success: true,
    message: 'Symposium Delegate Pass generated!',
    epassCode,
    ...req.body
  });
});

module.exports = router;
