# IT DIGITAL HUB - Government College of Engineering, Erode
## Official Academic & Department Management Portal (Autonomous R2021)

An advanced, modern, multi-role Web Portal built specifically for the **Department of Information Technology** at **Government College of Engineering, Erode** (TNEA Code: 7304).

---

## 🌟 Key Highlights & Tech Stack

- **Frontend**: **React 18**, **JavaScript (ES6+)**, **Tailwind CSS**, Glassmorphism Design System, Lucide SVG Icons, and HTML5 Canvas Charts.
- **Backend**: **Node.js** & **Express.js** REST API Server (`server/server.js`) with a modular Data Adapter (`server/data/store.js`) ready to connect to any future database (MongoDB, MySQL, PostgreSQL, SQLite).
- **Institution Specific**: Tailored exclusively for GCE Erode Information Technology Department with Autonomous curriculum (R2021/R2024), real semester courses, NBA Tier-1 accreditation metrics, and faculty roster.
- **4 Distinct Role Dashboards**:
  1. 👨‍🎓 **STUDENT PORTAL**
  2. 👨‍🏫 **STAFF / FACULTY PORTAL**
  3. 🎓 **HOD EXECUTIVE PORTAL**
  4. ⚙️ **ADMINISTRATOR CONSOLE**
- **Reactive State & Persistence**: Interactive actions (marking attendance, submitting assignments, uploading materials, updating internal marks, adding/editing students) immediately reflect across dashboards with automatic persistence and API synchronization.

---

## 🔑 Demo Credentials

Click the **Quick Demo Credentials** buttons on the login screen or use these credentials:

| Role | User ID / Roll No | Password | Profile Name |
| :--- | :--- | :--- | :--- |
| **Student** | `24IT001` | `student123` | Naveen Kumar R (II Year / IV Sem) |
| **Staff / Faculty** | `ITSTAFF01` | `staff123` | Dr. A. Venkatesh (Associate Professor) |
| **HOD** | `ITHOD01` | `hod123` | Dr. S. K. Murugesan (Professor & Head) |
| **Administrator** | `ITADMIN01` | `admin123` | Er. M. Senthil Kumar (System Admin) |

---

## 🚀 How to Run the Application

