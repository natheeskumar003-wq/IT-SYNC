// IT DIGITAL HUB - Unified Self-Contained Application Bundle
// Government College of Engineering, Erode - Department of Information Technology

(function () {
  const { useState, useEffect, useContext, createContext, createElement, Fragment } = React;

  // =========================================================================
  // 1. DATA LAYER
  // =========================================================================
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
    student: { id: "24IT001", pass: "student123", role: "student", name: "Naveen Kumar R" },
    staff: { id: "ITSTAFF01", pass: "staff123", role: "staff", name: "Dr. A. Venkatesh" },
    hod: { id: "ITHOD01", pass: "hod123", role: "hod", name: "Dr. S. K. Murugesan" },
    admin: { id: "ITADMIN01", pass: "admin123", role: "admin", name: "Er. M. Senthil Kumar" }
  };

  const INITIAL_STUDENT_PROFILE = {
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
    address: "42, Perundurai Road, Erode - 638011, Tamil Nadu",
    fatherName: "Rajendran K",
    fatherPhone: "+91 94432 10987",
    motherName: "Saraswathi R",
    mentorName: "Dr. A. Venkatesh (Assoc. Prof)",
    mentorEmail: "a.venkatesh@gceerode.ac.in",
    mentorPhone: "+91 94421 87654",
    hostelStatus: "Hosteller (Kavery Hostel, Room 304)",
    scholarship: "First Graduate Scholarship (Govt of Tamil Nadu)"
  };

  const INITIAL_SUBJECTS = [
    { code: "IT8401", name: "Database Management Systems", short: "DBMS", credits: 3, type: "Theory", faculty: "Dr. A. Venkatesh", syllabusUnits: 5, completedUnits: 4, totalHours: 45, description: "Relational model, SQL, Normalization, Transaction management, Indexing and NoSQL databases." },
    { code: "IT8402", name: "Design & Analysis of Algorithms", short: "DAA", credits: 4, type: "Theory", faculty: "Prof. P. Kavin", syllabusUnits: 5, completedUnits: 3, totalHours: 50, description: "Asymptotic notation, Divide & Conquer, Greedy, Dynamic Programming, NP-Completeness." },
    { code: "IT8403", name: "Operating Systems Principles", short: "OS", credits: 3, type: "Theory", faculty: "Dr. M. Deepa", syllabusUnits: 5, completedUnits: 4, totalHours: 45, description: "Process management, Threads, CPU Scheduling, Deadlocks, Memory Virtualization, File Systems." },
    { code: "IT8404", name: "Computer Networks & Protocols", short: "CN", credits: 3, type: "Theory", faculty: "Prof. R. Priya", syllabusUnits: 5, completedUnits: 4, totalHours: 45, description: "OSI & TCP/IP stack, Data link framing, Routing algorithms, Transport flow control, Application protocols." },
    { code: "IT8405", name: "Web Technologies & Frameworks", short: "WT", credits: 3, type: "Theory", faculty: "Dr. K. Sathish Kumar", syllabusUnits: 5, completedUnits: 4, totalHours: 45, description: "HTML5, CSS3, Modern JavaScript ES6+, React.js, Node.js, RESTful Web APIs, JWT Authentication." },
    { code: "IT8411", name: "DBMS & SQL Laboratory", short: "DBMS LAB", credits: 2, type: "Practical", faculty: "Dr. A. Venkatesh", syllabusUnits: 12, completedUnits: 10, totalHours: 36, description: "DDL, DML, Complex queries, PL/SQL triggers, Stored procedures, MongoDB CRUD." },
    { code: "IT8412", name: "Web Technologies Laboratory", short: "WT LAB", credits: 2, type: "Practical", faculty: "Dr. K. Sathish Kumar", syllabusUnits: 10, completedUnits: 9, totalHours: 36, description: "Responsive UI design, Full stack React & Node integration, Single page application development." }
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
    { code: "IT8401", name: "Database Management Systems", cia1: 45, cia2: 44, model: 88, assignment: 9.5, totalInternal: 46.2, gradeEstimate: "O (Outstanding)" },
    { code: "IT8402", name: "Design & Analysis of Algorithms", cia1: 41, cia2: 42, model: 82, assignment: 9.0, totalInternal: 43.1, gradeEstimate: "A+ (Excellent)" },
    { code: "IT8403", name: "Operating Systems Principles", cia1: 43, cia2: 40, model: 84, assignment: 9.0, totalInternal: 43.8, gradeEstimate: "A+ (Excellent)" },
    { code: "IT8404", name: "Computer Networks & Protocols", cia1: 46, cia2: 45, model: 90, assignment: 10.0, totalInternal: 47.1, gradeEstimate: "O (Outstanding)" },
    { code: "IT8405", name: "Web Technologies & Frameworks", cia1: 48, cia2: 47, model: 94, assignment: 10.0, totalInternal: 48.6, gradeEstimate: "O (Outstanding)" },
    { code: "IT8411", name: "DBMS & SQL Laboratory", cia1: 48, cia2: 49, model: 96, assignment: 10.0, totalInternal: 49.0, gradeEstimate: "O (Outstanding)" },
    { code: "IT8412", name: "Web Technologies Laboratory", cia1: 47, cia2: 48, model: 95, assignment: 10.0, totalInternal: 48.5, gradeEstimate: "O (Outstanding)" }
  ];

  const INITIAL_SEMESTER_RESULTS = [
    {
      semester: 1, gpa: 8.65, credits: 22, status: "ALL PASS",
      courses: [
        { code: "HS8151", name: "Communicative English", credit: 4, grade: "A+" },
        { code: "MA8151", name: "Engineering Mathematics I", credit: 4, grade: "O" },
        { code: "PH8151", name: "Engineering Physics", credit: 3, grade: "A+" },
        { code: "CY8151", name: "Engineering Chemistry", credit: 3, grade: "A" },
        { code: "GE8151", name: "Problem Solving & Python", credit: 3, grade: "O" },
        { code: "GE8161", name: "Python Programming Lab", credit: 2, grade: "O" }
      ]
    },
    {
      semester: 2, gpa: 8.80, credits: 24, status: "ALL PASS",
      courses: [
        { code: "HS8251", name: "Technical English", credit: 4, grade: "A+" },
        { code: "MA8251", name: "Engineering Mathematics II", credit: 4, grade: "O" },
        { code: "PH8252", name: "Physics for Information Science", credit: 3, grade: "A+" },
        { code: "IT8201", name: "Programming in C & Data Structures", credit: 4, grade: "O" },
        { code: "IT8211", name: "C Programming Laboratory", credit: 2, grade: "O" }
      ]
    },
    {
      semester: 3, gpa: 8.78, credits: 23, status: "ALL PASS",
      courses: [
        { code: "MA8354", name: "Discrete Mathematics", credit: 4, grade: "O" },
        { code: "IT8301", name: "Digital Principles & System Design", credit: 3, grade: "A+" },
        { code: "IT8302", name: "Data Structures & OOPs in Java", credit: 4, grade: "O" },
        { code: "IT8303", name: "Software Engineering & Agile", credit: 3, grade: "A+" },
        { code: "IT8311", name: "Java & OOP Laboratory", credit: 2, grade: "O" }
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
      { period: 7, time: "03:20 - 04:10", subject: "Mentor Hour", room: "Campus Grounds", faculty: "Dr. A. Venkatesh" }
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
      { period: 6, time: "02:20 - 03:10", subject: "Technical Seminar", room: "IT Seminar Hall", faculty: "Coordinator" },
      { period: 7, time: "03:20 - 04:10", subject: "Placement Aptitude", room: "IT LH-1", faculty: "Training Cell" }
    ],
    Thursday: [
      { period: 1, time: "09:00 - 09:50", subject: "IT8402 DAA", room: "IT LH-1", faculty: "Prof. P. Kavin" },
      { period: 2, time: "09:50 - 10:40", subject: "IT8403 OS", room: "IT LH-1", faculty: "Dr. M. Deepa" },
      { period: 3, time: "10:55 - 11:45", subject: "IT8405 WT", room: "IT LH-1", faculty: "Dr. K. Sathish" },
      { period: 4, time: "11:45 - 12:35", subject: "IT8404 CN", room: "IT LH-1", faculty: "Prof. R. Priya" },
      { period: "5-7", time: "01:30 - 04:10", subject: "IT8412 Web Tech Laboratory", room: "IT Computing Lab-1", faculty: "Dr. K. Sathish & Prof. Priya" }
    ],
    Friday: [
      { period: 1, time: "09:00 - 09:50", subject: "IT8405 WT", room: "IT LH-1", faculty: "Dr. K. Sathish" },
      { period: 2, time: "09:50 - 10:40", subject: "IT8404 CN", room: "IT LH-1", faculty: "Prof. R. Priya" },
      { period: 3, time: "10:55 - 11:45", subject: "IT8402 DAA", room: "IT LH-1", faculty: "Prof. P. Kavin" },
      { period: 4, time: "11:45 - 12:35", subject: "IT8401 DBMS", room: "IT LH-1", faculty: "Dr. A. Venkatesh" },
      { period: 5, time: "01:30 - 02:20", subject: "IT8403 OS", room: "IT LH-1", faculty: "Dr. M. Deepa" },
      { period: 6, time: "02:20 - 03:10", subject: "Coding Club", room: "IT Lab-1", faculty: "Club Mentors" },
      { period: 7, time: "03:20 - 04:10", subject: "Counseling & Feedback", room: "IT LH-1", faculty: "HOD / Mentors" }
    ]
  };

  const INITIAL_STUDY_MATERIALS = [
    { id: "MAT-01", title: "Unit 3 - Normalization and BCNF Complete Lecture Notes", subjectCode: "IT8401", subjectName: "Database Management Systems", category: "Lecture Notes", fileSize: "3.4 MB", fileType: "PDF", uploadedBy: "Dr. A. Venkatesh", date: "2026-08-20", downloads: 142 },
    { id: "MAT-02", title: "Dynamic Programming & Graph Algorithms Solved Problems Handbook", subjectCode: "IT8402", subjectName: "Design & Analysis of Algorithms", category: "Question Bank", fileSize: "5.1 MB", fileType: "PDF", uploadedBy: "Prof. P. Kavin", date: "2026-08-18", downloads: 189 },
    { id: "MAT-03", title: "React.js & REST API Full Stack Implementation Guide PPT", subjectCode: "IT8405", subjectName: "Web Technologies & Frameworks", category: "Presentation Slides", fileSize: "7.8 MB", fileType: "PPTX", uploadedBy: "Dr. K. Sathish Kumar", date: "2026-08-24", downloads: 210 },
    { id: "MAT-04", title: "Linux Kernel Process Scheduling & Memory Management Manual", subjectCode: "IT8403", subjectName: "Operating Systems Principles", category: "Lab Manual", fileSize: "4.2 MB", fileType: "PDF", uploadedBy: "Dr. M. Deepa", date: "2026-08-15", downloads: 165 },
    { id: "MAT-05", title: "Wireshark Packet Analysis & Subnetting Practical Guide", subjectCode: "IT8404", subjectName: "Computer Networks & Protocols", category: "Lab Manual", fileSize: "6.0 MB", fileType: "PDF", uploadedBy: "Prof. R. Priya", date: "2026-08-22", downloads: 177 },
    { id: "MAT-06", title: "Two Marks with Answers (All 5 Units) - Semester Question Bank", subjectCode: "IT8401", subjectName: "Database Management Systems", category: "Question Bank", fileSize: "2.8 MB", fileType: "PDF", uploadedBy: "Dr. A. Venkatesh", date: "2026-08-25", downloads: 245 }
  ];

  const INITIAL_ASSIGNMENTS = [
    { id: "ASN-101", title: "Design Relational Schema & 3NF Normalization for Hospital System", subjectCode: "IT8401", subjectName: "Database Management Systems", faculty: "Dr. A. Venkatesh", assignedDate: "2026-08-18", dueDate: "2026-09-02", maxMarks: 20, status: "Pending", submissionFile: null, submittedDate: null, score: null, remarks: null, instructions: "Submit an ER Diagram and mapped 3NF relational schemas with sample SQL create table scripts." },
    { id: "ASN-102", title: "Implement Dijkstra & Bellman-Ford Shortest Path in Java/C++", subjectCode: "IT8402", subjectName: "Design & Analysis of Algorithms", faculty: "Prof. P. Kavin", assignedDate: "2026-08-15", dueDate: "2026-08-28", maxMarks: 20, status: "Submitted", submissionFile: "24IT001_Dijkstra_Implementation.zip", submittedDate: "2026-08-25", score: 19, remarks: "Excellent time complexity explanation and clean code formatting.", instructions: "Provide code, test cases, and time complexity comparison graph." },
    { id: "ASN-103", title: "Build Responsive E-Commerce Product Catalog using React Components", subjectCode: "IT8405", subjectName: "Web Technologies & Frameworks", faculty: "Dr. K. Sathish Kumar", assignedDate: "2026-08-22", dueDate: "2026-09-05", maxMarks: 20, status: "Pending", submissionFile: null, submittedDate: null, score: null, remarks: null, instructions: "Use React hooks (useState, useEffect) with filter, search, and cart functionality." },
    { id: "ASN-104", title: "Simulate Round Robin and Multi-Level Queue CPU Scheduling in C", subjectCode: "IT8403", subjectName: "Operating Systems Principles", faculty: "Dr. M. Deepa", assignedDate: "2026-08-10", dueDate: "2026-08-20", maxMarks: 20, status: "Graded", submissionFile: "24IT001_OS_Scheduler_Simulation.pdf", submittedDate: "2026-08-19", score: 18.5, remarks: "Gantt chart rendering is very clear. Well done.", instructions: "Include calculation for average waiting time and turnaround time." }
  ];

  const INITIAL_FACULTY_LIST = [
    { id: "ITHOD01", name: "Dr. S. K. Murugesan", designation: "Professor & Head of Department", qualification: "B.E., M.Tech., Ph.D. (IIT Madras)", experience: "24 Years", specialization: "Cloud Computing, Distributed Systems, Big Data", email: "hod.it@gceerode.ac.in", phone: "+91 94433 11223", cabin: "IT Block - Ground Floor (Room 101)", publications: 38, subjects: ["Cloud Architecture", "Advanced Distributed Systems"] },
    { id: "ITSTAFF01", name: "Dr. A. Venkatesh", designation: "Associate Professor", qualification: "M.E., Ph.D. (Anna University)", experience: "16 Years", specialization: "Database Systems, Data Mining, Information Security", email: "a.venkatesh@gceerode.ac.in", phone: "+91 94421 87654", cabin: "IT Block - First Floor (Room 204)", publications: 22, subjects: ["Database Management Systems", "DBMS Lab", "Information Security"] },
    { id: "ITSTAFF02", name: "Dr. M. Deepa", designation: "Associate Professor", qualification: "M.Tech., Ph.D. (NIT Trichy)", experience: "14 Years", specialization: "Operating Systems, High Performance Computing, IoT", email: "m.deepa@gceerode.ac.in", phone: "+91 98433 76543", cabin: "IT Block - First Floor (Room 205)", publications: 19, subjects: ["Operating Systems", "IoT & Embedded Computing"] },
    { id: "ITSTAFF03", name: "Dr. K. Sathish Kumar", designation: "Assistant Professor (Sr. Gr.)", qualification: "M.E., Ph.D. (GCE Erode / AU)", experience: "11 Years", specialization: "Full Stack Web Technologies, Cloud Native, DevOps", email: "k.sathish@gceerode.ac.in", phone: "+91 97890 12345", cabin: "IT Block - Second Floor (Room 302)", publications: 14, subjects: ["Web Technologies", "Web Tech Lab", "Mobile App Development"] },
    { id: "ITSTAFF04", name: "Prof. R. Priya", designation: "Assistant Professor", qualification: "M.E., (Ph.D.)", experience: "9 Years", specialization: "Computer Networks, Wireless Sensor Networks, 5G", email: "r.priya@gceerode.ac.in", phone: "+91 96555 98765", cabin: "IT Block - Second Floor (Room 304)", publications: 10, subjects: ["Computer Networks", "Network Security", "Cryptography"] },
    { id: "ITSTAFF05", name: "Prof. P. Kavin", designation: "Assistant Professor", qualification: "M.Tech. (NIT Surathkal), (Ph.D.)", experience: "8 Years", specialization: "Algorithms, Machine Learning, Data Science", email: "p.kavin@gceerode.ac.in", phone: "+91 99444 32109", cabin: "IT Block - Second Floor (Room 305)", publications: 8, subjects: ["Design & Analysis of Algorithms", "Artificial Intelligence & ML"] }
  ];

  const INITIAL_ANNOUNCEMENTS = [
    { id: "ANN-201", title: "Continuous Internal Assessment - II (CIA-2) Schedule Announced", category: "Academic", priority: "High", date: "2026-08-26", author: "HOD - Information Technology", content: "The CIA-2 Examinations for 2nd, 3rd, and 4th year IT students will commence from September 10, 2026. Detailed timetable and seating plan are displayed on the department notice board.", attachment: "CIA2_Timetable_Sep2026.pdf" },
    { id: "ANN-202", title: "Smart India Hackathon (SIH 2026) - Internal College Hackathon Call", category: "Hackathon", priority: "Urgent", date: "2026-08-25", author: "IT Innovation & Incubation Cell", content: "Registrations are open for the internal screening hackathon of SIH 2026. All IT teams comprising 6 members must submit their abstract before September 03, 2026.", attachment: "SIH2026_Guidelines.pdf" },
    { id: "ANN-203", title: "Zoho Corporation - Campus Recruitment Drive for 2027/2028 Batches", category: "Placement", priority: "High", date: "2026-08-23", author: "Department Placement Coordinator", content: "Zoho Corporation is conducting an on-campus placement drive for Software Development and Quality Assurance roles. Minimum eligibility is 7.5 CGPA with no standing arrears.", attachment: "Zoho_Drive_Criteria.pdf" },
    { id: "ANN-204", title: "Guest Lecture on 'Generative AI & LLM Engineering in Production'", category: "Event", priority: "Normal", date: "2026-08-21", author: "IT Association (INFOTECH)", content: "INFOTECH Association organises a technical keynote by Mr. Karthik Sundaram, Principal AI Architect at Microsoft, on Saturday, Aug 30, 2026 at the IT Auditorium.", attachment: null }
  ];

  const INITIAL_QUESTION_PAPERS = [
    { id: "QP-01", subjectCode: "IT8401", subjectName: "Database Management Systems", semester: 4, year: "April / May 2025", type: "Autonomous End Semester", fileSize: "1.8 MB" },
    { id: "QP-02", subjectCode: "IT8401", subjectName: "Database Management Systems", semester: 4, year: "Nov / Dec 2024", type: "Autonomous End Semester", fileSize: "1.6 MB" },
    { id: "QP-03", subjectCode: "IT8402", subjectName: "Design & Analysis of Algorithms", semester: 4, year: "April / May 2025", type: "Autonomous End Semester", fileSize: "2.1 MB" },
    { id: "QP-04", subjectCode: "IT8403", subjectName: "Operating Systems Principles", semester: 4, year: "Nov / Dec 2024", type: "Autonomous End Semester", fileSize: "1.9 MB" },
    { id: "QP-05", subjectCode: "IT8404", subjectName: "Computer Networks & Protocols", semester: 4, year: "April / May 2025", type: "Autonomous End Semester", fileSize: "2.0 MB" },
    { id: "QP-06", subjectCode: "IT8405", subjectName: "Web Technologies & Frameworks", semester: 4, year: "April / May 2025", type: "Autonomous End Semester", fileSize: "1.7 MB" }
  ];

  const INITIAL_PLACEMENTS = [
    { id: "DRIVE-01", company: "Zoho Corporation", role: "Software Development Engineer (SDE-1)", ctc: "₹ 8.50 - 12.00 LPA", location: "Tenkasi / Chennai", eligibility: "CGPA 7.5+, No standing arrears", driveDate: "2026-09-15", deadline: "2026-09-05", rounds: ["Round 1: Online Aptitude & C/Java Debugging", "Round 2: Advanced Coding", "Round 3: System Design & Tech Interview", "Round 4: HR Discussion"], applied: true, status: "Shortlisted for Round 1" },
    { id: "DRIVE-02", company: "Tata Consultancy Services (TCS)", role: "TCS Digital / Prime Developer", ctc: "₹ 7.00 - 9.00 LPA", location: "Pan India", eligibility: "CGPA 7.0+, Max 1 history of arrear", driveDate: "2026-09-22", deadline: "2026-09-10", rounds: ["TCS NQT National Qualifier", "Technical Interview", "Managerial & HR Interview"], applied: true, status: "Application Submitted" },
    { id: "DRIVE-03", company: "Kaar Technologies", role: "Associate SAP / Cloud Consultant", ctc: "₹ 6.50 - 8.00 LPA", location: "Chennai / Hyderabad", eligibility: "CGPA 7.0+, IT/CSE only", driveDate: "2026-10-02", deadline: "2026-09-20", rounds: ["Online Assessment", "Group Discussion", "Technical Interview", "HR Interview"], applied: false, status: "Eligible (Registration Open)" },
    { id: "DRIVE-04", company: "Infosys Limited", role: "Specialist Programmer (SP) / DSE", ctc: "₹ 6.25 - 9.50 LPA", location: "Bengaluru / Mysuru / Chennai", eligibility: "CGPA 6.5+, No live arrears", driveDate: "2026-10-12", deadline: "2026-09-30", rounds: ["HackWithInfy Contest", "Technical Virtual Interview", "HR Round"], applied: false, status: "Eligible (Registration Open)" }
  ];

  const INITIAL_ACHIEVEMENTS = [
    { id: "ACH-01", title: "1st Prize - State Level Hackathon 'Hack-Erode 2026'", category: "Hackathon", date: "2026-03-12", issuedBy: "CSI Student Chapter", description: "Built an AI-driven automated crop disease detection and farmer advisory mobile app." },
    { id: "ACH-02", title: "NPTEL Elite + Silver Certificate in 'Data Structures & Algorithms'", category: "Academic", date: "2025-11-20", issuedBy: "IIT Kharagpur / SWAYAM", description: "Secured top 5% rank with score of 84% in national proctored exam." },
    { id: "ACH-03", title: "Best Research Paper Award in National Conference", category: "Research", date: "2026-01-28", issuedBy: "GCE Erode Department of IT", description: "Presented research paper titled 'Secure Medical Records Sharing via Hyperledger Fabric'." }
  ];

  const INITIAL_CERTIFICATES = [
    { id: "CERT-01", name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services (AWS)", issueDate: "2026-02-10", validTill: "2029-02-10", credentialId: "AWS-CCP-987410" },
    { id: "CERT-02", name: "Full Stack Web Development with React & Node", issuer: "Coursera / Meta Career Certificate", issueDate: "2025-12-15", validTill: "Lifetime", credentialId: "META-FS-554433" },
    { id: "CERT-03", name: "Oracle Certified Associate, Java SE 8 Programmer", issuer: "Oracle University", issueDate: "2025-08-04", validTill: "Lifetime", credentialId: "ORA-JAVA-112233" }
  ];

  const INITIAL_NOTIFICATIONS = [
    { id: "NOTIF-01", title: "CIA-2 Exam Timetable Uploaded", time: "20 mins ago", read: false, type: "academic", link: "internal-marks" },
    { id: "NOTIF-02", title: "Assignment 1 Graded for DAA (Score: 19/20)", time: "2 hours ago", read: false, type: "assignment", link: "assignments" },
    { id: "NOTIF-03", title: "Zoho Campus Placement Drive Registration Opened", time: "1 day ago", read: true, type: "placement", link: "placement-internship" },
    { id: "NOTIF-04", title: "Library Book Renewal Reminder - Operating Systems Concepts", time: "2 days ago", read: true, type: "system", link: "dashboard" }
  ];

  const INITIAL_ALL_STUDENTS = [
    { rollNo: "24IT001", regNo: "730424205001", name: "Naveen Kumar R", year: 2, sem: 4, sec: "A", attendance: 89.5, cgpa: 8.74, arrears: 0, mentor: "Dr. A. Venkatesh", phone: "+91 98421 54321", email: "naveenkumar.24it@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT002", regNo: "730424205002", name: "Abinaya S", year: 2, sem: 4, sec: "A", attendance: 94.2, cgpa: 9.15, arrears: 0, mentor: "Dr. A. Venkatesh", phone: "+91 98422 11111", email: "abinaya.24it@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT003", regNo: "730424205003", name: "Balaji V", year: 2, sem: 4, sec: "A", attendance: 71.0, cgpa: 7.20, arrears: 1, mentor: "Dr. M. Deepa", phone: "+91 98423 22222", email: "balaji.24it@gceerode.ac.in", status: "Low Attendance" },
    { rollNo: "24IT004", regNo: "730424205004", name: "Deepika M", year: 2, sem: 4, sec: "A", attendance: 96.0, cgpa: 9.42, arrears: 0, mentor: "Dr. A. Venkatesh", phone: "+91 98424 33333", email: "deepika.24it@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT005", regNo: "730424205005", name: "Dinesh K", year: 2, sem: 4, sec: "A", attendance: 68.5, cgpa: 6.85, arrears: 2, mentor: "Prof. P. Kavin", phone: "+91 98425 44444", email: "dinesh.24it@gceerode.ac.in", status: "Low Attendance" },
    { rollNo: "24IT006", regNo: "730424205006", name: "Gokulraj P", year: 2, sem: 4, sec: "A", attendance: 88.0, cgpa: 8.35, arrears: 0, mentor: "Prof. R. Priya", phone: "+91 98426 55555", email: "gokulraj.24it@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT007", regNo: "730424205007", name: "Harini T", year: 2, sem: 4, sec: "A", attendance: 92.5, cgpa: 8.90, arrears: 0, mentor: "Dr. K. Sathish", phone: "+91 98427 66666", email: "harini.24it@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT008", regNo: "730424205008", name: "Jeevitha S", year: 2, sem: 4, sec: "A", attendance: 85.0, cgpa: 8.10, arrears: 0, mentor: "Prof. P. Kavin", phone: "+91 98428 77777", email: "jeevitha.24it@gceerode.ac.in", status: "Active" },
    { rollNo: "24IT009", regNo: "730424205009", name: "Karthikeyan B", year: 2, sem: 4, sec: "A", attendance: 74.0, cgpa: 7.45, arrears: 1, mentor: "Dr. A. Venkatesh", phone: "+91 98429 88888", email: "karthikeyan.24it@gceerode.ac.in", status: "Low Attendance" },
    { rollNo: "24IT010", regNo: "730424205010", name: "Kavya R", year: 2, sem: 4, sec: "A", attendance: 97.4, cgpa: 9.60, arrears: 0, mentor: "Dr. M. Deepa", phone: "+91 98430 99999", email: "kavya.24it@gceerode.ac.in", status: "Top Ranker" },
    { rollNo: "23IT015", regNo: "730423205015", name: "Manoj Kumar S", year: 3, sem: 6, sec: "A", attendance: 91.0, cgpa: 8.65, arrears: 0, mentor: "Dr. K. Sathish", phone: "+91 98431 12345", email: "manoj.23it@gceerode.ac.in", status: "Active" },
    { rollNo: "23IT022", regNo: "730423205022", name: "Pooja V", year: 3, sem: 6, sec: "A", attendance: 95.0, cgpa: 9.25, arrears: 0, mentor: "Prof. R. Priya", phone: "+91 98432 23456", email: "pooja.23it@gceerode.ac.in", status: "Top Ranker" },
    { rollNo: "22IT008", regNo: "730422205008", name: "Aravindhan G", year: 4, sem: 8, sec: "A", attendance: 88.5, cgpa: 8.80, arrears: 0, mentor: "Dr. S. K. Murugesan", phone: "+91 98433 34567", email: "aravindh.22it@gceerode.ac.in", status: "Placed (Zoho 10 LPA)" },
    { rollNo: "22IT014", regNo: "730422205014", name: "Gayathri M", year: 4, sem: 8, sec: "A", attendance: 93.0, cgpa: 9.30, arrears: 0, mentor: "Dr. S. K. Murugesan", phone: "+91 98434 45678", email: "gayathri.22it@gceerode.ac.in", status: "Placed (Amazon 18 LPA)" }
  ];

  const HOD_DEPARTMENT_ANALYTICS = {
    totalStudents: 240,
    totalStaff: 18,
    averageAttendance: 88.4,
    averageInternalMarks: 82.1,
    lowAttendanceCount: 12,
    topRankersCount: 8,
    placementRate: "86.5%",
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

  const INITIAL_AUDIT_LOGS = [
    { id: "LOG-501", action: "User Login", user: "24IT001 (Naveen Kumar R)", role: "STUDENT", ip: "192.168.1.45", timestamp: "Today at 09:12 AM", status: "Success" },
    { id: "LOG-502", action: "Marks Updated", user: "ITSTAFF01 (Dr. A. Venkatesh)", role: "STAFF", ip: "192.168.1.12", timestamp: "Today at 10:45 AM", status: "Success" },
    { id: "LOG-503", action: "Attendance Committed", user: "ITSTAFF03 (Dr. K. Sathish)", role: "STAFF", ip: "192.168.1.18", timestamp: "Today at 11:30 AM", status: "Success" },
    { id: "LOG-504", action: "Announcement Published", user: "ITHOD01 (Dr. S. K. Murugesan)", role: "HOD", ip: "192.168.1.10", timestamp: "Yesterday at 04:15 PM", status: "Success" },
    { id: "LOG-505", action: "Database Backup Completed", user: "ITADMIN01 (System Admin)", role: "ADMIN", ip: "127.0.0.1", timestamp: "Yesterday at 11:59 PM", status: "Success" }
  ];

  window.ITDepartmentApp = {
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
    INITIAL_AUDIT_LOGS
  };

  console.log("IT Department Digital Hub Core loaded successfully.");
})();
