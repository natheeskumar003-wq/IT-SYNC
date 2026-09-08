/**
 * IT DIGITAL HUB - Real Gallery File Upload Verification Test Suite
 * Tests real binary multipart uploads, destination subfolders, size limits, format validation,
 * approval workflow (Teacher/HOD/Admin), public visibility, and file deletion from disk.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
const UPLOADS_ROOT = path.resolve(__dirname, '../uploads/gallery');

function buildMultipartBody(fields, fileField) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
  const parts = [];

  for (const [key, value] of Object.entries(fields)) {
    parts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
    ));
  }

  if (fileField) {
    parts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\nContent-Type: ${fileField.contentType}\r\n\r\n`
    ));
    parts.push(fileField.buffer);
    parts.push(Buffer.from('\r\n'));
  }

  parts.push(Buffer.from(`--${boundary}--\r\n`));
  const bodyBuffer = Buffer.concat(parts);
  return {
    boundary,
    contentType: `multipart/form-data; boundary=${boundary}`,
    body: bodyBuffer
  };
}

function sendRequest(method, endpoint, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { ...headers }
    };
    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const request = http.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });

    request.on('error', reject);
    if (body) request.write(body);
    request.end();
  });
}

function sendJson(method, endpoint, data = null) {
  const body = data ? JSON.stringify(data) : null;
  const headers = { 'Content-Type': 'application/json' };
  return sendRequest(method, endpoint, headers, body);
}

function sendMultipart(endpoint, fields, fileField) {
  const { contentType, body } = buildMultipartBody(fields, fileField);
  const headers = { 'Content-Type': contentType };
  return sendRequest('POST', endpoint, headers, body);
}

async function run() {
  console.log('===============================================================');
  console.log('📸 IT DIGITAL HUB - REAL GALLERY FILE UPLOAD VERIFICATION');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // 1. Check auto-created folders
  const requiredFolders = ['department', 'symposium', 'events', 'placement'];
  for (const f of requiredFolders) {
    const dir = path.join(UPLOADS_ROOT, f);
    assert(fs.existsSync(dir), `Folder exists: uploads/gallery/${f}/`);
  }

  // 2. Test Real Binary Image Upload as Student (Department Section)
  // Create a minimal 1x1 valid PNG buffer
  const samplePng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  const studentUpload = await sendMultipart(
    '/api/gallery/upload',
    {
      title: 'Real Student Lab Project',
      description: 'Captured during advanced distributed systems lab session.',
      section: 'department',
      category: 'Cloud Computing Lab',
      department: 'Information Technology',
      eventYear: '2026',
      uploadedBy: JSON.stringify({ id: '24IMT30', name: 'Nathees Kumar T', role: 'student' })
    },
    {
      name: 'image',
      filename: 'student_lab_capture.png',
      contentType: 'image/png',
      buffer: samplePng
    }
  );

  assert(studentUpload.status === 201, `Student real PNG upload returned HTTP 201 (Got: ${studentUpload.status})`);
  const uploadedPhoto = studentUpload.body?.data;
  assert(uploadedPhoto?.title === 'Real Student Lab Project', 'Metadata saved: title correctly saved');
  assert(uploadedPhoto?.status === 'Pending Approval', `Status saved as "Pending Approval" (Got: "${uploadedPhoto?.status}")`);
  assert(uploadedPhoto?.url && uploadedPhoto.url.startsWith('/uploads/gallery/department/'), `Saved in correct folder URL: ${uploadedPhoto?.url}`);
  assert(uploadedPhoto?.localFilePath && fs.existsSync(uploadedPhoto.localFilePath), `Physical disk file exists at: ${uploadedPhoto?.localFilePath}`);

  // 3. Test Symposium Folder Upload
  const sympUpload = await sendMultipart(
    '/api/gallery/upload',
    {
      title: 'INFOBIT 2026 Hackathon Finals',
      description: 'First prize presentation at annual national symposium.',
      section: 'symposium',
      category: 'Hackathon',
      department: 'Information Technology',
      eventYear: '2026',
      uploadedBy: JSON.stringify({ id: '24IMT30', name: 'Nathees Kumar T', role: 'student' })
    },
    {
      name: 'image',
      filename: 'infobit_team.png',
      contentType: 'image/png',
      buffer: samplePng
    }
  );

  assert(sympUpload.status === 201, 'Symposium real upload returned HTTP 201');
  const sympPhoto = sympUpload.body?.data;
  assert(sympPhoto?.url && sympPhoto.url.startsWith('/uploads/gallery/symposium/'), `Symposium file saved in: ${sympPhoto?.url}`);
  assert(sympPhoto?.localFilePath && fs.existsSync(sympPhoto.localFilePath), 'Physical symposium file exists on disk');

  // 4. Test Events Folder Upload
  const eventUpload = await sendMultipart(
    '/api/gallery/upload',
    {
      title: 'TARANG Cultural Inauguration',
      description: 'Annual cultural stage ceremony.',
      section: 'events',
      category: 'Cultural Programs',
      department: 'College Level',
      eventYear: '2026',
      uploadedBy: JSON.stringify({ id: '24IMT30', name: 'Nathees Kumar T', role: 'student' })
    },
    {
      name: 'image',
      filename: 'tarang_stage.png',
      contentType: 'image/png',
      buffer: samplePng
    }
  );
  assert(eventUpload.status === 201, 'Event real upload returned HTTP 201');
  const eventPhoto = eventUpload.body?.data;
  assert(eventPhoto?.url && eventPhoto.url.startsWith('/uploads/gallery/events/'), `Events file saved in: ${eventPhoto?.url}`);

  // 5. Test Placement Folder Upload
  const placeUpload = await sendMultipart(
    '/api/gallery/upload',
    {
      title: 'Zoho Recruitment Drive 2026',
      description: 'Selected students offer letter distribution.',
      section: 'placement',
      category: 'Recruitment Drive',
      department: 'Information Technology',
      company: 'Zoho',
      eventYear: '2026',
      uploadedBy: JSON.stringify({ id: 'ITSTAFF01', name: 'Prof. B. V. Prakash', role: 'staff' })
    },
    {
      name: 'image',
      filename: 'zoho_offers.png',
      contentType: 'image/png',
      buffer: samplePng
    }
  );
  assert(placeUpload.status === 201, 'Placement real upload returned HTTP 201');
  const placePhoto = placeUpload.body?.data;
  assert(placePhoto?.url && placePhoto.url.startsWith('/uploads/gallery/placement/'), `Placement file saved in: ${placePhoto?.url}`);
  assert(placePhoto?.status === 'Approved', `Faculty upload auto-approved (Got: "${placePhoto?.status}")`);

  // 6. Test Format Validation Filter (Only JPG, JPEG, PNG, WEBP)
  const invalidFormatUpload = await sendMultipart(
    '/api/gallery/upload',
    {
      title: 'Malicious PDF Upload',
      section: 'department'
    },
    {
      name: 'image',
      filename: 'test_document.pdf',
      contentType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 test content')
    }
  );
  assert(
    invalidFormatUpload.status === 400 && invalidFormatUpload.body?.message?.includes('Invalid image format'),
    `Rejects non-image format with HTTP 400: "${invalidFormatUpload.body?.message}"`
  );

  // 7. Test Size Limit (Maximum 10 MB)
  console.log('  ⏳ Testing 11 MB oversized upload rejection...');
  const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024, 0);
  const oversizedUpload = await sendMultipart(
    '/api/gallery/upload',
    {
      title: 'Oversized Raw Capture',
      section: 'department'
    },
    {
      name: 'image',
      filename: 'huge_camera_raw.jpg',
      contentType: 'image/jpeg',
      buffer: oversizedBuffer
    }
  );
  assert(
    oversizedUpload.status === 400 && oversizedUpload.body?.message?.includes('10 MB'),
    `Rejects >10 MB file with HTTP 400: "${oversizedUpload.body?.message}"`
  );

  // 8. Teacher Review & Approval Workflow
  // Teacher views pending uploads
  const teacherPending = await sendJson('GET', '/api/gallery?status=pending&userRole=staff');
  const foundPending = teacherPending.body?.data?.find(p => p.id === uploadedPhoto.id);
  assert(Boolean(foundPending), `Teacher can view pending student upload (Found ID: ${foundPending?.id})`);

  // Teacher approves the photo
  const approveRes = await sendJson('PATCH', `/api/gallery/${uploadedPhoto.id}/status`, { status: 'Approved' });
  assert(approveRes.status === 200 && approveRes.body?.data?.status === 'Approved', 'Teacher approves photograph -> status becomes "Approved"');

  // Verify approved photo is publicly visible
  const publicList = await sendJson('GET', `/api/gallery?section=department&userRole=student`);
  const isPubliclyVisible = publicList.body?.data?.some(p => p.id === uploadedPhoto.id);
  assert(isPubliclyVisible, 'Approved photograph is now visible in the Public/Student Gallery');

  // Verify image file is statically served over HTTP on port 5000
  const staticFileCheck = await sendRequest('GET', uploadedPhoto.url);
  assert(staticFileCheck.status === 200, `Static file served at http://localhost:5000${uploadedPhoto.url} (HTTP ${staticFileCheck.status})`);

  // 9. Teacher Rejection Workflow (Hiding Rejected Images)
  const rejectRes = await sendJson('PATCH', `/api/gallery/${sympPhoto.id}/status`, { status: 'Rejected' });
  assert(rejectRes.status === 200 && rejectRes.body?.data?.status === 'Rejected', 'Teacher rejects symposium photograph -> status becomes "Rejected"');

  // Student queries symposium gallery: rejected photo must be hidden!
  const studentSympList = await sendJson('GET', '/api/gallery?section=symposium&userRole=student&userId=OTHER_USER');
  const isRejectedHidden = !studentSympList.body?.data?.some(p => p.id === sympPhoto.id);
  assert(isRejectedHidden, 'Rejected photograph is hidden from public/student gallery view');

  // 10. Admin Metadata Edit (PUT /api/gallery/:id)
  const adminEditRes = await sendJson('PUT', `/api/gallery/${uploadedPhoto.id}`, {
    title: 'Updated AI & Neural Network Practical',
    category: 'Machine Learning Lab',
    description: 'Updated by System Administrator.'
  });
  assert(adminEditRes.status === 200 && adminEditRes.body?.data?.title === 'Updated AI & Neural Network Practical', 'Admin updates metadata (PUT /api/gallery/:id)');

  // 11. Admin Delete (Removes database record AND physical file from disk)
  const filePathToDelete = uploadedPhoto.localFilePath;
  assert(fs.existsSync(filePathToDelete), `File exists on disk before deletion: ${filePathToDelete}`);
  const deleteRes = await sendJson('DELETE', `/api/gallery/${uploadedPhoto.id}`);
  assert(deleteRes.status === 200, `Admin deletes photo record (HTTP 200)`);
  assert(!fs.existsSync(filePathToDelete), `Physical disk file was automatically removed from ${filePathToDelete}`);

  // Cleanup test files created during test
  if (sympPhoto?.localFilePath && fs.existsSync(sympPhoto.localFilePath)) fs.unlinkSync(sympPhoto.localFilePath);
  if (eventPhoto?.localFilePath && fs.existsSync(eventPhoto.localFilePath)) fs.unlinkSync(eventPhoto.localFilePath);
  if (placePhoto?.localFilePath && fs.existsSync(placePhoto.localFilePath)) fs.unlinkSync(placePhoto.localFilePath);

  // 12. HOD / Admin Analytics Summary
  const analyticsRes = await sendJson('GET', '/api/gallery/analytics');
  assert(
    analyticsRes.status === 200 &&
    typeof analyticsRes.body?.data?.totalPhotos === 'number' &&
    analyticsRes.body?.data?.sections?.department !== undefined,
    'HOD / Admin Gallery Analytics successfully retrieved'
  );

  console.log('\n===============================================================');
  console.log(`📊 RESULTS: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('===============================================================\n');

  if (passed === total) {
    console.log('🎉 ALL GALLERY UPLOAD & MANAGEMENT SYSTEM TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
