/**
 * ============================================================================
 * IT DIGITAL HUB - Node.js & Express REST API Server
 * Department of Information Technology - Government College of Engineering, Erode
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import modular routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const materialRoutes = require('./routes/materialRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const hodRoutes = require('./routes/hodRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const marksRoutes = require('./routes/marksRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    port: 5000,
    service: 'IT Digital Hub Node.js Express API',
    institution: 'Government College of Engineering, Erode',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/students/leave', leaveRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', adminRoutes);
app.use('/api/gallery', galleryRoutes);

// 404 handler for API routes (prevents fallback to index.html for API requests)
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Serve uploaded media files statically with auto-directory creation
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(path.join(uploadsDir, 'certificates'), { recursive: true });
fs.mkdirSync(path.join(uploadsDir, 'achievements'), { recursive: true });
fs.mkdirSync(path.join(uploadsDir, 'study_materials'), { recursive: true });
['department', 'symposium', 'events', 'placement'].forEach(sub => {
  fs.mkdirSync(path.join(uploadsDir, 'gallery', sub), { recursive: true });
});

// Smart Cross-Folder Resolver for Gallery Media (Seamless playback regardless of section subfolder)
app.get('/uploads/gallery/:section/:filename', (req, res, next) => {
  const { section, filename } = req.params;
  const directPath = path.join(uploadsDir, 'gallery', section, filename);
  if (fs.existsSync(directPath)) {
    return next();
  }
  const galleryFolders = ['department', 'symposium', 'events', 'placement'];
  for (const folder of galleryFolders) {
    const altPath = path.join(uploadsDir, 'gallery', folder, filename);
    if (fs.existsSync(altPath)) {
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.mp4') contentType = 'video/mp4';
      else if (ext === '.webm') contentType = 'video/webm';
      else if (ext === '.mov') contentType = 'video/quicktime';
      else if (ext === '.avi') contentType = 'video/x-msvideo';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');
      return res.sendFile(altPath);
    }
  }
  next();
});

// Stream and serve uploaded media files with strict MIME types & Range request support
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.mp4') res.setHeader('Content-Type', 'video/mp4');
    else if (ext === '.webm') res.setHeader('Content-Type', 'video/webm');
    else if (ext === '.mov') res.setHeader('Content-Type', 'video/quicktime');
    else if (ext === '.avi') res.setHeader('Content-Type', 'video/x-msvideo');
    else if (ext === '.jpg' || ext === '.jpeg') res.setHeader('Content-Type', 'image/jpeg');
    else if (ext === '.png') res.setHeader('Content-Type', 'image/png');
    else if (ext === '.webp') res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Accept-Ranges', 'bytes');
  }
}));

// Guard: Missing upload files must return 404 immediately (do NOT fall through to SPA index.html)
app.all('/uploads/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Media file ${req.originalUrl} not found on server`
  });
});

// Serve static frontend files if hosted together
app.use(express.static(path.join(__dirname, '..')));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start Express Server only when executed directly
if (require.main === module) {
  const { execSync } = require('child_process');

  const killProcessOnPort = (targetPort) => {
    try {
      if (process.platform === 'win32') {
        const stdout = execSync(`netstat -ano -p tcp | findstr :${targetPort}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        const lines = stdout.split('\n');
        const pids = new Set();
        for (const line of lines) {
          if (line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0' && pid !== String(process.pid)) {
              pids.add(pid);
            }
          }
        }
        for (const pid of pids) {
          try {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
            console.log(`[Single-Port Enforcer] Released stale process PID ${pid} occupying port ${targetPort}`);
          } catch (e) {}
        }
      } else {
        execSync(`fuser -k ${targetPort}/tcp 2>/dev/null || true`, { stdio: 'ignore' });
      }
    } catch (err) {
      // Port clear or command error
    }
  };

  const SINGLE_PORT = Number(process.env.PORT) || 5000;

  const startServer = (port = SINGLE_PORT, retriesLeft = 3) => {
    const server = app.listen(port, () => {
      console.log(`
  =============================================================
  🚀 IT DIGITAL HUB - Node.js Express Server Running!
  🏫 Department of Information Technology - GCE Erode
  📡 Unified Single-Port URL : http://localhost:${port}
  📡 REST API Base           : http://localhost:${port}/api
  🩺 Health Endpoint         : http://localhost:${port}/api/health
  =============================================================
      `);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        if (retriesLeft > 0) {
          console.warn(`\n⚠️  Port ${port} is currently busy. Reclaiming port ${port} immediately...`);
          killProcessOnPort(port);
          setTimeout(() => {
            startServer(port, retriesLeft - 1);
          }, 350);
        } else {
          console.error(`\n❌ Could not bind to single port ${port} after multiple attempts. Please verify port ${port}.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
      }
    });
  };

  startServer(SINGLE_PORT);
}

module.exports = app;
