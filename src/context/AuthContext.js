// IT DIGITAL HUB - Auth & Department Global Data State Context
// Connected to Unified API Service Layer for seamless Future Backend Database connectivity

const mockData = typeof require !== 'undefined' ? require('../data/mockData.js') : (window.ITDepartmentData || {});
const { 
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
} = mockData;

const ITDepartmentApi = typeof require !== 'undefined' ? require('../services/api.js') : (window.ITDepartmentApi || {});
const { authApi, studentApi, staffApi, hodApi, adminApi, messagingApi } = ITDepartmentApi;

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
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

  const [semesterResults, setSemesterResults] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_semester_results');
    return saved ? JSON.parse(saved) : INITIAL_SEMESTER_RESULTS;
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

  const [hodList, setHodList] = React.useState(() => {
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

  const [classAdvisors, setClassAdvisors] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_class_advisors');
    return saved ? JSON.parse(saved) : INITIAL_CLASS_ADVISORS;
  });

  const [messages, setMessages] = React.useState(() => {
    const saved = localStorage.getItem('gce_it_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
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
    localStorage.setItem('gce_it_faculty', JSON.stringify(facultyList));
  }, [facultyList]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_hod_list', JSON.stringify(hodList));
  }, [hodList]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_class_advisors', JSON.stringify(classAdvisors));
  }, [classAdvisors]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_messages', JSON.stringify(messages));
  }, [messages]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_internal_marks', JSON.stringify(internalMarks));
  }, [internalMarks]);

  React.useEffect(() => {
    localStorage.setItem('gce_it_semester_results', JSON.stringify(semesterResults));
  }, [semesterResults]);

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

  // Initial load from backend
  React.useEffect(() => {
    staffApi.getStudyMaterials().then(res => {
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStudyMaterials(res.data);
      }
    }).catch(() => {});

    studentApi.getCertificates().then(res => {
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCertificates(res.data);
      }
    }).catch(() => {});

    studentApi.getAchievements().then(res => {
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setAchievements(res.data);
      }
    }).catch(() => {});

    if (messagingApi && messagingApi.getMessages) {
      messagingApi.getMessages().then(res => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setMessages(res.data);
        }
      }).catch(() => {});
    }
  }, []);

  // Login handler
  const login = async (role, userId, password) => {
    // 1. Try Backend API first if enabled
    try {
      const backendRes = await authApi.login(role, userId, password);
      if (backendRes && backendRes.user) {
        setCurrentUser(backendRes.user);
        if (backendRes.user.role === 'student') {
          setStudentProfile(prev => ({
            ...prev,
            ...backendRes.user,
            name: backendRes.user.name,
            rollNo: backendRes.user.rollNo || backendRes.user.id
          }));
        }
        showToast(`Welcome back, ${backendRes.user.name}!`, 'success');
        return true;
      }
    } catch (err) {
      // Continue to local validation
    }

    // 2. Validate against institutional credentials
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
        avatar: '👨‍🎓',
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
          ...f,
          avatar: '👨‍🏫'
        };
      }
    } else if (role === 'hod') {
      const h = (hodList && hodList.find(item => item.id.toLowerCase() === trimmedId.toLowerCase() || trimmedId.toLowerCase() === 'hod')) || hodList?.[0];
      if (h && (trimmedId.toLowerCase() === h.id.toLowerCase() || trimmedId.toLowerCase() === 'hod')) {
        foundUser = {
          role: 'hod',
          ...h,
          avatar: '🎓'
        };
      }
    } else if (role === 'admin') {
      if (trimmedId.toLowerCase() === 'itadmin01') {
        foundUser = {
          role: 'admin',
          id: 'ITADMIN01',
          name: 'Er. M. Senthil Kumar',
          email: 'admin.it@gceerode.ac.in',
          avatar: '⚙️'
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
      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        action: "User Login",
        user: `${foundUser.id} (${foundUser.name})`,
        role: role.toUpperCase(),
        ip: "192.168.1.100",
        timestamp: "Just now",
        status: "Success"
      };
      setAuditLogs(prev => [newLog, ...prev]);
      showToast(`Welcome back, ${foundUser.name}!`, 'success');
      return true;
    } else {
      showToast(`Invalid ${role.toUpperCase()} ID or account not registered.`, 'error');
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
  const submitAssignment = async (asnId, fileName, fileData) => {
    try {
      await studentApi.submitAssignment(asnId, currentUser?.id, { fileName, ...fileData });
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
      const res = await studentApi.addAchievement(achievement);
      if (res && res.data) {
        setAchievements(prev => [res.data, ...prev.filter(a => a.id !== res.data.id)]);
        showToast('Achievement recorded successfully!', 'success');
        return res.data;
      }
    } catch (e) {}

    const newAch = {
      id: `ACH-${Date.now().toString().slice(-4)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      ...(achievement instanceof FormData ? {
        title: achievement.get('title') || 'Student Achievement',
        description: achievement.get('description') || '',
        category: achievement.get('category') || 'Achievement'
      } : achievement)
    };
    setAchievements(prev => [newAch, ...prev]);
    showToast('Achievement recorded successfully!', 'success');
    return newAch;
  };

  const deleteAchievement = async (id) => {
    try {
      await studentApi.deleteAchievement(id);
    } catch (e) {}
    setAchievements(prev => prev.filter(a => a.id !== id));
    showToast('Achievement deleted successfully!', 'info');
  };

  const addCertificate = async (cert) => {
    try {
      const res = await studentApi.addCertificate(cert);
      if (res && res.data) {
        setCertificates(prev => [res.data, ...prev.filter(c => c.id !== res.data.id)]);
        showToast('Certificate uploaded successfully!', 'success');
        return res.data;
      }
    } catch (e) {}

    const newCert = {
      id: `CERT-${Date.now().toString().slice(-4)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      ...(cert instanceof FormData ? { name: cert.get('title') || 'Certificate' } : cert)
    };
    setCertificates(prev => [newCert, ...prev]);
    showToast('Certificate uploaded successfully!', 'success');
    return newCert;
  };

  const deleteCertificate = async (id) => {
    try {
      await studentApi.deleteCertificate(id);
    } catch (e) {}
    setCertificates(prev => prev.filter(c => c.id !== id));
    showToast('Certificate deleted successfully!', 'info');
  };

  // Staff & Admin Actions
  const addStudyMaterial = async (material) => {
    let savedMat = null;
    try {
      const res = await staffApi.uploadStudyMaterial(material);
      if (res && res.data) {
        savedMat = res.data;
      }
    } catch (e) {}

    const newMat = savedMat || {
      id: `MAT-${Date.now().toString().slice(-4)}`,
      downloads: 0,
      date: new Date().toISOString().split('T')[0],
      ...(typeof FormData !== 'undefined' && material instanceof FormData ? {} : material)
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

  // Internal Marks Batch Editor (Staff only)
  const updateInternalMarksBatch = async (subjectCode, examType, marksList) => {
    try {
      await staffApi.saveInternalMarksBatch(subjectCode, examType, marksList);
    } catch (e) {}

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

  // Semester Results Editor (Staff / HOD)
  const updateSemesterResults = (rollNo, semesterKey, newCourseResult) => {
    setSemesterResults(prev => {
      const copy = { ...prev };
      if (copy[semesterKey]) {
        copy[semesterKey] = {
          ...copy[semesterKey],
          courses: copy[semesterKey].courses.map(c => 
            c.code === newCourseResult.code ? { ...c, ...newCourseResult } : c
          )
        };
      }
      return copy;
    });
    showToast(`Semester result updated for ${newCourseResult.code}!`, 'success');
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

  // Student CRUD (Class Advisor Privilege)
  const addStudent = async (studentData) => {
    const roll = (studentData.rollNo || '').trim().toUpperCase();
    const newStudent = {
      arrears: 0,
      status: "Active",
      pass: "1234",
      ...studentData,
      rollNo: roll,
      regNo: studentData.regNo || `7304${studentData.year || 2}4205${roll.slice(-3) || '001'}`,
      email: studentData.email || `${roll.toLowerCase()}@gceerode.ac.in`
    };

    try {
      await adminApi.createStudent(newStudent);
    } catch (e) {}

    setStudents(prev => {
      const idx = prev.findIndex(s => (s.rollNo || '').toUpperCase() === roll);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...newStudent };
        return copy;
      }
      return [newStudent, ...prev];
    });
    showToast(`Student ${newStudent.name} (${newStudent.rollNo}) enrolled! Credentials auto-generated (Pass: 1234)`, 'success');
    return newStudent;
  };

  const updateStudent = async (rollNo, updatedData) => {
    try {
      await adminApi.updateStudent(rollNo, updatedData);
    } catch (e) {}

    setStudents(prev => prev.map(s => (s.rollNo || '').toUpperCase() === rollNo.toUpperCase() ? { ...s, ...updatedData } : s));
    showToast(`Student record for ${rollNo} updated and saved!`, 'success');
  };

  const deleteStudent = async (rollNo) => {
    try {
      await adminApi.deleteStudent(rollNo);
    } catch (e) {}

    setStudents(prev => prev.filter(s => (s.rollNo || '').toUpperCase() !== rollNo.toUpperCase()));
    showToast(`Student record ${rollNo} deleted from department roster.`, 'info');
  };

  // Faculty CRUD (Exclusively governed by HOD)
  const addFaculty = async (facultyData) => {
    const newFaculty = {
      id: facultyData.id || `ITSTAFF${(facultyList.length + 1).toString().padStart(2, '0')}`,
      publications: facultyData.publications || 0,
      ...facultyData
    };

    try {
      await hodApi.createFaculty(newFaculty);
    } catch (e) {}

    setFacultyList(prev => [...prev, newFaculty]);
    showToast(`Faculty member ${newFaculty.name} added by HOD!`, 'success');
    return newFaculty;
  };

  const updateFaculty = async (facultyId, updatedData) => {
    try {
      if (staffApi && staffApi.updateFacultyProfile) {
        await staffApi.updateFacultyProfile(facultyId, updatedData);
      } else if (hodApi && hodApi.updateFaculty) {
        await hodApi.updateFaculty(facultyId, updatedData);
      }
    } catch (e) {
      console.warn('Backend updateFaculty error:', e);
    }

    setFacultyList(prev => prev.map(f => f.id === facultyId ? { ...f, ...updatedData } : f));
    setCurrentUser(prev => (prev && prev.id === facultyId) ? { ...prev, ...updatedData } : prev);
    showToast(`Faculty record for ${updatedData.name || facultyId} updated!`, 'success');
  };

  const deleteFaculty = async (id) => {
    try {
      await hodApi.deleteFaculty(id);
    } catch (e) {}

    setFacultyList(prev => prev.filter(f => f.id !== id));
    showToast(`Faculty record removed by HOD.`, 'info');
  };

  // Class Advisor assignment (Exclusively governed by HOD)
  const updateClassAdvisor = async (year, staffId) => {
    const yNum = Number(year);
    const staffMember = facultyList.find(f => f.id === staffId);
    if (!staffMember) return;

    try {
      await hodApi.updateClassAdvisor(yNum, staffId);
    } catch (e) {}

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

    // Update faculty's classAdvisorFor flag
    setFacultyList(prev => prev.map(f => {
      if (f.id === staffId) {
        return { ...f, classAdvisorFor: yNum, classAdvisorLabel: `Class Advisor - Year ${yNum}` };
      } else if (f.classAdvisorFor === yNum) {
        return { ...f, classAdvisorFor: null, classAdvisorLabel: null };
      }
      return f;
    }));

    showToast(`${staffMember.name} assigned as Class Advisor for Year ${yNum}!`, 'success');
  };

  // HOD Governance Actions (Admin Feature - Sole Authority to add and edit HODs)
  const addHOD = async (hodData) => {
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
      await adminApi.createHOD(newHOD);
    } catch (e) {}

    setHodList(prev => [...prev, newHOD]);
    showToast(`New Head of Department ${newHOD.name} registered by Admin!`, 'success');
    return newHOD;
  };

  const updateHOD = async (hodData, id) => {
    const targetId = id || hodData.id || 'ITHOD01';
    try {
      await adminApi.updateHOD(hodData, targetId);
    } catch (e) {}

    setHodList(prev => prev.map(h => h.id.toUpperCase() === targetId.toUpperCase() ? { ...h, ...hodData } : h));

    if (currentUser && currentUser.role === 'hod' && (currentUser.id.toUpperCase() === targetId.toUpperCase())) {
      setCurrentUser(prev => ({ ...prev, ...hodData }));
    }

    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      action: "HOD Profile Updated",
      user: `${currentUser?.id || 'ITADMIN01'} (${currentUser?.name || 'Administrator'})`,
      role: "ADMIN",
      ip: "192.168.1.100",
      timestamp: "Just now",
      status: "Success"
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast(`HOD profile for ${hodData.name || targetId} updated successfully!`, 'success');
  };

  const deleteHOD = async (id) => {
    if (hodList.length <= 1) {
      showToast('Cannot delete the sole HOD. At least one HOD must remain.', 'error');
      return;
    }
    try {
      await adminApi.deleteHOD(id);
    } catch (e) {}

    setHodList(prev => prev.filter(h => h.id.toUpperCase() !== id.toUpperCase()));
    showToast(`HOD account ${id} removed by Admin.`, 'info');
  };

  const changeHOD = async (newHODData) => {
    return addHOD(newHODData);
  };

  // Messaging System
  const sendMessage = async (messageData) => {
    let newMsg = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      read: false,
      status: messageData.type === 'Request' ? 'Pending' : 'Delivered',
      fromId: currentUser?.id || 'ITSTAFF01',
      fromName: currentUser?.name || 'Faculty Member',
      fromRole: currentUser?.role || 'staff',
      ...messageData
    };

    try {
      if (messagingApi && messagingApi.sendMessage) {
        const res = await messagingApi.sendMessage(newMsg);
        if (res && res.data) {
          newMsg = { ...newMsg, ...res.data };
        }
      }
    } catch (err) {
      console.warn('Backend message persist error, stored locally:', err);
    }

    setMessages(prev => [newMsg, ...prev]);

    // Dispatch toast notification
    const recipientText = messageData.toName || messageData.toId;
    if (messageData.type === 'Request') {
      showToast(`Request submitted to ${recipientText}!`, 'success');
    } else if (messageData.type === 'Broadcast') {
      showToast(`Department-wide circular broadcasted!`, 'success');
    } else {
      showToast(`Direct message sent to ${recipientText}!`, 'success');
    }
    return newMsg;
  };

  const updateMessageStatus = async (msgId, status) => {
    try {
      if (messagingApi && messagingApi.updateMessageStatus) {
        await messagingApi.updateMessageStatus(msgId, status);
      }
    } catch (err) {
      console.warn('Backend updateMessageStatus error:', err);
    }
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status, read: true } : m));
    showToast(`Request marked as ${status}`, 'info');
  };

  const markMessageRead = (msgId) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m));
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
    setSemesterResults(INITIAL_SEMESTER_RESULTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setStudyMaterials(INITIAL_STUDY_MATERIALS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setCertificates(INITIAL_CERTIFICATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFacultyList(INITIAL_FACULTY_LIST);
    setClassAdvisors(INITIAL_CLASS_ADVISORS);
    setMessages(INITIAL_MESSAGES);
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
    semesterResults,
    timetable: INITIAL_TIMETABLE,
    studyMaterials,
    assignments,
    facultyList,
    hodList,
    classAdvisors,
    messages,
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
    deleteAchievement,
    addCertificate,
    deleteCertificate,
    addStudyMaterial,
    createAssignment,
    gradeAssignment,
    updateInternalMarksBatch,
    updateSemesterResults,
    addAnnouncement,
    addStudent,
    updateStudent,
    deleteStudent,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    updateClassAdvisor,
    addHOD,
    updateHOD,
    deleteHOD,
    changeHOD,
    sendMessage,
    updateMessageStatus,
    markMessageRead,
    markAllNotificationsRead,
    resetAllData
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthContext, AuthProvider, useAuth };
}
if (typeof window !== 'undefined') {
  window.ITAuthContext = { ...(window.ITAuthContext || {}), AuthContext, AuthProvider, useAuth };
}
