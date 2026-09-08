// IT DIGITAL HUB - Mock Database & Academic System State
// Government College of Engineering, Erode - Department of Information Technology

const COLLEGE_INFO = {
  name: "Government College of Engineering, Erode",
  shortName: "GCE Erode",
  formerName: "Formerly Institute of Road and Transport Technology (IRTT)",
  affiliation: "Autonomous Institution Affiliated to Anna University, Chennai",
  counselingCode: "7304",
  department: "Department of Information Technology",
  portalTitle: "IT DIGITAL HUB",
  accreditation: "NBA Accredited • NAAC 'A' Grade • Approved by AICTE, New Delhi",
  location: "Suriyampalayam, Chithode, Erode - 638316, Tamil Nadu, India",
  website: "www.gceerode.ac.in",
  email: "hod.it@gceerode.ac.in",
  phone: "+91 424 2533279",
  established: "2000 (IT Department)",
  vision: "To produce globally competent Information Technology professionals with ethical values, innovative mindset, and leadership qualities to solve real-world societal problems.",
  mission: [
    "To provide quality education in core and emerging areas of Information Technology through outcome-based curriculum.",
    "To foster research, innovation, and entrepreneurship by establishing state-of-the-art laboratory infrastructure and industry tie-ups.",
    "To instill professional ethics, teamwork, lifelong learning, and social responsibility in students."
  ]
};

const DEMO_CREDENTIALS = {
  student: { id: "25IT001", pass: "1234", role: "student", name: "Naveen Kumar R" },
  staff: { id: "ITSTAFF01", pass: "1234", role: "staff", name: "Prof. B. V. Prakash" },
  hod: { id: "ITHOD01", pass: "1234", role: "hod", name: "Dr.I. Bhuvaneshwarri" },
  admin: { id: "ITADMIN01", pass: "1234", role: "admin", name: "Er. M. Senthil Kumar" }
};

const INITIAL_STUDENT_PROFILE = {
  rollNo: "25IT001",
  regNo: "730425205001",
  name: "Naveen Kumar R",
  department: "Information Technology",
  batch: "2025 - 2029",
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
  email: "25it001@gceerode.ac.in",
  phone: "+91 98421 54321",
  address: "42, Perundurai Road, Erode - 638011, Tamil Nadu",
  fatherName: "Rajendran K",
  fatherPhone: "+91 94432 10987",
  motherName: "Saraswathi R",
  mentorName: "Dr. Mohanasundaram (Assoc. Prof)",
  mentorEmail: "a.venkatesh@gceerode.ac.in",
  mentorPhone: "+91 94421 87654",
  hostelStatus: "Hosteller (Kavery Hostel, Room 304)",
  scholarship: "First Graduate Scholarship (Govt of Tamil Nadu)"
};

const INITIAL_SUBJECTS = [
  {
    code: "IT8401",
    name: "Database Management Systems",
    short: "DBMS",
    credits: 3,
    type: "Theory",
    faculty: "Dr. A. Venkatesh",
    facultyEmail: "a.venkatesh@gceerode.ac.in",
    syllabusUnits: 5,
    completedUnits: 4,
    hoursTaught: 42,
    totalHours: 45,
    description: "Relational model, SQL, Normalization, Transaction management, Indexing and NoSQL databases."
  },
  {
    code: "IT8402",
    name: "Design & Analysis of Algorithms",
    short: "DAA",
    credits: 4,
    type: "Theory",
    faculty: "Prof. P. Kavin",
    facultyEmail: "p.kavin@gceerode.ac.in",
    syllabusUnits: 5,
    completedUnits: 3,
    hoursTaught: 38,
    totalHours: 50,
    description: "Asymptotic notation, Divide & Conquer, Greedy, Dynamic Programming, NP-Completeness."
  },
  {
    code: "IT8403",
    name: "Operating Systems Principles",
    short: "OS",
    credits: 3,
    type: "Theory",
    faculty: "Dr. M. Deepa",
    facultyEmail: "m.deepa@gceerode.ac.in",
    syllabusUnits: 5,
    completedUnits: 4,
    hoursTaught: 40,
    totalHours: 45,
    description: "Process management, Threads, CPU Scheduling, Deadlocks, Memory Virtualization, File Systems."
  },
  {
    code: "IT8404",
    name: "Computer Networks & Protocols",
    short: "CN",
    credits: 3,
    type: "Theory",
    faculty: "Prof. R. Priya",
    facultyEmail: "r.priya@gceerode.ac.in",
    syllabusUnits: 5,
    completedUnits: 4,
    hoursTaught: 41,
    totalHours: 45,
    description: "OSI & TCP/IP stack, Data link framing, Routing algorithms, Transport flow control, Application protocols."
  },
  {
    code: "IT8405",
    name: "Web Technologies & Frameworks",
    short: "WT",
    credits: 3,
    type: "Theory",
    faculty: "Dr. K. Sathish Kumar",
    facultyEmail: "k.sathish@gceerode.ac.in",
    syllabusUnits: 5,
    completedUnits: 4,
    hoursTaught: 43,
    totalHours: 45,
    description: "HTML5, CSS3, Modern JavaScript ES6+, React.js, Node.js, RESTful Web APIs, JWT Authentication."
  },
  {
    code: "IT8411",
    name: "DBMS & SQL Laboratory",
    short: "DBMS LAB",
    credits: 2,
    type: "Practical",
    faculty: "Dr. A. Venkatesh",
    facultyEmail: "a.venkatesh@gceerode.ac.in",
    syllabusUnits: 12,
    completedUnits: 10,
    hoursTaught: 30,
    totalHours: 36,
    description: "DDL, DML, Complex queries, PL/SQL triggers, Stored procedures, MongoDB CRUD."
  },
  {
    code: "IT8412",
    name: "Web Technologies Laboratory",
    short: "WT LAB",
    credits: 2,
    type: "Practical",
    faculty: "Dr. K. Sathish Kumar",
    facultyEmail: "k.sathish@gceerode.ac.in",
    syllabusUnits: 10,
    completedUnits: 9,
    hoursTaught: 28,
    totalHours: 36,
    description: "Responsive UI design, Full stack React & Node integration, Single page application development."
  }
];

