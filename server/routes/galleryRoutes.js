/**
 * IT DIGITAL HUB - Real Gallery File Upload & Management REST API
 * Supports Department, Symposium, Events, and Placement Galleries
 * Powered by Multer with Automatic Directory Creation & ACID Storage
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const store = require('../data/store');

// Auto-create required gallery upload directories
const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads/gallery');
const GALLERY_FOLDERS = ['department', 'symposium', 'events', 'placement'];

GALLERY_FOLDERS.forEach(folder => {
  const fullPath = path.join(UPLOADS_ROOT, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Configure Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rawSection = (req.body.section || 'department').toLowerCase();
    let subfolder = 'department';
    if (rawSection === 'symposium') subfolder = 'symposium';
    else if (rawSection === 'event' || rawSection === 'events') subfolder = 'events';
    else if (rawSection === 'placement') subfolder = 'placement';

    const targetDir = path.join(UPLOADS_ROOT, subfolder);
    fs.mkdirSync(targetDir, { recursive: true });
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 35);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

// Strict File Format Filter (JPG, JPEG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format! Only JPG, JPEG, PNG, and WEBP image files are accepted.'));
  }
};

// Max Upload Size Limit: 10 MB
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB maximum
  }
});

// Helper: Handle Multer Errors Gracefully
const handleMulterUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Upload failed: File size exceeds the maximum limit of 10 MB.'
        });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// =========================================================================
// API ROUTES
// =========================================================================

// GET /api/gallery/analytics - Summary metrics for HOD and Admin
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await store.getGalleryAnalytics();
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery - Fetch photos with multi-criteria filtering & search
router.get('/', async (req, res) => {
  try {
    const {
      section,
      category,
      department,
      eventYear,
      company,
      status,
      search,
      userRole,
      userId
    } = req.query;

    const photos = await store.getGalleryPhotos({
      section,
      category,
      department,
      eventYear,
      company,
      status,
      search,
      userRole,
      userId
    });

    res.json({ success: true, count: photos.length, data: photos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gallery/upload - Real Multer File Upload & Metadata Persistence
router.post('/upload', handleMulterUpload, async (req, res) => {
  try {
    const { title, description, section, category, department, eventYear, company } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Photo title is required' });
    }

    // Determine uploader info
    let uploader = { id: 'GUEST', name: 'Academic User', role: 'student' };
    if (req.body.uploadedBy) {
      if (typeof req.body.uploadedBy === 'string') {
        try {
          uploader = JSON.parse(req.body.uploadedBy);
        } catch (e) {
          uploader = { id: req.body.uploadedBy, name: req.body.uploadedBy, role: 'student' };
        }
      } else if (typeof req.body.uploadedBy === 'object') {
        uploader = req.body.uploadedBy;
      }
    }

    // Determine target subfolder & public URL
    const rawSection = (section || 'department').toLowerCase();
    let subfolder = 'department';
    if (rawSection === 'symposium') subfolder = 'symposium';
    else if (rawSection === 'event' || rawSection === 'events') subfolder = 'events';
    else if (rawSection === 'placement') subfolder = 'placement';

    let imageUrl = '';
    let localFilePath = null;
    let fileSize = null;
    let mimeType = null;

    if (req.file) {
      imageUrl = `/uploads/gallery/${subfolder}/${req.file.filename}`;
      localFilePath = req.file.path;
      fileSize = req.file.size;
      mimeType = req.file.mimetype;
    } else if (req.body.url && req.body.url.trim()) {
      imageUrl = req.body.url.trim();
    } else {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded! Please select a valid JPG, JPEG, PNG, or WEBP image file.'
      });
    }

    // Role-based Status Workflow
    const isStudent = (uploader.role || 'student').toLowerCase() === 'student';
    const status = isStudent ? 'Pending Approval' : 'Approved';

    const photoData = {
      title: title.trim(),
      description: (description || '').trim(),
      section: rawSection === 'events' ? 'event' : rawSection,
      category: (category || 'Campus Event').trim(),
      department: department || 'Information Technology',
      eventYear: eventYear || new Date().getFullYear().toString(),
      company: rawSection === 'placement' ? (company || null) : null,
      url: imageUrl,
      localFilePath,
      fileSize,
      mimeType,
      date: req.body.date || new Date().toISOString().split('T')[0],
      uploadedBy: uploader,
      status
    };

    const newPhoto = await store.addGalleryPhoto(photoData);

    const message = isStudent
      ? 'Photograph uploaded successfully! Status: Pending Approval. Sent to faculty for review.'
      : 'Photograph uploaded and published live to the gallery!';

    res.status(201).json({
      success: true,
      message,
      data: newPhoto
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gallery/:id/like - Toggle like on photo
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required to like a photo' });
    }

    const result = await store.togglePhotoLike(id, userId);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Photograph not found' });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gallery/:id/comment - Add comment to photo
router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, userRole, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const comment = await store.addPhotoComment(id, { userId, userName, userRole, text: text.trim() });
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Photograph not found' });
    }

    res.status(201).json({ success: true, message: 'Comment posted successfully', data: comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/gallery/:id/status - Approve or reject photo (Teacher / HOD / Admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status value is required' });
    }

    const photo = await store.updatePhotoStatus(id, status);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photograph not found' });
    }

    const isApproved = (status || '').toLowerCase() === 'approved';
    const message = isApproved
      ? 'Photograph approved! It is now visible in the Gallery.'
      : 'Photograph rejected and hidden from the Gallery.';

    res.json({
      success: true,
      message,
      data: photo
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/gallery/:id - Update photo metadata (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await store.updateGalleryPhoto(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Photograph not found' });
    }

    res.json({
      success: true,
      message: 'Photograph metadata updated successfully!',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/gallery/:id - Delete photo (Removes metadata & physical disk file)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteGalleryPhoto(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Photograph not found or already deleted' });
    }

    res.json({ success: true, message: 'Photograph and file removed successfully from gallery' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