### Option 1: Direct Browser Launch (Standalone Client Mode)
Simply double-click [`index.html`](file:///C:/Users/nathe/.gemini/antigravity/scratch/IT-Department-Digital-Hub/index.html) to run the full React application directly in any browser (Chrome, Edge, Firefox, Brave).

### Option 2: Node.js & Express REST API Server
1. Run the Express backend server:
   ```bash
   npm install
   npm start
   ```
2. The REST API server will run on `http://localhost:5000/api`. Open `index.html` in your browser.

---

## 📋 Comprehensive Feature Breakdown

### 1. 👨‍🎓 Student Portal (`/student`)
- **Dashboard**: Circular attendance gauge with 75% cutoff indicator, Current CGPA (8.74), Internal average, Pending assignments, Today's lecture timetable, and Urgent circulars.
- **My Profile**: Comprehensive student dossier (Roll No, Reg No, Batch 2024-2028, Blood Group, Mentor, Parent contact, Hostel room).
- **Subjects**: Semester IV IT curriculum courses (DBMS, DAA, OS, Computer Networks, Web Technologies, DBMS Lab, Web Tech Lab).
- **Attendance Matrix**: Detailed subject breakdown, total vs attended hours, progress bars, and **Apply OD / Medical Leave** modal.
- **Internal Marks**: CIA-1, CIA-2, Model Exam scores, Assignment points, Total internal marks out of 50, and estimated university letter grades.
- **Semester Results**: Consolidated GPA sheets for Semesters 1, 2, and 3 with 1-click **Download Grade Sheet PDF** simulation.
- **Study Materials**: Searchable, filterable repository of lecture notes, question banks, PPTs, and lab manuals with instant downloads.
- **Assignments Tracker**: Submit code/archives with instant status transitions from *Pending* to *Submitted* and review faculty marks & remarks.
- **Department Timetable**: Monday to Friday period-by-period teaching and lab schedule with print view.
- **Faculty Directory**: Contact directory of IT professors, designations, qualifications, research areas, cabins, and email links.
- **Department Announcements**: Official circulars with priority badges (High, Urgent, Academic, Placement).
- **Previous Year Question Papers**: Archives of Anna University & Autonomous end-semester question papers (2021-2025).
- **Placement & Internship**: Upcoming campus recruitment drives (Zoho, TCS Digital, Infosys, Kaar Tech), CTC packages (₹6.5 - ₹18.5 LPA), eligibility rules, and registration.
- **Achievements & Certifications**: Track hackathon awards and upload verified certifications (AWS, NPTEL, Oracle).
- **Confidential IQAC Feedback**: 5-star faculty and course evaluation forms.

### 2. 👨‍🏫 Staff / Faculty Portal (`/staff`)
- **Executive Overview**: Handled subjects, student count, pending evaluations, and today's lecture schedule.
- **Interactive Attendance Sheet**: Batch mark attendance (Present / Absent / On-Duty) with 1-click commit and automatic statistics.
- **Internal Marks Spreadsheet**: Enter & update CIA-1, CIA-2, Model Exam marks with auto-totaling and publishing.
- **Assignments Manager**: Create assignments with deadlines & instructions; inspect student submissions and assign marks & remarks.
- **Upload Study Materials**: Share lecture notes, PPTs, lab guides, and question banks directly with students.
- **Student Performance & Risk Monitor**: Identify at-risk students (<75% attendance) and view department rank holders.

### 3. 🎓 Head of Department (HOD) Portal (`/hod`)
- **Department Analytics & Charts**:
  - 📈 Semester-wise Attendance Trend Chart (Semesters 1 to 8)
  - 📊 Internal Assessment Marks Cohort Distribution (O, A+, A, B+, Remedial)
  - 💼 Campus Placement Statistics & Top IT Recruiters (Zoho, TCS, Infosys, Amazon)
  - 👥 Weekly Faculty Teaching Workload Matrix (Theory vs Lab vs Admin hours)
- **Attendance Monitoring**: Low attendance audit (<75%) with **"Broadcast Warning SMS to Parents"** action.
- **Staff Governance & Sanctioning**: Review and Sanction / Reject faculty duty leave and conference attendance requests.
- **Official Department Circulars**: Issue high-priority department circulars and examination notifications.
- **Accreditation Reports**: Export NAAC Tier-1, NBA Criterion 4, and CIA audit reports.

### 4. ⚙️ System Administrator Portal (`/admin`)
- **System Metrics & Health**: Server uptime (99.98%), active sessions, user counts, and live transaction audit logs.
- **Student CRUD**: Enroll new students, modify academic records, or remove accounts.
- **Faculty CRUD**: Add new professors, set designations, and configure cabins.
- **Security Audit Logs**: Track user logins, attendance updates, marks changes, and circular publications with IP addresses and timestamps.
- **System Settings & Backups**: Trigger instant database dumps, toggle maintenance mode, or restore factory demo database.

---

## 📁 Codebase Directory Structure

```
IT-Department-Digital-Hub/
├── index.html                  # Main SPA entry with Tailwind, Lucide icons & React
├── README.md                   # Complete documentation and quick-start guide
├── src/
│   ├── main.js                 # Unified application context, icons, and UI components
│   ├── app.bundle.js           # GCE Erode IT department dataset & mock database
│   ├── styles/
│   │   └── portal.css          # Glassmorphism, animations, gradients & custom scrollbars
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.js    # Glassmorphic login card with full-screen campus background
│   │   ├── common/
│   │   │   ├── Icons.js        # SVG Lucide-style icon suite
│   │   │   └── UIComponents.js # StatCard, Modal, Topbar, Sidebar, ToastContainer
│   │   ├── student/
│   │   │   └── StudentViews.js # All 17 student modules and sub-views
│   │   ├── staff/
│   │   │   └── StaffViews.js   # All 11 staff modules and grading tools
│   │   ├── hod/
│   │   │   └── HODViews.js     # Analytics charts, staff governance & HOD circulars
│   │   └── admin/
│   │       └── AdminViews.js   # User CRUD, curriculum settings, audit logs
│   ├── context/
│   │   └── AuthContext.js      # Authentication and department global state
│   └── data/
│       └── mockData.js         # Comprehensive IT department data repository
└── assets/
    └── images/
        └── IT sync_dashboard sample img.jpeg # Campus / Dashboard visual asset
```

---

© 2026 Department of Information Technology • Government College of Engineering, Erode.
