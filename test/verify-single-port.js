const http = require('http');

const BASE_URL = 'http://localhost:5000';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
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
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('=== VERIFYING UNIFIED PORT 5000 ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  // 1. Health check
  try {
    const health = await get('/api/health');
    assert(health.status === 200 && health.body.port === 5000, `Health check on port 5000 (status: ${health.body.status}, port: ${health.body.port})`);
  } catch (err) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // 2. Student Logins
  const students = [
    { id: '24IMT30', name: 'Nathees Kumar T', year: 2, sem: 6 },
    { id: '26IT001', name: 'K. Ananya', year: 1, sem: 2 },
    { id: '25IT001', name: 'Naveen Kumar R', year: 2, sem: 4 },
    { id: '24IT001', name: 'S. Priya', year: 3, sem: 6 },
    { id: '23IT001', name: 'M. Vignesh', year: 4, sem: 8 }
  ];

  for (const s of students) {
    const res = await post('/api/auth/login', { role: 'student', userId: s.id, password: '1234' });
    const ok = res.status === 200 && res.body.success && res.body.user.rollNo === s.id && res.body.user.name.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]);
    assert(ok, `Student login: ${s.id} (${s.name})`);
  }

  // 3. Class Advisors Logins
  const advisors = [
    { id: 'ITSTAFF01', name: 'Prof. B. V. Prakash', year: 1 },
    { id: 'ITSTAFF02', name: 'Dr. Mohanasundaram', year: 2 },
    { id: 'ITSTAFF03', name: 'Prof. Sathyakala', year: 3 },
    { id: 'ITSTAFF04', name: 'Prof. Murugan', year: 4 }
  ];

  for (const a of advisors) {
    const res = await post('/api/auth/login', { role: 'staff', userId: a.id, password: '1234' });
    const ok = res.status === 200 && res.body.success && res.body.user.id === a.id;
    assert(ok, `Class Advisor login: ${a.id} (${a.name})`);
  }

  // 4. HOD Login
  const hodRes = await post('/api/auth/login', { role: 'hod', userId: 'ITHOD01', password: '1234' });
  assert(hodRes.status === 200 && hodRes.body.success && hodRes.body.user.role === 'hod', `HOD login: ITHOD01 (${hodRes.body.user?.name})`);

  // 5. Admin Login
  const adminRes = await post('/api/auth/login', { role: 'admin', userId: 'ITADMIN01', password: '1234' });
  assert(adminRes.status === 200 && adminRes.body.success && adminRes.body.user.role === 'admin', `Admin login: ITADMIN01 (${adminRes.body.user?.name})`);

  // 6. Class Advisors Mapping & Academic Years
  const caRes = await get('/api/messages/class-advisors');
  const cas = caRes.body.data;
  assert(
    cas['1'].staffId === 'ITSTAFF01' && cas['1'].batch === '2026 - 2030' &&
    cas['2'].staffId === 'ITSTAFF02' && cas['2'].batch === '2025 - 2029' &&
    cas['3'].staffId === 'ITSTAFF03' && cas['3'].batch === '2024 - 2028' &&
    cas['4'].staffId === 'ITSTAFF04' && cas['4'].batch === '2023 - 2027',
    'Class Advisors mapping & Batches (Year 1: 2026-2030, Year 2: 2025-2029, Year 3: 2024-2028, Year 4: 2023-2027)'
  );

  // 7. Student Profile for 24IMT30
  const profRes = await get('/api/students/profile?rollNo=24IMT30');
  const prof = profRes.body.data;
  assert(
    prof && prof.rollNo === '24IMT30' && prof.phone === '9655561053' && prof.email === 'natheeskumar003@gmail.com',
    `Student Profile for 24IMT30: ${prof?.name}, Phone: ${prof?.phone}, Email: ${prof?.email}`
  );

  // 8. Faculty Roster (strictly the 4 Advisors)
  const facRes = await get('/api/admin/faculty');
  const facList = facRes.body.data;
  assert(
    Array.isArray(facList) && facList.length === 4 &&
    facList.every(f => ['ITSTAFF01', 'ITSTAFF02', 'ITSTAFF03', 'ITSTAFF04'].includes(f.id)),
    `Faculty roster strictly contains 4 Class Advisors (count: ${facList?.length})`
  );

  console.log(`\n====================================================`);
  console.log(`RESULT: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log(`====================================================`);
}

runVerification();
