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
    Menu: createSvg(["M3 12h18", "M3 6h18", "M3 18h18"])
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
      const saved = localStorage.getItem('gce_it_student_profile');
      return saved ? JSON.parse(saved) : AppData.INITIAL_STUDENT_PROFILE;
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
    const [notifications, setNotifications] = useState(AppData.INITIAL_NOTIFICATIONS);
    const [facultyList, setFacultyList] = useState(AppData.INITIAL_FACULTY_LIST);
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

    const login = (role, userId, password) => {
      const cred = AppData.DEMO_CREDENTIALS[role];
      if (!cred) {
        showToast('Invalid role selected', 'error');
        return false;
      }
      if (cred.id.toLowerCase() === userId.trim().toLowerCase() && cred.pass === password.trim()) {
        let userData = {
          role: role,
          id: cred.id,
          name: cred.name,
          email: `${cred.id.toLowerCase()}@gceerode.ac.in`
        };
        if (role === 'student') {
          userData = { ...userData, ...studentProfile };
        }
        setCurrentUser(userData);
        const newLog = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          action: "User Login",
          user: `${cred.id} (${cred.name})`,
          role: role.toUpperCase(),
          ip: "192.168.1.100",
          timestamp: "Just now",
          status: "Success"
        };
        setAuditLogs(prev => [newLog, ...prev]);
        showToast(`Welcome back, ${cred.name}!`, 'success');
        return true;
      } else {
        showToast('Invalid User ID or Password. Click Quick Demo Credentials below to load.', 'error');
        return false;
      }
    };

    const logout = () => {
      setCurrentUser(null);
      localStorage.removeItem('gce_it_user');
      showToast('Logged out successfully', 'info');
    };

    const submitAssignment = (asnId, fileName) => {
      setAssignments(prev => prev.map(a => a.id === asnId ? { ...a, status: 'Submitted', submissionFile: fileName, submittedDate: new Date().toISOString().split('T')[0] } : a));
      setStudentProfile(prev => ({ ...prev, pendingAssignments: Math.max(0, prev.pendingAssignments - 1) }));
      showToast('Assignment submitted successfully!', 'success');
    };

    const addAchievement = (ach) => {
      setAchievements(prev => [{ id: `ACH-${Date.now().toString().slice(-4)}`, ...ach }, ...prev]);
      showToast('Achievement recorded successfully!', 'success');
    };

    const addCertificate = (cert) => {
      setCertificates(prev => [{ id: `CERT-${Date.now().toString().slice(-4)}`, ...cert }, ...prev]);
      showToast('Certificate uploaded successfully!', 'success');
    };

    const addStudyMaterial = (mat) => {
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

    const addAnnouncement = (ann) => {
      setAnnouncements(prev => [{ id: `ANN-${Date.now().toString().slice(-3)}`, date: new Date().toISOString().split('T')[0], ...ann }, ...prev]);
      showToast('Department announcement published live!', 'success');
    };

    const addStudent = (std) => {
      setStudents(prev => [{ arrears: 0, status: "Active", ...std }, ...prev]);
      showToast(`Student ${std.name} (${std.rollNo}) enrolled!`, 'success');
    };

    const updateStudent = (rollNo, updatedData) => {
      setStudents(prev => prev.map(s => s.rollNo === rollNo ? { ...s, ...updatedData } : s));
      showToast(`Student record for ${rollNo} updated!`, 'success');
    };

    const deleteStudent = (rollNo) => {
      setStudents(prev => prev.filter(s => s.rollNo !== rollNo));
      showToast(`Student record ${rollNo} deleted.`, 'info');
    };

    const addFaculty = (f) => {
      setFacultyList(prev => [...prev, { id: `ITSTAFF0${facultyList.length + 1}`, publications: 0, ...f }]);
      showToast(`Faculty member ${f.name} added!`, 'success');
    };

    const deleteFaculty = (id) => {
      setFacultyList(prev => prev.filter(f => f.id !== id));
      showToast('Faculty record removed.', 'info');
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
      studyMaterials, assignments, facultyList, announcements,
      questionPapers: AppData.INITIAL_QUESTION_PAPERS,
      placements: AppData.INITIAL_PLACEMENTS,
      achievements, certificates, notifications,
      hodAnalytics: AppData.HOD_DEPARTMENT_ANALYTICS,
      auditLogs,
      submitAssignment, addAchievement, addCertificate, addStudyMaterial,
      createAssignment, gradeAssignment, addAnnouncement, addStudent,
      updateStudent, deleteStudent, addFaculty, deleteFaculty,
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
  window.UIComponents = { StatCard, Modal };
})();

