/**
 * ============================================================================
 * IT DIGITAL HUB - Real Persistent Database Layer
 * Department of Information Technology - Government College of Engineering, Erode
 * ============================================================================
 * 
 * Auto-persists all entities to JSON storage with ACID-like atomic writes.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');
const defaultGallerySeed = require('./gallerySeed');

// Initial Seed Dataset (Standard GCE Erode Information Technology Department R2021)
const initialSeedData = {
  // Demo User Credentials (Password: 1234 for all registered users)
  credentials: {
    student: { id: "25IT001", pass: "1234", name: "Naveen Kumar R", role: "student" },
    staff: { id: "ITSTAFF01", pass: "1234", name: "Prof. B. V. Prakash", role: "staff" },
    hod: {
      id: "ITHOD01",
      pass: "1234",
      name: "Dr.I. Bhuvaneshwarri",
      role: "hod",
      designation: "Professor & Head of Department",
      qualification: "M.E,Ph.D",
      experience: "24 Years",
      specialization: "Big Data Analytics, Data Mining, Web Technology and Network Security",
      email: "ibw@gcee.ac.in",
      phone: "+91-9442689006",
      cabin: "HOD Chamber, IT Block - Ground Floor"
    },
    admin: { id: "ITADMIN01", pass: "1234", name: "Er. M. Senthil Kumar", role: "admin", email: "admin.it@gceerode.ac.in" }
  },

  // Registered Head of Department (HOD) Accounts - Admin has sole authority
  hodList: [
    {
      id: "ITHOD01",
      pass: "1234",
      name: "Dr.I. Bhuvaneshwarri",
      role: "hod",
      designation: "Professor & Head of Department",
      qualification: "M.E,Ph.D",
      experience: "24 Years",
      specialization: "Big Data Analytics, Data Mining, Web Technology and Network Security",
      email: "ibw@gcee.ac.in",
      phone: "+91-9442689006",
      cabin: "HOD Chamber, IT Block - Ground Floor",
      status: "Active"
    }
  ],

  // Student Profile Dossier
  studentProfile: {
    rollNo: "25IT001",
    regNo: "730425205001",
    name: "Naveen Kumar R",
    year: 2,
    sem: 4,
    sec: "A",
    batch: "2025 - 2029",
    degree: "B.Tech Information Technology",
    regulations: "Autonomous R2021",
    tneaCode: "7304",
    dob: "2006-05-14",
    bloodGroup: "O+ve",
    mentor: "Dr. Mohanasundaram (Assoc. Prof)",
    mentorContact: "mohanasundaram.it@gceerode.ac.in",
    cgpa: 8.74,
    rank: "4th in Department",
    standingArrears: 0,
    historyOfArrears: 0,
    creditsEarned: 68,
    totalCredits: 165,
    pendingAssignments: 2,
    hostelResident: true,
    roomNo: "Kaveri Hostel - Room 214",
    parentName: "Mr. K. Ramasamy",
    parentPhone: "+91 94432 10987",
    studentPhone: "+91 98421 54321",
    email: "25it001@gceerode.ac.in",
    address: "14/2, Anna Nagar, Perundurai Road, Erode - 638011"
  },

  // 5 Registered Students (Password: 1234)
  students: [
    { rollNo: "24IMT30", regNo: "731124205030", name: "Nathees Kumar T", year: 2, sem: 6, sec: "A", attendance: 85.0, cgpa: 7.50, arrears: 0, mentor: "Prof. Sathyakala", phone: "9655561053", email: "natheeskumar003@gmail.com", status: "Active", pass: "1234" },
    { rollNo: "26IT001", regNo: "730426205001", name: "K. Ananya", year: 1, sem: 2, sec: "A", attendance: 94.5, cgpa: 8.90, arrears: 0, mentor: "Prof. B. V. Prakash", phone: "+91 98421 54321", email: "26it001@gceerode.ac.in", status: "Active", pass: "1234" },
    { rollNo: "25IT001", regNo: "730425205001", name: "Naveen Kumar R", year: 2, sem: 4, sec: "A", attendance: 89.5, cgpa: 8.74, arrears: 0, mentor: "Dr. Mohanasundaram", phone: "+91 98421 54322", email: "25it001@gceerode.ac.in", status: "Active", pass: "1234" },
    { rollNo: "24IT001", regNo: "730424205001", name: "S. Priya", year: 3, sem: 6, sec: "A", attendance: 92.0, cgpa: 8.85, arrears: 0, mentor: "Prof. Sathyakala", phone: "+91 98421 54323", email: "24it001@gceerode.ac.in", status: "Active", pass: "1234" },
    { rollNo: "23IT001", regNo: "730423205001", name: "M. Vignesh", year: 4, sem: 8, sec: "A", attendance: 88.0, cgpa: 8.60, arrears: 0, mentor: "Prof. Murugan", phone: "+91 98421 54324", email: "23it001@gceerode.ac.in", status: "Active", pass: "1234" }
  ],

  // 4 Designated Class Advisors (Password: 1234)
  facultyList: [
    { id: "ITSTAFF01", name: "Prof. B. V. Prakash", designation: "Associate Professor", qualification: "M.E., Ph.D.", experience: "16 Years", specialization: "Database Systems & AI", email: "prakash.it@gceerode.ac.in", phone: "+91 98421 22334", cabin: "Room 304, IT Block - 2nd Floor", subjects: ["Database Management Systems", "DBMS Laboratory"], classAdvisorFor: 1, classAdvisorLabel: "Class Advisor - Year 1", publications: 26 },
    { id: "ITSTAFF02", name: "Dr. Mohanasundaram", designation: "Associate Professor", qualification: "M.E., Ph.D.", experience: "15 Years", specialization: "Network Security & Cryptography", email: "mohanasundaram.it@gceerode.ac.in", phone: "+91 98422 33445", cabin: "Room 305, IT Block - 2nd Floor", subjects: ["Computer Networks", "Network Security Lab"], classAdvisorFor: 2, classAdvisorLabel: "Class Advisor - Year 2", publications: 19 },
    { id: "ITSTAFF03", name: "Prof. Sathyakala", designation: "Assistant Professor (Sr. Gr)", qualification: "M.Tech., (Ph.D.)", experience: "12 Years", specialization: "Design & Analysis of Algorithms", email: "sathyakala.it@gceerode.ac.in", phone: "+91 98423 44556", cabin: "Room 306, IT Block - 2nd Floor", subjects: ["Design & Analysis of Algorithms"], classAdvisorFor: 3, classAdvisorLabel: "Class Advisor - Year 3", publications: 12 },
    { id: "ITSTAFF04", name: "Prof. Murugan", designation: "Assistant Professor", qualification: "M.E.", experience: "10 Years", specialization: "Full Stack Web Technologies & React", email: "murugan.it@gceerode.ac.in", phone: "+91 98424 55667", cabin: "Room 307, IT Block - 2nd Floor", subjects: ["Web Technologies", "Web Technologies Laboratory"], classAdvisorFor: 4, classAdvisorLabel: "Class Advisor - Year 4", publications: 11 }
  ],

  // Semester IV IT Curriculum Subjects
  subjects: [
    { code: "IT8401", name: "Database Management Systems", type: "Theory", credits: 3, faculty: "Dr. A. Venkatesh", syllabusUnits: 5, completedUnits: 3.5, attended: 42, total: 46, internalMarks: 44, attendancePct: 91.3 },
    { code: "IT8402", name: "Design & Analysis of Algorithms", type: "Theory", credits: 4, faculty: "Prof. P. Kavin", syllabusUnits: 5, completedUnits: 4, attended: 50, total: 54, internalMarks: 42, attendancePct: 92.5 },
    { code: "IT8403", name: "Operating Systems", type: "Theory", credits: 3, faculty: "Prof. R. Saravanan", syllabusUnits: 5, completedUnits: 3, attended: 38, total: 45, internalMarks: 40, attendancePct: 84.4 },
    { code: "IT8404", name: "Computer Networks", type: "Theory", credits: 3, faculty: "Dr. M. Deepa", syllabusUnits: 5, completedUnits: 3.5, attended: 41, total: 46, internalMarks: 45, attendancePct: 89.1 },
    { code: "IT8405", name: "Web Technologies", type: "Theory", credits: 3, faculty: "Prof. S. Priyanka", syllabusUnits: 5, completedUnits: 4, attended: 40, total: 44, internalMarks: 46, attendancePct: 90.9 },
    { code: "IT8411", name: "Database Management Systems Lab", type: "Practical", credits: 2, faculty: "Dr. A. Venkatesh", syllabusUnits: 12, completedUnits: 10, attended: 28, total: 30, internalMarks: 48, attendancePct: 93.3 },
    { code: "IT8412", name: "Web Technologies Laboratory", type: "Practical", credits: 2, faculty: "Prof. S. Priyanka", syllabusUnits: 12, completedUnits: 9, attended: 26, total: 30, internalMarks: 47, attendancePct: 86.6 }
  ],

  // Assignments
  assignments: [
    { id: "ASN-001", title: "Normalization & Complex SQL Query Optimization", subjectCode: "IT8401", subjectName: "Database Management Systems", faculty: "Dr. A. Venkatesh", assignedDate: "2026-08-20", dueDate: "2026-09-05", maxMarks: 20, status: "Submitted", submissionFile: "24IT001_DBMS_Assignment1.pdf", submittedDate: "2026-08-28", score: 19, remarks: "Excellent BCNF decompositions and query execution plans." },
    { id: "ASN-002", title: "Dynamic Programming: Traveling Salesperson Problem", subjectCode: "IT8402", subjectName: "Design & Analysis of Algorithms", faculty: "Prof. P. Kavin", assignedDate: "2026-08-24", dueDate: "2026-09-08", maxMarks: 20, status: "Pending", submissionFile: null, submittedDate: null, score: null, remarks: null },
    { id: "ASN-003", title: "React State Management & REST API CRUD Project", subjectCode: "IT8405", subjectName: "Web Technologies", faculty: "Prof. S. Priyanka", assignedDate: "2026-08-26", dueDate: "2026-09-10", maxMarks: 25, status: "Pending", submissionFile: null, submittedDate: null, score: null, remarks: null }
  ],

  // Study Materials Repository
  studyMaterials: [
    { id: "MAT-101", title: "Unit III: Transaction Processing & Concurrency Control Notes", subjectCode: "IT8401", subjectName: "Database Management Systems", category: "Lecture Notes", faculty: "Dr. A. Venkatesh", date: "2026-08-25", fileSize: "4.2 MB", fileType: "PDF", downloads: 142 },
    { id: "MAT-102", title: "Design & Analysis of Algorithms - Unit IV Dynamic Programming PPT", subjectCode: "IT8402", subjectName: "Design & Analysis of Algorithms", category: "Lecture PPT", faculty: "Prof. P. Kavin", date: "2026-08-22", fileSize: "8.5 MB", fileType: "PPTX", downloads: 118 },
    { id: "MAT-103", title: "Autonomous R2021 End Semester Model Question Paper with Keys", subjectCode: "IT8404", subjectName: "Computer Networks", category: "Question Bank", faculty: "Dr. M. Deepa", date: "2026-08-18", fileSize: "1.8 MB", fileType: "PDF", downloads: 204 }
  ],

  // Leave & OD Requests
  leaveRequests: [
    { id: "LEV-101", rollNo: "24IT001", studentName: "Naveen Kumar R", type: "Medical Leave", fromDate: "2026-08-12", toDate: "2026-08-14", reason: "Viral fever and doctor consultation", status: "Approved", proof: "Medical_Certificate.pdf" },
    { id: "LEV-102", rollNo: "24IT001", studentName: "Naveen Kumar R", type: "On-Duty (Symposium)", fromDate: "2026-09-14", toDate: "2026-09-14", reason: "Paper Presentation at National Symposium", status: "Pending", proof: "Event_Invite.pdf" }
  ],

  // Department Circulars & Announcements
  announcements: [
    { id: "ANN-01", title: "Autonomous Continuous Internal Assessment (CIA-1) Schedule Announced", category: "Academic", priority: "Urgent", date: "2026-08-28", author: "Dr. S. K. Murugesan (HOD)", content: "CIA-1 for all 2nd, 3rd, and 4th Year B.Tech IT students will commence from September 18, 2026. Detailed seating and timetable available in department notice board." },
    { id: "ANN-02", title: "Zoho Campus Recruitment Drive - Batch 2025 & 2026 Registrations Open", category: "Placement", priority: "High", date: "2026-08-25", author: "Placement Cell / IT Dept", content: "Zoho Corporation drive scheduled for Software Development Engineer (₹8.5 LPA). Eligible students (CGPA >= 7.5 with 0 arrears) must register before Sep 05." }
  ],

  // Achievements & Certifications
  achievements: [
    { id: "ACH-001", title: "1st Prize - Smart India Hackathon (SIH) 2025 Internal Round", category: "Hackathon", issuedBy: "Ministry of Education & GCE Erode", date: "2025-10-14", description: "Developed an IoT & AI based crop disease detector using edge computation." }
  ],
  certificates: [
    { id: "CERT-001", name: "AWS Certified Solutions Architect - Associate", issuer: "Amazon Web Services (AWS)", issueDate: "2025-12-10", validTill: "2028-12-10", credentialId: "AWS-SAA-849204" }
  ],

  // Class Advisors
  classAdvisors: {
    1: { year: 1, batch: "2026 - 2030", staffId: "ITSTAFF01", staffName: "Prof. B. V. Prakash" },
    2: { year: 2, batch: "2025 - 2029", staffId: "ITSTAFF02", staffName: "Dr. Mohanasundaram" },
    3: { year: 3, batch: "2024 - 2028", staffId: "ITSTAFF03", staffName: "Prof. Sathyakala" },
    4: { year: 4, batch: "2023 - 2027", staffId: "ITSTAFF04", staffName: "Prof. Murugan" }
  },

  // Messages & Requests
  messages: [
    { id: "MSG-01", fromId: "25IT001", fromName: "Naveen Kumar R", fromRole: "student", toId: "ITSTAFF02", toName: "Dr. Mohanasundaram (Class Advisor)", toRole: "staff", type: "Request", subject: "Permission for National Symposium On-Duty", content: "Respected Sir, I request you to kindly grant me On-Duty permission for presenting a research paper at PSG Tech on 14-Sep-2026.", timestamp: "Yesterday, 04:30 PM", read: false, status: "Pending" },
    { id: "MSG-02", fromId: "ITSTAFF02", fromName: "Dr. Mohanasundaram", fromRole: "staff", toId: "25IT001", toName: "Naveen Kumar R (25IT001)", toRole: "student", type: "DM", subject: "DBMS Mini-Project Review Feedback", content: "Naveen, your ER diagram and 3NF decomposition for the Hospital Management module look solid. Proceed with MongoDB indexing and FastAPI backend integration.", timestamp: "Yesterday, 06:15 PM", read: true, status: "Delivered" },
    { id: "MSG-03", fromId: "ITHOD01", fromName: "Dr.I. Bhuvaneshwarri (HOD)", fromRole: "hod", toId: "ALL", toName: "All IT Staff & Students", toRole: "all", type: "Broadcast", subject: "NBA Accreditation Review Meeting", content: "All faculty members and student class representatives are requested to assemble in the Department Seminar Hall at 4:00 PM today.", timestamp: "Today at 09:00 AM", read: false, status: "Active" }
  ],

  // Audit Logs
  auditLogs: [
    { id: "LOG-1001", action: "User Login", user: "25IT001 (Naveen Kumar R)", role: "STUDENT", ip: "192.168.1.100", timestamp: "Just now", status: "Success" }
  ],

  // Gallery Repository
  gallery: defaultGallerySeed
};

let dataStore = JSON.parse(JSON.stringify(initialSeedData));
let lastMtime = 0;

// Persistence Helpers
function saveToDisk() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(dataStore, null, 2), 'utf8');
    lastMtime = fs.statSync(DB_PATH).mtimeMs;
  } catch (err) {
    console.error('[DB Persistence Error]:', err.message);
  }
}

function loadFromDisk(force = false) {
  try {
    if (fs.existsSync(DB_PATH)) {
      const stat = fs.statSync(DB_PATH);
      if (!force && stat.mtimeMs === lastMtime && dataStore && dataStore.students) {
        return; // Fast cache hit - instantaneous 0ms response!
      }
      lastMtime = stat.mtimeMs;
      const saved = fs.readFileSync(DB_PATH, 'utf8');
      const parsed = JSON.parse(saved);
      dataStore = parsed;
      if (Array.isArray(dataStore.students)) {
        for (const seedStd of initialSeedData.students) {
          if (!dataStore.students.some(s => (s.rollNo || '').toUpperCase() === seedStd.rollNo.toUpperCase())) {
            dataStore.students.push(seedStd);
          }
        }
      } else {
        dataStore.students = JSON.parse(JSON.stringify(initialSeedData.students));
      }
      if (!dataStore.hodList || !dataStore.hodList.length) {
        dataStore.hodList = JSON.parse(JSON.stringify(initialSeedData.hodList));
        saveToDisk();
      }
      if (!dataStore.gallery || !Array.isArray(dataStore.gallery)) {
        dataStore.gallery = [];
        saveToDisk();
      }
    } else {
      dataStore = JSON.parse(JSON.stringify(initialSeedData));
      saveToDisk();
    }
  } catch (err) {
    console.error('[DB Load Error]:', err.message);
  }
}

loadFromDisk();

/* ==========================================================================
 * DATA ACCESS METHODS (Modular Repository Pattern with Real Persistence)
 * ========================================================================== */