const INITIAL_STUDENT_ATTENDANCE = [
  { code: "IT8401", name: "Database Management Systems", total: 42, attended: 39, percentage: 92.8, status: "Good" },
  { code: "IT8402", name: "Design & Analysis of Algorithms", total: 38, attended: 34, percentage: 89.4, status: "Good" },
  { code: "IT8403", name: "Operating Systems Principles", total: 40, attended: 35, percentage: 87.5, status: "Good" },
  { code: "IT8404", name: "Computer Networks & Protocols", total: 41, attended: 36, percentage: 87.8, status: "Good" },
  { code: "IT8405", name: "Web Technologies & Frameworks", total: 43, attended: 41, percentage: 95.3, status: "Excellent" },
  { code: "IT8411", name: "DBMS & SQL Laboratory", total: 15, attended: 14, percentage: 93.3, status: "Good" },
  { code: "IT8412", name: "Web Technologies Laboratory", total: 14, attended: 13, percentage: 92.8, status: "Good" }
];

const INITIAL_INTERNAL_MARKS = [
  {
    code: "IT8401",
    name: "Database Management Systems",
    cia1: 45, // max 50
    cia2: 44, // max 50
    model: 88, // max 100
    assignment: 9.5, // max 10
    attendanceMarks: 5, // max 5
    totalInternal: 46.2, // max 50
    gradeEstimate: "O (Outstanding)"
  },
  {
    code: "IT8402",
    name: "Design & Analysis of Algorithms",
    cia1: 41,
    cia2: 42,
    model: 82,
    assignment: 9.0,
    attendanceMarks: 4.5,
    totalInternal: 43.1,
    gradeEstimate: "A+ (Excellent)"
  },
  {
    code: "IT8403",
    name: "Operating Systems Principles",
    cia1: 43,
    cia2: 40,
    model: 84,
    assignment: 9.0,
    attendanceMarks: 4.5,
    totalInternal: 43.8,
    gradeEstimate: "A+ (Excellent)"
  },
  {
    code: "IT8404",
    name: "Computer Networks & Protocols",
    cia1: 46,
    cia2: 45,
    model: 90,
    assignment: 10.0,
    attendanceMarks: 4.5,
    totalInternal: 47.1,
    gradeEstimate: "O (Outstanding)"
  },
  {
    code: "IT8405",
    name: "Web Technologies & Frameworks",
    cia1: 48,
    cia2: 47,
    model: 94,
    assignment: 10.0,
    attendanceMarks: 5.0,
    totalInternal: 48.6,
    gradeEstimate: "O (Outstanding)"
  },
  {
    code: "IT8411",
    name: "DBMS & SQL Laboratory",
    cia1: 48,
    cia2: 49,
    model: 96,
    assignment: 10.0,
    attendanceMarks: 5.0,
    totalInternal: 49.0,
    gradeEstimate: "O (Outstanding)"
  },
  {
    code: "IT8412",
    name: "Web Technologies Laboratory",
    cia1: 47,
    cia2: 48,
    model: 95,
    assignment: 10.0,
    attendanceMarks: 5.0,
    totalInternal: 48.5,
    gradeEstimate: "O (Outstanding)"
  }
];

const INITIAL_SEMESTER_RESULTS = [
  {
    semester: 1,
    gpa: 8.65,
    credits: 22,
    status: "ALL PASS",
    courses: [
      { code: "HS8151", name: "Communicative English", credit: 4, grade: "A+" },
      { code: "MA8151", name: "Engineering Mathematics I", credit: 4, grade: "O" },
      { code: "PH8151", name: "Engineering Physics", credit: 3, grade: "A+" },
      { code: "CY8151", name: "Engineering Chemistry", credit: 3, grade: "A" },
      { code: "GE8151", name: "Problem Solving & Python Programming", credit: 3, grade: "O" },
      { code: "GE8152", name: "Engineering Graphics", credit: 3, grade: "A" },
      { code: "GE8161", name: "Python Programming Lab", credit: 2, grade: "O" }
    ]
  },
  {
    semester: 2,
    gpa: 8.80,
    credits: 24,
    status: "ALL PASS",
    courses: [
      { code: "HS8251", name: "Technical English", credit: 4, grade: "A+" },
      { code: "MA8251", name: "Engineering Mathematics II", credit: 4, grade: "O" },
      { code: "PH8252", name: "Physics for Information Science", credit: 3, grade: "A+" },
      { code: "BE8255", name: "Basic Electrical & Electronics", credit: 3, grade: "A" },
      { code: "IT8201", name: "Programming in C and Data Structures", credit: 4, grade: "O" },
      { code: "IT8211", name: "C Programming Laboratory", credit: 2, grade: "O" },
      { code: "GE8261", name: "Engineering Practices Lab", credit: 2, grade: "A+" }
    ]
  },
  {
    semester: 3,
    gpa: 8.78,
    credits: 23,
    status: "ALL PASS",
    courses: [
      { code: "MA8354", name: "Discrete Mathematics", credit: 4, grade: "O" },
      { code: "IT8301", name: "Digital Principles & System Design", credit: 3, grade: "A+" },
      { code: "IT8302", name: "Data Structures & OOPs in Java", credit: 4, grade: "O" },
      { code: "IT8303", name: "Software Engineering & Agile", credit: 3, grade: "A+" },
      { code: "IT8304", name: "Computer Architecture", credit: 3, grade: "A" },
      { code: "IT8311", name: "Java & OOP Laboratory", credit: 2, grade: "O" },
      { code: "IT8312", name: "Digital Systems Lab", credit: 2, grade: "O" }
    ]
  }
];

