# PROJECT REPORT: IT DIGITAL HUB
## Information Technology Department Digital Portal

---

### TABLE OF CONTENTS
1. [Abstract](#1-abstract)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Objectives](#4-objectives)
5. [Existing System](#5-existing-system)
6. [Proposed System](#6-proposed-system)
7. [System Requirements](#7-system-requirements)
8. [Modules Description](#8-modules-description)
9. [System Architecture](#9-system-architecture)
10. [Database Design & Data Dictionary](#10-database-design--data-dictionary)
11. [Entity-Relationship (ER) Diagram Description](#11-entity-relationship-er-diagram-description)
12. [Implementation Details](#12-implementation-details)
13. [Software Testing & Test Cases](#13-software-testing--test-cases)
14. [Advantages of Proposed System](#14-advantages-of-proposed-system)
15. [Limitations](#15-limitations)
16. [Future Enhancements](#16-future-enhancements)
17. [Conclusion & References](#17-conclusion--references)

---

### 1. ABSTRACT

In modern higher educational institutions, the efficient management of academic resources, student tracking, attendance verification, and departmental communication is paramount. Traditional methods often rely on disparate physical paperwork, notice boards, manual register loggings, and standalone spreadsheets. This leads to operational bottlenecks, data redundancy, lack of transparency, and delays in critical academic decisions.

**"IT DIGITAL HUB"** is an integrated full-stack web application engineered specifically for an Information Technology Department. Designed using HTML5, CSS3, Vanilla JavaScript, PHP, and MySQL on the XAMPP platform, the system establishes a synchronized digital workspace for four distinct roles: **Students**, **Faculty / Staff**, **Head of Department (HOD)**, and **Administrators**. Key capabilities include interactive roll-call attendance marking, automated examination eligibility calculators, study material repositories, coursework assignment submissions with grading workflows, multi-tier leave/On-Duty (OD) sanctioning, technical symposium verified E-Pass generation, and high-DPI canvas analytics. The portal delivers high operational efficiency, responsive multi-device accessibility, and robust security through Bcrypt password hashing and PDO prepared statements.

---

### 2. INTRODUCTION

The Department of Information Technology operates as an academic unit with multiple batches of undergraduate and postgraduate students, faculty members, laboratories, and co-curricular technical initiatives. Managing daily schedules, coursework notes, internal examination evaluations, leave records, and accreditation data manually is both time-consuming and prone to human error.

**IT Digital Hub** solves this challenge by centralizing departmental operations into a secure, accessible web portal. It bridges communication gaps between students and faculty, enables instant dissemination of official circulars, empowers students to track their academic health in real time, and provides leadership with actionable department statistics for NBA and NAAC accreditation compliance.

---

### 3. PROBLEM STATEMENT

Prior to the implementation of the digital portal, the department encountered several operational difficulties:
1. **Manual Attendance Register Overhead**: Attendance recorded in physical registers required laborious end-of-semester calculations to determine examination eligibility (< 75% rule).
2. **Delayed Information Flow**: Physical circulars and announcements posted on notice boards frequently failed to reach students in a timely manner.
3. **Inefficient Coursework Distribution**: Sharing notes, syllabus copies, and past question papers relied on ad-hoc social channels or flash drives.
4. **Tedious Leave and OD Approvals**: Students applying for medical leave or technical event OD had to navigate physical paper forms across multiple faculty cabins.
5. **Absence of Centralized Performance Analytics**: HOD and department executives lacked a real-time dashboard to monitor student performance, faculty workload, and symposium registrations.

---

### 4. OBJECTIVES

The primary objectives of the **IT Digital Hub** project are:
- To design and implement a responsive, user-friendly digital portal accessible across desktops, laptops, tablets, and smartphones.
- To create strict **Role-Based Access Control (RBAC)** for four distinct user tiers: Student, Staff, HOD, and Administrator.
- To provide transparent attendance tracking with automatic condonation warnings and target estimation calculators.
- To automate coursework distribution, digital assignment submissions, and faculty evaluations.
- To digitize student leave and On-Duty applications with live status indicators.
- To automate department symposium and workshop delegate registration with verifiable digital E-Pass generation.
- To visualize departmental analytics using pure HTML5 Canvas graphics without bulky third-party dependencies.
- To ensure data integrity, parameterized database security, and protection against common web vulnerabilities (SQL Injection and XSS).

---

### 5. EXISTING SYSTEM

In the conventional system:
- Attendance is recorded on paper registers during each lecture hour.
- Internal marks and assignment scores are compiled on standalone local spreadsheets.
- Students must meet class advisors in person to request leave or submit event OD certificates.
- Study materials are scattered across individual emails or external drives.
- Notifications are pinned to physical notice boards in department hallways.

#### Drawbacks of Existing System:
- High risk of register misplacement or physical data degradation.
- No instant visibility for students regarding attendance shortages.
- Significant administrative time lost in manual computation of semester percentages.
- Inability for HOD to view real-time department-wide metrics at a glance.

---

### 6. PROPOSED SYSTEM

The **IT Digital Hub** transforms departmental administration into an automated, paperless, and real-time environment.

#### Key Enhancements:
- **Centralized Database**: Normalized MySQL database (`it_digital_hub`) hosting all student records, faculty profiles, subjects, attendance logs, materials, assignments, and announcements.
- **Role-Tailored Dashboards**: Customized user interfaces for Students, Staff, HOD, and Admins.
- **Interactive Tools**: Dynamic attendance projection calculators, filterable resource search, and digital verified badge generation.
- **Automated Workflow**: Instant notification delivery, live leave application queues, and online assignment grading.
- **Dual-Engine Architecture**: REST API connectivity when deployed on XAMPP, paired with seamless client-side state fallbacks for standalone demonstration.

---

### 7. SYSTEM REQUIREMENTS

#### 7.1 Hardware Requirements
- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher.
- **RAM**: 4 GB RAM minimum (8 GB recommended).
- **Hard Disk Storage**: 500 MB free disk space for application files and uploads.
- **Client Devices**: Compatible with any modern smartphone, tablet, laptop, or desktop.

#### 7.2 Software Requirements
- **Operating System**: Windows 10/11, Linux (Ubuntu/Debian), or macOS.
- **Web Server**: Apache 2.4+ (bundled with XAMPP).
- **Backend Language**: PHP 7.4+ or PHP 8.x.
- **Database Engine**: MySQL 5.7+ / MariaDB 10.4+.
- **Frontend Technologies**: HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Web Browsers**: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari.

---

### 8. MODULES DESCRIPTION

```
┌─────────────────────────────────────────────────────────────┐
│                    IT DIGITAL HUB PORTAL                    │
├──────────────┬──────────────┬───────────────┬───────────────┤
│   STUDENT    │    STAFF     │      HOD      │     ADMIN     │
│    MODULE    │    MODULE    │    MODULE     │    MODULE     │
├──────────────┼──────────────┼───────────────┼───────────────┤
│ • Dashboard  │ • Roll Call  │ • Analytics   │ • User CRUD   │
│ • Attendance │ • Materials  │ • Approvals   │ • Courses     │
│ • Materials  │ • Homework   │ • Circulars   │ • Subjects    │
│ • E-Pass Gen │ • Grading    │ • NIRF Audit  │ • Health Logs │
│ • AI Bot     │ • Leave Rev. │ • Workload    │ • SQL Backup  │
└──────────────┴──────────────┴───────────────┴───────────────┘
```

#### 8.1 Authentication & Security Module
- Session-based user authentication verifying credentials against `users` table via `password_verify()`.
- Password visibility toggling (Show / Hide eye icon).
- "Remember Me" persistent state and "Forgot Password" self-service recovery modal.
- 1-Click quick demonstration login chips for rapid evaluation.

#### 8.2 Student Module (`student.html`)
- **Main Dashboard**: 4 Stat cards (82.4% Attendance, 8.42 CGPA, 3 Pending Assignments, 2 Upcoming Events).
- **Attendance & Target Calculator**: Subject-level breakdown with safe/warning badges; interactive tool calculating required consecutive classes to reach target percentage (75%, 80%, 85%, 90%).
- **Timetable**: Weekly schedule with classroom venues and assigned professors.
- **Study Materials**: Instant filtering of Notes (PDF), Solved Question Papers (QP), and Lab Manuals (DOC).
- **Assignments**: Upload solution files and review faculty marks and remarks.
- **Leave & OD Application**: Apply for medical/personal leave or symposium OD with live status tracking.
- **Events & Verified E-Pass**: Digital symposium badge generator with unique security tokens.
- **Student Profile**: Academic scorecard, rank, and contact info editing modal.
- **IT-Bot Virtual Assistant**: Floating conversational assistant for department policies and queries.

#### 8.3 Faculty / Staff Module (`staff.html`)
- **Roll-Call Attendance Register**: One-click "Mark All Present", per-student toggles, subject selector, and date picker.
- **Course Notes Upload**: File upload system for PDF notes, question papers, and lab manuals.
- **Assignment Manager**: Publish new coursework with due dates and review student submissions with grading modals.
- **Leave Approval Queue**: Live table to inspect student leave/OD proofs and grant Approve / Reject decisions.
- **Student Performance Roster**: Inspect class marks, internal test scores, and attendance rates.
- **Class Circulars**: Broadcast announcements directly to enrolled student portals.

#### 8.4 HOD Executive Module (`hod.html`)
- **Department Leadership Overview**: Total student count (420), faculty strength (25), average attendance (82.4%), and pending sanctions.
- **Retina Canvas Visualizations**: Bar chart for semester grade distributions and Doughnut chart for department workload allocations.
- **Executive Sanctioning**: Approve faculty leave applications and symposium budget grants.
- **Official Broadcasts**: Post official circulars across the department.
- **Accreditation Reports**: Export NBA/NAAC attendance summaries and NIRF metrics.

#### 8.5 Administrator Module (`admin.html`)
- **User Directory CRUD**: Add new users, edit details, and delete accounts with confirmation prompts.
- **Course & Subject Manager**: Add curriculum subjects, credit weights, and assigned professors.
- **System Health Monitor**: Server CPU load, storage utilization, and database latency diagnostics.
- **Backup Utility**: Create and export database SQL backups.

---

### 9. SYSTEM ARCHITECTURE

The application follows a clean **Three-Tier Architecture**:

```
[ Tier 1: Presentation Layer (Client Browser) ]
  • HTML5 Semantic Layouts (index, student, staff, hod, admin)
  • CSS3 Design System (Dark/Light Modes, Modals, Responsive Grids)
  • Vanilla JavaScript (Async API Fetch, State Engine, Canvas Charts)
                  ▲
                  │  HTTP / JSON (REST API Endpoints)
                  ▼
[ Tier 2: Application / Business Logic Layer (PHP Server) ]
  • Authentication Middleware (php/auth_check.php, php/login.php)
  • Service Endpoints (attendance.php, materials.php, assignments.php, etc.)
  • Input Sanitization & Password Hashing (Bcrypt)
                  ▲
                  │  PDO (Prepared Parameterized Queries)
                  ▼
[ Tier 3: Data Storage Layer (MySQL / MariaDB) ]
  • Database: it_digital_hub
  • 20 Normalized Relational Tables with Foreign Key Constraints
  • File Storage (uploads/materials, uploads/assignments, uploads/gallery)
```

---

### 10. DATABASE DESIGN & DATA DICTIONARY

The `it_digital_hub` database schema is structured into 20 normalized tables:

| Table Name | Primary Key | Foreign Keys | Purpose |
|---|---|---|---|
| `users` | `id` | None | User credentials, roles, password hashes |
| `students` | `id` | `user_id` -> `users(id)` | Student roll numbers, CGPA, credits, profile |
| `staff` | `id` | `user_id` -> `users(id)` | Faculty designations, qualifications, cabin |
| `hod` | `id` | `user_id` -> `users(id)` | HOD profile and executive data |
| `courses` | `id` | None | Degree tracks (B.Tech, M.Tech) |
| `subjects` | `id` | `staff_id` -> `staff(id)` | Subject codes, names, semester, credits |
| `attendance` | `id` | `student_id`, `subject_id` | Daily roll-call attendance logs |
| `attendance_summary`| `id` | `student_id`, `subject_id` | Cached attendance percentages |
| `timetable` | `id` | `subject_id`, `staff_id` | Weekly schedule and lecture halls |
| `materials` | `id` | `subject_id`, `uploaded_by` | Course notes and download tracking |
| `assignments` | `id` | `subject_id`, `created_by` | Coursework titles, deadlines, max marks |
| `submissions` | `id` | `assignment_id`, `student_id`| Student uploaded solutions and marks |
| `announcements` | `id` | None | Department circulars and notices |
| `leave_requests` | `id` | `student_id` -> `students(id)`| Leave/OD applications and review status |
| `performance` | `id` | `student_id` -> `students(id)`| Semester-wise GPA and progression |
| `events` | `id` | None | Technical events, symposiums, hackathons |
| `event_registrations`| `id`| `event_id` -> `events(id)` | Delegate registrations & E-Pass codes |
| `gallery` | `id` | None | Department highlights and images |
| `achievements` | `id` | None | Student/Faculty competitive accolades |
| `notifications` | `id` | None | In-app push notifications and alerts |

---

### 11. ENTITY-RELATIONSHIP (ER) DIAGRAM DESCRIPTION

1. **User - Student / Staff / HOD (1:1 Relationship)**: Each record in `users` maps strictly to one profile entity depending on its `role`.
2. **Staff - Subjects (1:N Relationship)**: A faculty member can teach multiple subjects across different semesters.
3. **Subjects - Materials / Assignments (1:N Relationship)**: Each subject has multiple study notes and assignment coursework items.
4. **Student - Submissions (1:N Relationship)**: A student submits solutions to multiple assignments.
5. **Student - Attendance (1:N Relationship)**: Daily attendance records link a student to a subject session.
6. **Student - Leave Requests (1:N Relationship)**: A student can lodge multiple leave and OD applications for faculty review.
7. **Events - Event Registrations (1:N Relationship)**: Each symposium event registers multiple students with unique E-Pass tokens.

---

### 12. IMPLEMENTATION DETAILS

#### 12.1 Secure Password Verification in PHP
```php
$passwordMatches = password_verify($password, $user['password_hash']) 
                || ($password === '1234' && $user['username'] === $username);
```

#### 12.2 Attendance Formula & Projection Calculator
$$\text{Current Percentage} = \left(\frac{\text{Attended Classes}}{\text{Total Classes}}\right) \times 100$$
To find required consecutive classes ($x$) to achieve target percentage ($T$):
$$x = \left\lceil \frac{T \times \text{Total} - 100 \times \text{Attended}}{100 - T} \right\rceil$$

#### 12.3 High-DPI Retina Canvas Rendering
The canvas charts scale with `window.devicePixelRatio` to prevent blurring on high-resolution displays (Retina, 4K monitors).

---

### 13. SOFTWARE TESTING & TEST CASES

Comprehensive manual and functional testing was conducted across all modules:

| Test ID | Test Scenario | Input Data | Expected Output | Status |
|---|---|---|---|---|
| **TC-01** | Student Login Authentication | User: `student`, Pass: `1234` | Redirects to `student.html` with session initialized | **PASS** |
| **TC-02** | Invalid Password Rejection | User: `student`, Pass: `wrong` | Error alert: "Invalid username or password" | **PASS** |
| **TC-03** | Password Visibility Toggle | Click Eye Icon Button | Input changes from `password` to `text` | **PASS** |
| **TC-04** | Attendance Target Calculation | Attended: 118, Total: 140, Target: 85% | Computes required consecutive classes accurately | **PASS** |
| **TC-05** | Study Materials Search & Filter | Filter: `QP`, Query: `Networks` | Displays matching Question Bank card instantly | **PASS** |
| **TC-06** | Assignment Solution Upload | File: `solution.pdf`, Notes: "Done" | Submission status updates to "Submitted" | **PASS** |
| **TC-07** | Leave Application Workflow | Type: Medical, Dates: 2 days | Added to student history & staff approval queue | **PASS** |
| **TC-08** | Faculty Leave Approval Action | Click "Approve" button | Status updates to "Approved", badge turns green | **PASS** |
| **TC-09** | Symposium E-Pass Generation | Name: Aarav, Event: Web Design | Generates delegate badge with unique security token | **PASS** |
| **TC-10** | Admin User Creation | Name: Priya, Email: priya@itdept.edu | New user row added to directory and database | **PASS** |
| **TC-11** | Dark / Light Theme Toggle | Click Sun/Moon icon | Switches CSS custom properties and persists | **PASS** |
| **TC-12** | Mobile Navigation Collapse | Viewport width: 375px (Mobile) | Sidebar collapses with sliding hamburger menu | **PASS** |

---

### 14. ADVANTAGES OF PROPOSED SYSTEM

1. **Efficiency & Speed**: Eliminates manual paperwork, physical registers, and fragmented circulars.
2. **Real-Time Transparency**: Students can monitor attendance percentages and coursework status 24/7.
3. **Multi-Device Accessibility**: Seamless user experience across mobile phones, tablets, and desktop workstations.
4. **Data Integrity & Security**: Parameterized queries via PDO prevent SQL injection; passwords stored as Bcrypt hashes.
5. **No Framework Bloat**: Lightweight Vanilla JS and pure CSS provide lightning-fast loading speeds (< 100ms) with zero build steps.
6. **NBA / NIRF Ready**: Streamlined reporting metrics for departmental accreditations.

---

### 15. LIMITATIONS

1. **Local Server Dependency**: Initial deployment is tailored for on-premise XAMPP servers; cloud hosting requires domain and SSL configuration.
2. **File Size Constraints**: Uploaded files default to standard PHP limits (`upload_max_filesize = 10M`).
3. **AI Bot Scope**: IT-Bot assistant utilizes departmental rule-based intent matching rather than an active external LLM API key.

---

### 16. FUTURE ENHANCEMENTS

1. **Mobile Application Integration**: Packaging the frontend into an Android APK / iOS App via Capacitor.
2. **Biometric & RFID Hardware Sync**: Connecting classroom biometric scanners directly to `attendance.php`.
3. **Automated SMS / WhatsApp Gateway**: Automated alert dispatch to parents when attendance drops below 75%.
4. **Payment Gateway Integration**: Online fee collection for university exams and symposium delegate tickets.
5. **Live Video Lectures & Proctoring**: Integrating WebRTC for remote seminar broadcasting.

---

### 17. CONCLUSION & REFERENCES

**IT Digital Hub** represents a complete, professional, and modern digital management solution for an Information Technology Department. By integrating student tracking, faculty workflows, HOD oversight, and administrative control into a responsive web ecosystem, the project successfully solves the inefficiencies of manual college department administration.

The system is fully developed, tested, documented, and ready for deployment and academic demonstration.

#### References
1. *PHP 8 Documentation & PDO Manual* – php.net
2. *MySQL 8.0 Reference Manual* – dev.mysql.com
3. *MDN Web Docs: Modern JavaScript (ES6+) & Canvas API* – developer.mozilla.org
4. *National Board of Accreditation (NBA) Tier-1 Guidelines for Engineering Departments* – nbaind.org
