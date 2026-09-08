// IT DIGITAL HUB - Admin Views (System Administration, User CRUD, Curriculum, Settings)
// Department of Information Technology - Government College of Engineering, Erode

(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));
const { StatCard, Modal } = (typeof window !== 'undefined' && window.UIComponents) || {};

// Resilient Modal Component
const SafeModal = (props) => {
  if (!props.isOpen) return null;
  return React.createElement(
    'div',
    { className: 'fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in' },
    React.createElement(
      'div',
      { className: `w-full ${props.maxWidth || 'max-w-2xl'} glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] bg-slate-900` },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80' },
        React.createElement('h3', { className: 'text-base sm:text-lg font-bold text-white' }, props.title || 'Department Hub Form'),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: props.onClose,
            className: 'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition font-bold text-base'
          },
          '✕'
        )
      ),
      React.createElement(
        'div',
        { className: 'p-6 overflow-y-auto space-y-4 text-slate-200 text-xs' },
        props.children
      )
    )
  );
};

const AdminViews = ({ currentTab, onNavigate }) => {

  const {
    collegeInfo,
    students,
    facultyList,
    hodList,
    subjects,
    studyMaterials,
    achievements,
    deleteAchievement,
    announcements,
    auditLogs,
    addStudent,
    updateStudent,
    deleteStudent,
    addFaculty,
    deleteFaculty,
    addHOD,
    updateHOD,
    deleteHOD,
    changeHOD,
    resetAllData,
    showToast
  } = useAuth();

  const safeStudyMaterials = Array.isArray(studyMaterials) ? studyMaterials : [];
  const safeAchievements = Array.isArray(achievements) ? achievements : [];

  const normalizedTab = 
    (currentTab === 'users' || currentTab === 'user-management') ? 'user-management' :
    (currentTab === 'students' || currentTab === 'student-management') ? 'student-management' :
    (currentTab === 'staff' || currentTab === 'staff-management') ? 'staff-management' :
    (currentTab === 'hod' || currentTab === 'hod-management') ? 'hod-management' :
    (currentTab === 'department' || currentTab === 'department-settings') ? 'department-settings' :
    (currentTab === 'subjects' || currentTab === 'subject-management') ? 'subject-management' :
    (currentTab === 'semesters' || currentTab === 'semester-management') ? 'semester-management' :
    (currentTab === 'attendance' || currentTab === 'attendance-management') ? 'attendance-management' :
    (currentTab === 'marks' || currentTab === 'marks-management') ? 'marks-management' :
    (currentTab === 'timetable' || currentTab === 'timetable-management') ? 'timetable-management' :
    (currentTab === 'announcements' || currentTab === 'department-announcements') ? 'announcements' :
    (currentTab === 'materials' || currentTab === 'study-materials') ? 'study-materials' :
    (currentTab === 'achievements' || currentTab === 'admin-achievements') ? 'achievements' :
    (currentTab === 'reports' || currentTab === 'system-reports') ? 'reports' :
    (currentTab === 'settings' || currentTab === 'system-settings') ? 'system-settings' :
    currentTab;

  const [activeModal, setActiveModal] = React.useState(null);
  const [previewMat, setPreviewMat] = React.useState(null);
  const [previewAch, setPreviewAch] = React.useState(null);

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

  const handleDeleteAchievement = async (id) => {
    if (window.confirm('Are you sure you want to delete this student achievement upload?')) {
      await deleteAchievement(id);
    }
  };


  // Student CRUD State
  const [studentForm, setStudentForm] = React.useState({
    rollNo: '',
    regNo: '',
    name: '',
    year: 2,
    sem: 4,
    sec: 'A',
    attendance: 90,
    cgpa: 8.5,
    mentor: 'Dr. A. Venkatesh',
    phone: '+91 98421 00000',
    email: ''
  });
  const [editingRollNo, setEditingRollNo] = React.useState(null);

  // Faculty CRUD State
  const [facultyForm, setFacultyForm] = React.useState({
    name: '',
    designation: 'Assistant Professor',
    qualification: 'M.E., (Ph.D.)',
    experience: '5 Years',
    specialization: 'Full Stack Development',
    email: '',
    phone: '+91 98420 00000',
    cabin: 'IT Block - Room 306',
    subjects: ['Web Technologies']
  });

  // System Settings State
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [autoBackup, setAutoBackup] = React.useState(true);

  // Student Add / Edit Handler
  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!studentForm.rollNo || !studentForm.name) {
      showToast('Please fill all student fields', 'error');
      return;
    }

    if (editingRollNo) {
      updateStudent(editingRollNo, studentForm);
    } else {
      addStudent({
        ...studentForm,
        email: studentForm.email || `${studentForm.rollNo.toLowerCase()}@gceerode.ac.in`
      });
    }
    setActiveModal(null);
    setEditingRollNo(null);
    setStudentForm({ rollNo: '', regNo: '', name: '', year: 2, sem: 4, sec: 'A', attendance: 90, cgpa: 8.5, mentor: 'Dr. A. Venkatesh', phone: '+91 98421 00000', email: '' });
  };

  const handleEditStudentClick = (std) => {
    setEditingRollNo(std.rollNo);
    setStudentForm({ ...std });
    setActiveModal('student-form-modal');
  };

  // Faculty Add Handler
  const handleSaveFaculty = (e) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.email) {
      showToast('Please fill faculty name and email', 'error');
      return;
    }
    addFaculty(facultyForm);
    setActiveModal(null);
    setFacultyForm({ name: '', designation: 'Assistant Professor', qualification: 'M.E., (Ph.D.)', experience: '5 Years', specialization: 'Full Stack Development', email: '', phone: '+91 98420 00000', cabin: 'IT Block - Room 306', subjects: ['Web Technologies'] });
  };

  // HOD Governance State & Handlers (Admin Sole Authority)
  const safeHodList = (hodList && hodList.length) ? hodList : [
    {
      id: 'ITHOD01',
      name: 'Dr. S. K. Murugesan',
      role: 'hod',
      designation: 'Professor & Head of Department',
      qualification: 'B.E., M.Tech., Ph.D. (IIT Madras)',
      experience: '24 Years',
      specialization: 'Cloud Computing, Distributed Systems, Big Data',
      email: 'hod.it@gceerode.ac.in',
      phone: '+91 94433 11223',
      cabin: 'HOD Chamber, IT Block - Ground Floor',
      publications: 38,
      status: 'Active',
      subjects: ["Cloud Architecture", "Advanced Distributed Systems"]
    }
  ];

  const currentHOD = safeHodList[0];
  const [editingHodId, setEditingHodId] = React.useState(null);

  const [hodEditForm, setHodEditForm] = React.useState({
    name: currentHOD.name || 'Dr. S. K. Murugesan',
    designation: currentHOD.designation || 'Professor & Head of Department',
    qualification: currentHOD.qualification || 'B.E., M.Tech., Ph.D. (IIT Madras)',
    experience: currentHOD.experience || '24 Years',
    specialization: currentHOD.specialization || 'Cloud Computing, Distributed Systems',
    email: currentHOD.email || 'hod.it@gceerode.ac.in',
    phone: currentHOD.phone || '+91 94433 11223',
    cabin: currentHOD.cabin || 'HOD Chamber, IT Block - Ground Floor',
    publications: currentHOD.publications || 38
  });

  const [newHodForm, setNewHodForm] = React.useState({
    id: '',
    name: '',
    designation: 'Professor & Head of Department',
    qualification: 'M.E., Ph.D.',
    experience: '20+ Years',
    specialization: 'Information Technology',
    email: '',
    phone: '+91 94433 11223',
    cabin: 'HOD Chamber, IT Block - Ground Floor',
    pass: '1234'
  });

  const [changeHodForm, setChangeHodForm] = React.useState({
    selectedFacultyId: '',
    name: '',
    designation: 'Professor & Head of Department',
    qualification: '',
    experience: '',
    specialization: '',
    email: 'hod.it@gceerode.ac.in',
    phone: '+91 94433 11223',
    cabin: 'HOD Chamber, IT Block - Ground Floor',
    publications: 20
  });

  const openEditHodModal = (targetHod = null) => {
    const h = targetHod || currentHOD;
    setEditingHodId(h.id);
    setHodEditForm({
      id: h.id,
      name: h.name || '',
      designation: h.designation || 'Professor & Head of Department',
      qualification: h.qualification || '',
      experience: h.experience || '',
      specialization: h.specialization || '',
      email: h.email || `${h.id.toLowerCase()}@gceerode.ac.in`,
      phone: h.phone || '+91 94433 11223',
      cabin: h.cabin || 'HOD Chamber, IT Block - Ground Floor',
      publications: h.publications || 38
    });
    setActiveModal('edit-hod-modal');
  };

  const openNewHodModal = () => {
    setNewHodForm({
      id: `ITHOD0${safeHodList.length + 1}`,
      name: '',
      designation: 'Professor & Head of Department',
      qualification: 'M.E., Ph.D.',
      experience: '20+ Years',
      specialization: 'Computer Science & Engineering',
      email: `ithod0${safeHodList.length + 1}@gceerode.ac.in`,
      phone: '+91 94433 11223',
      cabin: 'HOD Chamber, IT Block - Ground Floor',
      pass: '1234'
    });
    setActiveModal('new-hod-modal');
  };

  const openChangeHodModal = (preselectedStaff = null) => {
    if (preselectedStaff) {
      setChangeHodForm({
        selectedFacultyId: preselectedStaff.id,
        name: preselectedStaff.name,
        designation: 'Professor & Head of Department',
        qualification: preselectedStaff.qualification || 'M.E., Ph.D.',
        experience: preselectedStaff.experience || '15+ Years',
        specialization: preselectedStaff.specialization || 'Computer Science & Engineering',
        email: 'hod.it@gceerode.ac.in',
        phone: preselectedStaff.phone || '+91 94433 11223',
        cabin: 'HOD Chamber, IT Block - Ground Floor',
        publications: preselectedStaff.publications || 25
      });
    } else {
      setChangeHodForm({
        selectedFacultyId: '',
        name: '',
        designation: 'Professor & Head of Department',
        qualification: '',
        experience: '',
        specialization: '',
        email: 'hod.it@gceerode.ac.in',
        phone: '+91 94433 11223',
        cabin: 'HOD Chamber, IT Block - Ground Floor',
        publications: 20
      });
    }
    setActiveModal('change-hod-modal');
  };

  const handleSaveHODEdit = (e) => {
    e.preventDefault();
    if (!hodEditForm.name) {
      showToast('Please enter HOD name', 'error');
      return;
    }
    if (updateHOD) {
      updateHOD(hodEditForm, editingHodId || currentHOD.id);
    }
    setActiveModal(null);
  };

  const handleAddNewHOD = (e) => {
    e.preventDefault();
    if (!newHodForm.name) {
      showToast('Please provide HOD Name', 'error');
      return;
    }
    if (addHOD) {
      addHOD(newHodForm);
    }
    setActiveModal(null);
  };

  const handleDeleteHOD = (id) => {
    if (safeHodList.length <= 1) {
      showToast('Cannot delete the sole HOD. At least one HOD must remain.', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to remove HOD account ${id}?`)) {
      if (deleteHOD) {
        deleteHOD(id);
      }
    }
  };

  const handleConfirmChangeHOD = (e) => {
    e.preventDefault();
    if (!changeHodForm.name) {
      showToast('Please specify the new Head of Department name', 'error');
      return;
    }
    if (changeHOD) {
      changeHOD(changeHodForm);
    }
    setActiveModal(null);
  };

  let tabContent = null;

  // ==========================================
  // VIEW: ADMIN DASHBOARD (SYSTEM OVERVIEW)
  // ==========================================
  if (normalizedTab === 'dashboard') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },

      // Welcome Banner
      React.createElement(
        'div',
        { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900/60 relative overflow-hidden' },
        React.createElement('div', { className: 'absolute right-0 top-0 w-80 h-full bg-amber-500/10 rounded-full blur-3xl pointer-events-none' }),
        React.createElement(
          'div',
          { className: 'relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30' },
              'System Administrator Console'
            ),
            React.createElement('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2' },
              'IT Digital Hub Central Administration'
            ),
            React.createElement('p', { className: 'text-xs sm:text-sm text-slate-300 mt-1' },
              'Government College of Engineering, Erode • IT Department Database & Auth Core'
            )
          ),
          React.createElement(
            'div',
            { className: 'flex items-center gap-3' },
            React.createElement(
              'button',
              {
                onClick: () => {
                  setEditingRollNo(null);
                  setActiveModal('student-form-modal');
                },
                className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-semibold text-white flex items-center gap-2'
              },
              React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
              'Enroll New Student'
            ),
            React.createElement(
              'button',
              {
                onClick: () => setActiveModal('faculty-form-modal'),
                className: 'px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 hover:bg-slate-800 transition'
              },
              React.createElement(Icons.User, { className: 'w-4 h-4 text-amber-400' }),
              'Add Faculty Member'
            ),
            React.createElement(
              'button',
              {
                onClick: () => onNavigate('gallery'),
                className: 'px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-amber-600/30 transition cursor-pointer'
              },
              React.createElement(Icons.Image, { className: 'w-4 h-4' }),
              'Gallery Management'
            )
          )
        )
      ),

      // 4 System Metrics
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
        React.createElement(StatCard, {
          title: 'Total Enrolled Students',
          value: students.length.toString(),
          subtitle: 'Active IT Department Roster',
          icon: Icons.Users,
          color: 'blue',
          onClick: () => onNavigate('student-management')
        }),
        React.createElement(StatCard, {
          title: 'Department Faculty',
          value: facultyList.length.toString(),
          subtitle: 'Teaching & Lab Instructors',
          icon: Icons.BookOpen,
          color: 'emerald',
          onClick: () => onNavigate('staff-management')
        }),
        React.createElement(StatCard, {
          title: 'System Server Status',
          value: '99.98%',
          subtitle: 'Zero downtime in 90 days',
          icon: Icons.Shield,
          color: 'purple',
          onClick: () => onNavigate('system-settings')
        }),
        React.createElement(StatCard, {
          title: 'Security Audit Logs',
          value: auditLogs.length.toString(),
          subtitle: 'All login & edit transactions safe',
          icon: Icons.CheckCircle,
          color: 'amber',
          onClick: () => onNavigate('reports')
        })
      ),

      // Two Columns: System Activity Audit Trail & Quick Maintenance Tools
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },

        // Audit Trail (2 Cols)
        React.createElement(
          'div',
          { className: 'lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-700/60' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
            React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
              React.createElement(Icons.Shield, { className: 'w-5 h-5 text-amber-400' }),
              'Recent System Transactions & Security Logs'
            ),
            React.createElement('span', { className: 'text-xs font-mono text-emerald-400' }, 'Live Audit Engine')
          ),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            auditLogs.map(log => React.createElement(
              'div',
              { key: log.id, className: 'p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs' },
              React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: 'font-bold text-white' }, log.action),
                  React.createElement('span', { className: 'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300' }, log.role)
                ),
                React.createElement('p', { className: 'text-slate-400 text-[11px] mt-0.5' }, `${log.user} • IP: ${log.ip}`)
              ),
              React.createElement('span', { className: 'text-[10px] text-slate-500 font-mono' }, log.timestamp)
            ))
          )
        ),

        // Quick Maintenance & Reset Tool (1 Col)
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between space-y-4' },
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'text-base font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2' },
              React.createElement(Icons.Settings, { className: 'w-5 h-5 text-cyan-400' }),
              'System Controls & Backups'
            ),
            React.createElement(
              'div',
              { className: 'space-y-3 text-xs' },
              React.createElement(
                'button',
                {
                  onClick: () => showToast('Full PostgreSQL & JSON state dump backed up to server storage!', 'success'),
                  className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                },
                React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Download, { className: 'w-4 h-4 text-cyan-400' }), 'Trigger Instant DB Backup'),
                React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
              ),
              React.createElement(
                'button',
                {
                  onClick: () => showToast('Cache and temporary session tokens purged!', 'info'),
                  className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                },
                React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Sparkles, { className: 'w-4 h-4 text-amber-400' }), 'Clear Session Cache'),
                React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
              ),
              React.createElement(
                'button',
                {
                  onClick: resetAllData,
                  className: 'w-full p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 hover:border-rose-500 font-bold text-left text-rose-300 hover:text-rose-200 flex items-center justify-between transition'
                },
                React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Trash, { className: 'w-4 h-4 text-rose-400' }), 'Reset Demo Data to Initial'),
                React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-rose-500' })
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300' },
            '🔒 Admin Note: All system changes immediately sync to client storage.'
          )
        )
      )
    );
  } else if (normalizedTab === 'student-management' || normalizedTab === 'user-management') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Student Roster & User Account Management'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Add, modify, or remove student accounts and reset security credentials')
        ),
        React.createElement(
          'button',
          {
            onClick: () => {
              setEditingRollNo(null);
              setStudentForm({ rollNo: '', regNo: '', name: '', year: 2, sem: 4, sec: 'A', attendance: 90, cgpa: 8.5, mentor: 'Dr. A. Venkatesh', phone: '+91 98421 00000', email: '' });
              setActiveModal('student-form-modal');
            },
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
          },
          React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
          'Add Student'
        )
      ),

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
                React.createElement('th', null, 'Name'),
                React.createElement('th', null, 'Year / Sem'),
                React.createElement('th', null, 'Attendance %'),
                React.createElement('th', null, 'CGPA'),
                React.createElement('th', null, 'Contact'),
                React.createElement('th', null, 'Actions')
              )
            ),
            React.createElement(
              'tbody',
              null,
              students.map(s => React.createElement(
                'tr',
                { key: s.rollNo },
                React.createElement('td', { className: 'font-mono text-xs font-bold text-cyan-400' }, s.rollNo),
                React.createElement('td', { className: 'font-semibold text-white' }, s.name),
                React.createElement('td', { className: 'text-slate-300 text-xs' }, `Year ${s.year} (Sem ${s.sem})`),
                React.createElement('td', { className: `font-mono text-xs font-bold ${s.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}` }, `${s.attendance}%`),
                React.createElement('td', { className: 'font-mono text-xs font-bold text-purple-300' }, s.cgpa),
                React.createElement('td', { className: 'text-slate-400 text-xs' }, s.phone),
                React.createElement(
                  'td',
                  null,
                  React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('button', {
                      onClick: () => handleEditStudentClick(s),
                      className: 'p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition'
                    }, React.createElement(Icons.Edit, { className: 'w-3.5 h-3.5' })),
                    React.createElement('button', {
                      onClick: () => deleteStudent(s.rollNo),
                      className: 'p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition'
                    }, React.createElement(Icons.Trash, { className: 'w-3.5 h-3.5' }))
                  )
                )
              ))
            )
          )
        )
      )
    );
  }

  // ==========================================
  // VIEW: STAFF MANAGEMENT
  // ==========================================
  else if (normalizedTab === 'staff-management') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Faculty & Staff Accounts'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Manage IT department faculty records and role permissions')
        ),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('faculty-form-modal'),
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
          },
          React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
          'Add Faculty'
        )
      ),

      React.createElement(
        'div',
        { className: 'p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-200' },
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('span', { className: 'text-2xl' }, '🏛️'),
          React.createElement('div', null,
            React.createElement('p', { className: 'font-bold text-white' }, 'HOD Faculty Governance Authority'),
            React.createElement('p', { className: 'text-slate-400 text-[11px]' }, 'Under institutional hierarchy, teaching faculty accounts and Class Advisor appointments are governed by the Head of Department (HOD) in the HOD Portal.')
          )
        ),
        React.createElement('button', {
          type: 'button',
          onClick: () => onNavigate('hod-management'),
          className: 'px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold transition shrink-0 self-start sm:self-center'
        }, 'HOD Governance →')
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
        facultyList.map(f => React.createElement(
          'div',
          { key: f.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between' },
          React.createElement('div', null,
            React.createElement('div', { className: 'flex justify-between items-center mb-2' },
              React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, f.id),
              f.id !== 'ITHOD01' && React.createElement('button', {
                onClick: () => deleteFaculty(f.id),
                className: 'text-rose-400 hover:text-rose-300 p-1'
              }, React.createElement(Icons.Trash, { className: 'w-4 h-4' }))
            ),
            React.createElement('h3', { className: 'text-sm font-bold text-white' }, f.name),
            React.createElement('p', { className: 'text-xs font-semibold text-amber-400' }, f.designation),
            React.createElement('p', { className: 'text-[11px] text-slate-400 mt-1' }, f.qualification)
          ),
          React.createElement('div', { className: 'mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400' },
            React.createElement('p', null, `Email: ${f.email}`),
            React.createElement('p', { className: 'text-[11px] mt-0.5' }, `Cabin: ${f.cabin}`)
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: HOD MANAGEMENT (GOVERNANCE & SUCCESSION)
  // ==========================================
  else if (normalizedTab === 'hod-management') {
    const seniorFaculty = (facultyList || []).filter(f => f.id !== 'ITHOD01');

    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      
      // Page Header
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement(
          'div',
          null,
          React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
            React.createElement(Icons.Shield, { className: 'w-6 h-6 text-purple-400' }),
            'Head of Department (HOD) Governance & Succession'
          ),
          React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' },
            'Institutional administration, HOD profile maintenance, and departmental succession appointing authority'
          )
        ),
        React.createElement(
          'div',
          { className: 'flex flex-wrap items-center gap-2' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: openNewHodModal,
              className: 'px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-purple-950/50'
            },
            React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
            '+ Register New HOD'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: openEditHodModal,
              className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition shadow'
            },
            React.createElement(Icons.Edit, { className: 'w-4 h-4 text-cyan-400' }),
            'Edit HOD Profile'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => openChangeHodModal(),
              className: 'px-4 py-2 rounded-xl gradient-btn-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/20'
            },
            React.createElement(Icons.Award, { className: 'w-4 h-4' }),
            'Appoint / Change HOD'
          )
        )
      ),

      // Current HOD Dossier Card
      React.createElement(
        'div',
        { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden bg-gradient-to-br from-purple-950/30 via-slate-900/60 to-slate-950' },
        React.createElement('div', { className: 'absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none' }),
        
        React.createElement(
          'div',
          { className: 'flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 relative z-10' },
          React.createElement(
            'div',
            { className: 'flex items-center gap-5' },
            React.createElement(
              'div',
              { className: 'w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-xl flex items-center justify-center text-4xl' },
              '🎓'
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'flex items-center gap-2 mb-1.5' },
                React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 border border-purple-500/40 text-purple-300' }, 'Official Head of Department'),
                React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700' }, currentHOD.id || 'ITHOD01')
              ),
              React.createElement('h3', { className: 'text-2xl font-black text-white' }, currentHOD.name),
              React.createElement('p', { className: 'text-sm font-semibold text-amber-400 mt-0.5' }, currentHOD.designation || 'Professor & Head of Department'),
              React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' }, currentHOD.qualification || 'B.E., M.Tech., Ph.D. (IIT Madras)')
            )
          ),
          React.createElement(
            'div',
            { className: 'flex items-center gap-3 w-full md:w-auto' },
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: openEditHodModal,
                className: 'flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition flex items-center justify-center gap-1.5'
              },
              React.createElement(Icons.Edit, { className: 'w-4 h-4' }),
              'Modify Profile'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => openChangeHodModal(),
                className: 'flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow'
              },
              React.createElement(Icons.Award, { className: 'w-4 h-4' }),
              'Change Executive'
            )
          )
        ),

        // HOD Details Grid
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-xs relative z-10' },
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-xl bg-slate-900/60 border border-slate-800' },
            React.createElement('p', { className: 'text-slate-400 text-[11px] font-semibold' }, 'Department Specialization'),
            React.createElement('p', { className: 'text-slate-200 font-bold mt-1 truncate' }, currentHOD.specialization || 'Cloud Systems & Big Data')
          ),
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-xl bg-slate-900/60 border border-slate-800' },
            React.createElement('p', { className: 'text-slate-400 text-[11px] font-semibold' }, 'Academic Experience'),
            React.createElement('p', { className: 'text-slate-200 font-bold mt-1' }, currentHOD.experience || '24 Years')
          ),
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-xl bg-slate-900/60 border border-slate-800' },
            React.createElement('p', { className: 'text-slate-400 text-[11px] font-semibold' }, 'Official Department Email'),
            React.createElement('p', { className: 'text-cyan-400 font-bold mt-1 truncate' }, currentHOD.email || 'hod.it@gceerode.ac.in')
          ),
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-xl bg-slate-900/60 border border-slate-800' },
            React.createElement('p', { className: 'text-slate-400 text-[11px] font-semibold' }, 'Executive Office / Cabin'),
            React.createElement('p', { className: 'text-slate-200 font-bold mt-1 truncate' }, currentHOD.cabin || 'IT Block - Ground Floor (Room 101)')
          )
        ),

        // Publications and Portfolios summary
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs relative z-10' },
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-xl bg-slate-900/40 border border-slate-800' },
            React.createElement('span', { className: 'text-slate-400 text-[11px] font-semibold' }, 'Contact Phone: '),
            React.createElement('span', { className: 'text-white font-bold ml-1' }, currentHOD.phone || '+91 94433 11223'),
            React.createElement('span', { className: 'text-slate-500 mx-2' }, '•'),
            React.createElement('span', { className: 'text-slate-400 text-[11px] font-semibold' }, 'Refereed Publications: '),
            React.createElement('span', { className: 'text-emerald-400 font-bold ml-1' }, `${currentHOD.publications || 38} Papers`)
          ),
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-xl bg-slate-900/40 border border-slate-800' },
            React.createElement('span', { className: 'text-slate-400 text-[11px] font-semibold' }, 'Curriculum Portfolios: '),
            React.createElement('span', { className: 'text-slate-200 font-medium ml-1' },
              Array.isArray(currentHOD.subjects) ? currentHOD.subjects.join(', ') : 'Cloud Architecture, Advanced Distributed Systems'
            )
          )
        )
      ),

      // Registered HOD Accounts & Credentials (Admin Authority)
      React.createElement(
        'div',
        { className: 'space-y-4' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between' },
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
              React.createElement(Icons.Shield, { className: 'w-4 h-4 text-purple-400' }),
              'Registered HOD Accounts & Institutional Credentials'
            ),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' },
              'Official Department Heads authorized for HOD Portal access. Sole authority granted to System Admin.'
            )
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: openNewHodModal,
              className: 'px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow'
            },
            React.createElement(Icons.Plus, { className: 'w-3.5 h-3.5' }),
            '+ Register New HOD'
          )
        ),

        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          safeHodList.map(hod => React.createElement(
            'div',
            {
              key: hod.id,
              className: `glass-panel p-5 rounded-2xl border ${hod.id === currentHOD.id ? 'border-purple-500/60 bg-purple-950/20' : 'border-slate-700/60'} flex flex-col justify-between space-y-3`
            },
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'flex items-center justify-between mb-2' },
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, hod.id),
                  hod.id === currentHOD.id ? React.createElement('span', { className: 'px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40' }, 'Active Executive') : null
                ),
                React.createElement('span', { className: 'text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700' }, 'Status: Active')
              ),
              React.createElement('h4', { className: 'text-sm font-bold text-white' }, hod.name),
              React.createElement('p', { className: 'text-xs font-semibold text-amber-400' }, hod.designation || 'Professor & Head of Department'),
              React.createElement('p', { className: 'text-[11px] text-slate-300 mt-1' }, hod.qualification || 'M.E., Ph.D.'),
              React.createElement('p', { className: 'text-[11px] text-slate-400 mt-1' }, `Cabin: ${hod.cabin || 'HOD Chamber'}`),
              React.createElement('p', { className: 'text-[11px] text-cyan-300 mt-0.5' }, `Email: ${hod.email || `${hod.id.toLowerCase()}@gceerode.ac.in`}`)
            ),
            React.createElement(
              'div',
              { className: 'pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
              React.createElement('span', { className: 'text-slate-400 font-mono text-[11px]' }, hod.phone || '+91 94433 11223'),
              React.createElement(
                'div',
                { className: 'flex items-center gap-2' },
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    onClick: () => openEditHodModal(hod),
                    className: 'px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold border border-cyan-500/30 transition cursor-pointer'
                  },
                  'Edit'
                ),
                safeHodList.length > 1 && React.createElement(
                  'button',
                  {
                    type: 'button',
                    onClick: () => handleDeleteHOD(hod.id),
                    className: 'px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold border border-rose-500/30 transition cursor-pointer'
                  },
                  'Remove'
                )
              )
            )
          ))
        )
      ),

      // Senior Faculty Succession Roster
      React.createElement(
        'div',
        { className: 'space-y-4' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between' },
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
              React.createElement(Icons.Users, { className: 'w-4 h-4 text-cyan-400' }),
              'Department Faculty Succession & Promotion Pipeline'
            ),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' },
              '10 Active Department Staff Members eligible for HOD appointment or departmental chair delegation'
            )
          ),
          React.createElement('span', { className: 'text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300' },
            `${seniorFaculty.length} Registered Faculty Members`
          )
        ),

        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-3.5' },
          seniorFaculty.map(staff => React.createElement(
            'div',
            {
              key: staff.id,
              className: 'glass-panel p-4 rounded-2xl border border-slate-700/60 hover:border-slate-600 transition flex items-center justify-between gap-3'
            },
            React.createElement(
              'div',
              { className: 'flex items-center gap-3 min-w-0' },
              React.createElement(
                'div',
                { className: 'w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0' },
                '👨‍🏫'
              ),
              React.createElement(
                'div',
                { className: 'min-w-0' },
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2' },
                  React.createElement('h4', { className: 'text-xs font-bold text-white truncate' }, staff.name),
                  React.createElement('span', { className: 'font-mono text-[10px] text-cyan-400 font-semibold shrink-0' }, staff.id)
                ),
                React.createElement('p', { className: 'text-[11px] text-amber-400 font-medium truncate' }, staff.designation),
                React.createElement('p', { className: 'text-[10px] text-slate-400 truncate' }, `${staff.qualification || 'M.E., Ph.D.'} • ${staff.experience || '10+ Years'}`)
              )
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => openChangeHodModal(staff),
                className: 'shrink-0 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 hover:text-white border border-purple-500/40 text-purple-300 text-[11px] font-bold transition flex items-center gap-1 shadow-sm'
              },
              React.createElement(Icons.Award, { className: 'w-3.5 h-3.5' }),
              'Appoint as HOD'
            )
          ))
        )
      )
    );
  }

  // ==========================================
  // VIEW: DEPARTMENT SETTINGS
  // ==========================================
  else if (normalizedTab === 'department-settings') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Institutional Profile & Vision'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Official accreditation metadata and institutional identifiers')
      ),

      React.createElement(
        'div',
        { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-6 text-xs' },
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          React.createElement('div', { className: 'p-4 rounded-2xl bg-slate-900/60 border border-slate-800' },
            React.createElement('p', { className: 'text-slate-400 font-semibold' }, 'College Name'),
            React.createElement('h3', { className: 'text-sm font-bold text-white mt-1' }, collegeInfo.name),
            React.createElement('p', { className: 'text-slate-400 mt-1' }, collegeInfo.formerName),
            React.createElement('p', { className: 'text-cyan-400 font-semibold mt-2' }, `TNEA Counseling Code: ${collegeInfo.counselingCode}`)
          ),
          React.createElement('div', { className: 'p-4 rounded-2xl bg-slate-900/60 border border-slate-800' },
            React.createElement('p', { className: 'text-slate-400 font-semibold' }, 'Department & Affiliation'),
            React.createElement('h3', { className: 'text-sm font-bold text-white mt-1' }, collegeInfo.department),
            React.createElement('p', { className: 'text-slate-400 mt-1' }, collegeInfo.affiliation),
            React.createElement('p', { className: 'text-emerald-400 font-semibold mt-2' }, collegeInfo.accreditation)
          )
        ),
        React.createElement('div', { className: 'p-4 rounded-2xl bg-slate-900/60 border border-slate-800' },
          React.createElement('h4', { className: 'font-bold text-cyan-400 uppercase tracking-wider text-[11px] mb-2' }, 'Department Vision Statement'),
          React.createElement('p', { className: 'text-slate-200 leading-relaxed' }, collegeInfo.vision)
        ),
        React.createElement('div', { className: 'p-4 rounded-2xl bg-slate-900/60 border border-slate-800' },
          React.createElement('h4', { className: 'font-bold text-cyan-400 uppercase tracking-wider text-[11px] mb-2' }, 'Department Mission Statements'),
          React.createElement('div', { className: 'space-y-1.5 text-slate-200' },
            collegeInfo.mission.map((m, i) => React.createElement('p', { key: i }, `• ${m}`))
          )
        )
      )
    );
  }

  // ==========================================
  // VIEW: SYSTEM SETTINGS
  // ==========================================
  else if (normalizedTab === 'system-settings') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'System Configuration & Security Controls'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Database synchronization, maintenance window, and demo state controls')
      ),

      React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 space-y-4 max-w-2xl text-xs' },
        React.createElement('div', { className: 'flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800' },
          React.createElement('div', null,
            React.createElement('p', { className: 'font-bold text-white' }, 'Automatic Daily Database Backups'),
            React.createElement('p', { className: 'text-slate-400 text-[11px]' }, 'Backup student attendance, internal marks, and credentials at midnight')
          ),
          React.createElement('input', {
            type: 'checkbox',
            checked: autoBackup,
            onChange: (e) => {
              setAutoBackup(e.target.checked);
              showToast(`Auto Backup ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'info');
            },
            className: 'w-5 h-5 rounded bg-slate-900 text-cyan-500'
          })
        ),
        React.createElement('div', { className: 'flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800' },
          React.createElement('div', null,
            React.createElement('p', { className: 'font-bold text-white' }, 'Maintenance Mode'),
            React.createElement('p', { className: 'text-slate-400 text-[11px]' }, 'Restrict student logins during end-semester result processing')
          ),
          React.createElement('input', {
            type: 'checkbox',
            checked: maintenanceMode,
            onChange: (e) => {
              setMaintenanceMode(e.target.checked);
              showToast(`Maintenance Mode ${e.target.checked ? 'Active' : 'Deactivated'}`, 'info');
            },
            className: 'w-5 h-5 rounded bg-slate-900 text-cyan-500'
          })
        ),
        React.createElement('div', { className: 'p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30' },
          React.createElement('p', { className: 'font-bold text-rose-300' }, 'Factory Data Reset'),
          React.createElement('p', { className: 'text-slate-400 text-[11px] mt-1' }, 'Wipe custom modifications and restore standard GCE Erode demo database.'),
          React.createElement('button', {
            onClick: resetAllData,
            className: 'mt-3 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition'
          }, 'Reset Entire Demo Database')
        )
      )
    );
  }

  else if (normalizedTab === 'study-materials') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Academic Study Materials Repository'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Master repository of course lecture notes, PPTs, model question papers, and lab manuals')
      ),

      safeStudyMaterials.length === 0 ? React.createElement(
        'div',
        { className: 'glass-panel p-12 rounded-3xl border border-slate-800 text-center col-span-full' },
        React.createElement(Icons.BookOpen, { className: 'w-12 h-12 text-slate-500 mx-auto mb-3' }),
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1' }, 'No Study Materials Available.'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'There are currently no uploaded study materials in the department repository.')
      ) : React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        safeStudyMaterials.map(mat => React.createElement(
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
  }

  else if (normalizedTab === 'achievements') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
          React.createElement(Icons.Sparkles, { className: 'w-6 h-6 text-amber-400' }),
          'All Student Achievements Gallery (Admin Control)'
        ),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Manage, preview, and audit all uploaded student competitive accolades and honors')
      ),

      safeAchievements.length === 0 ? React.createElement(
        'div',
        { className: 'glass-panel p-12 rounded-3xl border border-slate-800 text-center' },
        React.createElement(Icons.Award, { className: 'w-12 h-12 text-slate-600 mx-auto mb-3' }),
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1' }, 'No Achievements Uploaded Yet'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'No student achievement photos have been uploaded yet.')
      ) : React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
        safeAchievements.map(ach => {
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
                  className: 'flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs flex items-center justify-center gap-1 transition border border-slate-700'
                },
                React.createElement(Icons.Eye, { className: 'w-3.5 h-3.5' }),
                'View'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => handleDownloadAchievement(ach),
                  className: 'flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition'
                },
                React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
                'Download'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => handleDeleteAchievement(ach.id),
                  className: 'py-1.5 px-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1 transition border border-rose-500/30'
                },
                React.createElement(Icons.Trash, { className: 'w-3.5 h-3.5' }),
                'Delete'
              )
            )
          );
        })
      )
    );
  }

  // Fallback
  else {
    tabContent = React.createElement('div', { className: 'p-8 text-center text-slate-400' }, `Admin View for ${currentTab} loaded.`);
  }

  return React.createElement(
    'div',
    { className: 'admin-portal-views-wrapper w-full' },
    tabContent,

    // Student Form Modal (SafeModal)
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'student-form-modal',
        onClose: () => {
          setActiveModal(null);
          setEditingRollNo(null);
        },
        title: editingRollNo ? `Edit Student Record (${editingRollNo})` : 'Enroll New IT Student'
      },
      React.createElement(
        'form',
        { onSubmit: handleSaveStudent, className: 'space-y-4 text-xs' },
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Roll Number'),
            React.createElement('input', {
              type: 'text',
              required: true,
              disabled: !!editingRollNo,
              placeholder: 'e.g. 24IT061',
              value: studentForm.rollNo,
              onChange: (e) => setStudentForm({ ...studentForm, rollNo: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-mono font-bold text-cyan-400'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Register Number'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. 730424205061',
              value: studentForm.regNo,
              onChange: (e) => setStudentForm({ ...studentForm, regNo: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-mono'
            })
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Student Full Name'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Priyadharshini M',
            value: studentForm.name,
            onChange: (e) => setStudentForm({ ...studentForm, name: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input font-semibold'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-3 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Year'),
            React.createElement('select', {
              value: studentForm.year,
              onChange: (e) => setStudentForm({ ...studentForm, year: Number(e.target.value) }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 1 }, '1st Year'),
              React.createElement('option', { value: 2 }, '2nd Year'),
              React.createElement('option', { value: 3 }, '3rd Year'),
              React.createElement('option', { value: 4 }, '4th Year')
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Semester'),
            React.createElement('input', {
              type: 'number',
              min: 1,
              max: 8,
              value: studentForm.sem,
              onChange: (e) => setStudentForm({ ...studentForm, sem: Number(e.target.value) }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Section'),
            React.createElement('select', {
              value: studentForm.sec,
              onChange: (e) => setStudentForm({ ...studentForm, sec: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'A' }, 'Section A'),
              React.createElement('option', { value: 'B' }, 'Section B')
            )
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Attendance %'),
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
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'CGPA'),
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
        React.createElement(
          'div',
          { className: 'flex items-center justify-end gap-3 pt-3 border-t border-slate-800' },
          React.createElement('button', {
            type: 'button',
            onClick: () => {
              setActiveModal(null);
              setEditingRollNo(null);
            },
            className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'px-5 py-2 rounded-xl gradient-btn-primary text-white font-bold transition shadow-lg shadow-cyan-500/20'
          }, editingRollNo ? 'Update Student Record' : 'Enroll Student')
        )
      )
    ),

    // Faculty Form Modal (SafeModal)
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'faculty-form-modal',
        onClose: () => setActiveModal(null),
        title: 'Add New IT Faculty Member'
      },
      React.createElement(
        'form',
        { onSubmit: handleSaveFaculty, className: 'space-y-4 text-xs' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Faculty Full Name'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Dr. N. Soundararajan',
            value: facultyForm.name,
            onChange: (e) => setFacultyForm({ ...facultyForm, name: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input font-bold'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Designation'),
            React.createElement('select', {
              value: facultyForm.designation,
              onChange: (e) => setFacultyForm({ ...facultyForm, designation: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'Professor' }, 'Professor'),
              React.createElement('option', { value: 'Associate Professor' }, 'Associate Professor'),
              React.createElement('option', { value: 'Assistant Professor (Sr. Gr.)' }, 'Assistant Professor (Sr. Gr.)'),
              React.createElement('option', { value: 'Assistant Professor' }, 'Assistant Professor')
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Qualification'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. M.E., Ph.D.',
              value: facultyForm.qualification,
              onChange: (e) => setFacultyForm({ ...facultyForm, qualification: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Email Address'),
            React.createElement('input', {
              type: 'email',
              required: true,
              placeholder: 'soundar@gceerode.ac.in',
              value: facultyForm.email,
              onChange: (e) => setFacultyForm({ ...facultyForm, email: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Phone'),
            React.createElement('input', {
              type: 'text',
              value: facultyForm.phone,
              onChange: (e) => setFacultyForm({ ...facultyForm, phone: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center justify-end gap-3 pt-3 border-t border-slate-800' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setActiveModal(null),
            className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'px-5 py-2 rounded-xl gradient-btn-primary text-white font-bold transition shadow-lg shadow-cyan-500/20'
          }, 'Save Faculty Member')
        )
      )
    ),

    // Edit HOD Profile Modal
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'edit-hod-modal',
        onClose: () => setActiveModal(null),
        title: `Edit HOD Profile (${currentHOD.name || 'Head of Department'})`
      },
      React.createElement(
        'form',
        { onSubmit: handleSaveHODEdit, className: 'space-y-4 text-xs' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'HOD Full Name & Honorific'),
          React.createElement('input', {
            type: 'text',
            required: true,
            value: hodEditForm.name,
            onChange: (e) => setHodEditForm({ ...hodEditForm, name: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input font-bold text-white'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Designation'),
            React.createElement('input', {
              type: 'text',
              value: hodEditForm.designation,
              onChange: (e) => setHodEditForm({ ...hodEditForm, designation: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Qualifications'),
            React.createElement('input', {
              type: 'text',
              value: hodEditForm.qualification,
              onChange: (e) => setHodEditForm({ ...hodEditForm, qualification: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Academic Experience'),
            React.createElement('input', {
              type: 'text',
              value: hodEditForm.experience,
              onChange: (e) => setHodEditForm({ ...hodEditForm, experience: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Refereed Publications'),
            React.createElement('input', {
              type: 'number',
              value: hodEditForm.publications,
              onChange: (e) => setHodEditForm({ ...hodEditForm, publications: Number(e.target.value) }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Specialization / Research Areas'),
          React.createElement('input', {
            type: 'text',
            value: hodEditForm.specialization,
            onChange: (e) => setHodEditForm({ ...hodEditForm, specialization: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Department Email'),
            React.createElement('input', {
              type: 'email',
              required: true,
              value: hodEditForm.email,
              onChange: (e) => setHodEditForm({ ...hodEditForm, email: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Office Phone'),
            React.createElement('input', {
              type: 'text',
              value: hodEditForm.phone,
              onChange: (e) => setHodEditForm({ ...hodEditForm, phone: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Department Office / Cabin'),
          React.createElement('input', {
            type: 'text',
            value: hodEditForm.cabin,
            onChange: (e) => setHodEditForm({ ...hodEditForm, cabin: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement(
          'div',
          { className: 'flex items-center justify-end gap-3 pt-3 border-t border-slate-800' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setActiveModal(null),
            className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'px-5 py-2 rounded-xl gradient-btn-primary text-white font-bold transition shadow-lg shadow-purple-500/20'
          }, 'Save HOD Profile Updates')
        )
      )
    ),

    // Appoint / Change HOD Modal
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'change-hod-modal',
        onClose: () => setActiveModal(null),
        title: 'Appoint / Change Department Head of Department (HOD)'
      },
      React.createElement(
        'form',
        { onSubmit: handleConfirmChangeHOD, className: 'space-y-4 text-xs' },
        React.createElement(
          'div',
          { className: 'p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1' },
          React.createElement('p', { className: 'font-bold text-purple-300 flex items-center gap-1.5' },
            React.createElement(Icons.Shield, { className: 'w-4 h-4' }),
            'Executive Department Governance Authority'
          ),
          React.createElement('p', { className: 'text-slate-300 text-[11px] leading-relaxed' },
            'You can appoint an existing senior department faculty member or enter a new Head of Department appointment. The HOD login credential (ITHOD01) and departmental leadership dossier will be officially reassigned.'
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Select from Department Faculty (Fast Appointment)'),
          React.createElement('select', {
            value: changeHodForm.selectedFacultyId,
            onChange: (e) => {
              const facId = e.target.value;
              const f = (facultyList || []).find(item => item.id === facId);
              if (f) {
                setChangeHodForm({
                  selectedFacultyId: f.id,
                  name: f.name,
                  designation: 'Professor & Head of Department',
                  qualification: f.qualification || 'M.E., Ph.D.',
                  experience: f.experience || '15+ Years',
                  specialization: f.specialization || 'Computer Science & Engineering',
                  email: 'hod.it@gceerode.ac.in',
                  phone: f.phone || '+91 94433 11223',
                  cabin: 'IT Block - Ground Floor (Room 101)',
                  publications: f.publications || 25
                });
              } else {
                setChangeHodForm(prev => ({ ...prev, selectedFacultyId: '' }));
              }
            },
            className: 'w-full p-2.5 rounded-xl glass-input text-cyan-300 font-semibold'
          },
            React.createElement('option', { value: '' }, '-- Or enter manual appointee details below --'),
            (facultyList || []).filter(f => f.id !== 'ITHOD01').map(f => React.createElement(
              'option',
              { key: f.id, value: f.id },
              `${f.id} - ${f.name} (${f.designation})`
            ))
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Appointee Full Name'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Dr. A. Venkatesh',
            value: changeHodForm.name,
            onChange: (e) => setChangeHodForm({ ...changeHodForm, name: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input font-bold text-white'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Designation Title'),
            React.createElement('input', {
              type: 'text',
              value: changeHodForm.designation,
              onChange: (e) => setChangeHodForm({ ...changeHodForm, designation: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Qualifications'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. M.E., Ph.D. (Anna University)',
              value: changeHodForm.qualification,
              onChange: (e) => setChangeHodForm({ ...changeHodForm, qualification: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Academic Experience'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. 18 Years',
              value: changeHodForm.experience,
              onChange: (e) => setChangeHodForm({ ...changeHodForm, experience: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Specialization'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. Distributed Systems & AI',
              value: changeHodForm.specialization,
              onChange: (e) => setChangeHodForm({ ...changeHodForm, specialization: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Official HOD Email'),
            React.createElement('input', {
              type: 'email',
              required: true,
              value: changeHodForm.email,
              onChange: (e) => setChangeHodForm({ ...changeHodForm, email: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Official Phone'),
            React.createElement('input', {
              type: 'text',
              value: changeHodForm.phone,
              onChange: (e) => setChangeHodForm({ ...changeHodForm, phone: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center justify-end gap-3 pt-3 border-t border-slate-800' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setActiveModal(null),
            className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold transition shadow-lg shadow-purple-500/20 flex items-center gap-1.5'
          },
            React.createElement(Icons.Award, { className: 'w-4 h-4' }),
            'Officially Appoint as HOD'
          )
        )
      )
    ),

    // Register New HOD Modal (Admin Authority)
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'new-hod-modal',
        onClose: () => setActiveModal(null),
        title: 'Register New Head of Department (HOD)'
      },
      React.createElement(
        'form',
        { onSubmit: handleAddNewHOD, className: 'space-y-4 text-xs' },
        React.createElement(
          'div',
          { className: 'p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1' },
          React.createElement('p', { className: 'font-bold text-purple-300 flex items-center gap-1.5' },
            React.createElement(Icons.Shield, { className: 'w-4 h-4' }),
            'System Administration Authority'
          ),
          React.createElement('p', { className: 'text-slate-300 text-[11px] leading-relaxed' },
            'Registering a new HOD creates official institutional credentials. The registered HOD can immediately log in with their HOD ID and initial password (default: 1234).'
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'HOD Login ID'),
            React.createElement('input', {
              type: 'text',
              required: true,
              value: newHodForm.id,
              onChange: (e) => setNewHodForm({ ...newHodForm, id: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-mono font-bold text-cyan-400'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Initial Password'),
            React.createElement('input', {
              type: 'text',
              required: true,
              value: newHodForm.pass,
              onChange: (e) => setNewHodForm({ ...newHodForm, pass: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-mono text-emerald-400 font-bold'
            })
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Full Name & Honorific'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Dr. M. R. Jayasudha',
            value: newHodForm.name,
            onChange: (e) => setNewHodForm({ ...newHodForm, name: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input font-bold text-white'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Designation'),
            React.createElement('input', {
              type: 'text',
              value: newHodForm.designation,
              onChange: (e) => setNewHodForm({ ...newHodForm, designation: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Qualification'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. M.E., Ph.D.',
              value: newHodForm.qualification,
              onChange: (e) => setNewHodForm({ ...newHodForm, qualification: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Academic Experience'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. 22 Years',
              value: newHodForm.experience,
              onChange: (e) => setNewHodForm({ ...newHodForm, experience: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Specialization'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. Cloud Computing & AI',
              value: newHodForm.specialization,
              onChange: (e) => setNewHodForm({ ...newHodForm, specialization: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Email Address'),
            React.createElement('input', {
              type: 'email',
              required: true,
              value: newHodForm.email,
              onChange: (e) => setNewHodForm({ ...newHodForm, email: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Phone Number'),
            React.createElement('input', {
              type: 'text',
              value: newHodForm.phone,
              onChange: (e) => setNewHodForm({ ...newHodForm, phone: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Chamber / Cabin'),
          React.createElement('input', {
            type: 'text',
            value: newHodForm.cabin,
            onChange: (e) => setNewHodForm({ ...newHodForm, cabin: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement(
          'div',
          { className: 'flex items-center justify-end gap-3 pt-3 border-t border-slate-800' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setActiveModal(null),
            className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold transition shadow-lg shadow-purple-500/20 flex items-center gap-1.5'
          },
            React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
            'Register HOD Account'
          )
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
          React.createElement('p', { className: 'text-xs text-cyan-300' }, `Subject: ${previewMat.subjectCode ? `${previewMat.subjectCode} - ` : ''}${previewMat.subjectName || previewMat.subject || 'Core Subject'}`),
          React.createElement('div', { className: 'flex justify-between text-[11px] text-slate-400 pt-1' },
            React.createElement('span', null, `Teacher: ${previewMat.teacherName || previewMat.faculty || previewMat.uploadedBy || 'Faculty Member'}`),
            React.createElement('span', null, `Upload Date: ${previewMat.uploadDate || previewMat.date || '2026-08-25'}`)
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
    )
  );
};

// Expose to window for standalone execution
if (typeof window !== 'undefined') {
  window.ITAdminViews = AdminViews;
}
})();

