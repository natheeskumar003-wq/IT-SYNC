// IT DIGITAL HUB - Auth & Department Global Data State Context
// Connected to Unified API Service Layer for seamless Future Backend Database connectivity

import { 
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
} from '../data/mockData.js';

import ITDepartmentApi, { authApi, studentApi, staffApi, hodApi, adminApi } from '../services/api.js';

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Global Department Data State with LocalStorage Persistence
  const [students, setStudents] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_students');
    return saved ? JSON.parse(saved) : INITIAL_ALL_STUDENTS;
  });

  const [studentProfile, setStudentProfile] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_student_profile');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  const [subjects, setSubjects] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [attendance, setAttendance] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_attendance');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_ATTENDANCE;
  });

  const [internalMarks, setInternalMarks] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_internal_marks');
    return saved ? JSON.parse(saved) : INITIAL_INTERNAL_MARKS;
  });

  const [assignments, setAssignments] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [studyMaterials, setStudyMaterials] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_study_materials');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  const [announcements, setAnnouncements] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [achievements, setAchievements] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [certificates, setCertificates] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [notifications, setNotifications] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [facultyList, setFacultyList] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_faculty');
    return saved ? JSON.parse(saved) : INITIAL_FACULTY_LIST;
  });

  const [auditLogs, setAuditLogs] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [toasts, setToasts] = React.useState([]);

  // Toast Dispatcher Helper
  const showToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync back to LocalStorage
  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gce_it_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gce_it_user');
    }
  }, [currentUser]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_students', JSON.stringify(students));
  }, [students]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_assignments', JSON.stringify(assignments));
  }, [assignments]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_study_materials', JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_announcements', JSON.stringify(announcements));
  }, [announcements]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_achievements', JSON.stringify(achievements));
  }, [achievements]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_certificates', JSON.stringify(certificates));
  }, [certificates]);

  // Login handler
  const login = async (role, userId, password) => {
    // 1. Try Backend API first if enabled
    try {
      const backendRes = await authApi.login(role, userId, password);
      if (backendRes && backendRes.user) {
        setCurrentUser(backendRes.user);
        showToast(`Welcome back, ${backendRes.user.name}!`, 'success');
        return true;
      }
    } catch (err) {
      // Continue to local validation
    }

    // 2. Validate against demo credentials
    const cred = DEMO_CREDENTIALS[role];
    if (!cred) {
      showToast('Invalid role selected', 'error');
      return false;
    }

    if (cred.id.toLowerCase() === userId.trim().toLowerCase() && cred.pass === password.trim()) {
      let userData = {
        role: role,
        id: cred.id,
        name: cred.name,
        email: `${cred.id.toLowerCase()}@gceerode.ac.in`,
        avatar: role === 'student' ? '👨‍🎓' : role === 'staff' ? '👨‍🏫' : role === 'hod' ? '🎓' : '⚙️'
      };

      if (role === 'student') {
        userData = { ...userData, ...studentProfile };
      }

      setCurrentUser(userData);
      
      // Log login event
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
      showToast('Invalid User ID or Password. Check demo credentials.', 'error');
      return false;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}

    if (currentUser) {
      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        action: "User Logout",
        user: `${currentUser.id} (${currentUser.name})`,
        role: currentUser.role?.toUpperCase(),
        ip: "192.168.1.100",
        timestamp: "Just now",
        status: "Success"
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
    setCurrentUser(null);
    localStorage.removeItem('gce_it_user');
    showToast('Logged out successfully', 'info');
  };

  // Student Actions
  const submitAssignment = async (asnId, fileName) => {
    try {
      await studentApi.submitAssignment(asnId, currentUser?.id, { fileName });
    } catch (e) {}

    setAssignments(prev => prev.map(a => {
      if (a.id === asnId) {
        return {
          ...a,
          status: 'Submitted',
          submissionFile: fileName,
          submittedDate: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    }));
    setStudentProfile(prev => ({
      ...prev,
      pendingAssignments: Math.max(0, prev.pendingAssignments - 1)
    }));
    showToast('Assignment submitted successfully!', 'success');
  };

  const addAchievement = async (achievement) => {
    try {
      await studentApi.addAchievement(achievement);
    } catch (e) {}

    const newAch = {
      id: `ACH-${Date.now().toString().slice(-4)}`,
      ...achievement
    };
    setAchievements(prev => [newAch, ...prev]);
    showToast('Achievement recorded successfully!', 'success');
  };

  const addCertificate = async (cert) => {
    try {
      await studentApi.addCertificate(cert);
    } catch (e) {}

    const newCert = {
      id: `CERT-${Date.now().toString().slice(-4)}`,
      ...cert
    };
    setCertificates(prev => [newCert, ...prev]);
    showToast('Certificate uploaded successfully!', 'success');
  };

  // Staff & Admin Actions
  const addStudyMaterial = async (material) => {
    try {
      await staffApi.uploadStudyMaterial(material);
    } catch (e) {}

    const newMat = {
      id: `MAT-${Date.now().toString().slice(-4)}`,
      downloads: 0,
      date: new Date().toISOString().split('T')[0],
      ...material
    };
    setStudyMaterials(prev => [newMat, ...prev]);
    showToast('Study Material uploaded to department repository!', 'success');
  };

  const createAssignment = async (assignmentData) => {
    try {
      await staffApi.createAssignment(assignmentData);
    } catch (e) {}

    const newAsn = {
      id: `ASN-${Date.now().toString().slice(-3)}`,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      submissionFile: null,
      submittedDate: null,
      score: null,
      remarks: null,
      ...assignmentData
    };
    setAssignments(prev => [newAsn, ...prev]);
    showToast('New Assignment created and assigned to students!', 'success');
  };

  const gradeAssignment = async (asnId, score, remarks) => {
    try {
      await staffApi.gradeAssignment(asnId, null, score, remarks);
    } catch (e) {}

    setAssignments(prev => prev.map(a => {
      if (a.id === asnId) {
        return { ...a, status: 'Graded', score: Number(score), remarks };
      }
      return a;
    }));
    showToast('Assignment evaluated and score published!', 'success');
  };

  const addAnnouncement = async (announcement) => {
    try {
      await hodApi.publishCircular(announcement);
    } catch (e) {}

    const newAnn = {
      id: `ANN-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      ...announcement
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast('Department announcement published live!', 'success');
  };

  const addStudent = async (studentData) => {
    try {
      await adminApi.createStudent(studentData);
    } catch (e) {}

    const newStudent = {
      arrears: 0,
      status: "Active",
      ...studentData
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast(`Student ${newStudent.name} (${newStudent.rollNo}) enrolled!`, 'success');
  };

  const updateStudent = async (rollNo, updatedData) => {
    try {
      await adminApi.updateStudent(rollNo, updatedData);
    } catch (e) {}

    setStudents(prev => prev.map(s => s.rollNo === rollNo ? { ...s, ...updatedData } : s));
    showToast(`Student record for ${rollNo} updated!`, 'success');
  };

  const deleteStudent = async (rollNo) => {
    try {
      await adminApi.deleteStudent(rollNo);
    } catch (e) {}

    setStudents(prev => prev.filter(s => s.rollNo !== rollNo));
    showToast(`Student record ${rollNo} deleted.`, 'info');
  };

  const addFaculty = async (facultyData) => {
    try {
      await adminApi.createFaculty(facultyData);
    } catch (e) {}

    const newFaculty = {
      id: `ITSTAFF0${facultyList.length + 1}`,
      publications: 0,
      ...facultyData
    };
    setFacultyList(prev => [...prev, newFaculty]);
    showToast(`Faculty member ${newFaculty.name} added!`, 'success');
  };

  const deleteFaculty = async (id) => {
    try {
      await adminApi.deleteFaculty(id);
    } catch (e) {}

    setFacultyList(prev => prev.filter(f => f.id !== id));
    showToast(`Faculty record removed.`, 'info');
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetAllData = () => {
    localStorage.clear();
    setStudents(INITIAL_ALL_STUDENTS);
    setStudentProfile(INITIAL_STUDENT_PROFILE);
    setSubjects(INITIAL_SUBJECTS);
    setAttendance(INITIAL_STUDENT_ATTENDANCE);
    setInternalMarks(INITIAL_INTERNAL_MARKS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setStudyMaterials(INITIAL_STUDY_MATERIALS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setCertificates(INITIAL_CERTIFICATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFacultyList(INITIAL_FACULTY_LIST);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    showToast('Department Demo Database reset to original factory state!', 'success');
  };

  const value = {
    currentUser,
    login,
    logout,
    toasts,
    showToast,
    removeToast,
    collegeInfo: COLLEGE_INFO,
    demoCredentials: DEMO_CREDENTIALS,
    students,
    studentProfile,
    subjects,
    attendance,
    internalMarks,
    semesterResults: INITIAL_SEMESTER_RESULTS,
    timetable: INITIAL_TIMETABLE,
    studyMaterials,
    assignments,
    facultyList,
    announcements,
    questionPapers: INITIAL_QUESTION_PAPERS,
    placements: INITIAL_PLACEMENTS,
    achievements,
    certificates,
    notifications,
    hodAnalytics: HOD_DEPARTMENT_ANALYTICS,
    auditLogs,
    // Actions
    submitAssignment,
    addAchievement,
    addCertificate,
    addStudyMaterial,
    createAssignment,
    gradeAssignment,
    addAnnouncement,
    addStudent,
    updateStudent,
    deleteStudent,
    addFaculty,
    deleteFaculty,
    markAllNotificationsRead,
    resetAllData
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
