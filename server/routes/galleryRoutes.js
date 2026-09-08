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

// Strict File Format Filter: Images (JPG, JPEG, PNG, WEBP) & Videos (MP4, MOV, AVI, WEBM)
const fileFilter = (req, file, cb) => {
  const allowedImageExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedVideoExts = ['.mp4', '.mov', '.avi', '.webm'];
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();

  const isImage = allowedImageExts.includes(ext) || mime.startsWith('image/');
  const isVideo = allowedVideoExts.includes(ext) || mime.startsWith('video/');

  if ((allowedImageExts.includes(ext) && isImage) || (allowedVideoExts.includes(ext) && isVideo)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format! Allowed: Photos (JPG, JPEG, PNG, WEBP) and Videos (MP4, MOV, AVI, WEBM).'));
  }
};

// Max Upload Size Limit: 100 MB (To comfortably support short and HD video clips)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB maximum
  }
});

// Helper: Handle Multer Errors Gracefully (Supports fields: 'file', 'image', or 'media')
const uploadFields = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'media', maxCount: 1 }
]);

const handleMulterUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Upload failed: File size exceeds the maximum limit of 100 MB.'
        });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (req.files) {
      req.file = req.files['file']?.[0] || req.files['image']?.[0] || req.files['media']?.[0];
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
      mediaType,
      view,
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
      mediaType,
      view,
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

// POST /api/gallery/upload - Real Multer File Upload & Metadata Persistence (Photos & Videos)
router.post('/upload', handleMulterUpload, async (req, res) => {
  try {
    const { title, description, section, category, department, eventYear, company } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Media title is required' });
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

    let mediaUrl = '';
    let localFilePath = null;
    let fileSize = null;
    let mimeType = null;
    let mediaType = 'photo';

    if (req.file) {
      const targetDir = path.join(UPLOADS_ROOT, subfolder);
      fs.mkdirSync(targetDir, { recursive: true });
      const targetPath = path.join(targetDir, req.file.filename);

      if (req.file.path !== targetPath && fs.existsSync(req.file.path)) {
        try {
          fs.renameSync(req.file.path, targetPath);
          req.file.path = targetPath;
        } catch (e) {
          console.warn('Could not relocate uploaded file to target section folder:', e);
        }
      }

      mediaUrl = `/uploads/gallery/${subfolder}/${req.file.filename}`;
      localFilePath = req.file.path;
      fileSize = req.file.size;
      mimeType = req.file.mimetype;

      const ext = path.extname(req.file.originalname).toLowerCase();
      const mime = (mimeType || '').toLowerCase();
      if (['.mp4', '.mov', '.avi', '.webm'].includes(ext) || mime.startsWith('video/')) {
        mediaType = 'video';
      }
    } else if (req.body.url && req.body.url.trim()) {
      mediaUrl = req.body.url.trim();
      if (req.body.mediaType) {
        mediaType = req.body.mediaType.toLowerCase();
      } else if (mediaUrl.match(/\.(mp4|mov|avi|webm)($|\?)/i)) {
        mediaType = 'video';
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'No media file uploaded! Please select a valid photo (JPG, JPEG, PNG, WEBP) or video (MP4, MOV, AVI, WEBM).'
      });
    }

    // Role-based Status Workflow
    // Students must go through "Pending Teacher Approval"; Faculty / HOD / Admin are Approved automatically
    const isStudent = (uploader.role || 'student').toLowerCase() === 'student';
    const status = isStudent ? 'Pending Teacher Approval' : 'Approved';

    const photoData = {
      title: title.trim(),
      description: (description || '').trim(),
      mediaType, // 'photo' or 'video'
      section: rawSection === 'events' ? 'event' : rawSection,
      category: (category || 'General').trim(),
      department: department || 'Information Technology',
      eventYear: eventYear || new Date().getFullYear().toString(),
      company: rawSection === 'placement' ? (company || null) : null,
      url: mediaUrl,
      localFilePath,
      fileSize,
      mimeType,
      date: req.body.date || new Date().toISOString().split('T')[0],
      uploadedBy: uploader,
      status
    };

    const newPhoto = await store.addGalleryPhoto(photoData);
    const mediaLabel = mediaType === 'video' ? 'Video' : 'Photo';

    const message = isStudent
      ? `${mediaLabel} uploaded successfully! Status: Pending Teacher Approval. Sent to faculty for review.`
      : `${mediaLabel} uploaded and published live to the gallery!`;

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
      ? 'Media approved! It is now visible in the Gallery.'
      : 'Media rejected and hidden from the Gallery.';

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

    res.json({ success: true, message: 'Media item and file removed successfully from gallery' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery/:id/stream - Direct HTTP 206 Partial Content Video Streaming Route
router.get('/:id/stream', async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await store.getGalleryPhotoById(id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Media file not found' });
    }

    let filePath = photo.localFilePath;
    if (!filePath || !fs.existsSync(filePath)) {
      // Fallback path resolution from url
      const relPath = photo.url.startsWith('/') ? photo.url.slice(1) : photo.url;
      filePath = path.resolve(__dirname, '../../', relPath);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Video file missing or deleted from disk' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'video/mp4';
    if (ext === '.webm') contentType = 'video/webm';
    else if (ext === '.mov') contentType = 'video/quicktime';
    else if (ext === '.avi') contentType = 'video/x-msvideo';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
        return;
      }

      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
