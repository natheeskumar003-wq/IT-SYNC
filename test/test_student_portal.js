// Comprehensive Student Portal Execution Test
// Simulates rendering all 18 tabs and features of StudentViews

const React = {
  createElement: (type, props, ...children) => ({
    type,
    props: { ...(props || {}), children }
  }),
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: () => {},
  useContext: () => {},
  createContext: () => ({}),
  Fragment: 'Fragment'
};
global.React = React;

// Setup mock window environment
global.window = {
  UIComponents: {
    StatCard: () => ({ type: 'StatCard' }),
    Modal: () => ({ type: 'Modal' }),
    FileUploader: () => ({ type: 'FileUploader' })
  },
  ITAuthContext: {
    Icons: new Proxy({}, { get: () => () => ({ type: 'Icon' }) }),
    useAuth: () => ({
      studentProfile: {
        rollNo: "24IT001",
        regNo: "730424205001",
        name: "Naveen Kumar R",
        department: "Information Technology",
        batch: "2024 - 2028",
        semester: 4,
        year: "II Year / IV Sem",
        section: "A",
        cgpa: 8.74,
        attendancePercentage: 89.5,
        pendingAssignments: 2,
        internalAvg: 86.4,
        dob: "2006-05-14",
        gender: "Male",
        bloodGroup: "O +ve",
        email: "naveenkumar.24it@gceerode.ac.in",
        phone: "+91 98421 54321",
        address: "42, Perundurai Road, Erode",
        fatherName: "Rajendran K",
        fatherPhone: "+91 94432 10987",
        motherName: "Saraswathi R",
        mentorName: "Dr. A. Venkatesh (Assoc. Prof)",
        mentorEmail: "a.venkatesh@gceerode.ac.in",
        mentorPhone: "+91 94421 87654",
        hostelStatus: "Hosteller",
        scholarship: "First Graduate"
      },
      subjects: [
        { code: "IT8401", name: "Database Management Systems", short: "DBMS", credits: 3, type: "Theory", faculty: "Dr. A. Venkatesh", syllabusUnits: 5, completedUnits: 4, totalHours: 45, description: "Relational model" }
      ],
      attendance: [
        { code: "IT8401", name: "Database Management Systems", total: 42, attended: 39, percentage: 92.8, status: "Good" }
      ],
      internalMarks: [
        { code: "IT8401", name: "Database Management Systems", cia1: 45, cia2: 44, model: 88, assignment: 9.5, totalInternal: 46.2, gradeEstimate: "O (Outstanding)" }
      ],
      semesterResults: [
        { semester: 3, gpa: 8.85, credits: 24, status: "Passed", courses: [{ code: "IT8301", name: "DSA", grade: "O" }] }
      ],
      timetable: {
        Monday: [{ period: "1", time: "09:00 - 09:50", subject: "DBMS", faculty: "Dr. A. Venkatesh", room: "Room 204" }],
        Tuesday: [{ period: "1", time: "09:00 - 09:50", subject: "DBMS", faculty: "Dr. A. Venkatesh", room: "Room 204" }],
        Wednesday: [{ period: "1", time: "09:00 - 09:50", subject: "DBMS", faculty: "Dr. A. Venkatesh", room: "Room 204" }],
        Thursday: [{ period: "1", time: "09:00 - 09:50", subject: "DBMS", faculty: "Dr. A. Venkatesh", room: "Room 204" }],
        Friday: [{ period: "1", time: "09:00 - 09:50", subject: "DBMS", faculty: "Dr. A. Venkatesh", room: "Room 204" }]
      },
      studyMaterials: [
        { id: "MAT-01", title: "Unit 1 Lecture Notes", subjectCode: "IT8401", subjectName: "DBMS", category: "Notes", fileSize: "4.2 MB", uploadedBy: "Dr. A. Venkatesh", date: "2026-02-10", downloads: 84 }
      ],
      assignments: [
        { id: "ASN-01", subjectCode: "IT8401", subjectName: "DBMS", title: "SQL Optimization", instructions: "Write BCNF decomposition", dueDate: "2026-09-15", assignedDate: "2026-08-30", maxMarks: 20, status: "Pending" }
      ],
      facultyList: [
        { id: "ITSTAFF01", name: "Dr. A. Venkatesh", designation: "Associate Professor", cabin: "Room 204", email: "a.venkatesh@gceerode.ac.in", phone: "+91 94421 87654", classAdvisorFor: 2 }
      ],
      announcements: [
        { id: "ANN-01", title: "Hackathon Registration", category: "Event", priority: "High", date: "2026-09-01", content: "SIH registration open." }
      ],
      questionPapers: [
        { id: "QP-01", subjectCode: "IT8401", subjectName: "DBMS", examYear: "Nov/Dec 2025", semester: 4, fileType: "PDF", fileSize: "1.2 MB" }
      ],
      placements: [
        { id: "DRV-01", company: "Zoho", role: "Software Engineer", ctc: "12 LPA", date: "2026-09-20", eligibility: "CGPA > 7.5", status: "Upcoming" }
      ],
      achievements: [
        { id: "ACH-01", title: "First Prize Smart India Hackathon", category: "Hackathon", issuedBy: "AICTE", date: "2025-12-18", description: "Won 1st prize" }
      ],
      certificates: [
        { id: "CERT-01", name: "AWS Cloud Practitioner", issuer: "AWS", issueDate: "2025-08-10", credentialId: "AWS-12345" }
      ],
      notifications: [
        { id: "NOTIF-01", title: "Assignment #2 Uploaded", time: "10 mins ago", read: false, link: "assignments" }
      ],
      messages: [
        { id: "MSG-01", fromId: "24IT001", fromName: "Naveen Kumar R", fromRole: "student", toId: "ITSTAFF01", toName: "Dr. A. Venkatesh", toRole: "staff", type: "Request", subject: "SIH OD", content: "Permission request", timestamp: "10:00 AM", status: "Pending" }
      ],
      classAdvisors: {
        2: { year: 2, batch: "2024 - 2028", staffId: "ITSTAFF01", staffName: "Dr. A. Venkatesh", designation: "Associate Professor", email: "a.venkatesh@gceerode.ac.in", phone: "+91 94421 87654", cabin: "Room 204, IT Block" }
      },
      submitAssignment: () => {},
      addAchievement: () => {},
      addCertificate: () => {},
      sendMessage: () => {},
      showToast: () => {}
    })
  }
};

