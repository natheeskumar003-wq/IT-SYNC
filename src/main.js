// IT DIGITAL HUB - Self-Contained Complete Application Engine
// Department of Information Technology - Government College of Engineering, Erode
// Includes AuthContext, Icons, UI Components, LoginPage, StudentViews, StaffViews, HODViews, AdminViews, and App

(function () {
  const { useState, useEffect, useContext, createContext, createElement: h, Fragment } = React;
  const AppData = window.ITDepartmentApp;

  if (!AppData) {
    console.error("AppData not found");
    return;
  }

  // Single Port Dynamic API URL Resolver
  const resolveApiUrl = (endpoint) => {
    const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http')) {
      return `${window.location.origin}${clean}`;
    }
    return `http://localhost:5000${clean}`;
  };

  // =========================================================================
  // 1. ICONS LIBRARY (SVG)
  // =========================================================================
  const createSvg = (pathD, viewBox = "0 0 24 24") => {
    return function IconComponent({ className = "w-5 h-5", size, color = "currentColor", strokeWidth = 2, ...props }) {
      const style = size ? { width: size, height: size } : {};
      return h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: viewBox,
          fill: "none",
          stroke: color,
          strokeWidth: strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: className,
          style: style,
          ...props
        },
        Array.isArray(pathD)
          ? pathD.map((d, i) => h("path", { key: i, d: d }))
          : h("path", { d: pathD })
      );
    };
  };

  const Icons = {
    Dashboard: createSvg(["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]),
    User: createSvg(["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]),
    Users: createSvg(["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]),
    BookOpen: createSvg(["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]),
    CheckCircle: createSvg(["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4L12 14.01l-3-3"]),
    Award: createSvg(["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M8.21 13.89L7 23l5-3 5 3-1.21-9.12"]),
    FileText: createSvg(["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]),
    Download: createSvg(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]),
    Upload: createSvg(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"]),
    Calendar: createSvg(["M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z", "M16 2v4", "M8 2v4", "M3 10h18"]),
    Bell: createSvg(["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"]),
    Briefcase: createSvg(["M20 7h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z", "M8 4h8v3H8z", "M2 13h20"]),
    BarChart: createSvg(["M12 20V10", "M18 20V4", "M6 20v-4"]),
    PieChart: createSvg(["M21.21 15.89A10 10 0 1 1 8 2.83", "M22 12A10 10 0 0 0 12 2v10z"]),
    MessageSquare: createSvg(["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]),
    Settings: createSvg(["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"]),
    LogOut: createSvg(["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"]),
    Search: createSvg(["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.35-4.35"]),
    Shield: createSvg(["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]),
    Eye: createSvg(["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"]),
    EyeOff: createSvg(["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24", "M1 1l22 22"]),
    Check: createSvg("M20 6L9 17l-5-5"),
    X: createSvg(["M18 6L6 18", "M6 6l12 12"]),
    Plus: createSvg(["M12 5v14", "M5 12h14"]),
    Edit: createSvg(["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"]),
    Trash: createSvg(["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M10 11v6", "M14 11v6"]),
    ChevronRight: createSvg("M9 18l6-6-6-6"),
    ChevronDown: createSvg("M6 9l6 6 6-6"),
    ArrowRight: createSvg(["M5 12h14", "M12 5l7 7-7 7"]),
    GraduationCap: createSvg(["M22 10v6M2 10l10-5 10 5-10 5z", "M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"]),
    Cpu: createSvg(["M4 4h16v16H4z", "M9 9h6v6H9z", "M9 1v3", "M15 1v3", "M9 20v3", "M15 20v3", "M20 9h3", "M20 14h3", "M1 9h3", "M1 14h3"]),
    Database: createSvg(["M12 3c-4.97 0-9 1.343-9 3v12c0 1.657 4.03 3 9 3s9-1.343 9-3V6c0-1.657-4.03-3-9-3z", "M3 10.5c0 1.657 4.03 3 9 3s9-1.343 9-3", "M3 15c0 1.657 4.03 3 9 3s9-1.343 9-3"]),
    Star: createSvg(["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"]),
    Sparkles: createSvg(["M12 3l1.912 5.885L20 10.5l-5.088 3.615L16.824 20 12 16.385 7.176 20l1.912-5.885L4 10.5l6.088-1.615z"]),
    AlertTriangle: createSvg(["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"]),
    Printer: createSvg(["M6 9V2h12v7", "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2", "M6 14h12v8H6z"]),
    Mail: createSvg(["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"]),
    Send: createSvg(["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"]),
    Inbox: createSvg(["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"]),
    Menu: createSvg(["M3 12h18", "M3 6h18", "M3 18h18"]),
    Image: createSvg([
      "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",
      "M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
      "M21 15l-5-5L5 21"
    ]),
    Heart: createSvg([
      "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
    ]),
    Camera: createSvg([
      "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",
      "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
    ]),
    MessageCircle: createSvg([
      "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
    ]),
    Maximize2: createSvg([
      "M15 3h6v6",
      "M9 21H3v-6",
      "M21 3l-7 7",
      "M3 21l7-7"
    ]),
    Folder: createSvg([
      "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
    ]),
    RefreshCw: createSvg([
      "M23 4v6h-6",
      "M1 20v-6h6",
      "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
    ])
  };

  // =========================================================================
  // 2. AUTH CONTEXT & PROVIDER
  // =========================================================================
  const AuthContext = createContext(null);

  const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
      const saved = localStorage.getItem('gce_it_user');
      return saved ? JSON.parse(saved) : null;
    });

    const [students, setStudents] = useState(() => {
      const saved = localStorage.getItem('gce_it_students');
      return saved ? JSON.parse(saved) : AppData.INITIAL_ALL_STUDENTS;
    });

    const [studentProfile, setStudentProfile] = useState(() => {
      const savedUser = localStorage.getItem('gce_it_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      const saved = localStorage.getItem('gce_it_student_profile');
      const base = saved ? JSON.parse(saved) : AppData.INITIAL_STUDENT_PROFILE;
      if (parsedUser && parsedUser.role === 'student') {
        return { ...base, ...parsedUser, name: parsedUser.name, rollNo: parsedUser.rollNo || parsedUser.id };
      }
      return base;
    });

    const [subjects, setSubjects] = useState(AppData.INITIAL_SUBJECTS);
    const [attendance, setAttendance] = useState(AppData.INITIAL_STUDENT_ATTENDANCE);
    const [internalMarks, setInternalMarks] = useState(AppData.INITIAL_INTERNAL_MARKS);
    const [assignments, setAssignments] = useState(() => {
      const saved = localStorage.getItem('gce_it_assignments');
      return saved ? JSON.parse(saved) : AppData.INITIAL_ASSIGNMENTS;
    });
    const [studyMaterials, setStudyMaterials] = useState(() => {
      const saved = localStorage.getItem('gce_it_study_materials');
      return saved ? JSON.parse(saved) : AppData.INITIAL_STUDY_MATERIALS;
    });
    const [announcements, setAnnouncements] = useState(() => {
      const saved = localStorage.getItem('gce_it_announcements');
      return saved ? JSON.parse(saved) : AppData.INITIAL_ANNOUNCEMENTS;
    });
    const [achievements, setAchievements] = useState(() => {
      const saved = localStorage.getItem('gce_it_achievements');
      return saved ? JSON.parse(saved) : AppData.INITIAL_ACHIEVEMENTS;
    });
    const [certificates, setCertificates] = useState(() => {
      const saved = localStorage.getItem('gce_it_certificates');
      return saved ? JSON.parse(saved) : AppData.INITIAL_CERTIFICATES;
    });
    const [facultyList, setFacultyList] = useState(() => {
      const saved = localStorage.getItem('gce_it_faculty');
      return saved ? JSON.parse(saved) : AppData.INITIAL_FACULTY_LIST;
    });
    const [hodList, setHodList] = useState(() => {
      const saved = localStorage.getItem('gce_it_hod_list');
      return saved ? JSON.parse(saved) : [
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
    });
    const [classAdvisors, setClassAdvisors] = useState(() => {
      const saved = localStorage.getItem('gce_it_class_advisors');
      return saved ? JSON.parse(saved) : (AppData.INITIAL_CLASS_ADVISORS || {});
    });
    const [messages, setMessages] = useState(() => {
      const saved = localStorage.getItem('gce_it_messages');
      return saved ? JSON.parse(saved) : (AppData.INITIAL_MESSAGES || []);
    });
    const [notifications, setNotifications] = useState(() => {
      const saved = localStorage.getItem('gce_it_notifications');
      return saved ? JSON.parse(saved) : (AppData.INITIAL_NOTIFICATIONS || []);
    });
    const [auditLogs, setAuditLogs] = useState(AppData.INITIAL_AUDIT_LOGS);
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success', duration = 3500) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    };

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    useEffect(() => {
      if (currentUser) {
        localStorage.setItem('gce_it_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('gce_it_user');
      }
    }, [currentUser]);

    useEffect(() => {
      localStorage.setItem('gce_it_students', JSON.stringify(students));
    }, [students]);

    useEffect(() => {
      localStorage.setItem('gce_it_faculty', JSON.stringify(facultyList));
    }, [facultyList]);

    useEffect(() => {
      localStorage.setItem('gce_it_hod_list', JSON.stringify(hodList));
    }, [hodList]);

    useEffect(() => {
      localStorage.setItem('gce_it_class_advisors', JSON.stringify(classAdvisors));
    }, [classAdvisors]);

    useEffect(() => {
      localStorage.setItem('gce_it_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
      localStorage.setItem('gce_it_assignments', JSON.stringify(assignments));
    }, [assignments]);

    useEffect(() => {
      localStorage.setItem('gce_it_study_materials', JSON.stringify(studyMaterials));
    }, [studyMaterials]);

    useEffect(() => {
      localStorage.setItem('gce_it_announcements', JSON.stringify(announcements));
    }, [announcements]);

    useEffect(() => {
      localStorage.setItem('gce_it_achievements', JSON.stringify(achievements));
    }, [achievements]);

    useEffect(() => {
      localStorage.setItem('gce_it_certificates', JSON.stringify(certificates));
    }, [certificates]);

    useEffect(() => {
      localStorage.setItem('gce_it_notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
      fetch(resolveApiUrl('/api/materials'))
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setStudyMaterials(data.data);
          }
        })
        .catch(() => {});

      fetch(resolveApiUrl('/api/students/certificates'))
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setCertificates(data.data);
          }
        })
        .catch(() => {});

      fetch(resolveApiUrl('/api/students/achievements'))
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setAchievements(data.data);
          }
        })
        .catch(() => {});
    }, []);

    const login = async (role, userId, password) => {
      try {
        const res = await fetch(resolveApiUrl('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role, userId, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          if (data.user.role === 'student') {
            setStudentProfile(prev => ({
              ...prev,
              ...data.user,
              name: data.user.name,
              rollNo: data.user.rollNo || data.user.id
            }));
          }
          if (data.token) localStorage.setItem('gce_it_token', data.token);
          showToast(`Welcome back, ${data.user.name}!`, 'success');
          return true;
        }
      } catch (err) {
        console.warn('Real API login fallback to local validation:', err.message);
      }

      const trimmedId = (userId || '').trim();
      const trimmedPass = (password || '').trim();

      if (trimmedPass !== '1234') {
        showToast('Invalid Password. Institutional password is required.', 'error');
        return false;
      }

      let foundUser = null;
      if (role === 'student') {
        const isRollNo = /^[0-9]{2}[A-Za-z]{2,4}[0-9]{2,4}$/i.test(trimmedId);
        const s = students.find(item => 
          (item.rollNo || '').toLowerCase() === trimmedId.toLowerCase() || 
          (item.id || '').toLowerCase() === trimmedId.toLowerCase() ||
          (item.name || '').toLowerCase() === trimmedId.toLowerCase() ||
          (item.name || '').toLowerCase().includes(trimmedId.toLowerCase())
        );
        const resolvedName = (!isRollNo && trimmedId.length > 1) ? trimmedId : (s ? s.name : trimmedId);
        const baseStd = s || students[0] || {};
        const roll = s ? (s.rollNo || s.id) : (isRollNo ? trimmedId.toUpperCase() : "24IMT30");

        foundUser = {
          ...studentProfile,
          ...baseStd,
          role: 'student',
          id: roll,
          rollNo: roll,
          regNo: s?.regNo || `731124205030`,
          name: resolvedName,
          email: s?.email || `${roll.toLowerCase()}@gceerode.ac.in`,
          year: Number(s?.year) || 2,
          sem: Number(s?.sem) || 4,
          sec: s?.sec || 'A',
          cgpa: s?.cgpa !== undefined ? Number(s.cgpa) : 8.5,
          attendance: s?.attendance !== undefined ? Number(s.attendance) : 90.0,
          standingArrears: s?.arrears !== undefined ? Number(s.arrears) : 0,
          mentor: s?.mentor || 'Assigned Faculty',
          status: s?.status || 'Active'
        };
      } else if (role === 'staff') {
        const f = facultyList.find(item => item.id.toLowerCase() === trimmedId.toLowerCase());
        if (f) {
          foundUser = {
            role: 'staff',
            ...f
          };
        }
      } else if (role === 'hod') {
        const h = (hodList && hodList.find(item => item.id.toLowerCase() === trimmedId.toLowerCase() || trimmedId.toLowerCase() === 'hod')) || hodList?.[0];
        if (h && (trimmedId.toLowerCase() === h.id.toLowerCase() || trimmedId.toLowerCase() === 'hod')) {
          foundUser = {
            role: 'hod',
            ...h
          };
        }
      } else if (role === 'admin') {
        if (trimmedId.toLowerCase() === 'itadmin01') {
          foundUser = {
            role: 'admin',
            id: 'ITADMIN01',
            name: 'Er. M. Senthil Kumar',
            email: 'admin.it@gceerode.ac.in'
          };
        }
      }

      if (foundUser) {
        setCurrentUser(foundUser);
        if (role === 'student') {
          setStudentProfile(prev => ({
            ...prev,
            ...foundUser,
            name: foundUser.name,
            rollNo: foundUser.rollNo
          }));
        }
        showToast(`Welcome back, ${foundUser.name}!`, 'success');
        return true;
      } else {
        showToast(`Invalid ${role.toUpperCase()} ID or account not registered.`, 'error');
        return false;
      }
    };

    const logout = () => {
      setCurrentUser(null);
      localStorage.removeItem('gce_it_user');
      showToast('Logged out successfully', 'info');
    };

    const submitAssignment = (asnId, fileName, fileData) => {
      setAssignments(prev => prev.map(a => a.id === asnId ? { ...a, status: 'Submitted', submissionFile: fileName, submittedDate: new Date().toISOString().split('T')[0] } : a));
      setStudentProfile(prev => ({ ...prev, pendingAssignments: Math.max(0, prev.pendingAssignments - 1) }));
      showToast('Assignment submitted successfully!', 'success');
    };

    const addAchievement = async (ach) => {
      try {
        const isFormData = typeof FormData !== 'undefined' && ach instanceof FormData;
        const res = await fetch(resolveApiUrl('/api/students/achievements'), {
          method: 'POST',
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
          body: isFormData ? ach : JSON.stringify(ach)
        });
        const data = await res.json();
        if (data.success && data.data) {
          setAchievements(prev => [data.data, ...prev.filter(a => a.id !== data.data.id)]);
          showToast('Achievement uploaded successfully!', 'success');
          return data.data;
        }
      } catch (err) {}

      const newAch = {
        id: `ACH-${Date.now().toString().slice(-4)}`,
        uploadDate: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        ...(typeof FormData !== 'undefined' && ach instanceof FormData ? {
          title: ach.get('title') || 'Student Achievement',
          description: ach.get('description') || '',
          category: ach.get('category') || 'Achievement'
        } : ach)
      };
      setAchievements(prev => [newAch, ...prev]);
      showToast('Achievement uploaded successfully!', 'success');
      return newAch;
    };

    const deleteAchievement = async (id) => {
      try {
        await fetch(resolveApiUrl(`/api/students/achievements/${id}`), {
          method: 'DELETE'
        });
      } catch (err) {}
      setAchievements(prev => prev.filter(a => a.id !== id));
      showToast('Achievement deleted successfully!', 'info');
    };

    const addCertificate = async (cert) => {
      try {
        const isFormData = typeof FormData !== 'undefined' && cert instanceof FormData;
        const res = await fetch(resolveApiUrl('/api/students/certificates'), {
          method: 'POST',
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
          body: isFormData ? cert : JSON.stringify(cert)
        });
        const data = await res.json();
        if (data.success && data.data) {
          setCertificates(prev => [data.data, ...prev.filter(c => c.id !== data.data.id)]);
          showToast('Certificate uploaded successfully!', 'success');
          return data.data;
        }
      } catch (err) {}

      const newCert = {
        id: `CERT-${Date.now().toString().slice(-4)}`,
        uploadDate: new Date().toISOString().split('T')[0],
        ...(typeof FormData !== 'undefined' && cert instanceof FormData ? { name: cert.get('title') || 'Certificate' } : cert)
      };
      setCertificates(prev => [newCert, ...prev]);
      showToast('Certificate uploaded successfully!', 'success');
      return newCert;
    };

    const deleteCertificate = async (id) => {
      try {
        await fetch(resolveApiUrl(`/api/students/certificates/${id}`), {
          method: 'DELETE'
        });
      } catch (err) {}
      setCertificates(prev => prev.filter(c => c.id !== id));
      showToast('Certificate deleted successfully!', 'info');
    };

    const addStudyMaterial = async (mat) => {
      try {
        const res = await fetch(resolveApiUrl('/api/materials'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mat)
        });
        const data = await res.json();
        if (data.success && data.data) {
          setStudyMaterials(prev => [data.data, ...prev.filter(m => m.id !== data.data.id)]);
          showToast('Study Material uploaded to department repository!', 'success');
          return data.data;
        }
      } catch (err) {}
      setStudyMaterials(prev => [{ id: `MAT-${Date.now().toString().slice(-4)}`, downloads: 0, date: new Date().toISOString().split('T')[0], ...mat }, ...prev]);
      showToast('Study Material uploaded to department repository!', 'success');
    };

    const createAssignment = (asnData) => {
      setAssignments(prev => [{ id: `ASN-${Date.now().toString().slice(-3)}`, assignedDate: new Date().toISOString().split('T')[0], status: 'Pending', submissionFile: null, submittedDate: null, score: null, remarks: null, ...asnData }, ...prev]);
      showToast('New Assignment created and assigned to students!', 'success');
    };

    const gradeAssignment = (asnId, score, remarks) => {
      setAssignments(prev => prev.map(a => a.id === asnId ? { ...a, status: 'Graded', score: Number(score), remarks } : a));
      showToast('Assignment evaluated and score published!', 'success');
    };

    const updateInternalMarksBatch = (subjectCode, examType, marksList) => {
      setInternalMarks(prev => {
        if (Array.isArray(prev)) {
          return prev.map(item => {
            if (item.code === subjectCode) {
              const updated = { ...item };
              const score = Number(marksList?.[0]?.score !== undefined ? marksList[0].score : (examType === 'Model Exam' ? 85 : 45));
              if (examType === 'CIA-1') updated.cia1 = score;
              if (examType === 'CIA-2') updated.cia2 = score;
              if (examType === 'Model Exam') updated.model = score;
              const ciaAvg = ((Number(updated.cia1) || 0) + (Number(updated.cia2) || 0)) / 2;
              const modelWeighted = ((Number(updated.model) || 0) / 100) * 20;
              const asgn = Number(updated.assignment || 9.5);
              updated.totalInternal = Number((ciaAvg * 0.4 + modelWeighted + asgn * 0.4).toFixed(1));
              return updated;
            }
            return item;
          });
        }
        return prev;
      });
      showToast(`${examType} marks updated & published for ${subjectCode}!`, 'success');
    };

    const updateSemesterResults = (rollNo, semesterKey, newCourseResult) => {
      showToast(`Semester result updated for ${newCourseResult.code}!`, 'success');
    };

    const addAnnouncement = (ann) => {
      setAnnouncements(prev => [{ id: `ANN-${Date.now().toString().slice(-3)}`, date: new Date().toISOString().split('T')[0], ...ann }, ...prev]);
      showToast('Department announcement published live!', 'success');
    };

    const addStudent = (std) => {
      const roll = (std.rollNo || '').trim().toUpperCase();
      const newStd = {
        arrears: 0,
        status: "Active",
        pass: "1234",
        ...std,
        rollNo: roll,
        regNo: std.regNo || `7304${std.year || 2}4205${roll.slice(-3) || '001'}`,
        email: std.email || `${roll.toLowerCase()}@gceerode.ac.in`
      };
      // Add to local state
      setStudents(prev => {
        const idx = prev.findIndex(s => (s.rollNo || '').toUpperCase() === roll);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...newStd };
          return copy;
        }
        return [newStd, ...prev];
      });
      
      // Sync with backend API
      const syncWithBackend = async () => {
        try {
          await fetch(resolveApiUrl('/api/students'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStd)
          });
        } catch (error) {
          console.warn('Backend API unavailable, using local state only:', error.message);
        }
      };
      
      syncWithBackend();
      showToast(`Student ${newStd.name} (${newStd.rollNo}) enrolled! Credentials auto-generated (Pass: 1234)`, 'success');
      return newStd;
    };

    const updateStudent = (rollNo, updatedData) => {
      // Update local state
      setStudents(prev => prev.map(s => s.rollNo === rollNo ? { ...s, ...updatedData } : s));
      
      // Try to sync with backend API
      const syncWithBackend = async () => {
        try {
          const response = await fetch(resolveApiUrl(`/api/students/${rollNo}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
          
          if (!response.ok) {
            console.error('Failed to update student on backend');
            return;
          }
          
          const data = await response.json();
          if (data.success) {
            console.log('Student updated on backend:', data.data);
          }
        } catch (error) {
          console.warn('Backend API unavailable, using local state only:', error.message);
        }
      };
      
      syncWithBackend();
      showToast(`Student record for ${rollNo} updated!`, 'success');
    };

    const deleteStudent = (rollNo) => {
      // Remove from local state
      setStudents(prev => prev.filter(s => s.rollNo !== rollNo));
      
      // Try to sync with backend API
      const syncWithBackend = async () => {
        try {
          const response = await fetch(resolveApiUrl(`/api/students/${rollNo}`), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (!response.ok) {
            console.error('Failed to delete student from backend');
            return;
          }
          
          const data = await response.json();
          if (data.success) {
            console.log('Student deleted from backend:', data.data);
          }
        } catch (error) {
          console.warn('Backend API unavailable, using local state only:', error.message);
        }
      };
      
      syncWithBackend();
      showToast(`Student record ${rollNo} deleted.`, 'info');
    };

    const addFaculty = async (f) => {
      const newFaculty = {
        id: f.id || `ITSTAFF0${(facultyList.length + 1).toString().padStart(2, '0')}`,
        publications: f.publications || 0,
        ...f
      };
      try {
        if (window.adminApi && window.adminApi.createFaculty) {
          await window.adminApi.createFaculty(newFaculty);
        }
      } catch (e) {}
      setFacultyList(prev => [...prev, newFaculty]);
      showToast(`Faculty member ${newFaculty.name} added!`, 'success');
    };

    const updateFaculty = async (facultyId, updatedData) => {
      try {
        if (window.adminApi && window.adminApi.updateFaculty) {
          await window.adminApi.updateFaculty(facultyId, updatedData);
        }
      } catch (e) {}
      setFacultyList(prev => prev.map(f => f.id === facultyId ? { ...f, ...updatedData } : f));
      showToast(`Faculty record for ${updatedData.name || facultyId} updated!`, 'success');
    };

    const deleteFaculty = async (id) => {
      try {
        if (window.adminApi && window.adminApi.deleteFaculty) {
          await window.adminApi.deleteFaculty(id);
        }
      } catch (e) {}
      setFacultyList(prev => prev.filter(f => f.id !== id));
      showToast('Faculty record removed.', 'info');
    };

    const updateClassAdvisor = (year, staffId) => {
      const yNum = Number(year);
      const staffMember = facultyList.find(f => f.id === staffId);
      if (!staffMember) return;
      setClassAdvisors(prev => ({
        ...prev,
        [yNum]: {
          year: yNum,
          batch: yNum === 1 ? "2026 - 2030" : yNum === 2 ? "2025 - 2029" : yNum === 3 ? "2024 - 2028" : "2023 - 2027",
          staffId: staffMember.id,
          staffName: staffMember.name,
          designation: staffMember.designation,
          email: staffMember.email,
          phone: staffMember.phone,
          cabin: staffMember.cabin
        }
      }));
      setFacultyList(prev => prev.map(f => {
        if (f.id === staffId) return { ...f, classAdvisorFor: yNum, classAdvisorLabel: `Class Advisor - Year ${yNum}` };
        if (f.classAdvisorFor === yNum) return { ...f, classAdvisorFor: null, classAdvisorLabel: null };
        return f;
      }));
      fetch(resolveApiUrl(`/api/hod/class-advisors/${yNum}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId })
      }).catch(e => console.warn('Class advisor sync warning:', e.message));

      showToast(`${staffMember.name} assigned as Class Advisor for Year ${yNum}!`, 'success');
    };

    const sendMessage = (messageData) => {
      const newMsg = {
        id: `MSG-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        read: false,
        status: messageData.type === 'Request' ? 'Pending' : 'Delivered',
        fromId: currentUser?.id || '24IT001',
        fromName: currentUser?.name || 'User',
        fromRole: currentUser?.role || 'student',
        ...messageData
      };
      setMessages(prev => [newMsg, ...prev]);
      showToast(messageData.type === 'Request' ? 'Request submitted!' : 'Message dispatched!', 'success');
      return newMsg;
    };

    const updateMessageStatus = (msgId, status) => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status, read: true } : m));
      showToast(`Request status updated to ${status}`, 'info');
    };

    const markAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('All notifications marked as read', 'info');
    };

    const resetAllData = () => {
      localStorage.clear();
      setStudents(AppData.INITIAL_ALL_STUDENTS);
      setStudentProfile(AppData.INITIAL_STUDENT_PROFILE);
      setSubjects(AppData.INITIAL_SUBJECTS);
      setAttendance(AppData.INITIAL_STUDENT_ATTENDANCE);
      setInternalMarks(AppData.INITIAL_INTERNAL_MARKS);
      setAssignments(AppData.INITIAL_ASSIGNMENTS);
      setStudyMaterials(AppData.INITIAL_STUDY_MATERIALS);
      setAnnouncements(AppData.INITIAL_ANNOUNCEMENTS);
      setAchievements(AppData.INITIAL_ACHIEVEMENTS);
      setCertificates(AppData.INITIAL_CERTIFICATES);
      setNotifications(AppData.INITIAL_NOTIFICATIONS);
      setFacultyList(AppData.INITIAL_FACULTY_LIST);
      setClassAdvisors(AppData.INITIAL_CLASS_ADVISORS);
      setMessages(AppData.INITIAL_MESSAGES);
      setAuditLogs(AppData.INITIAL_AUDIT_LOGS);
      showToast('Department Demo Database reset to original factory state!', 'success');
    };

    const value = {
      currentUser, login, logout, toasts, showToast, removeToast,
      collegeInfo: AppData.COLLEGE_INFO,
      demoCredentials: AppData.DEMO_CREDENTIALS,
      students, studentProfile, subjects, attendance, internalMarks,
      semesterResults: AppData.INITIAL_SEMESTER_RESULTS,
      timetable: AppData.INITIAL_TIMETABLE,
      studyMaterials, assignments, facultyList, hodList, classAdvisors, messages, announcements,
      questionPapers: AppData.INITIAL_QUESTION_PAPERS,
      placements: AppData.INITIAL_PLACEMENTS,
      achievements, certificates, notifications,
      hodAnalytics: AppData.HOD_DEPARTMENT_ANALYTICS,
      auditLogs,
      submitAssignment, addAchievement, deleteAchievement, addCertificate, deleteCertificate, addStudyMaterial,
      createAssignment, gradeAssignment, updateInternalMarksBatch, updateSemesterResults,
      addAnnouncement, addStudent, updateStudent, deleteStudent, addFaculty, updateFaculty, deleteFaculty,
      updateClassAdvisor,
      addHOD: async (hodData) => {
        const newHOD = {
          id: hodData.id || `ITHOD0${hodList.length + 1}`,
          name: hodData.name,
          designation: hodData.designation || 'Professor & Head of Department',
          qualification: hodData.qualification || 'M.E., Ph.D.',
          experience: hodData.experience || '20+ Years',
          specialization: hodData.specialization || 'Computer Science & Engineering',
          email: hodData.email || `${(hodData.id || 'ithod').toLowerCase()}@gceerode.ac.in`,
          phone: hodData.phone || '+91 94433 11223',
          cabin: hodData.cabin || 'HOD Chamber, IT Block - Ground Floor',
          role: 'hod',
          pass: hodData.pass || '1234',
          status: 'Active'
        };
        try {
          await fetch(resolveApiUrl('/api/admin/hods'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newHOD)
          });
        } catch (e) {}
        setHodList(prev => [...prev, newHOD]);
        showToast(`Head of Department ${newHOD.name} registered by Admin!`, 'success');
        return newHOD;
      },
      updateHOD: async (hodData, id) => {
        const targetId = id || hodData.id || 'ITHOD01';
        try {
          await fetch(resolveApiUrl(`/api/admin/hods/${targetId}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hodData)
          });
        } catch (e) {}
        setHodList(prev => prev.map(h => h.id.toUpperCase() === targetId.toUpperCase() ? { ...h, ...hodData } : h));
        setFacultyList(prev => prev.map(f => (f.id.toUpperCase() === targetId.toUpperCase() || f.role === 'hod') ? { ...f, ...hodData } : f));
        if (currentUser && currentUser.role === 'hod' && currentUser.id.toUpperCase() === targetId.toUpperCase()) {
          setCurrentUser(prev => ({ ...prev, ...hodData }));
        }
        showToast(`HOD profile for ${hodData.name || targetId} updated!`, 'success');
      },
      deleteHOD: async (id) => {
        if (hodList.length <= 1) {
          showToast('Cannot delete the sole HOD. At least one HOD must remain.', 'error');
          return;
        }
        try {
          await fetch(resolveApiUrl(`/api/admin/hods/${id}`), { method: 'DELETE' });
        } catch (e) {}
        setHodList(prev => prev.filter(h => h.id.toUpperCase() !== id.toUpperCase()));
        showToast(`HOD account ${id} removed by Admin.`, 'info');
      },
      changeHOD: async (newHODData) => {
        const target = {
          id: newHODData.id || `ITHOD0${hodList.length + 1}`,
          name: newHODData.name,
          designation: newHODData.designation || 'Professor & Head of Department',
          qualification: newHODData.qualification || 'M.E., Ph.D.',
          experience: newHODData.experience || '15+ Years',
          specialization: newHODData.specialization || 'Information Technology',
          email: newHODData.email || 'hod.it@gceerode.ac.in',
          phone: newHODData.phone || '+91 94433 11223',
          cabin: newHODData.cabin || 'IT Block - Ground Floor (Room 101)',
          publications: Number(newHODData.publications) || 20,
          subjects: newHODData.subjects || ["Advanced IT Systems", "Cloud Computing"],
          role: 'hod',
          pass: '1234',
          status: 'Active'
        };
        try {
          await fetch(resolveApiUrl('/api/admin/hods'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(target)
          });
        } catch (e) {}
        setHodList(prev => [...prev, target]);
        setFacultyList(prev => [target, ...prev]);
        if (currentUser && currentUser.role === 'hod') {
          setCurrentUser(prev => ({ ...prev, ...target }));
        }
        showToast(`Dr./Prof. ${target.name} officially appointed as Head of Department!`, 'success');
      },
      sendMessage, updateMessageStatus,
      markAllNotificationsRead, resetAllData
    };

    return h(AuthContext.Provider, { value }, children);
  };

  const useAuth = () => useContext(AuthContext);

  // Reusable StatCard Component
  const StatCard = ({ title, value, subtitle, icon: IconComponent, trend, trendLabel, color = 'blue', onClick }) => {
    const colorMap = {
      blue: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
      emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      purple: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
      rose: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400'
    };

    const currentTheme = colorMap[color] || colorMap.blue;

    return h(
      'div',
      {
        onClick: onClick,
        className: `glass-card p-5 rounded-2xl border bg-gradient-to-br ${currentTheme} ${onClick ? 'cursor-pointer' : ''} flex flex-col justify-between relative overflow-hidden group`
      },
      h('div', {
        className: 'absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-300'
      }),
      h(
        'div',
        { className: 'flex items-start justify-between relative z-10' },
        h(
          'div',
          null,
          h('p', { className: 'text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1' }, title),
          h('h3', { className: 'text-2xl lg:text-3xl font-extrabold text-white tracking-tight' }, value)
        ),
        IconComponent && h(
          'div',
          { className: 'p-3 rounded-xl bg-slate-900/60 border border-white/10 text-white shadow-inner group-hover:scale-110 transition-transform' },
          h(IconComponent, { className: 'w-6 h-6' })
        )
      ),
      (subtitle || trend) && h(
        'div',
        { className: 'mt-4 flex items-center justify-between text-xs text-slate-300 relative z-10 pt-2 border-t border-white/5' },
        subtitle && h('span', { className: 'truncate text-slate-400' }, subtitle),
        trend && h(
          'span',
          { className: `inline-flex items-center gap-1 font-bold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}` },
          trend > 0 ? '↑' : '↓', ' ', Math.abs(trend), '% ', trendLabel || ''
        )
      )
    );
  };

  // Reusable Modal Component
  const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
    if (!isOpen) return null;

    return h(
      'div',
      { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in' },
      h(
        'div',
        { className: `w-full ${maxWidth} glass-panel rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]` },
        h(
          'div',
          { className: 'flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70' },
          h('h3', { className: 'text-lg font-bold text-white flex items-center gap-2' }, title),
          h(
            'button',
            { onClick: onClose, className: 'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition' },
            h(Icons.X, { className: 'w-5 h-5' })
          )
        ),
        h('div', { className: 'p-6 overflow-y-auto space-y-4 text-slate-200 text-xs' }, children)
      )
    );
  };

  // Attach context and UI components to window for sub-components
  window.ITAuthContext = { AuthContext, AuthProvider, useAuth, Icons };
  window.UIComponents = { ...(window.UIComponents || {}), StatCard, Modal };
})();