const INITIAL_TIMETABLE = {
  Monday: [
    { period: 1, time: "09:00 - 09:50", subject: "IT8401 DBMS", room: "IT LH-1", faculty: "Dr. A. Venkatesh" },
    { period: 2, time: "09:50 - 10:40", subject: "IT8402 DAA", room: "IT LH-1", faculty: "Prof. P. Kavin" },
    { period: 3, time: "10:55 - 11:45", subject: "IT8403 OS", room: "IT LH-1", faculty: "Dr. M. Deepa" },
    { period: 4, time: "11:45 - 12:35", subject: "IT8405 WT", room: "IT LH-1", faculty: "Dr. K. Sathish" },
    { period: 5, time: "01:30 - 02:20", subject: "IT8404 CN", room: "IT LH-1", faculty: "Prof. R. Priya" },
    { period: 6, time: "02:20 - 03:10", subject: "Library / NPTEL", room: "Central Lib", faculty: "Staff in-charge" },
    { period: 7, time: "03:20 - 04:10", subject: "Mentor Hour / Sports", room: "Campus Grounds", faculty: "Dr. A. Venkatesh" }
  ],
  Tuesday: [
    { period: 1, time: "09:00 - 09:50", subject: "IT8404 CN", room: "IT LH-1", faculty: "Prof. R. Priya" },
    { period: 2, time: "09:50 - 10:40", subject: "IT8405 WT", room: "IT LH-1", faculty: "Dr. K. Sathish" },
    { period: 3, time: "10:55 - 11:45", subject: "IT8401 DBMS", room: "IT LH-1", faculty: "Dr. A. Venkatesh" },
    { period: 4, time: "11:45 - 12:35", subject: "IT8402 DAA", room: "IT LH-1", faculty: "Prof. P. Kavin" },
    { period: "5-7", time: "01:30 - 04:10", subject: "IT8411 DBMS Laboratory (Batch A/B)", room: "IT Computing Lab-2", faculty: "Dr. A. Venkatesh & Prof. Kavin" }
  ],
  Wednesday: [
    { period: 1, time: "09:00 - 09:50", subject: "IT8403 OS", room: "IT LH-1", faculty: "Dr. M. Deepa" },
    { period: 2, time: "09:50 - 10:40", subject: "IT8401 DBMS", room: "IT LH-1", faculty: "Dr. A. Venkatesh" },
    { period: 3, time: "10:55 - 11:45", subject: "IT8404 CN", room: "IT LH-1", faculty: "Prof. R. Priya" },
    { period: 4, time: "11:45 - 12:35", subject: "IT8402 DAA", room: "IT LH-1", faculty: "Prof. P. Kavin" },
    { period: 5, time: "01:30 - 02:20", subject: "IT8405 WT", room: "IT LH-1", faculty: "Dr. K. Sathish" },
    { period: 6, time: "02:20 - 03:10", subject: "Seminar / Technical Talk", room: "IT Seminar Hall", faculty: "Faculty Coordinator" },
    { period: 7, time: "03:20 - 04:10", subject: "Placement Aptitude", room: "IT LH-1", faculty: "Training Cell" }
  ],
  Thursday: [
    { period: 1, time: "09:00 - 09:50", subject: "IT8402 DAA", room: "IT LH-1", faculty: "Prof. P. Kavin" },
    { period: 2, time: "09:50 - 10:40", subject: "IT8403 OS", room: "IT LH-1", faculty: "Dr. M. Deepa" },
    { period: 3, time: "10:55 - 11:45", subject: "IT8405 WT", room: "IT LH-1", faculty: "Dr. K. Sathish" },
    { period: 4, time: "11:45 - 12:35", subject: "IT8404 CN", room: "IT LH-1", faculty: "Prof. R. Priya" },
    { period: "5-7", time: "01:30 - 04:10", subject: "IT8412 Web Tech Laboratory (Batch A/B)", room: "IT Computing Lab-1", faculty: "Dr. K. Sathish & Prof. Priya" }
  ],
  Friday: [
    { period: 1, time: "09:00 - 09:50", subject: "IT8405 WT", room: "IT LH-1", faculty: "Dr. K. Sathish" },
    { period: 2, time: "09:50 - 10:40", subject: "IT8404 CN", room: "IT LH-1", faculty: "Prof. R. Priya" },
    { period: 3, time: "10:55 - 11:45", subject: "IT8402 DAA", room: "IT LH-1", faculty: "Prof. P. Kavin" },
    { period: 4, time: "11:45 - 12:35", subject: "IT8401 DBMS", room: "IT LH-1", faculty: "Dr. A. Venkatesh" },
    { period: 5, time: "01:30 - 02:20", subject: "IT8403 OS", room: "IT LH-1", faculty: "Dr. M. Deepa" },
    { period: 6, time: "02:20 - 03:10", subject: "Coding Club (IT Association)", room: "IT Lab-1", faculty: "Club Mentors" },
    { period: 7, time: "03:20 - 04:10", subject: "Counseling & Feedback", room: "IT LH-1", faculty: "HOD / Mentors" }
  ]
};

