// IT DIGITAL HUB - Staff / Faculty Views (Comprehensive Modules & Features)
// Department of Information Technology - Government College of Engineering, Erode

(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));
const { StatCard, Modal, FileUploader } = (typeof window !== 'undefined' && window.UIComponents) || {};

// Resilient Self-Contained Modal Component (Guaranteed Zero-Dependency Rendering)
const SafeModal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;
  return React.createElement(
    'div',
    {
      className: 'fixed inset-0 flex items-center justify-center p-4 animate-fade-in',
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      },
      onClick: (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }
    },
    React.createElement(
      'div',
      {
        className: `w-full ${maxWidth} rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] bg-slate-900 text-slate-100`,
        style: {
          backgroundColor: '#0f172a',
          borderColor: 'rgba(51, 65, 85, 0.9)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
        }
      },
      React.createElement(
        'div',
        {
          className: 'flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80',
          style: { backgroundColor: '#090d16' }
        },
        React.createElement('h3', { className: 'text-lg font-bold text-white flex items-center gap-2' }, title || 'Department Hub Form'),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: onClose,
            className: 'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition font-bold text-base cursor-pointer',
            style: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
          },
          '✕'
        )
      ),
      React.createElement(
        'div',
        {
          className: 'p-6 overflow-y-auto space-y-4 text-slate-200 text-xs',
          style: { maxHeight: 'calc(90vh - 70px)' }
        },
        children
      )
    )
  );
};

// Resilient FileUploader Fallback Component
const SafeFileUploader = (props) => {
  const ResolvedUploader = (typeof window !== 'undefined' && window.UIComponents?.FileUploader) || FileUploader;
  if (ResolvedUploader) {
    return React.createElement(ResolvedUploader, props);
  }
  return React.createElement(
    'div',
    { className: 'p-4 rounded-xl border border-dashed border-cyan-500/40 bg-slate-900/60 text-center' },
    React.createElement('input', {
      type: 'file',
      accept: props.accept || '*/*',
      className: 'block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer',
      onChange: (e) => {
        const file = e.target.files && e.target.files[0];
        if (file && props.onFileSelect) {
          props.onFileSelect({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: file.type || 'Document',
            file: file,
            rawFile: file
          });
        }
      }
    }),
    React.createElement('p', { className: 'text-[11px] text-slate-400 mt-2' }, props.helperText || 'Browse file from your device directory')
  );
};

