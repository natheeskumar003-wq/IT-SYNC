# IT DIGITAL HUB - Backend Database Integration Guide
## Complete Guide for Connecting Live Databases (MySQL, PostgreSQL, MongoDB, Node.js, PHP, Python)

This web application has been transformed into a **modular React.js & Tailwind CSS Architecture** with a dedicated **API Service Layer** located at [`src/services/api.js`](file:///c:/Users/nathe/.gemini/antigravity/scratch/IT-Department-Digital-Hub/src/services/api.js).

---

## 🚀 How It Works (Zero Frontend Changes Needed)

The React components do **NOT** make direct database calls or depend on mock datasets. Instead, all data operations flow through the API Service Layer:

```
[ React Components / UI Views ]
              │
              ▼
    [ AuthContext.js ]
              │
              ▼
   [ src/services/api.js ]  ◄── All Endpoints Centralized Here
         │          │
 (USE_BACKEND_API)  │
    ├── FALSE ───────►  [ Reactive LocalStorage Fallback ]
    └── TRUE ────────►  [ Live Backend REST / GraphQL / MySQL API ]
```

---

## ⚙️ Step 1: Enable Backend Connectivity

Open [`src/services/api.js`](file:///c:/Users/nathe/.gemini/antigravity/scratch/IT-Department-Digital-Hub/src/services/api.js) and update the `API_CONFIG`:

```javascript
const API_CONFIG = {
  // Set to true to route all requests to your live backend server
  USE_BACKEND_API: true,
  
  // Set your backend server's base URL
  API_BASE_URL: 'http://localhost:5000/api', // or 'http://localhost/IT-Department-Digital-Hub/php'
  
  // Request timeout in milliseconds
  TIMEOUT_MS: 8000
};
```

---

## 📡 Step 2: REST API Endpoints Specification

Your backend server (Node.js/Express, PHP, Python, Java, etc.) needs to implement the following standard REST endpoints:

### 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Request Payload | Response |
|---|---|---|---|---|
| `POST` | `/auth/login` | Validate user credentials | `{ role, userId, password }` | `{ success: true, token, user }` |
| `POST` | `/auth/logout` | Invalidate session | None | `{ success: true }` |
| `GET` | `/auth/verify` | Verify JWT token | Header: `Authorization: Bearer <token>` | `{ success: true, user }` |

### 2. Student Endpoints (`/api/students`)
| Method | Endpoint | Description | Request Payload |
|---|---|---|---|
| `GET` | `/students/profile/:rollNo` | Get complete student profile | None |
| `PUT` | `/students/profile/:rollNo/contact` | Update student phone/contact | `{ phone, email, address }` |
| `POST` | `/assignments/:id/submit` | Submit assignment solution | `{ rollNo, fileDetails }` |
| `POST` | `/students/leave/apply` | Apply for OD / Medical leave | `{ type, fromDate, toDate, reason, proof }` |
| `POST` | `/students/achievements` | Add hackathon/award record | `{ title, category, issuedBy, date, desc }` |
| `POST` | `/students/certificates` | Upload certification badge | `{ name, issuer, issueDate, credentialId }` |
| `POST` | `/symposium/register` | Register & generate E-Pass | `{ name, rollNo, event, college }` |

### 3. Faculty / Staff Endpoints (`/api/staff` & `/api/attendance`)
| Method | Endpoint | Description | Request Payload |
|---|---|---|---|
| `POST` | `/attendance/batch` | Batch commit roll-call attendance | `{ subjectCode, date, records: [{ rollNo, status }] }` |
| `POST` | `/assignments` | Publish new assignment | `{ title, subjectCode, dueDate, maxMarks, instructions }` |
| `PUT` | `/assignments/:id/grade` | Grade student submission | `{ studentRollNo, score, remarks }` |
| `POST` | `/materials` | Upload study notes / QP | `{ title, subjectCode, category, fileUrl }` |
| `PATCH`| `/students/leave/:id/status`| Approve or Reject leave | `{ status: "Approved" \| "Rejected" }` |
| `POST` | `/marks/internal/batch` | Commit CIA internal marks | `{ subjectCode, examType, marks: [...] }` |

### 4. HOD Endpoints (`/api/hod`)
| Method | Endpoint | Description | Request Payload |
|---|---|---|---|
| `GET` | `/hod/analytics` | Fetch grade & attendance metrics | None |
| `POST`| `/announcements/circular` | Publish department-wide circular | `{ title, category, priority, content, author }` |
| `POST`| `/faculty/leave/:id/sanction`| Sanction faculty leave | `{ decision: "Approved" \| "Rejected" }` |
| `POST`| `/notifications/broadcast-warning` | Broadcast SMS to parents | `{ rollNos: [...] }` |

### 5. Administrator Endpoints (`/api/admin`)
| Method | Endpoint | Description | Request Payload |
|---|---|---|---|
| `POST` | `/admin/students` | Enroll new student | `{ rollNo, name, year, sem, cgpa, mentor }` |
| `PUT` | `/admin/students/:rollNo` | Update student details | `{ name, year, sem, cgpa, ... }` |
| `DELETE`| `/admin/students/:rollNo` | Remove student record | None |
| `POST` | `/admin/faculty` | Add faculty member | `{ name, designation, qualification, email }` |
| `DELETE`| `/admin/faculty/:id` | Remove faculty member | None |
| `POST` | `/admin/backup/export` | Trigger database SQL dump | None |

---

## 🛠️ Sample Backend Implementations

### Option A: Node.js + Express + MySQL Example

```javascript
// server.js (Node.js Express Backend)
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'it_digital_hub'
});

// Login API
app.post('/api/auth/login', async (req, res) => {
  const { role, userId, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND role = ?', [userId, role]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // Verify password with bcrypt
    // const valid = await bcrypt.compare(password, rows[0].password_hash);
    res.json({
      success: true,
      token: 'jwt_token_here',
      user: { id: rows[0].username, name: rows[0].name, role: rows[0].role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(5000, () => console.log('Backend server running on port 5000'));
```

### Option B: PHP + MySQL REST API

The application already includes pre-configured PHP endpoints inside the [`php/`](file:///c:/Users/nathe/.gemini/antigravity/scratch/IT-Department-Digital-Hub/php) directory and the SQL schema at [`database.sql`](file:///c:/Users/nathe/.gemini/antigravity/scratch/IT-Department-Digital-Hub/database.sql).

To connect to PHP:
1. Import [`database.sql`](file:///c:/Users/nathe/.gemini/antigravity/scratch/IT-Department-Digital-Hub/database.sql) into MySQL via phpMyAdmin.
2. In [`src/services/api.js`](file:///c:/Users/nathe/.gemini/antigravity/scratch/IT-Department-Digital-Hub/src/services/api.js), set `USE_BACKEND_API = true` and `API_BASE_URL = 'http://localhost/IT-Department-Digital-Hub/php'`.

---

## 🗄️ Database Schema Reference

The relational database [`database.sql`](file:///c:/Users/nathe/.gemini/antigravity/scratch/IT-Department-Digital-Hub/database.sql) includes 20 tables:
1. `users` (id, username, password_hash, role, email)
2. `students` (id, user_id, roll_no, reg_no, name, year, sem, cgpa, mentor_id)
3. `staff` (id, user_id, name, designation, qualification, cabin)
4. `attendance` (id, student_id, subject_id, date, status)
5. `assignments` (id, subject_id, title, due_date, max_marks, created_by)
6. `submissions` (id, assignment_id, student_id, file_path, score, remarks)
7. `materials` (id, subject_id, title, category, file_path, uploaded_by)
8. `leave_requests` (id, student_id, type, from_date, to_date, reason, status)
9. `announcements` (id, title, category, priority, content, author)
10. `symposium_registrations` (id, name, roll_no, event, college, epass_code)

---

## Summary
- **Frontend**: Pure React 18, ES6+ JavaScript, Tailwind CSS.
- **Data Layer**: Clean `api.js` Service Layer with instantaneous `localStorage` fallback.
- **Backend Plug-in**: Flip 1 variable (`USE_BACKEND_API = true`) in `src/services/api.js` to connect any backend database.