const INITIAL_STUDY_MATERIALS = [
  {
    id: "MAT-01",
    title: "Unit 3 - Normalization and BCNF Complete Lecture Notes",
    subjectCode: "IT8401",
    subjectName: "Database Management Systems",
    category: "Lecture Notes",
    fileSize: "3.4 MB",
    fileType: "PDF",
    uploadedBy: "Dr. A. Venkatesh",
    date: "2026-08-20",
    downloads: 142
  },
  {
    id: "MAT-02",
    title: "Dynamic Programming & Graph Algorithms Solved Problems Handbook",
    subjectCode: "IT8402",
    subjectName: "Design & Analysis of Algorithms",
    category: "Question Bank",
    fileSize: "5.1 MB",
    fileType: "PDF",
    uploadedBy: "Prof. P. Kavin",
    date: "2026-08-18",
    downloads: 189
  },
  {
    id: "MAT-03",
    title: "React.js & REST API Full Stack Implementation Guide PPT",
    subjectCode: "IT8405",
    subjectName: "Web Technologies & Frameworks",
    category: "Presentation Slides",
    fileSize: "7.8 MB",
    fileType: "PPTX",
    uploadedBy: "Dr. K. Sathish Kumar",
    date: "2026-08-24",
    downloads: 210
  },
  {
    id: "MAT-04",
    title: "Linux Kernel Process Scheduling & Memory Management Manual",
    subjectCode: "IT8403",
    subjectName: "Operating Systems Principles",
    category: "Lab Manual",
    fileSize: "4.2 MB",
    fileType: "PDF",
    uploadedBy: "Dr. M. Deepa",
    date: "2026-08-15",
    downloads: 165
  },
  {
    id: "MAT-05",
    title: "Wireshark Packet Analysis & Subnetting Practical Guide",
    subjectCode: "IT8404",
    subjectName: "Computer Networks & Protocols",
    category: "Lab Manual",
    fileSize: "6.0 MB",
    fileType: "PDF",
    uploadedBy: "Prof. R. Priya",
    date: "2026-08-22",
    downloads: 177
  },
  {
    id: "MAT-06",
    title: "Two Marks with Answers (All 5 Units) - Semester Exam Question Bank",
    subjectCode: "IT8401",
    subjectName: "Database Management Systems",
    category: "Question Bank",
    fileSize: "2.8 MB",
    fileType: "PDF",
    uploadedBy: "Dr. A. Venkatesh",
    date: "2026-08-25",
    downloads: 245
  }
];

const INITIAL_ASSIGNMENTS = [
  {
    id: "ASN-101",
    title: "Design Relational Schema & 3NF Normalization for Hospital System",
    subjectCode: "IT8401",
    subjectName: "Database Management Systems",
    faculty: "Dr. A. Venkatesh",
    assignedDate: "2026-08-18",
    dueDate: "2026-09-02",
    maxMarks: 20,
    status: "Pending",
    submissionFile: null,
    submittedDate: null,
    score: null,
    remarks: null,
    instructions: "Submit an ER Diagram and mapped 3NF relational schemas with sample SQL create table scripts."
  },
  {
    id: "ASN-102",
    title: "Implement Dijkstra & Bellman-Ford Shortest Path in Java/C++",
    subjectCode: "IT8402",
    subjectName: "Design & Analysis of Algorithms",
    faculty: "Prof. P. Kavin",
    assignedDate: "2026-08-15",
    dueDate: "2026-08-28",
    maxMarks: 20,
    status: "Submitted",
    submissionFile: "24IT001_Dijkstra_Implementation.zip",
    submittedDate: "2026-08-25",
    score: 19,
    remarks: "Excellent time complexity explanation and clean code formatting.",
    instructions: "Provide code, test cases, and time complexity comparison graph."
  },
  {
    id: "ASN-103",
    title: "Build Responsive E-Commerce Product Catalog using React Components",
    subjectCode: "IT8405",
    subjectName: "Web Technologies & Frameworks",
    faculty: "Dr. K. Sathish Kumar",
    assignedDate: "2026-08-22",
    dueDate: "2026-09-05",
    maxMarks: 20,
    status: "Pending",
    submissionFile: null,
    submittedDate: null,
    score: null,
    remarks: null,
    instructions: "Use React hooks (useState, useEffect) with filter, search, and cart functionality."
  },
  {
    id: "ASN-104",
    title: "Simulate Round Robin and Multi-Level Queue CPU Scheduling in C",
    subjectCode: "IT8403",
    subjectName: "Operating Systems Principles",
    faculty: "Dr. M. Deepa",
    assignedDate: "2026-08-10",
    dueDate: "2026-08-20",
    maxMarks: 20,
    status: "Graded",
    submissionFile: "24IT001_OS_Scheduler_Simulation.pdf",
    submittedDate: "2026-08-19",
    score: 18.5,
    remarks: "Gantt chart rendering is very clear. Well done.",
    instructions: "Include calculation for average waiting time and turnaround time."
  }
];