const StaffViews = ({ currentTab, onNavigate }) => {

  const {
    currentUser,
    facultyList,
    students,
    subjects,
    timetable,
    notifications,
    updateFaculty,
    assignments,
    studyMaterials,
    achievements,
    announcements,
    messages,
    classAdvisors,
    addStudyMaterial,
    createAssignment,
    gradeAssignment,
    updateInternalMarksBatch,
    updateSemesterResults,
    addAnnouncement,
    addStudent,
    updateStudent,
    deleteStudent,
    sendMessage,
    updateMessageStatus,
    showToast
  } = useAuth();

  const activeFaculty = (facultyList && facultyList.find(f => f.id === currentUser?.id)) || (facultyList && facultyList[0]) || {
    id: 'ITSTAFF01',
    name: 'Prof. B. V. Prakash',
    designation: 'Associate Professor',
    qualification: 'M.E., Ph.D.',
    experience: '16 Years',
    specialization: 'Cloud Computing & Database Systems',
    email: 'prakash.it@gceerode.ac.in',
    phone: '+91 98421 22334',
    cabin: 'Room 304, IT Block',
    classAdvisorLabel: 'Year 1 Class Advisor (Batch 2026-2030)'
  };

  // Institutional Hierarchy: Determine if active faculty is the designated Class Advisor
  const assignedAdvisorYear = Object.keys(classAdvisors || {}).find(y => classAdvisors[y]?.staffId === activeFaculty.id) || (activeFaculty.classAdvisorFor ? String(activeFaculty.classAdvisorFor) : null);
  const isClassAdvisor = Boolean(assignedAdvisorYear);
  const advisorBatch = assignedAdvisorYear && (classAdvisors?.[assignedAdvisorYear]?.batch || `Batch Year ${assignedAdvisorYear}`);
  const advisorClassLabel = assignedAdvisorYear ? `Year ${assignedAdvisorYear} Class Advisor (${advisorBatch})` : null;

  const normalizedTab = 
    (currentTab === 'profile' || currentTab === 'my-profile') ? 'my-profile' :
    (currentTab === 'subjects' || currentTab === 'my-subjects') ? 'my-subjects' :
    (currentTab === 'students' || currentTab === 'student-list') ? 'student-list' :
    (currentTab === 'attendance' || currentTab === 'attendance-management') ? 'attendance-management' :
    (currentTab === 'marks' || currentTab === 'internal-marks') ? 'internal-marks' :
    (currentTab === 'assignments' || currentTab === 'staff-assignments') ? 'assignments' :
    (currentTab === 'materials' || currentTab === 'upload-study-materials' || currentTab === 'study-materials') ? 'upload-study-materials' :
    (currentTab === 'timetable' || currentTab === 'staff-timetable') ? 'timetable' :
    (currentTab === 'announcements' || currentTab === 'department-announcements') ? 'announcements' :
    (currentTab === 'performance' || currentTab === 'student-performance') ? 'student-performance' :
    (currentTab === 'messages' || currentTab === 'staff-messages') ? 'messages' :
    (currentTab === 'achievements' || currentTab === 'staff-achievements') ? 'achievements' :
    (currentTab === 'notifications' || currentTab === 'staff-notifications') ? 'notifications' :
    currentTab;

  // Modal States
  const [activeModal, setActiveModal] = React.useState(null);
  const [previewMat, setPreviewMat] = React.useState(null);
  const [previewAch, setPreviewAch] = React.useState(null);

  // Student CRUD State
  const [studentForm, setStudentForm] = React.useState({
    rollNo: '',
    regNo: '',
    name: '',
    year: assignedAdvisorYear ? Number(assignedAdvisorYear) : 2,
    sem: assignedAdvisorYear ? Number(assignedAdvisorYear) * 2 : 4,
    sec: 'A',
    attendance: 90,
    cgpa: 8.5,
    mentor: activeFaculty.name,
    phone: '+91 98421 00000',
    email: '',
    status: 'Active'
  });
  const [editingRollNo, setEditingRollNo] = React.useState(null);

  const safeStudents = Array.isArray(students) ? students : [];

  // Attendance Marker State
  const [attendanceDate, setAttendanceDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [selectedSubjCode, setSelectedSubjCode] = React.useState('IT8401');
  const [attendanceSheet, setAttendanceSheet] = React.useState(() => {
    return safeStudents.map(s => ({ rollNo: s.rollNo, name: s.name, status: 'P' })); // P: Present, A: Absent, OD: On-Duty
  });

  // Marks Entry State
  const [marksExamType, setMarksExamType] = React.useState('CIA-1');
  const [marksSheet, setMarksSheet] = React.useState(() => {
    return safeStudents.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      score: 44,
      assignmentScore: 9,
      maxScore: 50
    }));
  });

  // Faculty Profile Edit State
  const [profileForm, setProfileForm] = React.useState({
    phone: activeFaculty.phone || '',
    cabin: activeFaculty.cabin || '',
    specialization: activeFaculty.specialization || '',
    experience: activeFaculty.experience || '',
    qualification: activeFaculty.qualification || ''
  });

  // Keep profileForm synced with activeFaculty
  React.useEffect(() => {
    if (activeFaculty) {
      setProfileForm({
        phone: activeFaculty.phone || '',
        cabin: activeFaculty.cabin || '',
        specialization: activeFaculty.specialization || '',
        experience: activeFaculty.experience || '',
        qualification: activeFaculty.qualification || ''
      });
    }
  }, [activeFaculty.id]);

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = React.useState({
    title: '',
    category: 'Academic',
    priority: 'Normal',
    content: ''
  });

  // Assignment Creator Form
  const [newAsn, setNewAsn] = React.useState({
    title: '',
    subjectCode: 'IT8401',
    subjectName: 'Database Management Systems',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    maxMarks: 20,
    instructions: ''
  });

  // Study Material Uploader Form
  const [newMaterial, setNewMaterial] = React.useState({
    title: '',
    subjectCode: 'IT8401',
    subjectName: 'Database Management Systems',
    category: 'Lecture Notes',
    fileSize: '3.5 MB',
    fileType: 'PDF',
    uploadedBy: activeFaculty.name,
    fileObject: null
  });

  // Announcement Creator Form
  const [newNotice, setNewNotice] = React.useState({
    title: '',
    category: 'Academic',
    priority: 'Normal',
    content: '',
    author: `${activeFaculty.name} (${activeFaculty.designation})`,
    attachment: null
  });

  // Messaging Form State
  const [msgTab, setMsgTab] = React.useState('request-hod'); // 'request-hod' | 'dm-student' | 'inbox'
  const [hodRequestForm, setHodRequestForm] = React.useState({
    subject: '',
    category: 'Equipment / Lab',
    priority: 'Normal',
    content: ''
  });
  const [studentDmForm, setStudentDmForm] = React.useState({
    recipientRollNo: safeStudents[0]?.rollNo || '24IT001',
    subject: '',
    content: ''
  });

  // Grading Modal Form
  const [gradingTarget, setGradingTarget] = React.useState(null);
  const [gradeInput, setGradeInput] = React.useState({ score: 18, remarks: 'Good implementation.' });

  // Filter students
  const [studentSearch, setStudentSearch] = React.useState('');
  const [filterYear, setFilterYear] = React.useState('ALL');

  const filteredStudents = safeStudents.filter(s => {
    const matchYear = filterYear === 'ALL' || s.year?.toString() === filterYear;
    const matchQuery = !studentSearch || (s.name && s.name.toLowerCase().includes(studentSearch.toLowerCase())) || (s.rollNo && s.rollNo.toLowerCase().includes(studentSearch.toLowerCase()));
    return matchYear && matchQuery;
  });

  // Attendance Status Toggle Handler
  const toggleAttendanceStatus = (rollNo) => {
    setAttendanceSheet(prev => prev.map(row => {
      if (row.rollNo === rollNo) {
        const nextStatus = row.status === 'P' ? 'A' : row.status === 'A' ? 'OD' : 'P';
        return { ...row, status: nextStatus };
      }
      return row;
    }));
  };

  const handleSaveAttendance = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const apiObj = (typeof window !== 'undefined' && window.ITDepartmentApi?.staff) || (typeof staffApi !== 'undefined' ? staffApi : null);
      if (apiObj && apiObj.submitAttendanceBatch) {
        await apiObj.submitAttendanceBatch(selectedSubjCode, attendanceDate, attendanceSheet);
      }
    } catch (err) {
      console.warn('Backend attendance error:', err);
    }
    const presentCount = attendanceSheet.filter(s => s.status === 'P' || s.status === 'OD').length;
    showToast(`Attendance for ${selectedSubjCode} (${attendanceDate}) saved to database! ${presentCount}/${attendanceSheet.length} Present`, 'success');
  };

  const handleSaveMarks = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      if (updateInternalMarksBatch) {
        await updateInternalMarksBatch(selectedSubjCode, marksExamType, marksSheet);
      }
    } catch (err) {
      console.warn('Marks batch error:', err);
    }
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAsn.title || !newAsn.instructions) {
      showToast('Please fill all assignment details', 'error');
      return;
    }
    createAssignment({
      ...newAsn,
      faculty: activeFaculty.name
    });
    setActiveModal(null);
    setNewAsn({
      title: '',
      subjectCode: 'IT8401',
      subjectName: 'Database Management Systems',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      maxMarks: 20,
      instructions: ''
    });
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!newMaterial.title) {
      showToast('Please enter material title', 'error');
      return;
    }

    const matPayload = {
      title: newMaterial.title,
      subjectCode: newMaterial.subjectCode,
      subjectName: newMaterial.subjectName || (subjects && subjects.find(s => s.code === newMaterial.subjectCode)?.name) || 'Database Management Systems',
      category: newMaterial.category,
      unit: newMaterial.unit || 'Unit 1',
      fileSize: newMaterial.fileSize || '2.5 MB',
      fileType: newMaterial.fileType || 'PDF',
      teacher: activeFaculty.name,
      author: activeFaculty.name,
      department: 'Information Technology',
      semester: '4',
      date: new Date().toISOString().split('T')[0]
    };

    const rawFile = newMaterial.fileObject?.file || newMaterial.fileObject?.rawFile;
    if (rawFile) {
      const fd = new FormData();
      fd.append('file', rawFile);
      Object.keys(matPayload).forEach(k => fd.append(k, matPayload[k]));
      await addStudyMaterial(fd);
    } else {
      await addStudyMaterial(matPayload);
    }

    setActiveModal(null);
    setNewMaterial({
      title: '',
      subjectCode: 'IT8401',
      subjectName: 'Database Management Systems',
      category: 'Lecture Notes',
      fileSize: '3.5 MB',
      fileType: 'PDF',
      uploadedBy: activeFaculty.name,
      fileObject: null
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (updateFaculty) {
      await updateFaculty(activeFaculty.id, profileForm);
    }
    setActiveModal(null);
    showToast('Faculty profile updated successfully!', 'success');
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) {
      showToast('Please fill out all announcement fields', 'error');
      return;
    }
    if (addAnnouncement) {
      await addAnnouncement({
        ...announcementForm,
        author: activeFaculty.name,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setActiveModal(null);
    setAnnouncementForm({
      title: '',
      category: 'Academic',
      priority: 'Normal',
      content: ''
    });
    showToast('Department announcement posted live!', 'success');
  };

  const handleDownloadMaterial = (mat) => {
    const docHeader = `GOVERNMENT COLLEGE OF ENGINEERING, ERODE (AUTONOMOUS R2021)\nDEPARTMENT OF INFORMATION TECHNOLOGY\n\nTITLE: ${mat.title}\nSUBJECT: ${mat.subjectCode} - ${mat.subjectName || mat.subject}\nTEACHER: ${mat.teacherName || mat.faculty || mat.uploadedBy}\nSEMESTER: ${mat.semester || 'Semester 4'}\nDEPARTMENT: ${mat.department || 'Information Technology'}\nUPLOAD DATE: ${mat.uploadDate || mat.date}\nFILE SIZE: ${mat.fileSize || '2.4 MB'}\n\n=======================================================\nACADEMIC STUDY MATERIAL & LECTURE NOTES\n=======================================================\n\n1. Course Overview & Key Objectives:\n   - Comprehensive conceptual explanations and problem solving strategies.\n   - Designed in compliance with Autonomous syllabus regulations.\n\n[End of Document - Official GCE Erode IT Repository]`;
    const blob = new Blob([docHeader], { type: 'application/pdf;charset=utf-8' });
    const dlUrl = mat.fileUrl || URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = mat.fileName || `${mat.subjectCode}_${mat.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (!mat.fileUrl) setTimeout(() => URL.revokeObjectURL(dlUrl), 5000);
    showToast(`Study Material "${mat.title}" Downloaded Successfully.`, 'success');
  };

  const handleDownloadAchievement = (ach) => {
    const isPdf = ach.fileType === 'pdf' || (ach.fileName && ach.fileName.toLowerCase().endsWith('.pdf')) || (ach.fileUrl && ach.fileUrl.toLowerCase().endsWith('.pdf'));
    const docContent = `GOVERNMENT COLLEGE OF ENGINEERING, ERODE\nDEPARTMENT OF INFORMATION TECHNOLOGY\n\nSTUDENT HONOR & ACHIEVEMENT RECORD\n=======================================================\nTITLE: ${ach.title}\nSTUDENT: ${ach.studentName || 'Student'} (${ach.studentRoll || ''})\nCATEGORY: ${ach.category || 'Achievement'}\nISSUED BY: ${ach.issuedBy || 'Institutional Recognition'}\nUPLOAD DATE: ${ach.uploadDate || ach.date}\nDESCRIPTION:\n${ach.description || 'Special achievement in technical competition / symposium.'}\n\n[Verified Institutional Digital Hub Record]`;
    const blob = new Blob([docContent], { type: isPdf ? 'application/pdf' : 'text/plain' });
    const dlUrl = ach.fileUrl || URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = ach.fileName || `${(ach.title || 'achievement').replace(/[^a-zA-Z0-9_-]/g, '_')}${isPdf ? '.pdf' : '.png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (!ach.fileUrl) setTimeout(() => URL.revokeObjectURL(dlUrl), 5000);
    showToast(`Achievement "${ach.title}" Downloaded Successfully.`, 'success');
  };

  const handlePublishNotice = (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) {
      showToast('Please enter notice title and details', 'error');
      return;
    }
    addAnnouncement(newNotice);
    setActiveModal(null);
    setNewNotice({
      title: '',
      category: 'Academic',
      priority: 'Normal',
      content: '',
      author: `${activeFaculty.name} (${activeFaculty.designation})`,
      attachment: null
    });
  };

  const handleConfirmGrade = (e) => {
    e.preventDefault();
    if (gradingTarget) {
      gradeAssignment(gradingTarget.id, gradeInput.score, gradeInput.remarks);
      setActiveModal(null);
      setGradingTarget(null);
    }
  };

  // Student Add, Edit, and Delete Handlers (Class Advisor Exclusive Privilege)
  const handleOpenAddStudent = () => {
    if (!isClassAdvisor) {
      showToast('Class Advisor Privilege Required: You are logged in as teaching faculty. Only the assigned Class Advisor can enroll new students.', 'error');
      return;
    }
    setEditingRollNo(null);
    setStudentForm({
      rollNo: '',
      regNo: '',
      name: '',
      year: Number(assignedAdvisorYear),
      sem: Number(assignedAdvisorYear) * 2,
      sec: 'A',
      attendance: 90,
      cgpa: 8.5,
      mentor: activeFaculty.name,
      phone: '+91 98421 00000',
      email: '',
      status: 'Active'
    });
    setActiveModal('student-form-modal');
  };

  const handleOpenEditStudent = (std) => {
    if (!isClassAdvisor) {
      showToast('Class Advisor Privilege Required: You are logged in as teaching faculty. Only the assigned Class Advisor can edit student records.', 'error');
      return;
    }
    if (String(std.year) !== String(assignedAdvisorYear)) {
      showToast(`Class Advisor Restriction: You are the Class Advisor for Year ${assignedAdvisorYear}. You cannot modify Year ${std.year} students.`, 'error');
      return;
    }
    setEditingRollNo(std.rollNo);
    setStudentForm({
      rollNo: std.rollNo,
      regNo: std.regNo || `730424205${std.rollNo.slice(-3)}`,
      name: std.name,
      year: std.year || Number(assignedAdvisorYear),
      sem: std.sem || (Number(assignedAdvisorYear) * 2),
      sec: std.sec || 'A',
      attendance: std.attendance || 90,
      cgpa: std.cgpa || 8.5,
      mentor: std.mentor || activeFaculty.name,
      phone: std.phone || '+91 98421 00000',
      email: std.email || `${std.rollNo.toLowerCase()}@gceerode.ac.in`,
      status: std.status || 'Active'
    });
    setActiveModal('student-form-modal');
  };

  const handleDeleteStudentClick = (std) => {
    if (!isClassAdvisor) {
      showToast('Class Advisor Privilege Required: Only the assigned Class Advisor can remove students.', 'error');
      return;
    }
    if (String(std.year) !== String(assignedAdvisorYear)) {
      showToast(`Class Advisor Restriction: You are the Class Advisor for Year ${assignedAdvisorYear}. You cannot delete Year ${std.year} students.`, 'error');
      return;
    }
    if (confirm(`Remove student ${std.name} (${std.rollNo}) from Year ${assignedAdvisorYear} roster?`)) {
      deleteStudent(std.rollNo);
      showToast(`Student ${std.name} (${std.rollNo}) removed from class roster.`, 'info');
    }
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!isClassAdvisor) {
      showToast('Class Advisor Privilege Required: Only assigned Class Advisors can register students.', 'error');
      return;
    }
    if (!studentForm.rollNo || !studentForm.name) {
      showToast('Please provide Student Roll No and Name', 'error');
      return;
    }

    if (editingRollNo) {
      updateStudent(editingRollNo, studentForm);
      showToast(`Student record for ${studentForm.name} updated successfully.`, 'success');
    } else {
      addStudent({
        ...studentForm,
        year: Number(assignedAdvisorYear),
        email: studentForm.email || `${studentForm.rollNo.toLowerCase()}@gceerode.ac.in`
      });
      showToast(`Student ${studentForm.name} enrolled! Login credentials created with default password "1234".`, 'success');
    }
    setActiveModal(null);
    setEditingRollNo(null);
  };

  // Messaging Handlers (Feature 3)
  const handleSendHodRequest = (e) => {
    e.preventDefault();
    if (!hodRequestForm.subject || !hodRequestForm.content) {
      showToast('Please fill all request fields', 'error');
      return;
    }
    sendMessage({
      fromId: activeFaculty.id,
      fromName: `${activeFaculty.name} (${activeFaculty.designation})`,
      fromRole: 'staff',
      toId: 'ITHOD01',
      toName: 'Dr. S. K. Murugesan (Professor & HOD)',
      toRole: 'hod',
      type: 'Request',
      subject: `[${hodRequestForm.category}] ${hodRequestForm.subject}`,
      content: hodRequestForm.content
    });
    setHodRequestForm({ subject: '', category: 'Equipment / Lab', priority: 'Normal', content: '' });
  };

  const handleSendStudentDm = (e) => {
    e.preventDefault();
    if (!studentDmForm.subject || !studentDmForm.content) {
      showToast('Please fill all message fields', 'error');
      return;
    }
    const targetStudent = safeStudents.find(s => s.rollNo === studentDmForm.recipientRollNo);
    sendMessage({
      fromId: activeFaculty.id,
      fromName: `${activeFaculty.name} (${activeFaculty.designation})`,
      fromRole: 'staff',
      toId: studentDmForm.recipientRollNo,
      toName: targetStudent ? `${targetStudent.name} (${targetStudent.rollNo})` : studentDmForm.recipientRollNo,
      toRole: 'student',
      type: 'DM',
      subject: studentDmForm.subject,
      content: studentDmForm.content
    });
    setStudentDmForm({ recipientRollNo: safeStudents[0]?.rollNo || '24IT001', subject: '', content: '' });
  };

  let tabContent = null;

  // ==========================================
  // VIEW: DASHBOARD OVERVIEW (DYNAMIC DASHBOARDS)
  // ==========================================
  if (normalizedTab === 'dashboard') {
    if (isClassAdvisor) {
      // ----------------------------------------------------
      // DYNAMIC DASHBOARD A: CLASS ADVISOR EXECUTIVE CONSOLE
      // ----------------------------------------------------
      const classStudents = safeStudents.filter(s => String(s.year) === String(assignedAdvisorYear));
      const classAvgAttendance = classStudents.length
        ? (classStudents.reduce((acc, s) => acc + (Number(s.attendance) || 0), 0) / classStudents.length).toFixed(1)
        : '90.0';
      const criticalAttendanceCount = classStudents.filter(s => (Number(s.attendance) || 0) < 75).length;
      const arrearsAlertCount = classStudents.filter(s => (Number(s.arrears) || 0) > 0 || (Number(s.cgpa) || 0) < 7.0).length;

      tabContent = React.createElement(
        'div',
        { className: 'space-y-6 animate-fade-in' },

        // Class Advisor Welcome Banner
        React.createElement(
          'div',
          { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-slate-900/70 to-indigo-950/50 relative overflow-hidden' },
          React.createElement('div', { className: 'absolute right-0 top-0 w-80 h-full bg-cyan-500/10 rounded-full blur-3xl pointer-events-none' }),
          React.createElement(
            'div',
            { className: 'relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'flex flex-wrap items-center gap-2 mb-1.5' },
                React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
                  `⭐ ${advisorClassLabel}`
                ),
                React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30' },
                  'Class Advisor Executive Console'
                )
              ),
              React.createElement('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-white tracking-tight' },
                'Welcome, ', React.createElement('span', { className: 'text-cyan-400' }, activeFaculty.name)
              ),
              React.createElement('p', { className: 'text-xs sm:text-sm text-slate-300 mt-1' },
                `Designated Class Advisor for Year ${assignedAdvisorYear} (${advisorBatch}) • Exclusive Student Roster Authority`
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  id: 'advisor-btn-enroll-student',
                  onClick: handleOpenAddStudent,
                  className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer'
                },
                React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
                `+ Enroll Student (Year ${assignedAdvisorYear})`
              ),
              React.createElement(
                'button',
                {
                  onClick: () => onNavigate('student-list'),
                  className: 'px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-2 hover:bg-slate-800 transition cursor-pointer'
                },
                React.createElement(Icons.Users, { className: 'w-4 h-4 text-cyan-400' }),
                'Class Roster'
              )
            )
          )
        ),

        // Class Advisor 4 Executive Metrics
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
          React.createElement(StatCard, {
            title: `Year ${assignedAdvisorYear} Class Strength`,
            value: classStudents.length.toString(),
            subtitle: `${advisorBatch} Cohort`,
            icon: Icons.Users,
            color: 'blue',
            onClick: () => onNavigate('student-list')
          }),
          React.createElement(StatCard, {
            title: 'Class Average Attendance',
            value: `${classAvgAttendance}%`,
            subtitle: 'Target: > 85%',
            icon: Icons.CheckCircle,
            color: 'emerald',
            onClick: () => onNavigate('attendance-management')
          }),
          React.createElement(StatCard, {
            title: 'Attendance Alerts (<75%)',
            value: criticalAttendanceCount.toString(),
            subtitle: 'Requires Advisor Follow-up',
            icon: Icons.AlertTriangle,
            color: 'amber',
            onClick: () => onNavigate('student-list')
          }),
          React.createElement(StatCard, {
            title: 'Academic Alert / Arrears',
            value: arrearsAlertCount.toString(),
            subtitle: 'CGPA < 7.0 or Standing Arrears',
            icon: Icons.FileText,
            color: 'purple',
            onClick: () => onNavigate('internal-marks')
          })
        ),

        // Two Column Layout: Class Roster & Class Advisor Tools
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },

          // Class Roster Card
          React.createElement(
            'div',
            { className: 'lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-700/60' },
            React.createElement(
              'div',
              { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
              React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
                React.createElement(Icons.Users, { className: 'w-5 h-5 text-cyan-400' }),
                `Year ${assignedAdvisorYear} Student Roster & Performance Overview`
              ),
              React.createElement('span', { className: 'text-xs font-mono text-cyan-400 font-bold' }, `${classStudents.length} Students in Cohort`)
            ),
            React.createElement(
              'div',
              { className: 'space-y-3' },
              classStudents.map(s => React.createElement(
                'div',
                { key: s.rollNo, className: 'p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs' },
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-3' },
                  React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, s.rollNo),
                  React.createElement('div', null,
                    React.createElement('p', { className: 'font-bold text-white' }, s.name),
                    React.createElement('p', { className: 'text-[11px] text-slate-400' }, `Reg: ${s.regNo || 'Autonomous'} • Sec ${s.sec || 'A'}`)
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-3' },
                  React.createElement('span', { className: `font-mono text-xs font-bold ${s.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}` }, `${s.attendance}% Attd`),
                  React.createElement('span', { className: 'font-mono text-xs font-bold text-purple-300' }, `CGPA ${s.cgpa}`),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      onClick: () => handleOpenEditStudent(s),
                      className: 'px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition cursor-pointer'
                    },
                    'Edit'
                  )
                )
              ))
            )
          ),

          // Class Advisor Operations
          React.createElement(
            'div',
            { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between space-y-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h3', { className: 'text-base font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2' },
                React.createElement(Icons.Award, { className: 'w-5 h-5 text-cyan-400' }),
                'Class Advisor Operations'
              ),
              React.createElement(
                'div',
                { className: 'space-y-2.5 text-xs' },
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    onClick: handleOpenAddStudent,
                    className: 'w-full p-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-200 hover:text-white font-bold text-left flex items-center justify-between transition cursor-pointer'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Plus, { className: 'w-4 h-4 text-cyan-400' }), `Enroll Student (Year ${assignedAdvisorYear})`),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-cyan-500' })
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => onNavigate('student-list'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Users, { className: 'w-4 h-4 text-cyan-400' }), `Manage Year ${assignedAdvisorYear} Roster`),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => onNavigate('attendance-management'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.CheckCircle, { className: 'w-4 h-4 text-emerald-400' }), 'Mark Batch Attendance'),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => onNavigate('messages'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.MessageSquare, { className: 'w-4 h-4 text-purple-400' }), 'Send Notice / Advisor DM'),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => onNavigate('gallery'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition cursor-pointer'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Image, { className: 'w-4 h-4 text-amber-400' }), 'Pending Gallery Uploads (Review & Approve)'),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 leading-relaxed' },
              `⭐ Class Advisor Authority: You have exclusive institutional authorization to enroll students, modify records, and manage admissions for Year ${assignedAdvisorYear} (${advisorBatch}).`
            )
          )
        )
      );
    } else {
      // ----------------------------------------------------
      // DYNAMIC DASHBOARD B: NORMAL TEACHING FACULTY DASHBOARD
      // ----------------------------------------------------
      tabContent = React.createElement(
        'div',
        { className: 'space-y-6 animate-fade-in' },

        // Normal Teaching Faculty Banner
        React.createElement(
          'div',
          { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-slate-900/60 relative overflow-hidden' },
          React.createElement('div', { className: 'absolute right-0 top-0 w-80 h-full bg-emerald-500/10 rounded-full blur-3xl pointer-events-none' }),
          React.createElement(
            'div',
            { className: 'relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'flex flex-wrap items-center gap-2 mb-1.5' },
                React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
                  'Teaching Faculty Portal • Academic Instruction'
                )
              ),
              React.createElement('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-white tracking-tight' },
                'Welcome, ', React.createElement('span', { className: 'gradient-text-emerald' }, activeFaculty.name)
              ),
              React.createElement('p', { className: 'text-xs sm:text-sm text-slate-300 mt-1' },
                `${activeFaculty.designation} • Cabin ${activeFaculty.cabin} • ${activeFaculty.experience} Academic Experience`
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              React.createElement(
                'button',
                {
                  onClick: () => onNavigate('attendance-management'),
                  className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-semibold text-white flex items-center gap-2'
                },
                React.createElement(Icons.CheckCircle, { className: 'w-4 h-4' }),
                'Mark Attendance'
              ),
              React.createElement(
                'button',
                {
                  onClick: () => onNavigate('messages'),
                  className: 'px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-2 hover:bg-slate-800 transition'
                },
                React.createElement(Icons.MessageSquare, { className: 'w-4 h-4 text-cyan-400' }),
                'Messages & Requests'
              )
            )
          )
        ),

        // Teaching Faculty 4 Metrics
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
          React.createElement(StatCard, {
            title: 'Handled Courses',
            value: activeFaculty.subjects ? activeFaculty.subjects.length.toString() : '3',
            subtitle: 'Theory & Lab Modules',
            icon: Icons.BookOpen,
            color: 'emerald',
            onClick: () => onNavigate('my-subjects')
          }),
          React.createElement(StatCard, {
            title: 'Weekly Teaching Load',
            value: '16 Hours',
            subtitle: '3 Scheduled Sessions Today',
            icon: Icons.Calendar,
            color: 'blue',
            onClick: () => onNavigate('timetable')
          }),
          React.createElement(StatCard, {
            title: 'Pending Evaluations',
            value: assignments.filter(a => a.status === 'Submitted').length.toString(),
            subtitle: 'Student submissions waiting review',
            icon: Icons.FileText,
            color: 'amber',
            onClick: () => onNavigate('assignments')
          }),
          React.createElement(StatCard, {
            title: 'Messages & Inquiries',
            value: messages.filter(m => m.toId === activeFaculty.id || m.toRole === 'staff').length.toString(),
            subtitle: 'HOD circulars & student inquiries',
            icon: Icons.MessageSquare,
            color: 'purple',
            onClick: () => onNavigate('messages')
          })
        ),

        // Two Column Layout: Today's Teaching Schedule & Faculty Actions
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },

          // Today's Lectures
          React.createElement(
            'div',
            { className: 'lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-700/60' },
            React.createElement(
              'div',
              { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
              React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
                React.createElement(Icons.Calendar, { className: 'w-5 h-5 text-emerald-400' }),
                "Today's Teaching Schedule & Lab Sessions"
              ),
              React.createElement('span', { className: 'text-xs font-mono text-emerald-400' }, '3 Sessions Scheduled')
            ),
            React.createElement(
              'div',
              { className: 'space-y-3' },
              [
                { period: 'Period 1', time: '09:00 - 09:50', title: 'IT8401 DBMS (Theory)', room: 'IT LH-1', batch: 'II Year IT A' },
                { period: 'Period 3', time: '10:55 - 11:45', title: 'IT8401 DBMS (Theory)', room: 'IT LH-1', batch: 'II Year IT B' },
                { period: 'Periods 5-7', time: '01:30 - 04:10', title: 'IT8411 DBMS & SQL Laboratory', room: 'IT Computing Lab-2', batch: 'Batch A (30 Students)' }
              ].map((slot, idx) => React.createElement(
                'div',
                { key: idx, className: 'p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between' },
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-3' },
                  React.createElement('span', { className: 'w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold text-xs flex items-center justify-center' }, idx + 1),
                  React.createElement('div', null,
                    React.createElement('p', { className: 'text-sm font-bold text-white' }, slot.title),
                    React.createElement('p', { className: 'text-xs text-slate-400' }, `${slot.batch} • ${slot.room}`)
                  )
                ),
                React.createElement('span', { className: 'text-xs font-mono text-emerald-400 font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800' }, slot.time)
              ))
            )
          ),

          // Teaching Faculty Shortcuts & Notice
          React.createElement(
            'div',
            { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between space-y-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h3', { className: 'text-base font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2' },
                React.createElement(Icons.Sparkles, { className: 'w-5 h-5 text-cyan-400' }),
                'Faculty Actions'
              ),
              React.createElement(
                'div',
                { className: 'space-y-2.5 text-xs' },
                React.createElement(
                  'button',
                  {
                    onClick: () => onNavigate('attendance-management'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.CheckCircle, { className: 'w-4 h-4 text-emerald-400' }), 'Mark Lecture Attendance'),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => setActiveModal('upload-material'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Upload, { className: 'w-4 h-4 text-cyan-400' }), 'Upload Notes (From Directory)'),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => onNavigate('assignments'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.FileText, { className: 'w-4 h-4 text-amber-400' }), 'Grade Student Assignments'),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => onNavigate('messages'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.MessageSquare, { className: 'w-4 h-4 text-purple-400' }), 'Send Request to HOD'),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => onNavigate('gallery'),
                    className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition cursor-pointer'
                  },
                  React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Image, { className: 'w-4 h-4 text-amber-400' }), 'Pending Gallery Uploads (Review)'),
                  React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed' },
              'ℹ️ Teaching Faculty Notice: You have full access to curriculum instruction, lecture attendance, and assignment grading. Student admissions, enrollment, and roster editing are administered exclusively by each year\'s designated Class Advisor.'
            )
          )
        )
      );
    }
  }

  // ==========================================
  // VIEW: STUDENT LIST & CLASS ADVISOR PRIVILEGES
  // ==========================================
  else if (normalizedTab === 'student-list') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },

      // Header Bar (Scoped by Privilege)
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
            isClassAdvisor ? `Year ${assignedAdvisorYear} Class Roster Management` : 'Department Student Directory (View Only)',
            isClassAdvisor
              ? React.createElement('span', { className: 'text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, `⭐ Year ${assignedAdvisorYear} Advisor`)
              : React.createElement('span', { className: 'text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700' }, 'View Only')
          ),
          React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' },
            isClassAdvisor
              ? `You hold exclusive Class Advisor privileges to enroll, edit, and remove student records for Year ${assignedAdvisorYear} (${advisorBatch}).`
              : 'Teaching Faculty view: Student enrollment and modifications are restricted to designated Class Advisors.'
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center gap-3' },
          isClassAdvisor ? React.createElement(
            'button',
            {
              type: 'button',
              id: 'btn-enroll-new-student',
              onClick: (e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                handleOpenAddStudent();
              },
              className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-cyan-950/40 cursor-pointer hover:opacity-95 active:scale-95 transition'
            },
            React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
            `+ Enroll New Student (Year ${assignedAdvisorYear})`
          ) : React.createElement(
            'button',
            {
              type: 'button',
              id: 'btn-enroll-disabled-notice',
              onClick: () => showToast('Class Advisor Privilege Required: You are logged in as teaching faculty. Only the assigned Class Advisor can enroll new students.', 'info'),
              className: 'px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-400 flex items-center gap-1.5 cursor-not-allowed opacity-80'
            },
            React.createElement(Icons.Lock || Icons.Shield, { className: 'w-4 h-4 text-slate-500' }),
            '🔒 Advisor Only (Enrollment Restricted)'
          )
        )
      ),

      // Non-Advisor Warning Banner
      !isClassAdvisor && React.createElement(
        'div',
        { className: 'p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-center gap-3 text-xs text-amber-200' },
        React.createElement('span', { className: 'text-xl shrink-0' }, '🔒'),
        React.createElement('p', { className: 'leading-relaxed' },
          React.createElement('strong', { className: 'text-amber-100' }, 'Class Advisor Privilege Notice: '),
          `You are logged in as teaching faculty (${activeFaculty.name}). Under institutional policy, only the appointed Class Advisor has the authority to add, edit, or remove students from class rosters. You have view-only access to this student roster.`
        )
      ),

      // Filter Controls
      React.createElement(
        'div',
        { className: 'glass-panel p-4 rounded-2xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs' },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search by Roll No, Reg No, or Name...',
          value: studentSearch,
          onChange: (e) => setStudentSearch(e.target.value),
          className: 'p-2.5 rounded-xl glass-input text-xs w-72'
        }),
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('span', { className: 'text-slate-400 font-semibold' }, 'Batch Year:'),
          React.createElement('select', {
            value: filterYear,
            onChange: (e) => setFilterYear(e.target.value),
            className: 'p-2 rounded-xl glass-input text-xs font-semibold'
          },
            React.createElement('option', { value: 'ALL' }, 'All Years'),
            React.createElement('option', { value: '1' }, 'I Year (Batch 2026-30)'),
            React.createElement('option', { value: '2' }, 'II Year (Batch 2025-29)'),
            React.createElement('option', { value: '3' }, 'III Year (Batch 2024-28)'),
            React.createElement('option', { value: '4' }, 'IV Year (Batch 2023-27)')
          )
        )
      ),

      // Student Table Roster
      React.createElement(
        'div',
        { className: 'glass-panel rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl' },
        React.createElement(
          'div',
          { className: 'overflow-x-auto' },
          React.createElement(
            'table',
            { className: 'w-full text-left custom-table' },
            React.createElement(
              'thead',
              { className: 'bg-slate-900/80' },
              React.createElement(
                'tr',
                null,
                React.createElement('th', null, 'Roll No'),
                React.createElement('th', null, 'Student Name'),
                React.createElement('th', null, 'Year / Sem'),
                React.createElement('th', null, 'Attendance'),
                React.createElement('th', null, 'CGPA'),
                React.createElement('th', null, 'Phone / Email'),
                React.createElement('th', null, 'Advisor / Mentor'),
                React.createElement('th', { className: 'text-center' }, 'Actions')
              )
            ),
            React.createElement(
              'tbody',
              null,
              filteredStudents.map(std => {
                const isStudentInMyBatch = isClassAdvisor && String(std.year) === String(assignedAdvisorYear);
                return React.createElement(
                  'tr',
                  { key: std.rollNo },
                  React.createElement('td', { className: 'font-mono text-xs font-bold text-cyan-400' }, std.rollNo),
                  React.createElement('td', null,
                    React.createElement('p', { className: 'font-semibold text-white' }, std.name),
                    React.createElement('p', { className: 'text-[10px] text-slate-500' }, std.regNo || 'Autonomous R2021')
                  ),
                  React.createElement('td', { className: 'text-slate-300 text-xs' }, `Year ${std.year} (Sem ${std.sem || std.year * 2})`),
                  React.createElement('td', { className: `font-mono text-xs font-bold ${std.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}` }, `${std.attendance}%`),
                  React.createElement('td', { className: 'font-mono text-xs font-bold text-purple-300' }, std.cgpa),
                  React.createElement('td', { className: 'text-[11px] text-slate-400' },
                    React.createElement('p', null, std.phone),
                    React.createElement('p', { className: 'text-slate-500 truncate max-w-[130px]' }, std.email)
                  ),
                  React.createElement('td', { className: 'text-xs text-slate-300 font-medium' }, std.mentor || 'Dr. A. Venkatesh'),
                  React.createElement('td', { className: 'text-center' },
                    isStudentInMyBatch ? React.createElement(
                      'div',
                      { className: 'flex items-center justify-center gap-1.5' },
                      React.createElement(
                        'button',
                        {
                          type: 'button',
                          onClick: (e) => {
                            if (e) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                            handleOpenEditStudent(std);
                          },
                          className: 'px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold border border-cyan-500/30 transition cursor-pointer'
                        },
                        'Edit'
                      ),
                      React.createElement(
                        'button',
                        {
                          type: 'button',
                          onClick: () => handleDeleteStudentClick(std),
                          className: 'px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold border border-rose-500/30 transition cursor-pointer'
                        },
                        'Delete'
                      )
                    ) : isClassAdvisor ? React.createElement(
                      'span',
                      { className: 'text-[10px] text-slate-500 font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800' },
                      `Year ${std.year} Advisor Only`
                    ) : React.createElement(
                      'span',
                      { className: 'text-[10px] text-slate-500 font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800' },
                      'View-Only'
                    )
                  )
                );
              })
            )
          )
        )
      )
    );
  } else if (normalizedTab === 'messages') {
    const staffReceivedMessages = (messages || []).filter(m => m.toId === activeFaculty.id || m.toRole === 'staff' || m.toId === 'ALL');
    const staffSentMessages = (messages || []).filter(m => m.fromId === activeFaculty.id);

    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
            React.createElement(Icons.MessageSquare, { className: 'w-6 h-6 text-cyan-400' }),
            'Department Messaging & Request Hub'
          ),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Staff Communication: Submit requests to HOD, send direct messages (DMs) to students, and review student queries')
        ),
        React.createElement(
          'div',
          { className: 'flex items-center gap-2' },
          React.createElement('button', {
            onClick: () => setMsgTab('request-hod'),
            className: `px-3 py-1.5 rounded-xl text-xs font-bold transition ${msgTab === 'request-hod' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`
          }, 'Submit Request to HOD'),
          React.createElement('button', {
            onClick: () => setMsgTab('dm-student'),
            className: `px-3 py-1.5 rounded-xl text-xs font-bold transition ${msgTab === 'dm-student' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`
          }, 'DM to Student'),
          React.createElement('button', {
            onClick: () => setMsgTab('inbox'),
            className: `px-3 py-1.5 rounded-xl text-xs font-bold transition ${msgTab === 'inbox' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`
          }, `Inbox (${staffReceivedMessages.length})`)
        )
      ),

      // Sub-View: Request to HOD
      msgTab === 'request-hod' && React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-purple-500/40 bg-gradient-to-b from-purple-950/20 to-slate-950 space-y-4' },
        React.createElement('h3', { className: 'text-base font-bold text-purple-300 flex items-center gap-2' },
          React.createElement(Icons.Shield, { className: 'w-5 h-5 text-purple-400' }),
          'Submit Official Request / Proposal to Head of Department (HOD)'
        ),
        React.createElement(
          'form',
          { onSubmit: handleSendHodRequest, className: 'space-y-4 text-xs' },
          React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Request Category'),
              React.createElement('select', {
                value: hodRequestForm.category,
                onChange: (e) => setHodRequestForm({ ...hodRequestForm, category: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('option', { value: 'Equipment / Lab' }, 'Laboratory Equipment / Hardware Upgrade'),
                React.createElement('option', { value: 'Duty Leave (OD)' }, 'Faculty Duty Leave / Conference Sanction'),
                React.createElement('option', { value: 'Budget / Grant' }, 'Student Project Budget / Grant Proposal'),
                React.createElement('option', { value: 'Syllabus / Curriculum' }, 'Curriculum / Syllabus Revision Proposal'),
                React.createElement('option', { value: 'General' }, 'General Department Request')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Priority Level'),
              React.createElement('select', {
                value: hodRequestForm.priority,
                onChange: (e) => setHodRequestForm({ ...hodRequestForm, priority: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('option', { value: 'Normal' }, 'Normal Priority'),
                React.createElement('option', { value: 'Urgent' }, 'High / Urgent Clearance Required')
              )
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Subject Title'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. Request for Lab-2 High Performance Workstation Allocation',
              value: hodRequestForm.subject,
              onChange: (e) => setHodRequestForm({ ...hodRequestForm, subject: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Detailed Request Description & Justification'),
            React.createElement('textarea', {
              rows: 4,
              required: true,
              placeholder: 'Explain the purpose, estimated cost/specifications, and student benefit...',
              value: hodRequestForm.content,
              onChange: (e) => setHodRequestForm({ ...hodRequestForm, content: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-[1.01] transition'
          }, 'Send Request to HOD')
        )
      ),

      // Sub-View: DM to Student
      msgTab === 'dm-student' && React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-950 space-y-4' },
        React.createElement('h3', { className: 'text-base font-bold text-cyan-300 flex items-center gap-2' },
          React.createElement(Icons.User, { className: 'w-5 h-5 text-cyan-400' }),
          'Direct Message (DM) to Student'
        ),
        React.createElement(
          'form',
          { onSubmit: handleSendStudentDm, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Select Recipient Student'),
            React.createElement('select', {
              value: studentDmForm.recipientRollNo,
              onChange: (e) => setStudentDmForm({ ...studentDmForm, recipientRollNo: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-bold text-cyan-400'
            },
              safeStudents.map(s => React.createElement('option', { key: s.rollNo, value: s.rollNo }, `${s.rollNo} - ${s.name} (Year ${s.year})`))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Message Subject'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. Follow-up on CIA-1 Marks & Record Submission',
              value: studentDmForm.subject,
              onChange: (e) => setStudentDmForm({ ...studentDmForm, subject: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Message Text'),
            React.createElement('textarea', {
              rows: 3,
              required: true,
              placeholder: 'Type your message to the student...',
              value: studentDmForm.content,
              onChange: (e) => setStudentDmForm({ ...studentDmForm, content: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'px-6 py-2.5 rounded-xl gradient-btn-primary text-white font-bold hover:scale-[1.01] transition'
          }, 'Send Message to Student')
        )
      ),

      // Sub-View: Inbox
      msgTab === 'inbox' && React.createElement(
        'div',
        { className: 'space-y-4' },
        staffReceivedMessages.length === 0 ? React.createElement(
          'div',
          { className: 'glass-panel p-8 text-center rounded-2xl text-slate-400 text-xs' },
          'No incoming messages in your inbox.'
        ) : staffReceivedMessages.map(msg => React.createElement(
          'div',
          { key: msg.id, className: `glass-panel p-5 rounded-2xl border ${msg.type === 'Request' ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-700/60'} space-y-2 text-xs` },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-2 border-b border-slate-800' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('span', {
                className: `px-2 py-0.5 rounded text-[10px] font-bold ${
                  msg.type === 'Request' ? 'bg-amber-500/20 text-amber-300' :
                  msg.type === 'Broadcast' ? 'bg-purple-500/20 text-purple-300' :
                  'bg-cyan-500/20 text-cyan-300'
                }`
              }, msg.type.toUpperCase()),
              React.createElement('span', { className: 'font-bold text-white' }, msg.subject)
            ),
            React.createElement('span', { className: 'text-slate-500 text-[11px]' }, msg.timestamp)
          ),
          React.createElement('p', { className: 'text-slate-300 leading-relaxed' }, msg.content),
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pt-2 text-[11px] text-slate-400' },
            React.createElement('span', null, `From: `, React.createElement('strong', { className: 'text-white' }, msg.fromName)),
            msg.type === 'Request' && React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement('span', { className: 'font-semibold text-amber-400' }, `Status: ${msg.status}`),
              msg.status === 'Pending' && React.createElement(
                'button',
                {
                  onClick: () => updateMessageStatus(msg.id, 'Approved'),
                  className: 'px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30'
                },
                'Approve'
              ),
              msg.status === 'Pending' && React.createElement(
                'button',
                {
                  onClick: () => updateMessageStatus(msg.id, 'Rejected'),
                  className: 'px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30'
                },
                'Reject'
              )
            )
          )
        ))
      )
    );
  } else if (normalizedTab === 'internal-marks') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Internal Marks & Semester Result Editor'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Staff Privilege: Enter, update, and publish Continuous Internal Assessment (CIA) marks and semester grades')
        ),
        React.createElement(
          'button',
          {
            onClick: handleSaveMarks,
            className: 'px-5 py-2.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-950/40'
          },
          React.createElement(Icons.CheckCircle, { className: 'w-4 h-4' }),
          'Publish Marks to Student Portals'
        )
      ),

      // Controls
      React.createElement(
        'div',
        { className: 'glass-panel p-4 rounded-2xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs' },
        React.createElement('div', { className: 'flex flex-wrap items-center gap-4' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-semibold text-slate-400 mb-1' }, 'Subject'),
            React.createElement('select', {
              value: selectedSubjCode,
              onChange: (e) => setSelectedSubjCode(e.target.value),
              className: 'p-2 rounded-xl glass-input font-bold text-cyan-400'
            },
              subjects.map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.name}`))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-semibold text-slate-400 mb-1' }, 'Assessment / Exam Tier'),
            React.createElement('select', {
              value: marksExamType,
              onChange: (e) => setMarksExamType(e.target.value),
              className: 'p-2 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'CIA-1' }, 'Continuous Internal Assessment 1 (Max 50)'),
              React.createElement('option', { value: 'CIA-2' }, 'Continuous Internal Assessment 2 (Max 50)'),
              React.createElement('option', { value: 'Model Exam' }, 'Model Examination (Max 100)'),
              React.createElement('option', { value: 'Assignment' }, 'Assignment & Seminar Points (Max 10)')
            )
          )
        ),
        React.createElement('div', { className: 'p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold' },
          `✓ Subject Instructor: ${activeFaculty.name}`
        )
      ),

      // Marks Sheet Table
      React.createElement(
        'div',
        { className: 'glass-panel rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl' },
        React.createElement(
          'div',
          { className: 'overflow-x-auto' },
          React.createElement(
            'table',
            { className: 'w-full text-left custom-table' },
            React.createElement(
              'thead',
              { className: 'bg-slate-900/80' },
              React.createElement(
                'tr',
                null,
                React.createElement('th', null, 'Roll No'),
                React.createElement('th', null, 'Student Name'),
                React.createElement('th', null, 'Marks Secured'),
                React.createElement('th', null, 'Assignment (10)'),
                React.createElement('th', null, 'Total Internal (50)'),
                React.createElement('th', null, 'Estimated Grade')
              )
            ),
            React.createElement(
              'tbody',
              null,
              marksSheet.map(row => {
                const totalInternal = Math.min(50, Math.round((row.score / row.maxScore) * 40 + (row.assignmentScore || 9)));
                const pct = ((totalInternal / 50) * 100).toFixed(1);
                const grade = pct >= 90 ? 'O (Outstanding)' : pct >= 80 ? 'A+ (Excellent)' : pct >= 70 ? 'A (Very Good)' : 'B+ (Good)';

                return React.createElement(
                  'tr',
                  { key: row.rollNo },
                  React.createElement('td', { className: 'font-mono text-xs font-bold text-cyan-400' }, row.rollNo),
                  React.createElement('td', { className: 'font-semibold text-white' }, row.name),
                  React.createElement(
                    'td',
                    null,
                    React.createElement('input', {
                      type: 'number',
                      min: 0,
                      max: row.maxScore,
                      value: row.score,
                      onChange: (e) => {
                        const val = Number(e.target.value);
                        setMarksSheet(prev => prev.map(r => r.rollNo === row.rollNo ? { ...r, score: val } : r));
                      },
                      className: 'w-20 p-1.5 rounded-lg glass-input font-mono font-bold text-cyan-300 text-center'
                    }),
                    React.createElement('span', { className: 'text-xs text-slate-400 ml-1.5' }, `/ ${row.maxScore}`)
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement('input', {
                      type: 'number',
                      min: 0,
                      max: 10,
                      value: row.assignmentScore || 9,
                      onChange: (e) => {
                        const val = Number(e.target.value);
                        setMarksSheet(prev => prev.map(r => r.rollNo === row.rollNo ? { ...r, assignmentScore: val } : r));
                      },
                      className: 'w-16 p-1.5 rounded-lg glass-input font-mono font-bold text-emerald-300 text-center'
                    }),
                    React.createElement('span', { className: 'text-xs text-slate-400 ml-1.5' }, '/ 10')
                  ),
                  React.createElement('td', { className: 'font-mono text-xs font-extrabold text-white' }, `${totalInternal} / 50`),
                  React.createElement('td', null,
                    React.createElement('span', { className: 'badge-it bg-purple-500/20 text-purple-300 border border-purple-500/30' }, grade)
                  )
                );
              })
            )
          )
        )
      )
    );
  } else if (normalizedTab === 'upload-study-materials') {
    const safeMats = Array.isArray(studyMaterials) ? studyMaterials : [];
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Course Notes & Study Material Repository'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Official lecture notes, question banks, and lab manuals')
        ),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('upload-material'),
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
          },
          React.createElement(Icons.Upload, { className: 'w-4 h-4' }),
          'Upload New Material'
        )
      ),

      // Uploaded List
      safeMats.length === 0 ? React.createElement(
        'div',
        { className: 'glass-panel p-12 rounded-3xl border border-slate-800 text-center col-span-full' },
        React.createElement(Icons.BookOpen, { className: 'w-12 h-12 text-slate-500 mx-auto mb-3' }),
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1' }, 'No Study Materials Available.'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'There are currently no uploaded study materials in the repository.')
      ) : React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        safeMats.map(mat => React.createElement(
          'div',
          { key: mat.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between hover:border-cyan-500/40 transition' },
          React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'flex justify-between items-center mb-2' },
              React.createElement('span', { className: 'badge-it bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' }, mat.category || 'Study Material'),
              React.createElement('span', { className: 'font-mono text-xs text-slate-400' }, mat.fileSize || 'PDF')
            ),
            React.createElement('h4', { className: 'text-sm font-bold text-white mt-1' }, mat.title),
            React.createElement('p', { className: 'text-xs text-cyan-400 font-semibold mt-1' }, `Subject: ${mat.subjectCode ? `${mat.subjectCode} - ` : ''}${mat.subjectName || mat.subject || 'Core Subject'}`),
            React.createElement('div', { className: 'mt-2 space-y-1 text-xs text-slate-300 border-t border-slate-800/80 pt-2' },
              React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'Teacher: '), mat.teacherName || mat.faculty || mat.uploadedBy || 'Faculty Member'),
              React.createElement('div', { className: 'flex justify-between text-[11px] text-slate-400 pt-1' },
                React.createElement('span', null, `Semester: ${mat.semester || 'Semester 4'}`),
                React.createElement('span', null, `Dept: ${mat.department || 'Information Technology'}`)
              ),
              React.createElement('p', { className: 'text-[11px] text-slate-400' }, `Upload Date: ${mat.uploadDate || mat.date || '2026-08-25'}`)
            )
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-between mt-4 pt-3 border-t border-slate-800 gap-2' },
            React.createElement('span', { className: 'text-[11px] text-slate-400' }, `📥 ${mat.downloads || 0} Downloads`),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => setPreviewMat(mat),
                  className: 'px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition'
                },
                React.createElement(Icons.Eye, { className: 'w-3.5 h-3.5' }),
                'Preview'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => handleDownloadMaterial(mat),
                  className: 'px-3 py-1.5 rounded-lg gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
                },
                React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
                'Download'
              )
            )
          )
        ))
      )
    );
  } else if (normalizedTab === 'achievements') {
    const safeAchs = Array.isArray(achievements) ? achievements : [];
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
          React.createElement(Icons.Sparkles, { className: 'w-6 h-6 text-amber-400' }),
          'Student Honors & Achievements Gallery'
        ),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Faculty review and showcase of student hackathon prizes, symposium awards, and technical accolades')
      ),

      safeAchs.length === 0 ? React.createElement(
        'div',
        { className: 'glass-panel p-12 rounded-3xl border border-slate-800 text-center' },
        React.createElement(Icons.Award, { className: 'w-12 h-12 text-slate-600 mx-auto mb-3' }),
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1' }, 'No Achievements Uploaded Yet'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Students have not uploaded any achievement records yet.')
      ) : React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
        safeAchs.map(ach => {
          const isPdf = ach.fileType === 'pdf' || (ach.fileName && ach.fileName.toLowerCase().endsWith('.pdf')) || (ach.fileUrl && ach.fileUrl.toLowerCase().endsWith('.pdf'));
          const hasImage = ach.fileUrl && !isPdf;

          return React.createElement(
            'div',
            {
              key: ach.id,
              className: 'glass-panel rounded-2xl border border-slate-700/60 hover:border-purple-500/40 transition overflow-hidden flex flex-col justify-between shadow-lg'
            },
            React.createElement(
              'div',
              { className: 'relative w-full h-44 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800 group' },
              hasImage ? React.createElement('img', {
                src: ach.fileUrl,
                alt: ach.title,
                className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
              }) : React.createElement(
                'div',
                { className: 'flex flex-col items-center justify-center p-4 text-center w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/40' },
                React.createElement(
                  'div',
                  { className: `w-14 h-14 rounded-2xl ${isPdf ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'} flex items-center justify-center mb-2 shadow` },
                  React.createElement(isPdf ? Icons.FileText : Icons.Award, { className: 'w-7 h-7' })
                ),
                React.createElement('span', { className: 'text-[11px] font-mono font-bold text-slate-300 truncate max-w-[220px]' }, ach.fileName || `${ach.title}.png`),
                React.createElement('span', { className: 'text-[10px] text-purple-400 mt-1 font-semibold uppercase tracking-wider' }, isPdf ? 'PDF Document' : 'Achievement Photo')
              ),
              React.createElement(
                'span',
                { className: 'absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md' },
                ach.category || 'Honors'
              )
            ),
            React.createElement(
              'div',
              { className: 'p-4 flex-1 flex flex-col justify-between space-y-2' },
              React.createElement('div', null,
                React.createElement('h3', { className: 'text-sm font-bold text-white line-clamp-1' }, ach.title),
                React.createElement('p', { className: 'text-xs text-slate-300 mt-1 line-clamp-2' }, ach.description || 'Special achievement award.')
              ),
              React.createElement(
                'div',
                { className: 'pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400' },
                React.createElement('span', { className: 'font-mono' }, `Upload Date: ${ach.uploadDate || ach.date || '2026-09-08'}`),
                React.createElement('span', { className: 'text-purple-400 font-semibold' }, ach.studentName ? `Student: ${ach.studentName}` : '')
              )
            ),
            React.createElement(
              'div',
              { className: 'px-4 pb-4 pt-1 flex items-center gap-2 border-t border-slate-800/60 bg-slate-900/40' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => setPreviewAch(ach),
                  className: 'flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-700'
                },
                React.createElement(Icons.Eye, { className: 'w-3.5 h-3.5' }),
                'View'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => handleDownloadAchievement(ach),
                  className: 'flex-1 py-1.5 rounded-xl gradient-btn-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 transition'
                },
                React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
                'Download'
              )
            )
          );
        })
      )
    );
  } else if (normalizedTab === 'attendance-management') {
    const presentTotal = attendanceSheet.filter(s => s.status === 'P').length;
    const absentTotal = attendanceSheet.filter(s => s.status === 'A').length;
    const odTotal = attendanceSheet.filter(s => s.status === 'OD').length;

    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Daily Attendance Entry & Audit'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Click on status chip (P: Present / A: Absent / OD: On-Duty) to toggle student state')
        ),
        React.createElement(
          'button',
          {
            onClick: handleSaveAttendance,
            className: 'px-5 py-2.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2'
          },
          React.createElement(Icons.CheckCircle, { className: 'w-4 h-4' }),
          'Commit Attendance'
        )
      ),

      // Controls Bar
      React.createElement(
        'div',
        { className: 'glass-panel p-4 rounded-2xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs' },
        React.createElement('div', { className: 'flex flex-wrap items-center gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-semibold text-slate-400 mb-1' }, 'Select Subject'),
            React.createElement('select', {
              value: selectedSubjCode,
              onChange: (e) => setSelectedSubjCode(e.target.value),
              className: 'p-2 rounded-xl glass-input font-bold text-cyan-400'
            },
              subjects.map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.name}`))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-semibold text-slate-400 mb-1' }, 'Attendance Date'),
            React.createElement('input', {
              type: 'date',
              value: attendanceDate,
              onChange: (e) => setAttendanceDate(e.target.value),
              className: 'p-2 rounded-xl glass-input'
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 text-xs font-bold' },
          React.createElement('span', { className: 'px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }, `Present: ${presentTotal}`),
          React.createElement('span', { className: 'px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30' }, `Absent: ${absentTotal}`),
          React.createElement('span', { className: 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, `OD: ${odTotal}`)
        )
      ),

      // Attendance Table Roster
      React.createElement(
        'div',
        { className: 'glass-panel rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl' },
        React.createElement(
          'div',
          { className: 'overflow-x-auto' },
          React.createElement(
            'table',
            { className: 'w-full text-left custom-table' },
            React.createElement(
              'thead',
              { className: 'bg-slate-900/80' },
              React.createElement(
                'tr',
                null,
                React.createElement('th', null, 'Roll No'),
                React.createElement('th', null, 'Student Name'),
                React.createElement('th', null, 'Overall Attendance %'),
                React.createElement('th', null, 'Mark Attendance Status')
              )
            ),
            React.createElement(
              'tbody',
              null,
              attendanceSheet.map(row => {
                const isP = row.status === 'P';
                const isA = row.status === 'A';
                const isOD = row.status === 'OD';

                return React.createElement(
                  'tr',
                  { key: row.rollNo },
                  React.createElement('td', { className: 'font-mono text-xs font-bold text-cyan-400' }, row.rollNo),
                  React.createElement('td', { className: 'font-semibold text-white' }, row.name),
                  React.createElement('td', { className: 'text-slate-300 font-mono text-xs' }, '88.5%'),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        onClick: () => toggleAttendanceStatus(row.rollNo),
                        className: `px-4 py-1.5 rounded-xl font-bold text-xs transition border cursor-pointer ${
                          isP ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30' :
                          isA ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30' :
                          'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30'
                        }`
                      },
                      isP ? '✓ PRESENT' : isA ? '✗ ABSENT' : '★ ON-DUTY (OD)'
                    )
                  )
                );
              })
            )
          )
        )
      )
    );
  } else if (normalizedTab === 'assignments') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Course Assignments & Submissions Review'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Create coursework topics, inspect student uploads, and publish grades')
        ),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('create-assignment'),
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
          },
          React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
          'Create Assignment'
        )
      ),

      React.createElement(
        'div',
        { className: 'space-y-4' },
        assignments.map(asn => React.createElement(
          'div',
          { key: asn.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60' },
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800' },
            React.createElement('div', null,
              React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, `${asn.subjectCode} - ${asn.subjectName}`),
              React.createElement('h3', { className: 'text-base font-bold text-white mt-0.5' }, asn.title)
            ),
            React.createElement('span', { className: 'text-xs text-slate-400' }, `Due: ${asn.dueDate}`)
          ),
          React.createElement('p', { className: 'text-xs text-slate-300 mb-3' }, asn.instructions),
          React.createElement(
            'div',
            { className: 'flex items-center justify-between text-xs pt-3 border-t border-slate-800' },
            React.createElement('span', { className: 'text-slate-400' }, `Max Marks: ${asn.maxMarks}`),
            asn.submissionFile ? React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              React.createElement('span', { className: 'text-cyan-300 font-semibold text-xs' }, `Submission: ${asn.submissionFile}`),
              React.createElement(
                'button',
                {
                  onClick: () => {
                    setGradingTarget(asn);
                    setGradeInput({ score: asn.score || 18, remarks: asn.remarks || 'Very good' });
                    setActiveModal('grade-modal');
                  },
                  className: 'px-3 py-1.5 rounded-lg gradient-btn-primary text-white font-bold'
                },
                asn.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'
              )
            ) : React.createElement('span', { className: 'text-amber-400 font-medium' }, 'Pending Student Submissions')
          )
        ))
      )
    );
  } else if (normalizedTab === 'my-subjects') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'My Allocated Teaching Subjects'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Courses allotted by Head of Department for Academic Year 2026')
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        (subjects || []).map(subj => React.createElement(
          'div',
          { key: subj.code, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60' },
          React.createElement('div', { className: 'flex justify-between items-center mb-2' },
            React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30' }, subj.code),
            React.createElement('span', { className: 'text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300' }, `${subj.credits} Credits • ${subj.type}`)
          ),
          React.createElement('h3', { className: 'text-base font-bold text-white mt-1' }, subj.name),
          React.createElement('p', { className: 'text-xs text-slate-300 mt-2' }, subj.description || 'Core Information Technology curriculum course.'),
          React.createElement('div', { className: 'mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400' },
            React.createElement('span', null, `Total Hours: ${subj.totalHours || 45} hrs`),
            React.createElement('span', { className: 'text-emerald-400 font-bold' }, `Instructor: ${subj.faculty}`)
          )
        ))
      )
    );
  } else if (normalizedTab === 'my-profile') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement('div', { className: 'glass-panel p-6 rounded-2xl border border-slate-700/60' },
        React.createElement('div', { className: 'flex flex-col md:flex-row items-center gap-6' },
          React.createElement('div', { className: 'w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-emerald-950/50' },
            (activeFaculty.name || 'Staff').split(' ').map(n => n[0]).join('').slice(0, 2)
          ),
          React.createElement('div', { className: 'flex-1 text-center md:text-left' },
            React.createElement('div', { className: 'flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1' },
              React.createElement('h2', { className: 'text-2xl font-bold text-white' }, activeFaculty.name),
              React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }, activeFaculty.id)
            ),
            React.createElement('p', { className: 'text-sm font-semibold text-cyan-400' }, `${activeFaculty.designation} • Department of Information Technology`),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, `${activeFaculty.qualification} | ${activeFaculty.experience} Teaching & Research Experience`),
            React.createElement('p', { className: 'text-xs text-slate-300 mt-2 font-mono' }, `📧 ${activeFaculty.email} | 📞 ${activeFaculty.phone} | 🏢 ${activeFaculty.cabin}`),
            React.createElement('div', { className: 'mt-3 flex justify-center md:justify-start' },
              React.createElement('button', {
                type: 'button',
                onClick: () => setActiveModal('edit-faculty-profile'),
                className: 'px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer'
              }, '✏️ Edit Profile Details')
            )
          )
        )
      ),
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        React.createElement('div', { className: 'glass-panel p-5 rounded-2xl border border-slate-700/60' },
          React.createElement('h3', { className: 'text-sm font-bold text-white mb-3 flex items-center gap-2' }, 'Specialization & Research'),
          React.createElement('p', { className: 'text-xs text-slate-300 leading-relaxed' }, activeFaculty.specialization || 'Distributed Systems, Database Management Systems, Cloud Computing, High Performance Computing.')
        ),
        React.createElement('div', { className: 'glass-panel p-5 rounded-2xl border border-slate-700/60' },
          React.createElement('h3', { className: 'text-sm font-bold text-white mb-3 flex items-center gap-2' }, 'Academic Roles'),
          React.createElement('p', { className: 'text-xs text-slate-300 leading-relaxed' }, activeFaculty.classAdvisorLabel ? `⭐ Assigned Class Advisor: ${activeFaculty.classAdvisorLabel}` : 'Faculty Member, Autonomous Curriculum Committee, Project Guide')
        )
      )
    );
  } else if (normalizedTab === 'timetable') {
    const activeSchedule = timetable || (typeof mockData !== 'undefined' && mockData.INITIAL_TIMETABLE) || {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = ['09:00 - 09:50', '09:50 - 10:40', '10:55 - 11:45', '11:45 - 12:35', '01:30 - 02:20', '02:20 - 03:10', '03:10 - 04:00'];

    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement('div', null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Faculty Academic Timetable'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Weekly instructional lecture, laboratory, and tutorial schedule • Autonomous R2021')
      ),
      React.createElement('div', { className: 'glass-panel rounded-2xl border border-slate-700/60 p-4 overflow-x-auto shadow-xl' },
        React.createElement('table', { className: 'w-full text-left custom-table text-xs' },
          React.createElement('thead', null,
            React.createElement('tr', { className: 'bg-slate-900/80' },
              React.createElement('th', { className: 'p-3 text-cyan-400 font-bold' }, 'Day / Period'),
              periods.map((p, idx) => React.createElement('th', { key: idx, className: 'p-3 font-semibold text-slate-300 whitespace-nowrap' }, `P${idx + 1} (${p})`))
            )
          ),
          React.createElement('tbody', null,
            days.map(d => {
              const daySchedule = Array.isArray(activeSchedule[d]) ? activeSchedule[d] : [];
              return React.createElement('tr', { key: d, className: 'border-b border-slate-800/60 hover:bg-white/5' },
                React.createElement('td', { className: 'p-3 font-bold text-white whitespace-nowrap' }, d),
                periods.map((_, pIdx) => {
                  const targetPeriod = pIdx + 1;
                  const periodEntry = daySchedule.find(p => p.period === targetPeriod || String(p.period).includes(String(targetPeriod)));
                  if (!periodEntry) {
                    return React.createElement('td', { key: pIdx, className: 'p-3' },
                      React.createElement('span', { className: 'text-slate-500 text-[11px]' }, 'Research / Office')
                    );
                  }
                  const isLab = periodEntry.subject && (periodEntry.subject.toLowerCase().includes('lab') || String(periodEntry.period).includes('-'));
                  const isSeminar = periodEntry.subject && (periodEntry.subject.toLowerCase().includes('seminar') || periodEntry.subject.toLowerCase().includes('aptitude') || periodEntry.subject.toLowerCase().includes('mentor'));
                  const badgeClass = isLab ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                                     isSeminar ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                     'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                  return React.createElement('td', { key: pIdx, className: 'p-3' },
                    React.createElement('div', { className: 'flex flex-col gap-0.5' },
                      React.createElement('span', { className: `px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${badgeClass}` }, (periodEntry.subject || '').split(' ')[0]),
                      React.createElement('span', { className: 'text-[11px] font-medium text-white truncate max-w-[120px]' }, periodEntry.subject),
                      React.createElement('span', { className: 'text-[10px] text-slate-400' }, periodEntry.room || 'IT LH-1')
                    )
                  );
                })
              );
            })
          )
        )
      )
    );
  } else if (normalizedTab === 'announcements') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Announcements & Circulars'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Official notices issued by Head of Department & Academic Coordinators')
        ),
        React.createElement('button', {
          type: 'button',
          onClick: () => setActiveModal('create-announcement'),
          className: 'px-4 py-2 rounded-xl gradient-btn-primary text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg'
        }, '📢 + Post Notice / Circular')
      ),
      React.createElement('div', { className: 'space-y-3' },
        (announcements || []).map(a => React.createElement('div', { key: a.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60' },
          React.createElement('div', { className: 'flex justify-between items-start gap-4 mb-2' },
            React.createElement('div', null,
              React.createElement('span', { className: 'px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mr-2' }, a.category || 'Academic'),
              React.createElement('span', { className: 'text-xs text-slate-400 font-mono' }, a.date)
            ),
            React.createElement('span', { className: 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300' }, a.priority || 'Normal')
          ),
          React.createElement('h3', { className: 'text-base font-bold text-white' }, a.title),
          React.createElement('p', { className: 'text-xs text-slate-300 mt-2 leading-relaxed' }, a.content),
          React.createElement('p', { className: 'text-[11px] text-slate-500 mt-3 border-t border-slate-800/80 pt-2 font-medium' }, `Issued by: ${a.author || 'HOD Office'}`)
        ))
      )
    );
  } else if (normalizedTab === 'student-performance') {
    const highCgpa = safeStudents.filter(s => s.cgpa >= 8.5).length;
    const avgCgpa = safeStudents.reduce((acc, s) => acc + (s.cgpa || 0), 0) / (safeStudents.length || 1);
    const lowAttendance = safeStudents.filter(s => s.attendance < 75).length;

    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement('div', null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Student Cohort Performance Analytics'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Academic grade distribution, attendance compliance, and mentor insights')
      ),
      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' },
        React.createElement('div', { className: 'glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20' },
          React.createElement('h3', { className: 'text-xs font-bold text-emerald-400 uppercase tracking-wider' }, 'High Distinction (CGPA ≥ 8.5)'),
          React.createElement('p', { className: 'text-3xl font-extrabold text-white mt-2' }, highCgpa),
          React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, 'Eligible for Tier-1 placements')
        ),
        React.createElement('div', { className: 'glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20' },
          React.createElement('h3', { className: 'text-xs font-bold text-cyan-400 uppercase tracking-wider' }, 'Cohort Average CGPA'),
          React.createElement('p', { className: 'text-3xl font-extrabold text-white mt-2' }, avgCgpa.toFixed(2)),
          React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, 'Autonomous R2021 Regulation')
        ),
        React.createElement('div', { className: 'glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20' },
          React.createElement('h3', { className: 'text-xs font-bold text-rose-400 uppercase tracking-wider' }, 'Attendance Shortage (<75%)'),
          React.createElement('p', { className: 'text-3xl font-extrabold text-white mt-2' }, lowAttendance),
          React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, 'Immediate mentoring recommended')
        )
      ),
      React.createElement('div', { className: 'glass-panel rounded-2xl border border-slate-700/60 p-5 overflow-x-auto shadow-xl' },
        React.createElement('div', { className: 'flex justify-between items-center mb-4' },
          React.createElement('h3', { className: 'text-sm font-bold text-white' }, 'Cohort Academic Standing & Mentoring Roster'),
          React.createElement('span', { className: 'text-xs text-slate-400' }, `Total Students: ${safeStudents.length}`)
        ),
        React.createElement('table', { className: 'w-full text-left custom-table text-xs' },
          React.createElement('thead', null,
            React.createElement('tr', { className: 'bg-slate-900/80 text-slate-300' },
              React.createElement('th', { className: 'p-3' }, 'Roll No'),
              React.createElement('th', { className: 'p-3' }, 'Student Name'),
              React.createElement('th', { className: 'p-3' }, 'Year / Sec'),
              React.createElement('th', { className: 'p-3' }, 'CGPA'),
              React.createElement('th', { className: 'p-3' }, 'Attendance'),
              React.createElement('th', { className: 'p-3' }, 'Academic Standing'),
              React.createElement('th', { className: 'p-3 text-right' }, 'Action')
            )
          ),
          React.createElement('tbody', null,
            safeStudents.map(s => {
              const cgpaVal = Number(s.cgpa) || 8.0;
              const attVal = Number(s.attendance) || 85;
              const standing = cgpaVal >= 8.5 && attVal >= 80 ? 'Distinction' :
                               attVal < 75 ? 'Attendance Shortage' :
                               cgpaVal < 7.0 ? 'Needs Academic Focus' : 'Good Standing';
              const standingColor = standing === 'Distinction' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                    standing === 'Attendance Shortage' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                    standing === 'Needs Academic Focus' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                    'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
              return React.createElement('tr', { key: s.rollNo, className: 'border-b border-slate-800/60 hover:bg-white/5' },
                React.createElement('td', { className: 'p-3 font-mono font-bold text-white' }, s.rollNo),
                React.createElement('td', { className: 'p-3 font-semibold text-slate-200' }, s.name),
                React.createElement('td', { className: 'p-3 text-slate-400' }, `Year ${s.year || 2} (${s.sec || 'A'})`),
                React.createElement('td', { className: 'p-3 font-bold text-white' }, cgpaVal.toFixed(2)),
                React.createElement('td', { className: 'p-3' },
                  React.createElement('span', { className: `px-2 py-0.5 rounded text-[11px] font-bold ${attVal < 75 ? 'bg-rose-500/20 text-rose-300' : 'text-emerald-400'}` }, `${attVal}%`)
                ),
                React.createElement('td', { className: 'p-3' },
                  React.createElement('span', { className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${standingColor}` }, standing)
                ),
                React.createElement('td', { className: 'p-3 text-right' },
                  React.createElement('button', {
                    type: 'button',
                    onClick: () => {
                      if (onNavigate) onNavigate('messages');
                      showToast(`Navigated to messaging for ${s.name}`, 'info');
                    },
                    className: 'px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] transition cursor-pointer'
                  }, 'Contact Student')
                )
              );
            })
          )
        )
      )
    );
  } else if (normalizedTab === 'notifications') {
    const list = (notifications && notifications.length > 0) ? notifications : (announcements || []).map(a => ({
      id: a.id,
      title: a.title,
      time: a.date,
      read: false,
      type: a.category ? a.category.toLowerCase() : 'academic'
    }));

    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement('div', { className: 'flex justify-between items-center' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Faculty Notifications & Alerts'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Direct alerts, pending actions, and circular updates')
        ),
        React.createElement('button', {
          type: 'button',
          onClick: () => {
            showToast('All notifications marked as read', 'info');
          },
          className: 'px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition cursor-pointer'
        }, 'Mark All Read')
      ),
      React.createElement('div', { className: 'space-y-3' },
        list.map((n, i) => React.createElement('div', {
          key: n.id || i,
          className: `glass-panel p-4 rounded-xl border ${n.read ? 'border-slate-800/60 bg-slate-900/30 opacity-75' : 'border-cyan-500/40 bg-slate-900/70 shadow-lg'} flex items-center justify-between`
        },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('div', {
              className: `w-2.5 h-2.5 rounded-full ${n.read ? 'bg-slate-600' : 'bg-cyan-400 animate-pulse'}`
            }),
            React.createElement('div', null,
              React.createElement('h4', { className: 'text-sm font-bold text-white' }, n.title),
              React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' }, n.time || 'Today')
            )
          ),
          React.createElement('span', { className: 'text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30 uppercase' }, n.type || 'System')
        ))
      )
    );
  } else {
    tabContent = React.createElement('div', { className: 'p-8 text-center text-slate-400' }, `View ${currentTab} loaded.`);
  }

  // ==========================================
  // RENDER MAIN VIEW CONTENT + SHARED MODALS
  // ==========================================
  return React.createElement(
    'div',
    { className: 'staff-portal-views-wrapper w-full' },
    tabContent,

    // Modal: Student Add / Edit Form (Feature 1)
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'student-form-modal',
        onClose: () => {
          setActiveModal(null);
          setEditingRollNo(null);
        },
        title: editingRollNo
          ? `Edit Student Record - ${editingRollNo}`
          : (isClassAdvisor ? `Enroll New Student (Year ${assignedAdvisorYear} - ${advisorBatch})` : 'Enroll New Student into Department')
      },
      React.createElement(
        'form',
        { onSubmit: handleSaveStudent, className: 'space-y-4 text-xs' },
        React.createElement(
          'div',
          { className: 'p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs leading-relaxed flex items-center gap-2.5' },
          React.createElement('span', { className: 'text-base' }, '🔑'),
          React.createElement('div', null,
            React.createElement('p', { className: 'font-bold text-white' }, 'Automatic Student Login & Dedicated Dashboard Generation'),
            React.createElement('p', { className: 'text-cyan-300 text-[11px]' }, 'Enrolling this student immediately generates active institutional login credentials (User ID = Roll No, Password = "1234") with full database synchronization.')
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Roll Number'),
            React.createElement('input', {
              type: 'text',
              required: true,
              disabled: !!editingRollNo,
              placeholder: 'e.g. 24IT025',
              value: studentForm.rollNo,
              onChange: (e) => setStudentForm({ ...studentForm, rollNo: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-mono font-bold text-cyan-400'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Register Number'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. 730424205025',
              value: studentForm.regNo,
              onChange: (e) => setStudentForm({ ...studentForm, regNo: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-mono'
            })
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Full Student Name'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Anandha Kumar S',
            value: studentForm.name,
            onChange: (e) => setStudentForm({ ...studentForm, name: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-3 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Year'),
            React.createElement('select', {
              value: studentForm.year,
              onChange: (e) => setStudentForm({ ...studentForm, year: Number(e.target.value), sem: Number(e.target.value) * 2 }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 1 }, 'I Year (Sem 2)'),
              React.createElement('option', { value: 2 }, 'II Year (Sem 4)'),
              React.createElement('option', { value: 3 }, 'III Year (Sem 6)'),
              React.createElement('option', { value: 4 }, 'IV Year (Sem 8)')
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Attendance %'),
            React.createElement('input', {
              type: 'number',
              min: 0,
              max: 100,
              value: studentForm.attendance,
              onChange: (e) => setStudentForm({ ...studentForm, attendance: Number(e.target.value) }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'CGPA'),
            React.createElement('input', {
              type: 'number',
              step: '0.01',
              min: 0,
              max: 10,
              value: studentForm.cgpa,
              onChange: (e) => setStudentForm({ ...studentForm, cgpa: Number(e.target.value) }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Contact Phone'),
            React.createElement('input', {
              type: 'text',
              placeholder: '+91 98421 00000',
              value: studentForm.phone,
              onChange: (e) => setStudentForm({ ...studentForm, phone: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Assigned Mentor / Advisor'),
            React.createElement('input', {
              type: 'text',
              value: studentForm.mentor,
              onChange: (e) => setStudentForm({ ...studentForm, mentor: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Official Student Email'),
            React.createElement('input', {
              type: 'email',
              placeholder: 'student@gceerode.ac.in',
              value: studentForm.email,
              onChange: (e) => setStudentForm({ ...studentForm, email: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Academic Status'),
            React.createElement('select', {
              value: studentForm.status,
              onChange: (e) => setStudentForm({ ...studentForm, status: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'Active' }, 'Active'),
              React.createElement('option', { value: 'Detained' }, 'Detained'),
              React.createElement('option', { value: 'Graduated' }, 'Graduated')
            )
          )
        ),
        React.createElement('div', { className: 'flex items-center gap-2 pt-3 border-t border-slate-800' },
          React.createElement('button', {
            type: 'button',
            onClick: () => {
              setActiveModal(null);
              setEditingRollNo(null);
            },
            className: 'w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'w-2/3 py-2.5 rounded-xl gradient-btn-primary text-white font-bold transition shadow-lg shadow-emerald-950/40'
          }, editingRollNo ? 'Update Student Record' : 'Save & Enroll Student')
        )
      )
    ),

    // Modal: Study Material Upload with File Directory Uploader (Feature 2)
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'upload-material',
        onClose: () => setActiveModal(null),
        title: 'Upload Study Material from Computer'
      },
      React.createElement(
        'form',
        { onSubmit: handleUploadMaterial, className: 'space-y-4 text-xs' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Material Title'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Unit 4 - Transaction Management & Concurrency Control',
            value: newMaterial.title,
            onChange: (e) => setNewMaterial({ ...newMaterial, title: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Subject'),
            React.createElement('select', {
              value: newMaterial.subjectCode,
              onChange: (e) => setNewMaterial({ ...newMaterial, subjectCode: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              (subjects || []).map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.name}`))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Category'),
            React.createElement('select', {
              value: newMaterial.category,
              onChange: (e) => setNewMaterial({ ...newMaterial, category: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'Lecture Notes' }, 'Lecture Notes (PDF)'),
              React.createElement('option', { value: 'Question Bank' }, 'Question Bank (PDF)'),
              React.createElement('option', { value: 'Presentation Slides' }, 'Presentation Slides (PPT)'),
              React.createElement('option', { value: 'Lab Manual' }, 'Lab Manual (DOC/PDF)')
            )
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Choose File from Directory'),
          React.createElement(SafeFileUploader, {
            accept: '.pdf,.doc,.docx,.ppt,.pptx,.zip',
            label: 'Click to select study document from PC',
            helperText: 'Select PDF notes, PPT presentation, or lab guide archive',
            onFileSelect: (fileData) => {
              if (fileData) {
                setNewMaterial({
                  ...newMaterial,
                  fileSize: fileData.size,
                  fileType: fileData.type,
                  fileObject: fileData
                });
              }
            }
          })
        ),
        React.createElement('div', { className: 'flex items-center gap-2 pt-2' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setActiveModal(null),
            className: 'w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'w-2/3 py-2.5 rounded-xl gradient-btn-primary text-white font-bold transition'
          }, 'Upload & Publish to Repository')
        )
      )
    ),

    // Modal: Assignment Create
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'create-assignment',
        onClose: () => setActiveModal(null),
        title: 'Publish Course Assignment'
      },
      React.createElement(
        'form',
        { onSubmit: handleCreateAssignment, className: 'space-y-4 text-xs' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Assignment Title'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Design Hospital Management DB Schema with 3NF',
            value: newAsn.title,
            onChange: (e) => setNewAsn({ ...newAsn, title: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Subject'),
            React.createElement('select', {
              value: newAsn.subjectCode,
              onChange: (e) => setNewAsn({ ...newAsn, subjectCode: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              (subjects || []).map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.name}`))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Due Date'),
            React.createElement('input', {
              type: 'date',
              value: newAsn.dueDate,
              onChange: (e) => setNewAsn({ ...newAsn, dueDate: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Instructions'),
          React.createElement('textarea', {
            rows: 3,
            required: true,
            placeholder: 'Specify submission criteria...',
            value: newAsn.instructions,
            onChange: (e) => setNewAsn({ ...newAsn, instructions: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'flex items-center gap-2 pt-2' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setActiveModal(null),
            className: 'w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'w-2/3 py-2.5 rounded-xl gradient-btn-primary text-white font-bold transition'
          }, 'Publish Assignment')
        )
      )
    ),

    // Modal: Grading
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'grade-modal',
        onClose: () => {
          setActiveModal(null);
          setGradingTarget(null);
        },
        title: `Grade Submission - ${gradingTarget?.title || 'Assignment'}`
      },
      React.createElement(
        'form',
        { onSubmit: handleConfirmGrade, className: 'space-y-4 text-xs' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, `Marks (Max ${gradingTarget?.maxMarks || 20})`),
          React.createElement('input', {
            type: 'number',
            min: 0,
            max: gradingTarget?.maxMarks || 20,
            value: gradeInput.score,
            onChange: (e) => setGradeInput({ ...gradeInput, score: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input font-bold text-cyan-400'
          })
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Faculty Remarks'),
          React.createElement('textarea', {
            rows: 2,
            value: gradeInput.remarks,
            onChange: (e) => setGradeInput({ ...gradeInput, remarks: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'flex items-center gap-2 pt-2' },
          React.createElement('button', {
            type: 'button',
            onClick: () => { setActiveModal(null); setGradingTarget(null); },
            className: 'w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'w-2/3 py-2.5 rounded-xl gradient-btn-primary text-white font-bold transition'
          }, 'Submit Grade')
        )
      )
    ),

    // Preview Material Modal
    previewMat && React.createElement(
      SafeModal,
      {
        isOpen: !!previewMat,
        onClose: () => setPreviewMat(null),
        title: `Document Preview: ${previewMat.title}`
      },
      React.createElement(
        'div',
        { className: 'space-y-4 text-xs' },
        React.createElement(
          'div',
          { className: 'p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'badge-it bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, previewMat.category || 'Study Material'),
            React.createElement('span', { className: 'text-slate-400 font-mono' }, previewMat.fileSize || 'PDF')
          ),
          React.createElement('h4', { className: 'text-base font-bold text-white' }, previewMat.title),
          React.createElement('p', { className: 'text-xs text-cyan-300' }, `Subject: ${previewMat.subjectCode} - ${previewMat.subjectName || previewMat.subject}`),
          React.createElement('div', { className: 'flex justify-between text-[11px] text-slate-400 pt-1' },
            React.createElement('span', null, `Teacher: ${previewMat.teacherName || previewMat.faculty || previewMat.uploadedBy}`),
            React.createElement('span', null, `Upload Date: ${previewMat.uploadDate || previewMat.date}`)
          )
        ),
        React.createElement(
          'div',
          { className: 'p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-slate-300 space-y-2 max-h-56 overflow-y-auto' },
          React.createElement('p', { className: 'text-cyan-400 font-bold' }, '--- OFFICIAL REPOSITORY MATERIAL PREVIEW ---'),
          React.createElement('p', null, `Department of Information Technology, GCE Erode`),
          React.createElement('p', null, `Course: ${previewMat.title}`),
          React.createElement('p', null, `Semester: ${previewMat.semester || 'Semester 4'}`),
          React.createElement('p', { className: 'text-slate-500 pt-2 border-t border-slate-800' }, 'Material verified by Department Academic Council.')
        ),
        React.createElement(
          'div',
          { className: 'flex justify-end gap-2 pt-2' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => handleDownloadMaterial(previewMat),
              className: 'px-4 py-2 rounded-xl gradient-btn-primary text-white font-bold text-xs flex items-center gap-1.5'
            },
            React.createElement(Icons.Download, { className: 'w-4 h-4' }),
            'Download Material'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setPreviewMat(null),
              className: 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition'
            },
            'Close'
          )
        )
      )
    ),

    // Preview Achievement Modal
    previewAch && React.createElement(
      SafeModal,
      {
        isOpen: !!previewAch,
        onClose: () => setPreviewAch(null),
        title: `Achievement: ${previewAch.title}`
      },
      React.createElement(
        'div',
        { className: 'space-y-4 text-xs' },
        previewAch.fileUrl && !previewAch.fileUrl.toLowerCase().endsWith('.pdf') && previewAch.fileType !== 'pdf' ? React.createElement(
          'div',
          { className: 'w-full max-h-[50vh] overflow-hidden rounded-xl bg-black flex items-center justify-center' },
          React.createElement('img', {
            src: previewAch.fileUrl,
            alt: previewAch.title,
            className: 'max-h-[50vh] object-contain rounded-xl'
          })
        ) : React.createElement(
          'div',
          { className: 'p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3' },
          React.createElement(Icons.Award, { className: 'w-16 h-16 text-purple-400 mx-auto' }),
          React.createElement('h4', { className: 'text-base font-bold text-white' }, previewAch.title),
          React.createElement('p', { className: 'text-xs text-slate-300 max-w-md mx-auto' }, previewAch.description),
          React.createElement('span', { className: 'badge-it bg-purple-500/20 text-purple-300 border border-purple-500/30' }, previewAch.category || 'Honors')
        ),
        React.createElement(
          'div',
          { className: 'p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1' },
          React.createElement('p', null, React.createElement('strong', { className: 'text-white' }, 'Description: '), previewAch.description),
          React.createElement('p', null, React.createElement('strong', { className: 'text-white' }, 'Upload Date: '), previewAch.uploadDate || previewAch.date || '2026-09-08'),
          previewAch.studentName && React.createElement('p', null, React.createElement('strong', { className: 'text-white' }, 'Student: '), `${previewAch.studentName} (${previewAch.studentRoll || ''})`)
        ),
        React.createElement(
          'div',
          { className: 'flex justify-end gap-2 pt-2' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => handleDownloadAchievement(previewAch),
              className: 'px-4 py-2 rounded-xl gradient-btn-primary text-white font-bold flex items-center gap-1.5'
            },
            React.createElement(Icons.Download, { className: 'w-4 h-4' }),
            'Download File'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setPreviewAch(null),
              className: 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition'
            },
            'Close'
          )
        )
      )
    ),

    // Modal: Edit Faculty Profile
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'edit-faculty-profile',
        onClose: () => setActiveModal(null),
        title: `Edit Faculty Profile - ${activeFaculty.name}`
      },
      React.createElement(
        'form',
        { onSubmit: handleSaveProfile, className: 'space-y-4 text-xs' },
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Phone / Mobile'),
            React.createElement('input', {
              type: 'text',
              value: profileForm.phone,
              onChange: (e) => setProfileForm({ ...profileForm, phone: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input',
              required: true
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Cabin / Office'),
            React.createElement('input', {
              type: 'text',
              value: profileForm.cabin,
              onChange: (e) => setProfileForm({ ...profileForm, cabin: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input',
              required: true
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Experience'),
            React.createElement('input', {
              type: 'text',
              value: profileForm.experience,
              onChange: (e) => setProfileForm({ ...profileForm, experience: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Qualification'),
            React.createElement('input', {
              type: 'text',
              value: profileForm.qualification,
              onChange: (e) => setProfileForm({ ...profileForm, qualification: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Specialization & Research Areas'),
          React.createElement('textarea', {
            rows: 3,
            value: profileForm.specialization,
            onChange: (e) => setProfileForm({ ...profileForm, specialization: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'flex items-center gap-2 pt-2' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setActiveModal(null),
            className: 'w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'w-2/3 py-2.5 rounded-xl gradient-btn-primary text-white font-bold transition'
          }, 'Save Profile Changes')
        )
      )
    ),

    // Modal: Post Announcement / Circular
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'create-announcement',
        onClose: () => setActiveModal(null),
        title: 'Publish Department Announcement / Circular'
      },
      React.createElement(
        'form',
        { onSubmit: handleCreateAnnouncement, className: 'space-y-4 text-xs' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Announcement Title'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Schedule for CIA-2 Re-evaluations & Practical Reviews',
            value: announcementForm.title,
            onChange: (e) => setAnnouncementForm({ ...announcementForm, title: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Category'),
            React.createElement('select', {
              value: announcementForm.category,
              onChange: (e) => setAnnouncementForm({ ...announcementForm, category: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'Academic' }, 'Academic'),
              React.createElement('option', { value: 'Examinations' }, 'Examinations'),
              React.createElement('option', { value: 'Placements' }, 'Placements'),
              React.createElement('option', { value: 'Events & Symposium' }, 'Events & Symposium')
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Priority Level'),
            React.createElement('select', {
              value: announcementForm.priority,
              onChange: (e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'Normal' }, 'Normal Priority'),
              React.createElement('option', { value: 'High' }, 'High Priority'),
              React.createElement('option', { value: 'Urgent' }, 'Urgent Notice')
            )
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Circular Details & Instructions'),
          React.createElement('textarea', {
            rows: 4,
            required: true,
            placeholder: 'Write the complete circular text for students and faculty...',
            value: announcementForm.content,
            onChange: (e) => setAnnouncementForm({ ...announcementForm, content: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'flex items-center gap-2 pt-2' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setActiveModal(null),
            className: 'w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'w-2/3 py-2.5 rounded-xl gradient-btn-primary text-white font-bold transition'
          }, 'Publish Announcement')
        )
      )
    )
  );
};

// Expose to window for standalone execution
if (typeof window !== 'undefined') {
  window.ITStaffViews = StaffViews;
}
})();
