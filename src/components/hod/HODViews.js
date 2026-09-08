// IT DIGITAL HUB - HOD Views (Executive Department Analytics & Governance)
// Department of Information Technology - Government College of Engineering, Erode

(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));
const { StatCard, Modal } = (typeof window !== 'undefined' && window.UIComponents) || {};

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
        { className: 'p-6 overflow-y-auto space-y-4 text-slate-200 text-xs' },
        children
      )
    )
  );
};

const HODViews = ({ currentTab, onNavigate }) => {

  const {
    currentUser,
    collegeInfo,
    facultyList,
    students,
    subjects,
    studyMaterials,
    achievements,
    hodAnalytics,
    announcements,
    messages,
    classAdvisors,
    addAnnouncement,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    updateClassAdvisor,
    sendMessage,
    updateMessageStatus,
    showToast
  } = useAuth();

  const safeFacultyList = Array.isArray(facultyList) ? facultyList : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const safeMessages = Array.isArray(messages) ? messages : [];
  const safeStudyMaterials = Array.isArray(studyMaterials) ? studyMaterials : [];
  const safeAchievements = Array.isArray(achievements) ? achievements : [];

  const safeAnalytics = hodAnalytics || {
    averageAttendance: 88.5,
    averageInternalMarks: 76.2,
    placementRate: '94%',
    semesterAttendanceTrend: [
      { semester: 'Sem 1', avgAttendance: 91.2 },
      { semester: 'Sem 2', avgAttendance: 89.4 },
      { semester: 'Sem 3', avgAttendance: 87.8 },
      { semester: 'Sem 4', avgAttendance: 86.5 }
    ],
    internalMarksDistribution: [
      { range: '90-100%', studentCount: 45, percentage: 18.75 },
      { range: '75-89%', studentCount: 110, percentage: 45.83 },
      { range: '60-74%', studentCount: 65, percentage: 27.08 },
      { range: '< 60%', studentCount: 20, percentage: 8.33 }
    ]
  };

  const normalizedTab = 
    (currentTab === 'profile' || currentTab === 'hod-profile') ? 'hod-profile' :
    (currentTab === 'students' || currentTab === 'student-management') ? 'student-management' :
    (currentTab === 'staff' || currentTab === 'staff-management') ? 'staff-management' :
    (currentTab === 'attendance' || currentTab === 'attendance-monitoring') ? 'attendance-monitoring' :
    (currentTab === 'marks' || currentTab === 'internal-marks-monitoring' || currentTab === 'internal-marks') ? 'internal-marks-monitoring' :
    (currentTab === 'performance' || currentTab === 'student-performance') ? 'student-performance' :
    (currentTab === 'subjects' || currentTab === 'subject-management') ? 'subject-management' :
    (currentTab === 'timetable' || currentTab === 'timetable-management') ? 'timetable-management' :
    (currentTab === 'announcements' || currentTab === 'department-announcements') ? 'department-announcements' :
    (currentTab === 'materials' || currentTab === 'study-materials') ? 'study-materials' :
    (currentTab === 'achievements' || currentTab === 'hod-achievements') ? 'achievements' :
    (currentTab === 'placements' || currentTab === 'placement-internship') ? 'placement-internship' :
    (currentTab === 'reports' || currentTab === 'department-reports') ? 'reports' :
    (currentTab === 'messages' || currentTab === 'hod-messages') ? 'messages' :
    (currentTab === 'notifications' || currentTab === 'hod-notifications') ? 'notifications' :
    currentTab;

  const [activeModal, setActiveModal] = React.useState(null);
  const [facultySearch, setFacultySearch] = React.useState('');
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

  // Faculty CRUD State (HOD Staff Governance)
  const [facultyForm, setFacultyForm] = React.useState({
    id: '',
    name: '',
    designation: 'Assistant Professor',
    qualification: 'M.E., (Ph.D.)',
    experience: '5 Years',
    specialization: 'Information Technology',
    email: '',
    phone: '+91 98421 00000',
    cabin: 'Room 306, IT Block - 2nd Floor',
    subjects: 'Database Management Systems, Web Technologies',
    classAdvisorFor: null
  });
  const [editingFacultyId, setEditingFacultyId] = React.useState(null);

  // Messaging Form State (Feature 3: HOD DM to Everybody)
  const [hodMsgForm, setHodMsgForm] = React.useState({
    recipientType: 'ALL', // 'ALL' | 'STAFF' | 'STUDENTS' | 'SPECIFIC'
    specificTargetId: safeFacultyList[0]?.id || 'ITSTAFF01',
    subject: '',
    content: '',
    priority: 'Normal'
  });

  // HOD Circular creator
  const [hodCircular, setHodCircular] = React.useState({
    title: '',
    category: 'Academic',
    priority: 'High',
    content: '',
    author: 'Dr. S. K. Murugesan (Professor & HOD)'
  });

  const handleOpenAddFaculty = () => {
    setEditingFacultyId(null);
    setFacultyForm({
      id: `ITSTAFF0${(safeFacultyList.length + 1).toString().padStart(2, '0')}`,
      name: '',
      designation: 'Assistant Professor',
      qualification: 'M.E., (Ph.D.)',
      experience: '5 Years',
      specialization: 'Information Technology',
      email: '',
      phone: '+91 98421 00000',
      cabin: 'Room 306, IT Block - 2nd Floor',
      subjects: 'Database Management Systems, Web Technologies',
      classAdvisorFor: null
    });
    setActiveModal('faculty-form-modal');
  };

  const handleOpenEditFaculty = (f) => {
    setEditingFacultyId(f.id);
    setFacultyForm({
      id: f.id,
      name: f.name || '',
      designation: f.designation || 'Associate Professor',
      qualification: f.qualification || 'M.E., Ph.D.',
      experience: f.experience || '10 Years',
      specialization: f.specialization || 'Computer Science & IT',
      email: f.email || `${f.id.toLowerCase()}@gceerode.ac.in`,
      phone: f.phone || '+91 98421 00000',
      cabin: f.cabin || 'IT Block',
      subjects: Array.isArray(f.subjects) ? f.subjects.join(', ') : (f.subjects || ''),
      classAdvisorFor: f.classAdvisorFor || null
    });
    setActiveModal('faculty-form-modal');
  };

  const handleSaveFaculty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!facultyForm.name || !facultyForm.email) {
      showToast('Please provide Faculty Name and Email', 'error');
      return;
    }

    const payload = {
      ...facultyForm,
      subjects: typeof facultyForm.subjects === 'string'
        ? facultyForm.subjects.split(',').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(facultyForm.subjects) ? facultyForm.subjects : ['Information Technology'])
    };

    if (editingFacultyId) {
      updateFaculty(editingFacultyId, payload);
    } else {
      addFaculty(payload);
    }
    setActiveModal(null);
    setEditingFacultyId(null);
  };

  const handlePublishHODCircular = (e) => {
    e.preventDefault();
    if (!hodCircular.title || !hodCircular.content) {
      showToast('Please fill all circular fields', 'error');
      return;
    }
    addAnnouncement(hodCircular);
    setActiveModal(null);
    setHodCircular({
      title: '',
      category: 'Academic',
      priority: 'High',
      content: '',
      author: 'Dr. S. K. Murugesan (Professor & HOD)'
    });
  };

  const handleSendHodMessage = (e) => {
    e.preventDefault();
    if (!hodMsgForm.subject || !hodMsgForm.content) {
      showToast('Please enter subject and message text', 'error');
      return;
    }

    let targetId = 'ALL';
    let targetName = 'All Department Staff & Students';
    let targetRole = 'all';
    let msgType = 'Broadcast';

    if (hodMsgForm.recipientType === 'STAFF') {
      targetId = 'ALL_STAFF';
      targetName = 'All Faculty Members';
      targetRole = 'staff';
    } else if (hodMsgForm.recipientType === 'STUDENTS') {
      targetId = 'ALL_STUDENTS';
      targetName = 'All IT Students (I to IV Year)';
      targetRole = 'student';
    } else if (hodMsgForm.recipientType === 'SPECIFIC') {
      const isStaff = facultyList.find(f => f.id === hodMsgForm.specificTargetId);
      const isStd = students.find(s => s.rollNo === hodMsgForm.specificTargetId);
      targetId = hodMsgForm.specificTargetId;
      targetName = isStaff ? isStaff.name : isStd ? `${isStd.name} (${isStd.rollNo})` : hodMsgForm.specificTargetId;
      targetRole = isStaff ? 'staff' : 'student';
      msgType = 'DM';
    }

    sendMessage({
      fromId: 'ITHOD01',
      fromName: 'Dr. S. K. Murugesan (Professor & HOD)',
      fromRole: 'hod',
      toId: targetId,
      toName: targetName,
      toRole: targetRole,
      type: msgType,
      subject: hodMsgForm.subject,
      content: hodMsgForm.content
    });

    setHodMsgForm({
      recipientType: 'ALL',
      specificTargetId: facultyList[0]?.id || 'ITSTAFF01',
      subject: '',
      content: '',
      priority: 'Normal'
    });
  };

  let tabContent = null;

  // ==========================================
  // VIEW: HOD DASHBOARD (EXECUTIVE ANALYTICS)
  // ==========================================
  if (normalizedTab === 'dashboard') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },

      // Welcome Banner
      React.createElement(
        'div',
        { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-slate-900/60 relative overflow-hidden' },
        React.createElement('div', { className: 'absolute right-0 top-0 w-80 h-full bg-purple-500/10 rounded-full blur-3xl pointer-events-none' }),
        React.createElement(
          'div',
          { className: 'relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30' },
              'Head of Department Executive Portal'
            ),
            React.createElement('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2' },
              'Department Overview & Analytics Dashboard'
            ),
            React.createElement('p', { className: 'text-xs sm:text-sm text-slate-300 mt-1' },
              'Dr. S. K. Murugesan, M.E., Ph.D. • Information Technology • Autonomous R2021'
            )
          ),
          React.createElement(
            'div',
            { className: 'flex items-center gap-3' },
            React.createElement(
              'button',
              {
                type: 'button',
                id: 'btn-hod-banner-add-faculty',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpenAddFaculty();
                },
                className: 'px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-purple-900/40 transition cursor-pointer'
              },
              React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
              '+ Add Faculty'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => onNavigate('messages'),
                className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-semibold text-white flex items-center gap-2 cursor-pointer'
              },
              React.createElement(Icons.Send, { className: 'w-4 h-4' }),
              'DM to Everybody'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => onNavigate('reports'),
                className: 'px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 hover:bg-slate-800 transition cursor-pointer'
              },
              React.createElement(Icons.FileText, { className: 'w-4 h-4 text-purple-400' }),
              'Export Report'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => onNavigate('gallery'),
                className: 'px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition cursor-pointer'
              },
              React.createElement(Icons.Image, { className: 'w-4 h-4' }),
              'Gallery Monitoring'
            )
          )
        )
      ),

      // 6 Executive KPI StatCards
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4' },
        React.createElement(StatCard, {
          title: 'Total IT Students',
          value: safeStudents.length.toString(),
          subtitle: '4 Batches (I to IV Year)',
          icon: Icons.Users,
          color: 'blue',
          onClick: () => onNavigate('student-management')
        }),
        React.createElement(StatCard, {
          title: 'Faculty Members',
          value: safeFacultyList.length.toString(),
          subtitle: 'Active IT Professors',
          icon: Icons.Award,
          color: 'purple',
          onClick: () => onNavigate('staff-management')
        }),
        React.createElement(StatCard, {
          title: 'Dept Avg Attendance',
          value: `${safeAnalytics.averageAttendance}%`,
          subtitle: 'Target: > 85%',
          icon: Icons.CheckCircle,
          color: 'emerald',
          onClick: () => onNavigate('attendance-monitoring')
        }),
        React.createElement(StatCard, {
          title: 'CIA Internal Average',
          value: `${safeAnalytics.averageInternalMarks}%`,
          subtitle: 'Even Sem Midterm Audit',
          icon: Icons.BarChart,
          color: 'blue',
          onClick: () => onNavigate('internal-marks-monitoring')
        }),
        React.createElement(StatCard, {
          title: 'Staff Requests',
          value: messages.filter(m => m.toRole === 'hod' && m.type === 'Request').length.toString(),
          subtitle: 'Proposals awaiting sanction',
          icon: Icons.MessageSquare,
          color: 'amber',
          onClick: () => onNavigate('messages')
        }),
        React.createElement(StatCard, {
          title: 'Placement Rate',
          value: safeAnalytics.placementRate,
          subtitle: 'Highest: ₹18.5 LPA',
          icon: Icons.Briefcase,
          color: 'emerald',
          onClick: () => onNavigate('placement-internship')
        })
      ),

      // Visual Interactive Charts Row 1: Attendance Trends & Grade Distribution
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },

        // Attendance Trends Chart
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
                React.createElement(Icons.BarChart, { className: 'w-5 h-5 text-cyan-400' }),
                'Semester-wise Average Attendance Matrix (%)'
              ),
              React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' }, 'Audited across all 8 semesters')
            ),
            React.createElement('span', { className: 'text-xs font-mono font-bold text-cyan-300' }, 'Overall: 88.4%')
          ),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            safeAnalytics.semesterAttendanceTrend.map(sem => React.createElement(
              'div',
              { key: sem.semester, className: 'space-y-1' },
              React.createElement('div', { className: 'flex justify-between text-xs font-semibold' },
                React.createElement('span', { className: 'text-slate-300' }, sem.semester),
                React.createElement('span', { className: 'font-mono text-cyan-400' }, `${sem.avgAttendance}%`)
              ),
              React.createElement(
                'div',
                { className: 'w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800' },
                React.createElement('div', {
                  className: `h-full rounded-full ${sem.avgAttendance >= 90 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`,
                  style: { width: `${sem.avgAttendance}%` }
                })
              )
            ))
          )
        ),

        // Internal Marks Distribution Chart
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
                React.createElement(Icons.PieChart, { className: 'w-5 h-5 text-purple-400' }),
                'Internal Examination Marks Distribution'
              ),
              React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' }, 'Continuous Internal Assessment Cohort Breakdown')
            ),
            React.createElement('span', { className: 'text-xs font-mono font-bold text-purple-300' }, '240 Students')
          ),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            safeAnalytics.internalMarksDistribution.map((item, idx) => React.createElement(
              'div',
              { key: idx, className: 'p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs' },
              React.createElement('div', null,
                React.createElement('p', { className: 'font-bold text-white' }, item.range),
                React.createElement('p', { className: 'text-[11px] text-slate-400' }, `${item.studentCount} Students (${item.percentage}%)`)
              ),
              React.createElement(
                'div',
                { className: 'w-32 h-2.5 bg-slate-950 rounded-full overflow-hidden' },
                React.createElement('div', {
                  className: `h-full rounded-full ${idx === 0 ? 'bg-cyan-400' : idx === 1 ? 'bg-emerald-400' : idx === 2 ? 'bg-purple-400' : idx === 3 ? 'bg-amber-400' : 'bg-rose-500'}`,
                  style: { width: `${item.percentage * 2}%` }
                })
              )
            ))
          )
        )
      )
    );
  } else if (normalizedTab === 'staff-management') {
    const filteredFaculty = safeFacultyList.filter(f => {
      if (!facultySearch.trim()) return true;
      const q = facultySearch.toLowerCase();
      return (
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.id && f.id.toLowerCase().includes(q)) ||
        (f.designation && f.designation.toLowerCase().includes(q)) ||
        (f.specialization && f.specialization.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q))
      );
    });

    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
            'Faculty Governance & Class Advisor Allocation',
            React.createElement('span', { className: 'text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30' }, `${safeFacultyList.length} Professors`)
          ),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'HOD Privilege: Add new faculty, edit staff profiles, and allocate year-wise Class Advisors')
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            id: 'btn-add-new-faculty',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              handleOpenAddFaculty();
            },
            className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-purple-950/40 hover:brightness-110 active:scale-95 transition cursor-pointer'
          },
          React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
          '+ Add New Faculty Member'
        )
      ),

      // Year-wise Class Advisor Allocation Panel (Feature 5)
      React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/20 via-slate-900 to-slate-950 space-y-4' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('h3', { className: 'text-base font-bold text-cyan-300 flex items-center gap-2' },
            React.createElement(Icons.Award, { className: 'w-5 h-5 text-cyan-400' }),
            'Year-wise Class Advisor Appointments'
          ),
          React.createElement('span', { className: 'text-xs text-slate-400' }, '1 Dedicated Staff per Batch Year')
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
          [1, 2, 3, 4].map(year => {
            const advisorInfo = (classAdvisors && classAdvisors[year]) || {};
            return React.createElement(
              'div',
              { key: year, className: 'p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs' },
              React.createElement('div', { className: 'flex justify-between items-center' },
                React.createElement('span', { className: 'font-bold text-white' }, `Year ${year}`),
                React.createElement('span', { className: 'text-[10px] text-cyan-400 font-mono' }, advisorInfo?.batch || '')
              ),
              React.createElement('p', { className: 'text-emerald-300 font-semibold text-xs' }, `Advisor: ${advisorInfo?.name || advisorInfo?.staffName || 'Unassigned'}`),
              React.createElement('div', { className: 'pt-2 border-t border-slate-800' },
                React.createElement('label', { className: 'block text-[10px] text-slate-400 mb-1' }, 'Assign Advisor:'),
                React.createElement('select', {
                  value: advisorInfo?.staffId || '',
                  onChange: (e) => updateClassAdvisor(year, e.target.value),
                  className: 'w-full p-1.5 rounded-lg glass-input text-xs font-semibold text-cyan-300'
                },
                  safeFacultyList.map(f => React.createElement('option', { key: f.id, value: f.id }, f.name))
                )
              )
            );
          })
        )
      ),

      // Search & Faculty Filter Bar
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800' },
        React.createElement(
          'div',
          { className: 'relative w-full sm:w-80' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search faculty by name, ID, domain, cabin...',
            value: facultySearch,
            onChange: (e) => setFacultySearch(e.target.value),
            className: 'w-full px-3 py-2 rounded-xl glass-input text-xs text-white'
          })
        ),
        React.createElement(
          'div',
          { className: 'flex items-center gap-3 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end' },
          React.createElement('span', null, `Showing ${filteredFaculty.length} of ${safeFacultyList.length} Faculty Members`),
          facultySearch ? React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setFacultySearch(''),
              className: 'px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]'
            },
            'Clear Search'
          ) : null
        )
      ),

      // Faculty Roster Grid
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
        filteredFaculty.map(f => React.createElement(
          'div',
          { key: f.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition' },
          React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, f.id),
              f.classAdvisorLabel ? React.createElement('span', { className: 'px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, f.classAdvisorLabel) : null
            ),
            React.createElement('h3', { className: 'text-sm font-bold text-white' }, f.name),
            React.createElement('p', { className: 'text-xs font-semibold text-purple-400' }, f.designation),
            React.createElement('p', { className: 'text-[11px] text-slate-300 mt-1' }, f.qualification),
            React.createElement('p', { className: 'text-[11px] text-slate-400 mt-1' }, `Cabin: ${f.cabin || 'IT Block'}`),
            React.createElement('p', { className: 'text-[11px] text-slate-400' }, `Specialization: ${f.specialization || 'Information Technology'}`),
            f.subjects && f.subjects.length ? React.createElement(
              'div',
              { className: 'mt-2 flex flex-wrap gap-1' },
              (Array.isArray(f.subjects) ? f.subjects : [f.subjects]).map((sub, sIdx) => React.createElement(
                'span',
                { key: sIdx, className: 'px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60' },
                sub
              ))
            ) : null
          ),
          React.createElement(
            'div',
            { className: 'pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
            React.createElement('span', { className: 'text-slate-400 font-mono text-[11px]' }, f.phone || '+91 98421 00000'),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenEditFaculty(f);
                  },
                  className: 'px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold border border-cyan-500/30 transition cursor-pointer'
                },
                'Edit'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm(`Remove faculty record for ${f.name}?`)) {
                      deleteFaculty(f.id);
                    }
                  },
                  className: 'px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold border border-rose-500/30 transition cursor-pointer'
                },
                'Delete'
              )
            )
          )
        ))
      )
    );
  } else if (normalizedTab === 'messages') {
    const hodIncomingRequests = (messages || []).filter(m => m.toRole === 'hod' || m.toId === 'ITHOD01');

    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
          React.createElement(Icons.Send, { className: 'w-6 h-6 text-purple-400' }),
          'Executive Communication & Broadcast Console'
        ),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'HOD Direct Messaging: Send direct messages (DMs) to everybody (Staff, Students, or Broadcast) and sanction staff proposals')
      ),

      // Two Column Layout: Compose DM to Everybody & Review Incoming Requests
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },

        // Compose Message Box
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-purple-500/40 bg-gradient-to-b from-purple-950/20 to-slate-950 space-y-4' },
          React.createElement('h3', { className: 'text-base font-bold text-purple-300 flex items-center gap-2' },
            React.createElement(Icons.MessageSquare, { className: 'w-5 h-5 text-purple-400' }),
            'Send Direct Message (DM) / Broadcast'
          ),
          React.createElement(
            'form',
            { onSubmit: handleSendHodMessage, className: 'space-y-4 text-xs' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Select Recipient Target'),
              React.createElement('select', {
                value: hodMsgForm.recipientType,
                onChange: (e) => setHodMsgForm({ ...hodMsgForm, recipientType: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input font-bold text-purple-300'
              },
                React.createElement('option', { value: 'ALL' }, '📢 Entire Department (Broadcast to All Staff & Students)'),
                React.createElement('option', { value: 'STAFF' }, '👨‍🏫 All Faculty Members Only'),
                React.createElement('option', { value: 'STUDENTS' }, '👨‍🎓 All Students Only (I to IV Year)'),
                React.createElement('option', { value: 'SPECIFIC' }, '👤 Specific Individual (Select Staff or Student)')
              )
            ),

            hodMsgForm.recipientType === 'SPECIFIC' && React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Choose Specific Member'),
              React.createElement('select', {
                value: hodMsgForm.specificTargetId,
                onChange: (e) => setHodMsgForm({ ...hodMsgForm, specificTargetId: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('optgroup', { label: 'Faculty Members' },
                  facultyList.map(f => React.createElement('option', { key: f.id, value: f.id }, `${f.name} (${f.designation})`))
                ),
                React.createElement('optgroup', { label: 'Students' },
                  students.map(s => React.createElement('option', { key: s.rollNo, value: s.rollNo }, `${s.rollNo} - ${s.name}`))
                )
              )
            ),

            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Subject Title'),
              React.createElement('input', {
                type: 'text',
                required: true,
                placeholder: 'e.g. Department Academic Review & Autonomous Syllabus Updates',
                value: hodMsgForm.subject,
                onChange: (e) => setHodMsgForm({ ...hodMsgForm, subject: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Message Text'),
              React.createElement('textarea', {
                rows: 4,
                required: true,
                placeholder: 'Write instructions, announcement, or directive...',
                value: hodMsgForm.content,
                onChange: (e) => setHodMsgForm({ ...hodMsgForm, content: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            ),
            React.createElement('button', {
              type: 'submit',
              className: 'w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-[1.01] transition'
            }, 'Send Message / Broadcast Live')
          )
        ),

        // Incoming Faculty Requests
        React.createElement(
          'div',
          { className: 'space-y-4' },
          React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
            React.createElement(Icons.Inbox, { className: 'w-5 h-5 text-amber-400' }),
            `Staff Proposals & Sanction Queue (${hodIncomingRequests.length})`
          ),
          hodIncomingRequests.length === 0 ? React.createElement(
            'div',
            { className: 'glass-panel p-8 text-center rounded-2xl text-slate-400 text-xs' },
            'No pending faculty proposals or requests.'
          ) : hodIncomingRequests.map(msg => React.createElement(
            'div',
            { key: msg.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 space-y-2 text-xs' },
            React.createElement(
              'div',
              { className: 'flex items-center justify-between pb-2 border-b border-slate-800' },
              React.createElement('span', { className: 'font-bold text-white' }, msg.subject),
              React.createElement('span', { className: 'text-[11px] text-slate-400 font-mono' }, msg.timestamp)
            ),
            React.createElement('p', { className: 'text-slate-300 leading-relaxed' }, msg.content),
            React.createElement(
              'div',
              { className: 'flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/80' },
              React.createElement('span', null, `From: `, React.createElement('strong', { className: 'text-cyan-300' }, msg.fromName)),
              React.createElement(
                'div',
                { className: 'flex items-center gap-2' },
                React.createElement('span', { className: 'font-semibold text-amber-400' }, `Status: ${msg.status}`),
                msg.status === 'Pending' && React.createElement(
                  'button',
                  {
                    onClick: () => updateMessageStatus(msg.id, 'Approved'),
                    className: 'px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30'
                  },
                  'Sanction & Approve'
                ),
                msg.status === 'Pending' && React.createElement(
                  'button',
                  {
                    onClick: () => updateMessageStatus(msg.id, 'Rejected'),
                    className: 'px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30'
                  },
                  'Decline'
                )
              )
            )
          ))
        )
      )
    );
  } else if (normalizedTab === 'study-materials') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Academic Study Materials Repository'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Official repository of course lecture notes, PPTs, model question papers, and lab manuals')
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
  } else if (normalizedTab === 'achievements') {
    tabContent = React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
          React.createElement(Icons.Sparkles, { className: 'w-6 h-6 text-amber-400' }),
          'Department Student Achievements Gallery'
        ),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Executive review of student competitive programming awards, hackathon victories, and academic accolades')
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
  } else {
    tabContent = React.createElement('div', { className: 'p-8 text-center text-slate-400' }, `View ${currentTab} loaded.`);
  }

  // ==========================================
  // RENDER MAIN VIEW CONTENT + SHARED MODALS
  // ==========================================
  return React.createElement(
    'div',
    { className: 'hod-portal-views-wrapper w-full' },
    tabContent,

    // Modal: Faculty Add / Edit Form (Feature 1)
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'faculty-form-modal',
        onClose: () => {
          setActiveModal(null);
          setEditingFacultyId(null);
        },
        title: editingFacultyId ? `Edit Faculty Record - ${editingFacultyId}` : 'Add New Department Faculty Member'
      },
      React.createElement(
        'form',
        { onSubmit: handleSaveFaculty, className: 'space-y-4 text-xs' },
        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Staff ID'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. ITSTAFF06',
              value: facultyForm.id || '',
              disabled: !!editingFacultyId,
              onChange: (e) => setFacultyForm({ ...facultyForm, id: e.target.value.toUpperCase() }),
              className: `w-full p-2.5 rounded-xl glass-input font-mono font-bold ${editingFacultyId ? 'opacity-60 cursor-not-allowed' : ''}`
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Full Faculty Name *'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. Dr. R. Saravanan',
              value: facultyForm.name,
              onChange: (e) => setFacultyForm({ ...facultyForm, name: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-bold'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Designation'),
            React.createElement('select', {
              value: facultyForm.designation,
              onChange: (e) => setFacultyForm({ ...facultyForm, designation: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'Professor' }, 'Professor'),
              React.createElement('option', { value: 'Associate Professor' }, 'Associate Professor'),
              React.createElement('option', { value: 'Assistant Professor (Sr. Gr.)' }, 'Assistant Professor (Sr. Gr.)'),
              React.createElement('option', { value: 'Assistant Professor' }, 'Assistant Professor'),
              React.createElement('option', { value: 'Adjunct Professor' }, 'Adjunct Professor')
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Highest Qualification'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. M.E., Ph.D.',
              value: facultyForm.qualification,
              onChange: (e) => setFacultyForm({ ...facultyForm, qualification: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Official Email *'),
            React.createElement('input', {
              type: 'email',
              required: true,
              placeholder: 'faculty@gceerode.ac.in',
              value: facultyForm.email,
              onChange: (e) => setFacultyForm({ ...facultyForm, email: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-mono'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Contact Phone Number'),
            React.createElement('input', {
              type: 'text',
              placeholder: '+91 98421 00000',
              value: facultyForm.phone,
              onChange: (e) => setFacultyForm({ ...facultyForm, phone: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Office Cabin / Room'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Room 306, IT Block - 2nd Floor',
              value: facultyForm.cabin,
              onChange: (e) => setFacultyForm({ ...facultyForm, cabin: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Academic Experience'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. 8 Years',
              value: facultyForm.experience,
              onChange: (e) => setFacultyForm({ ...facultyForm, experience: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Technical Specialization'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. Machine Learning, Cloud Architecture',
              value: facultyForm.specialization,
              onChange: (e) => setFacultyForm({ ...facultyForm, specialization: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Subjects Handled (comma-separated)'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'e.g. DBMS, Web Technologies, Cloud Computing',
              value: typeof facultyForm.subjects === 'string' ? facultyForm.subjects : (Array.isArray(facultyForm.subjects) ? facultyForm.subjects.join(', ') : ''),
              onChange: (e) => setFacultyForm({ ...facultyForm, subjects: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          )
        ),
        React.createElement('div', { className: 'flex items-center gap-2 pt-3 border-t border-slate-800' },
          React.createElement('button', {
            type: 'button',
            onClick: () => {
              setActiveModal(null);
              setEditingFacultyId(null);
            },
            className: 'w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'w-2/3 py-2.5 rounded-xl gradient-btn-primary text-white font-bold transition shadow-lg shadow-purple-950/40 hover:brightness-110 active:scale-95 cursor-pointer'
          }, editingFacultyId ? 'Update Faculty Record' : 'Confirm & Add Faculty Member')
        )
      )
    ),

    // Modal: HOD Circular
    React.createElement(
      SafeModal,
      {
        isOpen: activeModal === 'publish-circular',
        onClose: () => setActiveModal(null),
        title: 'Issue Official Department Circular'
      },
      React.createElement(
        'form',
        { onSubmit: handlePublishHODCircular, className: 'space-y-4 text-xs' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Circular Title'),
          React.createElement('input', {
            type: 'text',
            required: true,
            placeholder: 'e.g. Schedule for Autonomous End Semester Practical Examinations',
            value: hodCircular.title,
            onChange: (e) => setHodCircular({ ...hodCircular, title: e.target.value }),
            className: 'w-full p-2.5 rounded-xl glass-input'
          })
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block font-bold uppercase text-slate-300 mb-1' }, 'Detailed Announcement Content'),
          React.createElement('textarea', {
            rows: 4,
            required: true,
            placeholder: 'Type circular details...',
            value: hodCircular.content,
            onChange: (e) => setHodCircular({ ...hodCircular, content: e.target.value }),
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
          }, 'Broadcast Circular Live')
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
    )
  );
};

// Expose to window for standalone execution
if (typeof window !== 'undefined') {
  window.ITHODViews = HODViews;
}
})();