const INITIAL_FACULTY_LIST = [
  {
    id: "ITSTAFF01",
    name: "Prof. B. V. Prakash",
    designation: "Associate Professor",
    qualification: "M.E., Ph.D. (Anna University)",
    experience: "16 Years",
    specialization: "Database Systems, Data Mining, Information Security",
    email: "prakash.it@gceerode.ac.in",
    phone: "+91 98421 22334",
    cabin: "IT Block - First Floor (Room 204)",
    publications: 26,
    subjects: ["Database Management Systems", "DBMS Lab", "Information Security"],
    classAdvisorFor: 1,
    classAdvisorLabel: "Class Advisor - I Year IT (Batch 2026-2030)"
  },
  {
    id: "ITSTAFF02",
    name: "Dr. Mohanasundaram",
    designation: "Associate Professor",
    qualification: "M.Tech., Ph.D. (NIT Trichy)",
    experience: "15 Years",
    specialization: "Operating Systems, High Performance Computing, IoT",
    email: "mohanasundaram.it@gceerode.ac.in",
    phone: "+91 98422 33445",
    cabin: "IT Block - First Floor (Room 205)",
    publications: 19,
    subjects: ["Operating Systems", "IoT & Embedded Computing"],
    classAdvisorFor: 2,
    classAdvisorLabel: "Class Advisor - II Year IT (Batch 2025-2029)"
  },
  {
    id: "ITSTAFF03",
    name: "Prof. Sathyakala",
    designation: "Assistant Professor (Sr. Gr)",
    qualification: "M.Tech. (NIT Surathkal), (Ph.D.)",
    experience: "12 Years",
    specialization: "Design & Analysis of Algorithms, Competitive Coding",
    email: "sathyakala.it@gceerode.ac.in",
    phone: "+91 98423 44556",
    cabin: "IT Block - Second Floor (Room 306)",
    publications: 12,
    subjects: ["Design & Analysis of Algorithms", "Artificial Intelligence & ML"],
    classAdvisorFor: 3,
    classAdvisorLabel: "Class Advisor - III Year IT (Batch 2024-2028)"
  },
  {
    id: "ITSTAFF04",
    name: "Prof. Murugan",
    designation: "Assistant Professor",
    qualification: "M.E.",
    experience: "10 Years",
    specialization: "Full Stack Web Technologies, React, Cloud Native",
    email: "murugan.it@gceerode.ac.in",
    phone: "+91 98424 55667",
    cabin: "IT Block - Second Floor (Room 307)",
    publications: 11,
    subjects: ["Web Technologies", "Web Technologies Laboratory"],
    classAdvisorFor: 4,
    classAdvisorLabel: "Class Advisor - IV Year IT (Batch 2023-2027)"
  }
];

const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ANN-201",
    title: "Continuous Internal Assessment - II (CIA-2) Schedule Announced",
    category: "Academic",
    priority: "High",
    date: "2026-08-26",
    author: "HOD - Information Technology",
    content: "The CIA-2 Examinations for 2nd, 3rd, and 4th year IT students will commence from September 10, 2026. Detailed timetable and seating plan are displayed on the department notice board.",
    attachment: "CIA2_Timetable_Sep2026.pdf"
  },
  {
    id: "ANN-202",
    title: "Smart India Hackathon (SIH 2026) - Internal College Hackathon Call",
    category: "Hackathon",
    priority: "Urgent",
    date: "2026-08-25",
    author: "IT Innovation & Incubation Cell",
    content: "Registrations are open for the internal screening hackathon of SIH 2026. All IT teams comprising 6 members (with at least 1 female participant) must submit their abstract before September 03, 2026.",
    attachment: "SIH2026_Guidelines.pdf"
  },
  {
    id: "ANN-203",
    title: "Zoho Corporation - Campus Recruitment Drive for 2027/2028 Batches",
    category: "Placement",
    priority: "High",
    date: "2026-08-23",
    author: "Department Placement Coordinator",
    content: "Zoho Corporation is conducting an on-campus placement drive for Software Development and Quality Assurance roles. Minimum eligibility is 7.5 CGPA with no standing arrears.",
    attachment: "Zoho_Drive_Criteria.pdf"
  },
  {
    id: "ANN-204",
    title: "Guest Lecture on 'Generative AI & LLM Engineering in Production'",
    category: "Event",
    priority: "Normal",
    date: "2026-08-21",
    author: "IT Association (INFOTECH)",
    content: "INFOTECH Association organises a technical keynote by Mr. Karthik Sundaram, Principal AI Architect at Microsoft, Bengaluru on Saturday, Aug 30, 2026 at the IT Auditorium.",
    attachment: null
  }
];

const INITIAL_QUESTION_PAPERS = [
  {
    id: "QP-01",
    subjectCode: "IT8401",
    subjectName: "Database Management Systems",
    semester: 4,
    year: "April / May 2025",
    type: "Autonomous End Semester",
    fileSize: "1.8 MB",
    downloadUrl: "#"
  },
  {
    id: "QP-02",
    subjectCode: "IT8401",
    subjectName: "Database Management Systems",
    semester: 4,
    year: "Nov / Dec 2024",
    type: "Autonomous End Semester",
    fileSize: "1.6 MB",
    downloadUrl: "#"
  },
  {
    id: "QP-03",
    subjectCode: "IT8402",
    subjectName: "Design & Analysis of Algorithms",
    semester: 4,
    year: "April / May 2025",
    type: "Autonomous End Semester",
    fileSize: "2.1 MB",
    downloadUrl: "#"
  },
  {
    id: "QP-04",
    subjectCode: "IT8403",
    subjectName: "Operating Systems Principles",
    semester: 4,
    year: "Nov / Dec 2024",
    type: "Autonomous End Semester",
    fileSize: "1.9 MB",
    downloadUrl: "#"
  },
  {
    id: "QP-05",
    subjectCode: "IT8404",
    subjectName: "Computer Networks & Protocols",
    semester: 4,
    year: "April / May 2025",
    type: "Autonomous End Semester",
    fileSize: "2.0 MB",
    downloadUrl: "#"
  },
  {
    id: "QP-06",
    subjectCode: "IT8405",
    subjectName: "Web Technologies & Frameworks",
    semester: 4,
    year: "April / May 2025",
    type: "Autonomous End Semester",
    fileSize: "1.7 MB",
    downloadUrl: "#"
  }
];

