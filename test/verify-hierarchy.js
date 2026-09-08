// Comprehensive Hierarchical Flow Verification Test
// Tests: Admin -> HOD -> Staff (Class Advisor) -> Student with database persistence

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5098;
process.env.PORT = PORT;

const app = require('../server/server.js');
const server = http.createServer(app);
const store = require('../server/data/store');
const dbPath = path.join(__dirname, '../server/data/database.json');

function request(method, urlPath, data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: urlPath,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runHierarchyVerification() {
  console.log('=== STARTING HIERARCHY & PERSISTENCE VERIFICATION ===');
  server.listen(PORT, async () => {
    try {
      // 1. Admin login
      console.log('\n[TEST 1] Admin Authentication');
      const adminLogin = await request('POST', '/api/auth/login', {
        role: 'admin',
        userId: 'admin',
        password: '1234'
      });
      console.log('Admin login status:', adminLogin.status, 'User:', adminLogin.data.user?.name);
      if (adminLogin.status !== 200) throw new Error('Admin login failed');

      // 2. Admin adds a new HOD
      console.log('\n[TEST 2] Admin Registers New HOD');
      const newHodPayload = {
        id: 'ITHOD02',
        name: 'Dr. M. R. Jayasudha',
        designation: 'Professor & Head',
        qualification: 'B.E., M.E., Ph.D.',
        experience: '22 Years',
        specialization: 'Cloud & AI Systems',
        email: 'jayasudha.it@gceerode.ac.in',
        phone: '+91 94433 99887',
        cabin: 'HOD Chamber - Room 102',
        pass: '1234'
      };
      const addHodRes = await request('POST', '/api/admin/hods', newHodPayload);
      console.log('Add HOD status:', addHodRes.status, 'Created ID:', addHodRes.data.data?.id);
      if (addHodRes.status !== 200 && addHodRes.status !== 201) throw new Error('Failed to add new HOD');

      // Verify persistence in database.json
      const dbContent1 = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const hodInDb = dbContent1.hodList.find(h => h.id === 'ITHOD02');
      console.log('HOD persisted in database.json:', hodInDb ? 'YES (Verified)' : 'NO');
      if (!hodInDb) throw new Error('HOD not persisted to database.json');

      // 3. New HOD logs in
      console.log('\n[TEST 3] Newly Registered HOD Logs In');
      const hodLogin = await request('POST', '/api/auth/login', {
        role: 'hod',
        userId: 'ITHOD02',
        password: '1234'
      });
      console.log('HOD login status:', hodLogin.status, 'HOD Name:', hodLogin.data.user?.name);
      if (hodLogin.status !== 200) throw new Error('Newly registered HOD failed to login');

      // 4. HOD registers a new Staff member
      console.log('\n[TEST 4] HOD Registers New Faculty Member');
      const newFacultyPayload = {
        id: 'ITSTAFF11',
        name: 'Dr. K. Anand',
        designation: 'Assistant Professor',
        qualification: 'M.E., Ph.D.',
        experience: '8 Years',
        specialization: 'Information Security & Blockchain',
        email: 'k.anand@gceerode.ac.in',
        phone: '+91 98425 66778',
        cabin: 'Room 309, IT Block'
      };
      const addFacultyRes = await request('POST', '/api/hod/faculty', newFacultyPayload);
      console.log('Add Faculty status:', addFacultyRes.status, 'Faculty ID:', addFacultyRes.data.data?.id);
      if (addFacultyRes.status !== 200 && addFacultyRes.status !== 201) throw new Error('HOD failed to register faculty');

      // 5. HOD assigns Class Advisor
      console.log('\n[TEST 5] HOD Assigns Class Advisor for Year 4');
      const assignAdvisorRes = await request('PUT', '/api/hod/class-advisors/4', { staffId: 'ITSTAFF11' });
      console.log('Assign Advisor status:', assignAdvisorRes.status, 'Assigned to:', assignAdvisorRes.data.data?.name);
      if (assignAdvisorRes.status !== 200) throw new Error('Failed to assign class advisor');

      // Verify DB persistence of Class Advisor
      const dbContent2 = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      console.log('Year 4 Class Advisor in database.json:', dbContent2.classAdvisors['4'].staffId === 'ITSTAFF11' ? 'YES (Verified)' : 'NO');

      // 6. Registered Staff member logs in
      console.log('\n[TEST 6] Registered Staff Member Logs In');
      const staffLogin = await request('POST', '/api/auth/login', {
        role: 'staff',
        userId: 'ITSTAFF11',
        password: '1234'
      });
      console.log('Staff login status:', staffLogin.status, 'Staff Name:', staffLogin.data.user?.name);
      if (staffLogin.status !== 200) throw new Error('Registered staff failed to log in');

      // 7. Class Advisor enrolls a student
      console.log('\n[TEST 7] Class Advisor Enrolls New Student (Auto-Generated Credentials)');
      const newStudentPayload = {
        rollNo: '24IT065',
        name: 'Priya S',
        year: 2,
        sem: 4,
        sec: 'A',
        attendance: 94.5,
        cgpa: 8.85,
        phone: '+91 98421 77889'
      };
      const enrollRes = await request('POST', '/api/students', newStudentPayload);
      console.log('Enroll student status:', enrollRes.status, 'Student:', enrollRes.data.data?.name, 'Roll:', enrollRes.data.data?.rollNo);
      if (enrollRes.status !== 200 && enrollRes.status !== 201) throw new Error('Class Advisor failed to enroll student');

      // Verify DB persistence of Student
      const dbContent3 = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const studentInDb = dbContent3.students.find(s => s.rollNo === '24IT065');
      console.log('Student persisted in database.json with default pass:', studentInDb?.pass === '1234' ? 'YES (Verified)' : 'NO');
      if (!studentInDb) throw new Error('Student not persisted to database.json');

      // 8. Student logs in with auto-generated credentials (ID = Roll No, Pass = "1234")
      console.log('\n[TEST 8] Student Authenticates with Auto-Generated Credentials');
      const studentLogin = await request('POST', '/api/auth/login', {
        role: 'student',
        userId: '24IT065',
        password: '1234'
      });
      console.log('Student login status:', studentLogin.status);
      console.log('Student Profile Synthesized:', {
        name: studentLogin.data.user?.name,
        rollNo: studentLogin.data.user?.rollNo,
        year: studentLogin.data.user?.year,
        cgpa: studentLogin.data.user?.cgpa,
        attendance: studentLogin.data.user?.attendance
      });
      if (studentLogin.status !== 200) throw new Error('Student login with auto-generated credentials failed');
      if (studentLogin.data.user?.name !== 'Priya S') throw new Error('Student profile name mismatch');
      if (studentLogin.data.user?.rollNo !== '24IT065') throw new Error('Student profile rollNo mismatch');

      console.log('\n======================================================');
      console.log('✅ ALL HIERARCHICAL & PERSISTENCE TESTS PASSED 100%!');
      console.log('======================================================');
    } catch (err) {
      console.error('\n❌ TEST SUITE ERROR:', err);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

runHierarchyVerification();