// Load StudentViews
require('../src/components/student/StudentViews.js');
const StudentViews = global.window.ITStudentViews;

if (!StudentViews) {
  console.error("FAILED: ITStudentViews not found on window!");
  process.exit(1);
}

// All 18 tabs
const TABS = [
  'dashboard',
  'my-profile',
  'messages',
  'subjects',
  'attendance',
  'internal-marks',
  'semester-results',
  'study-materials',
  'assignments',
  'timetable',
  'faculty-details',
  'department-announcements',
  'previous-year-question-papers',
  'placement-internship',
  'achievements',
  'certificates',
  'notifications',
  'feedback'
];

console.log("==================================================");
console.log("TESTING ALL 18 STUDENT PORTAL TABS");
console.log("==================================================");

let passed = 0;
for (const tab of TABS) {
  try {
    const rendered = StudentViews({ currentTab: tab, onNavigate: () => {} });
    if (!rendered || !rendered.type) {
      throw new Error(`Rendered result invalid for tab: ${tab}`);
    }
    console.log(`[PASS] Tab: ${tab.padEnd(30)} -> Rendered successfully`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] Tab: ${tab} -> ERROR: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

console.log("==================================================");
console.log(`ALL ${passed}/${TABS.length} STUDENT PORTAL TABS RENDERED FLAWLESSLY!`);
console.log("==================================================");