const INITIAL_PLACEMENTS = [
  {
    id: "DRIVE-01",
    company: "Zoho Corporation",
    role: "Software Development Engineer (SDE-1)",
    ctc: "₹ 8.50 - 12.00 LPA",
    location: "Tenkasi / Chennai",
    eligibility: "CGPA 7.5+, No standing arrears",
    driveDate: "2026-09-15",
    deadline: "2026-09-05",
    rounds: ["Round 1: Online Aptitude & C/Java Debugging", "Round 2: Advanced Coding", "Round 3: System Design & Tech Interview", "Round 4: HR Discussion"],
    applied: true,
    status: "Shortlisted for Round 1"
  },
  {
    id: "DRIVE-02",
    company: "Tata Consultancy Services (TCS)",
    role: "TCS Digital / Prime Developer",
    ctc: "₹ 7.00 - 9.00 LPA",
    location: "Pan India",
    eligibility: "CGPA 7.0+, Max 1 history of arrear",
    driveDate: "2026-09-22",
    deadline: "2026-09-10",
    rounds: ["TCS NQT National Qualifier", "Technical Interview", "Managerial & HR Interview"],
    applied: true,
    status: "Application Submitted"
  },
  {
    id: "DRIVE-03",
    company: "Kaar Technologies",
    role: "Associate SAP / Cloud Consultant",
    ctc: "₹ 6.50 - 8.00 LPA",
    location: "Chennai / Hyderabad",
    eligibility: "CGPA 7.0+, IT/CSE only",
    driveDate: "2026-10-02",
    deadline: "2026-09-20",
    rounds: ["Online Assessment", "Group Discussion", "Technical Interview", "HR Interview"],
    applied: false,
    status: "Eligible (Registration Open)"
  },
  {
    id: "DRIVE-04",
    company: "Infosys Limited",
    role: "Specialist Programmer (SP) / DSE",
    ctc: "₹ 6.25 - 9.50 LPA",
    location: "Bengaluru / Mysuru / Chennai",
    eligibility: "CGPA 6.5+, No live arrears",
    driveDate: "2026-10-12",
    deadline: "2026-09-30",
    rounds: ["HackWithInfy Contest", "Technical Virtual Interview", "HR Round"],
    applied: false,
    status: "Eligible (Registration Open)"
  }
];

const INITIAL_ACHIEVEMENTS = [
  {
    id: "ACH-01",
    title: "1st Prize - State Level Hackathon 'Hack-Erode 2026'",
    category: "Hackathon",
    date: "2026-03-12",
    issuedBy: "CSI Student Chapter & Industry Partners",
    description: "Built an AI-driven automated crop disease detection and farmer advisory mobile app."
  },
  {
    id: "ACH-02",
    title: "NPTEL Elite + Silver Certificate in 'Data Structures & Algorithms'",
    category: "Academic",
    date: "2025-11-20",
    issuedBy: "IIT Kharagpur / SWAYAM NPTEL",
    description: "Secured top 5% rank with score of 84% in national proctored exam."
  },
  {
    id: "ACH-03",
    title: "Best Research Paper Award in National Conference on Smart Computing",
    category: "Research",
    date: "2026-01-28",
    issuedBy: "GCE Erode Department of IT",
    description: "Presented research paper titled 'Secure Medical Records Sharing via Hyperledger Fabric'."
  }
];

const INITIAL_CERTIFICATES = [
  {
    id: "CERT-01",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services (AWS)",
    issueDate: "2026-02-10",
    validTill: "2029-02-10",
    credentialId: "AWS-CCP-987410",
    verifyUrl: "https://aws.amazon.com/verification"
  },
  {
    id: "CERT-02",
    name: "Full Stack Web Development with React & Node",
    issuer: "Coursera / Meta Career Certificate",
    issueDate: "2025-12-15",
    validTill: "Lifetime",
    credentialId: "META-FS-554433",
    verifyUrl: "https://coursera.org/verify"
  },
  {
    id: "CERT-03",
    name: "Oracle Certified Associate, Java SE 8 Programmer",
    issuer: "Oracle University",
    issueDate: "2025-08-04",
    validTill: "Lifetime",
    credentialId: "ORA-JAVA-112233",
    verifyUrl: "https://oracle.com/verify"
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-01",
    title: "CIA-2 Exam Timetable Uploaded",
    time: "20 mins ago",
    read: false,
    type: "academic",
    link: "internal-marks"
  },
  {
    id: "NOTIF-02",
    title: "Assignment 1 Graded for DAA (Score: 19/20)",
    time: "2 hours ago",
    read: false,
    type: "assignment",
    link: "assignments"
  },
  {
    id: "NOTIF-03",
    title: "Zoho Campus Placement Drive Registration Opened",
    time: "1 day ago",
    read: true,
    type: "placement",
    link: "placement"
  },
  {
    id: "NOTIF-04",
    title: "Library Book Renewal Reminder - Operating Systems Concepts",
    time: "2 days ago",
    read: true,
    type: "system",
    link: "dashboard"
  }
];

