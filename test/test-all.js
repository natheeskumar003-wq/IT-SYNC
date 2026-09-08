/**
 * IT DIGITAL HUB - Automated Verification & Test Suite
 * Tests Server REST APIs, Route Handlers, Database Store, and Frontend Component Logic
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🧪 IT DIGITAL HUB - Automated Verification Suite');
console.log('🏫 Department of Information Technology - GCE Erode');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// ==========================================
// TEST SUITE 1: JS Syntax Verification
// ==========================================
console.log('🔹 Test Suite 1: JavaScript Syntax Verification');
const filesToCheck = [
  'server/server.js',
  'server/data/store.js',
  'server/routes/authRoutes.js',
  'server/routes/studentRoutes.js',
  'server/routes/attendanceRoutes.js',
  'server/routes/assignmentRoutes.js',
  'server/routes/materialRoutes.js',
  'server/routes/leaveRoutes.js',
  'server/routes/announcementRoutes.js',
  'server/routes/hodRoutes.js',
  'server/routes/adminRoutes.js',
  'server/routes/messageRoutes.js',
  'server/routes/galleryRoutes.js',
  'server/data/gallerySeed.js',
  'src/app-portal.js',
  'src/app.bundle.js',
  'src/App.js',
  'src/main.js',
  'src/services/api.js',
  'src/data/mockData.js',
  'src/context/AuthContext.js',
  'src/components/common/Icons.js',
  'src/components/common/UIComponents.js',
  'src/components/auth/LoginPage.js',
  'src/components/student/StudentViews.js',
  'src/components/staff/StaffViews.js',
  'src/components/hod/HODViews.js',
  'src/components/admin/AdminViews.js',
  'src/components/gallery/GalleryView.js'
];

for (const f of filesToCheck) {
  const full = path.join(rootDir, f);
  let ok = false;
  try {
    execSync(`node --check "${full}"`, { stdio: 'pipe' });
    ok = true;
  } catch (err) {
    ok = false;
  }
  assert(ok, `Syntax valid: ${f}`);
}

// ==========================================
// TEST SUITE 2: Express Server & REST API Endpoints
// ==========================================
console.log('\n🔹 Test Suite 2: Express Server & REST API Endpoints');

const app = require('../server/server.js');
const server = http.createServer(app);

server.listen(5099, async () => {
  const apiEndpoints = [
    { url: '/api/health', expectedStatus: 200, key: 'status', expectedVal: 'online' },
    { url: '/api/auth/demo-credentials', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/students/profile', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/students/all', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/attendance', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/attendance/subjects', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/assignments', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/materials', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/announcements', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/hod/analytics', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/admin/audit-logs', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/admin/faculty', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/messages', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/messages/class-advisors', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/gallery', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/gallery/analytics', expectedStatus: 200, key: 'success', expectedVal: true },
    { url: '/api/unknown-route-test', expectedStatus: 404, key: 'success', expectedVal: false }
  ];

  for (const ep of apiEndpoints) {
    await new Promise((resolve) => {
      http.get(`http://localhost:5099${ep.url}`, (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', () => {
          let parsed = {};
          try { parsed = JSON.parse(raw); } catch (e) {}
          const statusOk = res.statusCode === ep.expectedStatus;
          const valOk = parsed[ep.key] === ep.expectedVal;
          assert(statusOk && valOk, `Endpoint ${ep.url} -> HTTP ${res.statusCode}`);
          resolve();
        });
      }).on('error', (e) => {
        assert(false, `Endpoint ${ep.url} error: ${e.message}`);
        resolve();
      });
    });
  }

  // Static Assets Verification
  console.log('\n🔹 Test Suite 3: Static Asset & Frontend Bundle Integrity');
  const staticAssets = [
    { file: 'index.html', desc: 'Precompiled index.html entry' },
    { file: 'src/app-portal.js', desc: 'Compiled App Portal bundle' },
    { file: 'src/app.bundle.js', desc: 'Department core bundle' },
    { file: 'src/styles/portal.css', desc: 'Glassmorphism stylesheet' },
    { file: 'assets/vendor/react/react.production.min.js', desc: 'React 18 production vendor' },
    { file: 'assets/vendor/react/react-dom.production.min.js', desc: 'ReactDOM 18 production vendor' }
  ];

  for (const a of staticAssets) {
    const exists = fs.existsSync(path.join(rootDir, a.file));
    assert(exists, `Asset present: ${a.desc} (${a.file})`);
  }

  // Clean shutdown
  server.close(() => {
    console.log('\n====================================================');
    console.log(`📊 Summary: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('====================================================');
    process.exit(passedTests === totalTests ? 0 : 1);
  });
});
