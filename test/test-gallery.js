const http = require('http');

const BASE_URL = 'http://localhost:5000';

function req(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
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
    if (data) request.write(data);
    request.end();
  });
}

async function runGalleryTests() {
  console.log('====================================================');
  console.log('🧪 IT DIGITAL HUB - Gallery Module Test Suite');
  console.log('====================================================\n');

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

  // 1. Health check
  const health = await req('GET', '/api/health');
  assert(health.status === 200 && health.body.status === 'online', 'Server health check on port 5000');

  // 2. Fetch all gallery photos
  const allRes = await req('GET', '/api/gallery');
  assert(allRes.status === 200 && allRes.body.success && Array.isArray(allRes.body.data) && allRes.body.data.length > 0, `Fetch all gallery photos (Count: ${allRes.body?.data?.length})`);

  // 3. Section 1: Department Gallery
  const deptRes = await req('GET', '/api/gallery?section=department');
  assert(deptRes.status === 200 && deptRes.body.data.every(p => p.section === 'department'), `Department Gallery section items (Count: ${deptRes.body?.data?.length})`);

  // 4. Section 2: Symposium Gallery
  const sympRes = await req('GET', '/api/gallery?section=symposium');
  assert(sympRes.status === 200 && sympRes.body.data.every(p => p.section === 'symposium'), `Symposium Gallery section items (Count: ${sympRes.body?.data?.length})`);

  // 5. Section 3: Event Gallery
  const evtRes = await req('GET', '/api/gallery?section=event');
  assert(evtRes.status === 200 && evtRes.body.data.every(p => p.section === 'event'), `Event Gallery section items (Count: ${evtRes.body?.data?.length})`);

  // 6. Section 4: Placement Gallery
  const placeRes = await req('GET', '/api/gallery?section=placement');
  assert(placeRes.status === 200 && placeRes.body.data.every(p => p.section === 'placement'), `Placement Gallery section items (Count: ${placeRes.body?.data?.length})`);

  // 7. Search filter test
  const searchRes = await req('GET', '/api/gallery?search=Cloud');
  assert(searchRes.status === 200 && searchRes.body.data.length > 0, `Search query "Cloud" returned ${searchRes.body?.data?.length} match(es)`);

  // 8. Upload photo as Student (must be pending)
  const studentUpload = await req('POST', '/api/gallery/upload', {
    title: 'Student IoT Project Showcase',
    description: 'Smart irrigation automated valve module test.',
    section: 'department',
    category: 'Innovation & Projects',
    department: 'Information Technology',
    eventYear: '2026',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    uploadedBy: { id: '24IMT30', name: 'Nathees Kumar T', role: 'student' }
  });
  const uploadedStudentPhoto = studentUpload.body?.data;
  assert(
    studentUpload.status === 201 && (uploadedStudentPhoto?.status === 'Pending Approval' || uploadedStudentPhoto?.status === 'pending'),
    `Student photo upload -> Status: Pending Approval (${uploadedStudentPhoto?.id})`
  );

  // 9. Upload photo as Staff (must be approved immediately)
  const staffUpload = await req('POST', '/api/gallery/upload', {
    title: 'TCS Placement Drive Selected Batch',
    description: 'Congratulations to the 2026 batch candidates.',
    section: 'placement',
    category: 'Recruitment Drives',
    company: 'TCS',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80',
    uploadedBy: { id: 'ITSTAFF01', name: 'Prof. B. V. Prakash', role: 'staff' }
  });
  const uploadedStaffPhoto = staffUpload.body?.data;
  assert(
    staffUpload.status === 201 && (uploadedStaffPhoto?.status === 'Approved' || uploadedStaffPhoto?.status === 'approved'),
    `Staff photo upload -> Status: Approved immediately (${uploadedStaffPhoto?.id})`
  );

  // 10. Approve Student Photo (Teacher / HOD privilege)
  if (uploadedStudentPhoto?.id) {
    const approveRes = await req('PATCH', `/api/gallery/${uploadedStudentPhoto.id}/status`, { status: 'Approved' });
    assert(approveRes.status === 200 && (approveRes.body?.data?.status === 'Approved' || approveRes.body?.data?.status === 'approved'), `Faculty approves student photo -> Status: Approved`);
  }

  // 11. Like and Comment System
  const testPhotoId = uploadedStaffPhoto?.id || 'GAL-101';
  const likeRes = await req('POST', `/api/gallery/${testPhotoId}/like`, { userId: '24IMT30' });
  assert(likeRes.status === 200 && likeRes.body.success, `Toggle like on photo (${likeRes.body?.data?.likes} likes)`);

  const commentRes = await req('POST', `/api/gallery/${testPhotoId}/comment`, {
    userId: '24IMT30',
    userName: 'Nathees Kumar T',
    userRole: 'student',
    text: 'Proud of our department placements!'
  });
  assert(commentRes.status === 201 && commentRes.body?.data?.text.includes('Proud'), `Add comment to photo ("${commentRes.body?.data?.text}")`);

  // 12. Gallery Analytics (HOD / Admin)
  const analyticsRes = await req('GET', '/api/gallery/analytics');
  const aData = analyticsRes.body?.data;
  assert(
    analyticsRes.status === 200 && aData?.totalPhotos > 0 && aData?.sectionCounts?.department > 0 && aData?.sectionCounts?.symposium > 0 && aData?.sectionCounts?.event > 0 && aData?.sectionCounts?.placement > 0,
    `Gallery Analytics breakdown (Total: ${aData?.totalPhotos}, Dept: ${aData?.sectionCounts?.department}, Symp: ${aData?.sectionCounts?.symposium}, Evt: ${aData?.sectionCounts?.event}, Place: ${aData?.sectionCounts?.placement})`
  );

  // 13. Delete Test Photo Clean-up
  if (uploadedStudentPhoto?.id) {
    const delRes = await req('DELETE', `/api/gallery/${uploadedStudentPhoto.id}`);
    assert(delRes.status === 200 && delRes.body.success, `Delete test photo (${uploadedStudentPhoto.id})`);
  }
  if (uploadedStaffPhoto?.id) {
    const delRes = await req('DELETE', `/api/gallery/${uploadedStaffPhoto.id}`);
    assert(delRes.status === 200 && delRes.body.success, `Delete test photo (${uploadedStaffPhoto.id})`);
  }

  console.log('\n====================================================');
  console.log(`📊 Summary: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  process.exit(passed === total ? 0 : 1);
}

runGalleryTests();