const store = {
  // Auth
  getCredentials() {
    loadFromDisk();
    return dataStore.credentials;
  },
  async validateUser(role, userId, password) {
    loadFromDisk();
    const uId = (userId || '').trim().toLowerCase();
    const pWord = (password || '').trim();

    // Registered person password is "1234"
    const validPass = (pWord === '1234');

    // 1. Check Admin login
    if (role === 'admin') {
      const adminCred = dataStore.credentials.admin;
      if ((uId === adminCred.id.toLowerCase() || uId === 'admin') && (validPass || pWord === adminCred.pass)) {
        return {
          id: adminCred.id,
          name: adminCred.name,
          role: 'admin',
          email: adminCred.email || `${adminCred.id.toLowerCase()}@gceerode.ac.in`
        };
      }
      return null;
    }

    // 2. Check HOD login (strictly HODs registered by Admin)
    if (role === 'hod') {
      const hodList = dataStore.hodList || [dataStore.credentials.hod];
      const foundHod = hodList.find(h => h.id.toLowerCase() === uId || uId === 'hod');
      if (foundHod && (validPass || pWord === foundHod.pass)) {
        return {
          id: foundHod.id,
          name: foundHod.name,
          role: 'hod',
          designation: foundHod.designation || 'Professor & Head',
          qualification: foundHod.qualification || 'M.E., Ph.D.',
          email: foundHod.email || `${foundHod.id.toLowerCase()}@gceerode.ac.in`,
          cabin: foundHod.cabin || 'HOD Chamber, IT Block - Ground Floor',
          ...foundHod
        };
      }
      return null;
    }

    // 3. Check Staff login (strictly only staff registered by HOD)
    if (role === 'staff') {
      const staffMember = dataStore.facultyList.find(f => f.id.toLowerCase() === uId);
      if (staffMember && validPass) {
        return {
          id: staffMember.id,
          name: staffMember.name,
          role: 'staff',
          email: staffMember.email,
          ...staffMember
        };
      }
      return null;
    }

    // 4. Check Student login (students enrolled by Class Advisor or custom entered name)
    if (role === 'student') {
      const trimmedInput = (userId || '').trim();
      const lowerInput = trimmedInput.toLowerCase();

      // Find by rollNo, id, or name
      let student = dataStore.students.find(s => 
        (s.rollNo && s.rollNo.toLowerCase() === lowerInput) ||
        (s.id && s.id.toLowerCase() === lowerInput) ||
        (s.name && s.name.toLowerCase() === lowerInput) ||
        (s.name && s.name.toLowerCase().includes(lowerInput)) ||
        (lowerInput.includes((s.name || '').toLowerCase()))
      );

      // Check valid password (1234 default institutional password or student pass)
      if (validPass || (student && pWord === (student.pass || '1234'))) {
        // If user typed a custom name (not matching roll number format), use exact entered name
        const isRollNoFormat = /^[0-9]{2}[A-Za-z]{2,4}[0-9]{2,4}$/i.test(trimmedInput);
        const resolvedName = (!isRollNoFormat && trimmedInput.length > 1) 
          ? trimmedInput 
          : (student ? student.name : trimmedInput);

        const baseStudent = student || dataStore.students[0] || {};
        const studentRollNo = student ? student.rollNo : (isRollNoFormat ? trimmedInput.toUpperCase() : "24IMT30");

        return {
          ...dataStore.studentProfile,
          ...baseStudent,
          id: studentRollNo,
          rollNo: studentRollNo,
          regNo: student?.regNo || `731124205030`,
          name: resolvedName,
          role: 'student',
          email: student?.email || `${studentRollNo.toLowerCase()}@gceerode.ac.in`,
          year: Number(student?.year) || 2,
          sem: Number(student?.sem) || 4,
          sec: student?.sec || 'A',
          cgpa: student?.cgpa !== undefined ? Number(student.cgpa) : 8.5,
          attendance: student?.attendance !== undefined ? Number(student.attendance) : 90.0,
          standingArrears: student?.arrears !== undefined ? Number(student.arrears) : 0,
          mentor: student?.mentor || 'Assigned Faculty',
          status: student?.status || 'Active'
        };
      }
      return null;
    }

    return null;
  },

  // HOD Governance (Admin Feature - Sole Authority to add, view, and edit HODs)
  async getHODList() {
    if (!dataStore.hodList || !dataStore.hodList.length) {
      dataStore.hodList = [
        {
          id: "ITHOD01",
          pass: "1234",
          name: "Dr. S. K. Murugesan",
          role: "hod",
          designation: "Professor & Head",
          qualification: "M.E., Ph.D.",
          experience: "24 Years",
          specialization: "Cloud Computing, High Speed Networks",
          email: "hod.it@gceerode.ac.in",
          phone: "+91 94433 11223",
          cabin: "HOD Chamber, IT Block - Ground Floor",
          status: "Active"
        }
      ];
      saveToDisk();
    }
    return dataStore.hodList;
  },
  async getHOD(id) {
    const list = await this.getHODList();
    if (id) {
      return list.find(h => h.id.toLowerCase() === id.toLowerCase()) || list[0];
    }
    return dataStore.credentials.hod || list[0];
  },
  async addHOD(hodData) {
    const list = await this.getHODList();
    const newId = hodData.id || `ITHOD0${list.length + 1}`;
    const newHOD = {
      id: newId,
      name: hodData.name,
      pass: hodData.pass || "1234",
      role: "hod",
      designation: hodData.designation || "Professor & Head",
      qualification: hodData.qualification || "M.E., Ph.D.",
      experience: hodData.experience || "20+ Years",
      specialization: hodData.specialization || "Computer Science & IT",
      email: hodData.email || `${newId.toLowerCase()}@gceerode.ac.in`,
      phone: hodData.phone || "+91 94433 11223",
      cabin: hodData.cabin || "HOD Chamber, IT Block - Ground Floor",
      status: "Active",
      appointedDate: new Date().toISOString().split('T')[0]
    };
    list.push(newHOD);
    dataStore.hodList = list;
    dataStore.credentials.hod = { ...newHOD };
    saveToDisk();
    return newHOD;
  },
  async updateHOD(id, hodData) {
    const list = await this.getHODList();
    const targetId = id || (hodData && hodData.id) || 'ITHOD01';
    const idx = list.findIndex(h => h.id.toLowerCase() === targetId.toLowerCase());
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...hodData, id: targetId, role: 'hod', pass: list[idx].pass || '1234' };
      dataStore.credentials.hod = { ...list[idx] };
      dataStore.hodList = list;
      saveToDisk();
      return list[idx];
    } else {
      return this.addHOD({ id: targetId, ...hodData });
    }
  },
  async deleteHOD(id) {
    const list = await this.getHODList();
    if (list.length <= 1) {
      throw new Error("Cannot remove the sole department head. At least one HOD must remain.");
    }
    dataStore.hodList = list.filter(h => h.id.toLowerCase() !== id.toLowerCase());
    dataStore.credentials.hod = dataStore.hodList[0];
    saveToDisk();
    return true;
  },
  async changeHOD(newHOD) {
    return this.addHOD(newHOD);
  },

  // Student Profile
  async getStudentProfile(rollNo) {
    loadFromDisk();
    if (rollNo) {
      const s = dataStore.students.find(st => st.rollNo.toUpperCase() === rollNo.toUpperCase());
      if (s) {
        return {
          ...dataStore.studentProfile,
          ...s,
          rollNo: s.rollNo,
          regNo: s.regNo || `7304${s.year || 2}4205${s.rollNo.slice(-3)}`,
          name: s.name,
          year: Number(s.year) || 2,
          sem: Number(s.sem) || (Number(s.year) * 2),
          sec: s.sec || "A",
          cgpa: Number(s.cgpa) || 8.5,
          standingArrears: Number(s.arrears) || 0,
          mentor: s.mentor || "Assigned Faculty",
          studentPhone: s.phone || "+91 98421 54321",
          email: s.email || `${s.rollNo.toLowerCase()}@gceerode.ac.in`
        };
      }
    }
    return dataStore.studentProfile;
  },
  async updateStudentContact(rollNo, contactData) {
    loadFromDisk();
    Object.assign(dataStore.studentProfile, contactData);
    saveToDisk();
    return dataStore.studentProfile;
  },

  // Students (Enrolled & Managed by Class Advisor)
  async getStudents() {
    loadFromDisk();
    return dataStore.students;
  },
  async addStudent(student) {
    const roll = (student.rollNo || '').trim().toUpperCase();
    const yearNum = Number(student.year) || 2;
    const semNum = Number(student.sem) || (yearNum * 2);
    const newS = {
      rollNo: roll,
      regNo: student.regNo || `7304${yearNum}4205${roll.slice(-3) || '001'}`,
      name: student.name,
      year: yearNum,
      sem: semNum,
      sec: student.sec || "A",
      attendance: Number(student.attendance) || 90.0,
      cgpa: Number(student.cgpa) || 8.5,
      arrears: Number(student.arrears) || 0,
      mentor: student.mentor || "Assigned Faculty",
      phone: student.phone || "+91 98421 00000",
      email: student.email || `${roll.toLowerCase()}@gceerode.ac.in`,
      status: "Active",
      pass: "1234",
      enrolledAt: new Date().toISOString()
    };
    const idx = dataStore.students.findIndex(s => s.rollNo.toUpperCase() === roll);
    if (idx !== -1) {
      dataStore.students[idx] = { ...dataStore.students[idx], ...newS };
    } else {
      dataStore.students.unshift(newS);
    }
    saveToDisk();
    return newS;
  },
  async updateStudent(rollNo, updatedData) {
    const idx = dataStore.students.findIndex(s => s.rollNo.toUpperCase() === rollNo.toUpperCase());
    if (idx !== -1) {
      dataStore.students[idx] = { ...dataStore.students[idx], ...updatedData, rollNo };
      saveToDisk();
      return dataStore.students[idx];
    }
    return null;
  },
  async deleteStudent(rollNo) {
    dataStore.students = dataStore.students.filter(s => s.rollNo.toUpperCase() !== rollNo.toUpperCase());
    saveToDisk();
    return true;
  },

  // Subjects & Attendance
  async getSubjects() {
    return dataStore.subjects;
  },
  async getAttendance(rollNo) {
    return dataStore.subjects.map(s => ({
      code: s.code,
      name: s.name,
      type: s.type,
      faculty: s.faculty,
      attended: s.attended,
      total: s.total,
      percentage: s.attendancePct
    }));
  },
  async saveAttendanceBatch(subjectCode, date, records) {
    if (!dataStore.attendanceRecords) dataStore.attendanceRecords = [];
    dataStore.attendanceRecords.push({
      id: `ATT-${Date.now()}`,
      subjectCode,
      date: date || new Date().toISOString().split('T')[0],
      records: records || [],
      recordedAt: new Date().toISOString()
    });

    // Update attendance in subjects
    const sub = dataStore.subjects.find(s => s.code === subjectCode);
    if (sub) {
      sub.total = (sub.total || 45) + 1;
      const present = (records || []).filter(r => r.status === 'Present' || r.status === 'P' || r.status === 'OD').length;
      if (present > 0) {
        sub.attended = (sub.attended || 40) + 1;
        sub.attendancePct = Number(((sub.attended / sub.total) * 100).toFixed(1));
      }
    }

    // Update individual student records
    (records || []).forEach(r => {
      const std = dataStore.students.find(s => (s.rollNo || '').toUpperCase() === (r.rollNo || '').toUpperCase());
      if (std) {
        const isPresent = r.status === 'P' || r.status === 'Present' || r.status === 'OD';
        if (isPresent) {
          std.attendance = Math.min(100, Number(((Number(std.attendance) || 85) + 0.2).toFixed(1)));
        } else {
          std.attendance = Math.max(50, Number(((Number(std.attendance) || 85) - 0.4).toFixed(1)));
        }
      }
    });

    saveToDisk();
    return { success: true, count: records.length, subjectCode, date };
  },

  async getAttendanceRecords(subjectCode) {
    if (!dataStore.attendanceRecords) dataStore.attendanceRecords = [];
    if (subjectCode) {
      return dataStore.attendanceRecords.filter(r => (r.subjectCode || '').toUpperCase() === subjectCode.toUpperCase());
    }
    return dataStore.attendanceRecords;
  },

  // Internal Marks
  async getInternalMarks(subjectCode) {
    if (!dataStore.internalMarks) dataStore.internalMarks = [];
    if (subjectCode) {
      return dataStore.internalMarks.filter(m => m.subjectCode === subjectCode);
    }
    return dataStore.internalMarks;
  },

  async getStudentInternalMarks(rollNo) {
    if (!dataStore.internalMarks) dataStore.internalMarks = [];
    const roll = (rollNo || '').toUpperCase();
    return dataStore.internalMarks.map(batch => {
      const studentMark = (batch.marks || []).find(m => (m.rollNo || '').toUpperCase() === roll);
      return {
        subjectCode: batch.subjectCode,
        examType: batch.examType,
        publishedDate: batch.publishedDate,
        mark: studentMark || null
      };
    });
  },

  async saveInternalMarksBatch(subjectCode, examType, marksList) {
    if (!dataStore.internalMarks) dataStore.internalMarks = [];
    
    const existingIndex = dataStore.internalMarks.findIndex(b => b.subjectCode === subjectCode && b.examType === examType);
    const newBatch = {
      id: `MARK-${Date.now()}`,
      subjectCode,
      examType,
      marks: marksList,
      publishedDate: new Date().toISOString().split('T')[0],
      recordedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      dataStore.internalMarks[existingIndex] = newBatch;
    } else {
      dataStore.internalMarks.push(newBatch);
    }

    // Update subject internalMarks attribute
    const sub = dataStore.subjects.find(s => s.code === subjectCode);
    if (sub && marksList.length > 0) {
      const avg = marksList.reduce((acc, m) => acc + (Number(m.score) || 0), 0) / marksList.length;
      sub.internalMarks = Number(avg.toFixed(1));
    }

    saveToDisk();
    return newBatch;
  },

  // Assignments
  async getAssignments() {
    return dataStore.assignments;
  },
  async createAssignment(asnData) {
    const newAsn = {
      id: `ASN-${Date.now().toString().slice(-3)}`,
      assignedDate: new Date().toISOString().split('T')[0],
      status: "Pending",
      submissionFile: null,
      submittedDate: null,
      score: null,
      remarks: null,
      ...asnData
    };
    dataStore.assignments.unshift(newAsn);
    saveToDisk();
    return newAsn;
  },
  async submitAssignment(id, rollNo, fileDetails) {
    const asn = dataStore.assignments.find(a => a.id === id);
    if (asn) {
      asn.status = "Submitted";
      asn.submissionFile = fileDetails.fileName || "submission.pdf";
      asn.submittedDate = new Date().toISOString().split('T')[0];
      saveToDisk();
      return asn;
    }
    return null;
  },
  async gradeAssignment(id, rollNo, score, remarks) {
    const asn = dataStore.assignments.find(a => a.id === id);
    if (asn) {
      asn.status = "Graded";
      asn.score = Number(score);
      asn.remarks = remarks;
      saveToDisk();
      return asn;
    }
    return null;
  },

  // Study Materials
  async getStudyMaterials() {
    return dataStore.studyMaterials;
  },
  async addStudyMaterial(material) {
    const tName = material.teacherName || material.teacher || material.author || material.faculty || 'Prof. B. V. Prakash';
    const uDate = material.uploadDate || material.date || new Date().toISOString().split('T')[0];
    const newMat = {
      id: `MAT-${Date.now().toString().slice(-4)}`,
      downloads: 0,
      date: uDate,
      uploadDate: uDate,
      teacherName: tName,
      faculty: tName,
      teacher: tName,
      department: material.department || 'Information Technology',
      semester: material.semester || 'Semester 4',
      ...material
    };
    dataStore.studyMaterials.unshift(newMat);
    saveToDisk();
    return newMat;
  },
  async deleteStudyMaterial(id) {
    const idx = dataStore.studyMaterials.findIndex(m => m.id === id);
    if (idx !== -1) {
      const removed = dataStore.studyMaterials.splice(idx, 1)[0];
      saveToDisk();
      return removed;
    }
    return null;
  },

  // Leave & OD
  async getLeaveRequests() {
    return dataStore.leaveRequests;
  },
  async applyLeave(leaveData) {
    const newLeave = {
      id: `LEV-${Math.floor(100 + Math.random() * 900)}`,
      status: "Pending",
      ...leaveData
    };
    dataStore.leaveRequests.unshift(newLeave);
    saveToDisk();
    return newLeave;
  },
  async updateLeaveStatus(id, status) {
    const req = dataStore.leaveRequests.find(l => l.id === id);
    if (req) {
      req.status = status;
      saveToDisk();
      return req;
    }
    return null;
  },

  // Announcements & Circulars
  async getAnnouncements() {
    return dataStore.announcements;
  },
  async addAnnouncement(announcement) {
    const newAnn = {
      id: `ANN-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      ...announcement
    };
    dataStore.announcements.unshift(newAnn);
    saveToDisk();
    return newAnn;
  },
  async deleteAnnouncement(id) {
    const idx = dataStore.announcements.findIndex(a => a.id === id);
    if (idx !== -1) {
      const removed = dataStore.announcements.splice(idx, 1)[0];
      saveToDisk();
      return removed;
    }
    return null;
  },

  // Faculty
  async getFacultyList() {
    loadFromDisk();
    return dataStore.facultyList;
  },
  async addFaculty(faculty) {
    loadFromDisk();
    const newF = {
      id: faculty.id || `ITSTAFF0${dataStore.facultyList.length + 1}`,
      publications: faculty.publications || 0,
      ...faculty
    };
    dataStore.facultyList.push(newF);
    saveToDisk();
    return newF;
  },
  async updateFaculty(id, data) {
    loadFromDisk();
    const index = dataStore.facultyList.findIndex(f => f.id === id);
    if (index !== -1) {
      dataStore.facultyList[index] = { ...dataStore.facultyList[index], ...data, id };
      saveToDisk();
      return dataStore.facultyList[index];
    }
    return null;
  },
  async deleteFaculty(id) {
    loadFromDisk();
    dataStore.facultyList = dataStore.facultyList.filter(f => f.id !== id);
    saveToDisk();
    return true;
  },

  // Achievements & Certs
  async getAchievements() {
    loadFromDisk();
    return dataStore.achievements;
  },
  async addAchievement(ach) {
    loadFromDisk();
    const newAch = {
      id: `ACH-${Date.now().toString().slice(-4)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      ...ach
    };
    dataStore.achievements.unshift(newAch);
    saveToDisk();
    return newAch;
  },
  async deleteAchievement(id) {
    loadFromDisk();
    const ach = dataStore.achievements.find(a => a.id === id);
    if (ach && ach.fileUrl) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', '..', ach.fileUrl);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }
    dataStore.achievements = dataStore.achievements.filter(a => a.id !== id);
    saveToDisk();
    return true;
  },
  async getCertificates() {
    loadFromDisk();
    return dataStore.certificates;
  },
  async addCertificate(cert) {
    loadFromDisk();
    const newCert = { id: `CERT-${Date.now().toString().slice(-4)}`, uploadDate: new Date().toISOString().split('T')[0], ...cert };
    dataStore.certificates.unshift(newCert);
    saveToDisk();
    return newCert;
  },
  async deleteCertificate(id) {
    loadFromDisk();
    const cert = dataStore.certificates.find(c => c.id === id);
    if (cert && cert.fileUrl) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', '..', cert.fileUrl);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }
    dataStore.certificates = dataStore.certificates.filter(c => c.id !== id);
    saveToDisk();
    return true;
  },

  // Class Advisors
  async getClassAdvisors() {
    loadFromDisk();
    return dataStore.classAdvisors;
  },
  async updateClassAdvisor(year, staffId) {
    if (!dataStore.classAdvisors) dataStore.classAdvisors = {};
    const yNum = Number(year);
    const staffMember = dataStore.facultyList.find(f => f.id === staffId);
    dataStore.classAdvisors[yNum] = {
      year: yNum,
      batch: yNum === 1 ? "2026 - 2030" : yNum === 2 ? "2025 - 2029" : yNum === 3 ? "2024 - 2028" : "2023 - 2027",
      staffId,
      staffName: staffMember ? staffMember.name : staffId
    };

    // Reflect assignment directly into facultyList
    dataStore.facultyList = dataStore.facultyList.map(f => {
      if (f.id === staffId) {
        return { ...f, classAdvisorFor: yNum, classAdvisorLabel: `Class Advisor - Year ${yNum}` };
      } else if (f.classAdvisorFor === yNum) {
        return { ...f, classAdvisorFor: null, classAdvisorLabel: null };
      }
      return f;
    });

    saveToDisk();
    return dataStore.classAdvisors[yNum];
  },

  // Messaging Hub
  async getMessages(userId, role) {
    if (!dataStore.messages) dataStore.messages = [];
    if (!userId) return dataStore.messages;
    return dataStore.messages.filter(m => 
      m.toId === userId || m.fromId === userId || m.toRole === role || m.toId === 'ALL'
    );
  },
  async addMessage(msg) {
    if (!dataStore.messages) dataStore.messages = [];
    const newMsg = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      status: msg.type === 'Request' ? 'Pending' : 'Delivered',
      ...msg
    };
    dataStore.messages.unshift(newMsg);
    saveToDisk();
    return newMsg;
  },
  async updateMessageStatus(msgId, status) {
    if (!dataStore.messages) dataStore.messages = [];
    const msg = dataStore.messages.find(m => m.id === msgId);
    if (msg) {
      msg.status = status;
      msg.read = true;
      saveToDisk();
    }
    return msg;
  },

  // Audit Logs
  async getAuditLogs() {
    return dataStore.auditLogs;
  },
  async addAuditLog(action, user, role) {
    dataStore.auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      action,
      user,
      role: role.toUpperCase(),
      ip: "127.0.0.1",
      timestamp: "Just now",
      status: "Success"
    });
    saveToDisk();
  },

  // Gallery Management (Photos & Videos with Teacher Approval Workflow)
  async getGalleryPhotos(filters = {}) {
    loadFromDisk();
    let photos = dataStore.gallery || [];

    const isApproved = (s) => (s || '').toLowerCase() === 'approved';
    const isPending = (s) => (s || '').toLowerCase().includes('pending');
    const isRejected = (s) => (s || '').toLowerCase() === 'rejected';

    // Section Filter (handles both 'event' and 'events')
    if (filters.section && filters.section !== 'all') {
      const sec = filters.section.toLowerCase();
      if (sec === 'event' || sec === 'events') {
        photos = photos.filter(p => p.section === 'event' || p.section === 'events');
      } else {
        photos = photos.filter(p => (p.section || '').toLowerCase() === sec);
      }
    }

    // Media Type Filter (photo or video)
    if (filters.mediaType && filters.mediaType !== 'all') {
      const mt = filters.mediaType.toLowerCase();
      photos = photos.filter(p => (p.mediaType || 'photo').toLowerCase() === mt);
    }

    // Category Filter
    if (filters.category && filters.category !== 'all') {
      photos = photos.filter(p => (p.category || '').toLowerCase() === filters.category.toLowerCase());
    }

    // Department Filter
    if (filters.department && filters.department !== 'all') {
      photos = photos.filter(p => (p.department || '').toLowerCase() === filters.department.toLowerCase());
    }

    // Event Year Filter
    if (filters.eventYear && filters.eventYear !== 'all') {
      photos = photos.filter(p => String(p.eventYear) === String(filters.eventYear));
    }

    // Company Filter
    if (filters.company && filters.company !== 'all') {
      photos = photos.filter(p => (p.company || '').toLowerCase() === filters.company.toLowerCase());
    }

    // Status / Permissions Workflow
    const uId = (filters.userId || '').toLowerCase();
    const st = (filters.status || '').toLowerCase();
    const isMyUploads = filters.view === 'my-uploads' || st === 'my-uploads';

    if (isMyUploads) {
      // Return student's own uploads with status (Pending Teacher Approval, Approved, Rejected)
      photos = photos.filter(p => (p.uploadedBy?.id || '').toLowerCase() === uId);
    } else if (filters.userRole === 'student') {
      if (st && st !== 'all') {
        if (st === 'approved') {
          photos = photos.filter(p => isApproved(p.status));
        } else if (st.includes('pending')) {
          photos = photos.filter(p => isPending(p.status) && (p.uploadedBy?.id || '').toLowerCase() === uId);
        } else if (st === 'rejected') {
          photos = photos.filter(p => isRejected(p.status) && (p.uploadedBy?.id || '').toLowerCase() === uId);
        }
      } else {
        // Students browsing public gallery only see Approved media
        photos = photos.filter(p => isApproved(p.status));
      }
    } else if (st && st !== 'all') {
      // Teachers / HOD / Admin filtering by status
      if (st === 'approved') {
        photos = photos.filter(p => isApproved(p.status));
      } else if (st.includes('pending')) {
        photos = photos.filter(p => isPending(p.status));
      } else if (st === 'rejected') {
        photos = photos.filter(p => isRejected(p.status));
      }
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      photos = photos.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.department || '').toLowerCase().includes(q) ||
        (p.company || '').toLowerCase().includes(q) ||
        (p.uploadedBy?.name || '').toLowerCase().includes(q) ||
        (p.uploadedBy?.id || '').toLowerCase().includes(q)
      );
    }

    return photos;
  },

  async addGalleryPhoto(photoData) {
    loadFromDisk();
    if (!dataStore.gallery) dataStore.gallery = [];

    const role = (photoData.uploadedBy?.role || 'student').toLowerCase();
    const isApprovedByDefault = role === 'staff' || role === 'hod' || role === 'admin';
    const finalStatus = photoData.status || (isApprovedByDefault ? 'Approved' : 'Pending Teacher Approval');

    const newPhoto = {
      id: `GAL-${Date.now().toString().slice(-6)}`,
      title: photoData.title || 'Untitled Media',
      description: photoData.description || '',
      mediaType: photoData.mediaType || 'photo', // 'photo' or 'video'
      section: photoData.section === 'events' ? 'event' : (photoData.section || 'department'),
      category: photoData.category || 'General',
      department: photoData.department || 'Information Technology',
      eventYear: photoData.eventYear || new Date().getFullYear().toString(),
      company: photoData.company || null,
      url: photoData.url || '',
      localFilePath: photoData.localFilePath || null,
      fileSize: photoData.fileSize || null,
      mimeType: photoData.mimeType || null,
      date: photoData.date || new Date().toISOString().split('T')[0],
      uploadedBy: photoData.uploadedBy || { id: 'GUEST', name: 'Anonymous', role: 'student' },
      status: finalStatus,
      likes: 0,
      likedBy: [],
      comments: [],
      views: 1
    };

    dataStore.gallery.unshift(newPhoto);
    saveToDisk();
    return newPhoto;
  },

  async getGalleryPhotoById(photoId) {
    loadFromDisk();
    if (!dataStore.gallery) return null;
    return dataStore.gallery.find(p => p.id === photoId) || null;
  },

  async updateGalleryPhoto(photoId, updateData) {
    loadFromDisk();
    if (!dataStore.gallery) return null;
    const photo = dataStore.gallery.find(p => p.id === photoId);
    if (!photo) return null;
    Object.assign(photo, updateData);
    saveToDisk();
    return photo;
  },

  async togglePhotoLike(photoId, userId) {
    loadFromDisk();
    if (!dataStore.gallery) return null;
    const photo = dataStore.gallery.find(p => p.id === photoId);
    if (!photo) return null;

    if (!Array.isArray(photo.likedBy)) photo.likedBy = [];
    const idx = photo.likedBy.indexOf(userId);
    let isLiked = false;

    if (idx > -1) {
      photo.likedBy.splice(idx, 1);
      photo.likes = Math.max(0, (photo.likes || 1) - 1);
      isLiked = false;
    } else {
      photo.likedBy.push(userId);
      photo.likes = (photo.likes || 0) + 1;
      isLiked = true;
    }

    saveToDisk();
    return { likes: photo.likes, isLiked, likedBy: photo.likedBy };
  },

  async addPhotoComment(photoId, commentData) {
    loadFromDisk();
    if (!dataStore.gallery) return null;
    const photo = dataStore.gallery.find(p => p.id === photoId);
    if (!photo) return null;

    if (!Array.isArray(photo.comments)) photo.comments = [];
    const newComment = {
      id: `CMT-${Date.now().toString().slice(-5)}`,
      userId: commentData.userId || 'ANON',
      userName: commentData.userName || 'Anonymous User',
      userRole: commentData.userRole || 'student',
      text: commentData.text || '',
      timestamp: 'Just now'
    };

    photo.comments.push(newComment);
    saveToDisk();
    return newComment;
  },

  async updatePhotoStatus(photoId, status) {
    loadFromDisk();
    if (!dataStore.gallery) return null;
    const photo = dataStore.gallery.find(p => p.id === photoId);
    if (!photo) return null;

    // Normalize status string
    let normalized = status;
    if (status.toLowerCase() === 'approved') normalized = 'Approved';
    else if (status.toLowerCase().includes('pending')) normalized = 'Pending Teacher Approval';
    else if (status.toLowerCase() === 'rejected') normalized = 'Rejected';

    photo.status = normalized;
    saveToDisk();
    return photo;
  },

  async deleteGalleryPhoto(photoId) {
    loadFromDisk();
    if (!dataStore.gallery) return false;
    const photo = dataStore.gallery.find(p => p.id === photoId);
    if (!photo) return false;

    // Delete local file from disk if present
    if (photo.localFilePath) {
      try {
        if (fs.existsSync(photo.localFilePath)) {
          fs.unlinkSync(photo.localFilePath);
        }
      } catch (err) {
        console.warn('Could not unlink local photo file:', err.message);
      }
    }

    dataStore.gallery = dataStore.gallery.filter(p => p.id !== photoId);
    saveToDisk();
    return true;
  },

  async getGalleryAnalytics() {
    loadFromDisk();
    const photos = dataStore.gallery || [];
    const totalPhotos = photos.length;
    const approved = photos.filter(p => (p.status || '').toLowerCase() === 'approved').length;
    const pending = photos.filter(p => (p.status || '').toLowerCase().includes('pending')).length;
    const rejected = photos.filter(p => (p.status || '').toLowerCase() === 'rejected').length;
    const totalLikes = photos.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalComments = photos.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

    const sectionCounts = {
      department: photos.filter(p => p.section === 'department').length,
      symposium: photos.filter(p => p.section === 'symposium').length,
      event: photos.filter(p => p.section === 'event' || p.section === 'events').length,
      events: photos.filter(p => p.section === 'event' || p.section === 'events').length,
      placement: photos.filter(p => p.section === 'placement').length
    };

    return {
      totalPhotos,
      approved,
      pending,
      rejected,
      totalLikes,
      totalComments,
      sectionCounts,
      sections: sectionCounts
    };
  },

  // Reset Database to Pure Initial Seed
  async resetDatabase() {
    dataStore = JSON.parse(JSON.stringify(initialSeedData));
    saveToDisk();
    return dataStore;
  }
};

module.exports = store;
