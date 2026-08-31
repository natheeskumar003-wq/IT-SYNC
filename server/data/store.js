/**
 * ============================================================================
 * IT DIGITAL HUB - Modular Backend Data Adapter Layer
 * Department of Information Technology - Government College of Engineering, Erode
 * ============================================================================
 * 
 * This module manages all departmental data entities and operations.
 * 
 * FUTURE DATABASE INTEGRATION:
 * When you decide on a database (MongoDB, MySQL, PostgreSQL, Supabase, Firebase, SQLite),
 * you only need to swap the methods in this file with your database queries (e.g. Mongoose, Prisma, or pg/mysql2).
 * All Express routes and React frontend components will continue to work seamlessly without ANY changes!
 */

// Initial Seed Dataset (Standard GCE Erode Information Technology Department R2021)
const dataStore = {
  // Demo User Credentials
  credentials: {
    student: { id: "24IT001", pass: "student123", name: "Naveen Kumar R", role: "student" },
    staff: { id: "ITSTAFF01", pass: "staff123", name: "Dr. A. Venkatesh", role: "staff" },
    hod: { id: "ITHOD01", pass: "hod123", name: "Dr. S. K. Murugesan", role: "hod" },
    admin: { id: "ITADMIN01", pass: "admin123", name: "Er. M. Senthil Kumar", role: "admin" }
  },

  // Student Profile Dossier
  studentProfile: {
    rollNo: "24IT001",
    regNo: "730424205001",
    name: "Naveen Kumar R",
    year: 2,
    sem: 4,
    sec: "A",
    batch: "2024 - 2028",
    degree: "B.Tech Information Technology",
    regulations: "Autonomous R2021",
    tneaCode: "7304",
    dob: "2006-05-14",
    bloodGroup: "O+ve",
    mentor: "Dr. A. Venkatesh (Assoc. Prof)",
    mentorContact: "venkatesh.it@gceerode.ac.in",
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
    email: "24it001@gceerode.ac.in",
    address: "14/2, Anna Nagar, Perundurai Road, Erode - 638011"
  },

  // Students Roster
  students: [
    { rollNo: "24IT001", regNo: "730424205001", name: "Naveen Kumar R", year: 2, sem: 4, sec: "A", attendance: 89.5, cgpa: 8.74, arrears: 0, mentor: "Dr. A. Venkatesh", phone: "+91 98421 54321", email: "24it001@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT002", regNo: "730424205002", name: "Abinaya S", year: 2, sem: 4, sec: "A", attendance: 94.2, cgpa: 9.12, arrears: 0, mentor: "Dr. A. Venkatesh", phone: "+91 98421 54322", email: "24it002@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT003", regNo: "730424205003", name: "Balaji K", year: 2, sem: 4, sec: "A", attendance: 71.8, cgpa: 7.45, arrears: 1, mentor: "Dr. A. Venkatesh", phone: "+91 98421 54323", email: "24it003@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT004", regNo: "730424205004", name: "Dhivya Dharshini M", year: 2, sem: 4, sec: "A", attendance: 96.0, cgpa: 9.38, arrears: 0, mentor: "Dr. A. Venkatesh", phone: "+91 98421 54324", email: "24it004@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT005", regNo: "730424205005", name: "Gokulraj P", year: 2, sem: 4, sec: "A", attendance: 82.4, cgpa: 8.05, arrears: 0, mentor: "Dr. A. Venkatesh", phone: "+91 98421 54325", email: "24it005@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT006", regNo: "730424205006", name: "Harish Kumar V", year: 2, sem: 4, sec: "A", attendance: 68.5, cgpa: 6.90, arrears: 2, mentor: "Dr. A. Venkatesh", phone: "+91 98421 54326", email: "24it006@gceerode.ac.in", status: "Active" }
  ],

  // Faculty Directory
  facultyList: [
    { id: "ITHOD01", name: "Dr. S. K. Murugesan", designation: "Professor & Head", qualification: "M.E., Ph.D.", experience: "24 Years", specialization: "Cloud Computing, High Speed Networks", email: "hod.it@gceerode.ac.in", phone: "+91 94433 11223", cabin: "HOD Chamber, IT Block - Ground Floor", subjects: ["High Speed Networks"], publications: 48 },
    { id: "ITSTAFF01", name: "Dr. A. Venkatesh", designation: "Associate Professor", qualification: "M.Tech., Ph.D.", experience: "16 Years", specialization: "Database Systems, Data Mining, AI", email: "venkatesh.it@gceerode.ac.in", phone: "+91 98421 22334", cabin: "Room 304, IT Block - 2nd Floor", subjects: ["Database Management Systems", "DBMS Laboratory"], publications: 26 },
    { id: "ITSTAFF02", name: "Dr. M. Deepa", designation: "Associate Professor", qualification: "M.E., Ph.D.", experience: "14 Years", specialization: "Network Security, Cryptography, Blockchain", email: "deepa.it@gceerode.ac.in", phone: "+91 98422 33445", cabin: "Room 305, IT Block - 2nd Floor", subjects: ["Computer Networks", "Network Security Lab"], publications: 19 },
    { id: "ITSTAFF03", name: "Prof. P. Kavin", designation: "Assistant Professor (Sr. Gr)", qualification: "M.E., (Ph.D.)", experience: "11 Years", specialization: "Design & Analysis of Algorithms, Competitive Coding", email: "kavin.it@gceerode.ac.in", phone: "+91 98423 44556", cabin: "Room 306, IT Block - 2nd Floor", subjects: ["Design & Analysis of Algorithms"], publications: 12 },
    { id: "ITSTAFF04", name: "Prof. S. Priyanka", designation: "Assistant Professor", qualification: "M.Tech.", experience: "8 Years", specialization: "Full Stack Web Technologies, React, Cloud Native", email: "priyanka.it@gceerode.ac.in", phone: "+91 98424 55667", cabin: "Room 307, IT Block - 2nd Floor", subjects: ["Web Technologies", "Web Technologies Laboratory"], publications: 8 },
    { id: "ITSTAFF05", name: "Prof. R. Saravanan", designation: "Assistant Professor", qualification: "M.E.", experience: "9 Years", specialization: "Operating Systems, Linux Kernel, Embedded IT", email: "saravanan.it@gceerode.ac.in", phone: "+91 98425 66778", cabin: "Room 308, IT Block - 2nd Floor", subjects: ["Operating Systems", "OS & System Programming Lab"], publications: 10 }
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

  // Audit Logs
  auditLogs: [
    { id: "LOG-1001", action: "User Login", user: "24IT001 (Naveen Kumar R)", role: "STUDENT", ip: "192.168.1.100", timestamp: "Just now", status: "Success" }
  ]
};

/* ==========================================================================
 * DATA ACCESS METHODS (Modular Repository Pattern)
 * ========================================================================== */

const store = {
  // Auth
  async validateUser(role, userId, password) {
    const cred = dataStore.credentials[role];
    if (cred && cred.id.toLowerCase() === userId.trim().toLowerCase() && cred.pass === password.trim()) {
      return {
        id: cred.id,
        name: cred.name,
        role: cred.role,
        email: `${cred.id.toLowerCase()}@gceerode.ac.in`,
        ...(role === 'student' ? dataStore.studentProfile : {})
      };
    }
    return null;
  },

  // Student Profile
  async getStudentProfile(rollNo) {
    return dataStore.studentProfile;
  },
  async updateStudentContact(rollNo, contactData) {
    Object.assign(dataStore.studentProfile, contactData);
    return dataStore.studentProfile;
  },

  // Students
  async getStudents() {
    return dataStore.students;
  },
  async addStudent(student) {
    dataStore.students.unshift({ arrears: 0, status: "Active", ...student });
    return student;
  },
  async updateStudent(rollNo, updatedData) {
    const idx = dataStore.students.findIndex(s => s.rollNo === rollNo);
    if (idx !== -1) {
      dataStore.students[idx] = { ...dataStore.students[idx], ...updatedData };
      return dataStore.students[idx];
    }
    return null;
  },
  async deleteStudent(rollNo) {
    dataStore.students = dataStore.students.filter(s => s.rollNo !== rollNo);
    return true;
  },

  // Subjects & Attendance
  async getSubjects() {
    return dataStore.subjects;
  },
  async saveAttendanceBatch(subjectCode, date, records) {
    return { success: true, count: records.length, subjectCode, date };
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
    return newAsn;
  },
  async submitAssignment(id, rollNo, fileDetails) {
    const asn = dataStore.assignments.find(a => a.id === id);
    if (asn) {
      asn.status = "Submitted";
      asn.submissionFile = fileDetails.fileName || "submission.pdf";
      asn.submittedDate = new Date().toISOString().split('T')[0];
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
      return asn;
    }
    return null;
  },

  // Study Materials
  async getStudyMaterials() {
    return dataStore.studyMaterials;
  },
  async addStudyMaterial(material) {
    const newMat = {
      id: `MAT-${Date.now().toString().slice(-4)}`,
      downloads: 0,
      date: new Date().toISOString().split('T')[0],
      ...material
    };
    dataStore.studyMaterials.unshift(newMat);
    return newMat;
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
    return newLeave;
  },
  async updateLeaveStatus(id, status) {
    const req = dataStore.leaveRequests.find(l => l.id === id);
    if (req) {
      req.status = status;
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
    return newAnn;
  },

  // Faculty
  async getFacultyList() {
    return dataStore.facultyList;
  },
  async addFaculty(faculty) {
    const newF = {
      id: `ITSTAFF0${dataStore.facultyList.length + 1}`,
      publications: 0,
      ...faculty
    };
    dataStore.facultyList.push(newF);
    return newF;
  },
  async deleteFaculty(id) {
    dataStore.facultyList = dataStore.facultyList.filter(f => f.id !== id);
    return true;
  },

  // Achievements & Certs
  async getAchievements() {
    return dataStore.achievements;
  },
  async addAchievement(ach) {
    const newAch = { id: `ACH-${Date.now().toString().slice(-4)}`, ...ach };
    dataStore.achievements.unshift(newAch);
    return newAch;
  },
  async getCertificates() {
    return dataStore.certificates;
  },
  async addCertificate(cert) {
    const newCert = { id: `CERT-${Date.now().toString().slice(-4)}`, ...cert };
    dataStore.certificates.unshift(newCert);
    return newCert;
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
  }
};

module.exports = store;