// Department Student Roster for Staff, HOD, and Admin (5 Registered Students)
const INITIAL_ALL_STUDENTS = [
  { rollNo: "24IMT30", regNo: "731124205030", name: "Nathees Kumar T", year: 2, sem: 6, sec: "A", attendance: 85.0, cgpa: 7.50, arrears: 0, mentor: "Prof. Sathyakala", phone: "9655561053", email: "natheeskumar003@gmail.com", status: "Active", pass: "1234" },
  { rollNo: "26IT001", regNo: "730426205001", name: "K. Ananya", year: 1, sem: 2, sec: "A", attendance: 94.5, cgpa: 8.90, arrears: 0, mentor: "Prof. B. V. Prakash", phone: "+91 98421 54321", email: "26it001@gceerode.ac.in", status: "Active", pass: "1234" },
  { rollNo: "25IT001", regNo: "730425205001", name: "Naveen Kumar R", year: 2, sem: 4, sec: "A", attendance: 89.5, cgpa: 8.74, arrears: 0, mentor: "Dr. Mohanasundaram", phone: "+91 98421 54322", email: "25it001@gceerode.ac.in", status: "Active", pass: "1234" },
  { rollNo: "24IT001", regNo: "730424205001", name: "S. Priya", year: 3, sem: 6, sec: "A", attendance: 92.0, cgpa: 8.85, arrears: 0, mentor: "Prof. Sathyakala", phone: "+91 98421 54323", email: "24it001@gceerode.ac.in", status: "Active", pass: "1234" },
  { rollNo: "23IT001", regNo: "730423205001", name: "M. Vignesh", year: 4, sem: 8, sec: "A", attendance: 88.0, cgpa: 8.60, arrears: 0, mentor: "Prof. Murugan", phone: "+91 98421 54324", email: "23it001@gceerode.ac.in", status: "Active", pass: "1234" }
];

// Department Analytics Data for HOD & Admin
const HOD_DEPARTMENT_ANALYTICS = {
  totalStudents: 240,
  totalStaff: 18,
  averageAttendance: 88.4,
  averageInternalMarks: 82.1,
  lowAttendanceCount: 12,
  topRankersCount: 8,
  placementRate: "86.5%",
  activeProjects: 32,
  mousSigned: 9,
  accreditedUntil: "2028 (NBA Tier-1)",
  semesterAttendanceTrend: [
    { semester: "Sem 1", avgAttendance: 91.2 },
    { semester: "Sem 2", avgAttendance: 89.8 },
    { semester: "Sem 3", avgAttendance: 87.5 },
    { semester: "Sem 4", avgAttendance: 88.4 },
    { semester: "Sem 5", avgAttendance: 86.9 },
    { semester: "Sem 6", avgAttendance: 85.7 },
    { semester: "Sem 7", avgAttendance: 89.0 },
    { semester: "Sem 8", avgAttendance: 92.4 }
  ],
  internalMarksDistribution: [
    { range: "90% - 100% (O Grade)", studentCount: 58, percentage: 24.2 },
    { range: "80% - 89% (A+ Grade)", studentCount: 94, percentage: 39.2 },
    { range: "70% - 79% (A Grade)", studentCount: 56, percentage: 23.3 },
    { range: "60% - 69% (B+ Grade)", studentCount: 22, percentage: 9.1 },
    { range: "< 60% (Remedial Needed)", studentCount: 10, percentage: 4.2 }
  ],
  placementStats: {
    totalEligible: 60,
    placedStudents: 52,
    higherStudies: 5,
    entrepreneurs: 3,
    highestPackage: "₹ 18.50 LPA (Amazon)",
    averagePackage: "₹ 6.85 LPA",
    medianPackage: "₹ 6.00 LPA",
    topRecruiters: [
      { name: "Zoho Corporation", offers: 14, highestCtc: "12.0 LPA" },
      { name: "TCS (Digital / Ninja)", offers: 18, highestCtc: "9.0 LPA" },
      { name: "Infosys", offers: 12, highestCtc: "9.5 LPA" },
      { name: "Kaar Technologies", offers: 8, highestCtc: "8.0 LPA" },
      { name: "Cognizant (CTS)", offers: 10, highestCtc: "6.75 LPA" },
      { name: "Accenture", offers: 7, highestCtc: "6.5 LPA" }
    ]
  },
  facultyWorkload: [
    { name: "Dr. S. K. Murugesan (HOD)", theoryHours: 6, labHours: 0, adminHours: 18, totalHours: 24 },
    { name: "Dr. A. Venkatesh", theoryHours: 8, labHours: 6, adminHours: 6, totalHours: 20 },
    { name: "Dr. M. Deepa", theoryHours: 8, labHours: 6, adminHours: 4, totalHours: 18 },
    { name: "Dr. K. Sathish Kumar", theoryHours: 8, labHours: 8, adminHours: 4, totalHours: 20 },
    { name: "Prof. R. Priya", theoryHours: 8, labHours: 6, adminHours: 4, totalHours: 18 },
    { name: "Prof. P. Kavin", theoryHours: 8, labHours: 8, adminHours: 4, totalHours: 20 }
  ]
};

