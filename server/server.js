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
    status: 'online',
    service: 'IT Digital Hub Node.js Express API',
    institution: 'Government College of Engineering, Erode',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students/leave', leaveRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend files if hosted together
app.use(express.static(path.join(__dirname, '..')));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`
  =============================================================
  🚀 IT DIGITAL HUB - Node.js Express Server Running!
  🏫 Department of Information Technology - GCE Erode
  📡 API URL : http://localhost:${PORT}/api
  🩺 Health  : http://localhost:${PORT}/api/health
  =============================================================
  `);
});

module.exports = app;