// System audit logs for Admin
const INITIAL_AUDIT_LOGS = [
  { id: "LOG-501", action: "User Login", user: "24IT001 (Naveen Kumar R)", role: "STUDENT", ip: "192.168.1.45", timestamp: "Today at 09:12 AM", status: "Success" },
  { id: "LOG-502", action: "Marks Updated", user: "ITSTAFF01 (Dr. A. Venkatesh)", role: "STAFF", ip: "192.168.1.12", timestamp: "Today at 10:45 AM", status: "Success" },
  { id: "LOG-503", action: "Attendance Committed", user: "ITSTAFF03 (Dr. K. Sathish)", role: "STAFF", ip: "192.168.1.18", timestamp: "Today at 11:30 AM", status: "Success" },
  { id: "LOG-504", action: "Announcement Published", user: "ITHOD01 (Dr. S. K. Murugesan)", role: "HOD", ip: "192.168.1.10", timestamp: "Yesterday at 04:15 PM", status: "Success" },
  { id: "LOG-505", action: "Database Backup Completed", user: "ITADMIN01 (System Admin)", role: "ADMIN", ip: "127.0.0.1", timestamp: "Yesterday at 11:59 PM", status: "Success" }
];

// Year-wise Class Advisors Mapping
const INITIAL_CLASS_ADVISORS = {
  1: { year: 1, batch: "2026 - 2030", staffId: "ITSTAFF01", staffName: "Prof. B. V. Prakash", designation: "Associate Professor", email: "prakash.it@gceerode.ac.in", phone: "+91 98421 22334", cabin: "Room 304, IT Block" },
  2: { year: 2, batch: "2025 - 2029", staffId: "ITSTAFF02", staffName: "Dr. Mohanasundaram", designation: "Associate Professor", email: "mohanasundaram.it@gceerode.ac.in", phone: "+91 98422 33445", cabin: "Room 305, IT Block" },
  3: { year: 3, batch: "2024 - 2028", staffId: "ITSTAFF03", staffName: "Prof. Sathyakala", designation: "Assistant Professor (Sr. Gr)", email: "sathyakala.it@gceerode.ac.in", phone: "+91 98423 44556", cabin: "Room 306, IT Block" },
  4: { year: 4, batch: "2023 - 2027", staffId: "ITSTAFF04", staffName: "Prof. Murugan", designation: "Assistant Professor", email: "murugan.it@gceerode.ac.in", phone: "+91 98424 55667", cabin: "Room 307, IT Block" }
};

// Department Communication Messages & Requests
const INITIAL_MESSAGES = [
  {
    id: "MSG-01",
    fromId: "24IT001",
    fromName: "Naveen Kumar R (24IT001)",
    fromRole: "student",
    toId: "ITSTAFF01",
    toName: "Dr. A. Venkatesh (Class Advisor - Year 2)",
    toRole: "staff",
    type: "Request",
    subject: "Permission for SIH 2026 Hackathon OD",
    content: "Respected Sir, our team has been selected for the SIH 2026 Internal Screening Round. Kindly sanction On-Duty permission for September 03.",
    timestamp: "Today at 10:30 AM",
    read: false,
    status: "Pending"
  },
  {
    id: "MSG-02",
    fromId: "ITSTAFF01",
    fromName: "Dr. A. Venkatesh",
    fromRole: "staff",
    toId: "ITHOD01",
    toName: "Dr. S. K. Murugesan (HOD)",
    toRole: "hod",
    type: "Request",
    subject: "Lab-2 GPU Server Memory Expansion Proposal",
    content: "Respected HOD Sir, we request approval to procure 64GB ECC RAM expansion for the AI computing workstation in IT Lab-2 for student projects.",
    timestamp: "Yesterday at 03:15 PM",
    read: true,
    status: "Approved"
  },
  {
    id: "MSG-03",
    fromId: "ITHOD01",
    fromName: "Dr. S. K. Murugesan (HOD)",
    fromRole: "hod",
    toId: "ALL",
    toName: "All IT Staff & Students",
    toRole: "all",
    type: "Broadcast",
    subject: "NBA Accreditation Review Meeting",
    content: "All faculty members and student class representatives are requested to assemble in the Department Seminar Hall at 4:00 PM today.",
    timestamp: "Today at 09:00 AM",
    read: false,
    status: "Active"
  },
  {
    id: "MSG-04",
    fromId: "24IT001",
    fromName: "Naveen Kumar R",
    fromRole: "student",
    toId: "24IT002",
    toName: "Abinaya S (24IT002)",
    toRole: "student",
    type: "DM",
    subject: "DBMS Lab Query Optimization",
    content: "Hey Abinaya, did you test the BCNF decomposition and composite index trigger? Let's cross-verify our results before tomorrow's lab session.",
    timestamp: "Today at 11:20 AM",
    read: true,
    status: "Delivered"
  }
];


const ITDepartmentData = {
  COLLEGE_INFO,
  DEMO_CREDENTIALS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_SUBJECTS,
  INITIAL_STUDENT_ATTENDANCE,
  INITIAL_INTERNAL_MARKS,
  INITIAL_SEMESTER_RESULTS,
  INITIAL_TIMETABLE,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_FACULTY_LIST,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_QUESTION_PAPERS,
  INITIAL_PLACEMENTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ALL_STUDENTS,
  HOD_DEPARTMENT_ANALYTICS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLASS_ADVISORS,
  INITIAL_MESSAGES
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ITDepartmentData;
}
if (typeof window !== 'undefined') {
  window.ITDepartmentData = ITDepartmentData;
  window.ITDepartmentApp = ITDepartmentData;
}
