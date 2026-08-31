// IT DIGITAL HUB - Staff / Faculty Views (All 11+ Modules)
// Department of Information Technology - Government College of Engineering, Erode

(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));
const { StatCard, Modal } = (typeof window !== 'undefined' && window.UIComponents) || {};

const StaffViews = ({ currentTab, onNavigate }) => {

  const {
    currentUser,
    facultyList,
    students,
    subjects,
    assignments,
    studyMaterials,
    announcements,
    timetable,
    addStudyMaterial,
    createAssignment,
    gradeAssignment,
    addAnnouncement,
    showToast
  } = useAuth();

  const activeFaculty = facultyList.find(f => f.id === currentUser?.id) || facultyList[1]; // default to Dr. A. Venkatesh

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
    (currentTab === 'notifications' || currentTab === 'staff-notifications') ? 'notifications' :
    currentTab;


  // Modal States
  const [activeModal, setActiveModal] = React.useState(null);

  // Attendance Marker State
  const [attendanceDate, setAttendanceDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [selectedSubjCode, setSelectedSubjCode] = React.useState('IT8401');
  const [attendanceSheet, setAttendanceSheet] = React.useState(() => {
    return students.map(s => ({ rollNo: s.rollNo, name: s.name, status: 'P' })); // P: Present, A: Absent, OD: On-Duty
  });

  // Marks Entry State
  const [marksExamType, setMarksExamType] = React.useState('CIA-1');
  const [marksSheet, setMarksSheet] = React.useState(() => {
    return students.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      score: Math.floor(Math.random() * 12) + 38,
      maxScore: 50
    }));
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
    uploadedBy: activeFaculty.name
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

  // Grading Modal Form
  const [gradingTarget, setGradingTarget] = React.useState(null);
  const [gradeInput, setGradeInput] = React.useState({ score: 18, remarks: 'Good implementation.' });

  // Filter students
  const [studentSearch, setStudentSearch] = React.useState('');
  const [filterYear, setFilterYear] = React.useState('ALL');

  const filteredStudents = students.filter(s => {
    const matchYear = filterYear === 'ALL' || s.year.toString() === filterYear;
    const matchQuery = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNo.toLowerCase().includes(studentSearch.toLowerCase());
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

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    const presentCount = attendanceSheet.filter(s => s.status === 'P' || s.status === 'OD').length;
    showToast(`Attendance for ${selectedSubjCode} (${attendanceDate}) saved! ${presentCount}/${attendanceSheet.length} Present`, 'success');
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    showToast(`${marksExamType} marks saved and published for ${selectedSubjCode}!`, 'success');
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

  const handleUploadMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.title) {
      showToast('Please enter material title', 'error');
      return;
    }
    addStudyMaterial(newMaterial);
    setActiveModal(null);
    setNewMaterial({
      title: '',
      subjectCode: 'IT8401',
      subjectName: 'Database Management Systems',
      category: 'Lecture Notes',
      fileSize: '3.5 MB',
      fileType: 'PDF',
      uploadedBy: activeFaculty.name
    });
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

  // ==========================================
  // VIEW: DASHBOARD OVERVIEW
  // ==========================================
  if (normalizedTab === 'dashboard') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },

      // Welcome Banner
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
            React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
              'Faculty Portal • Even Semester 2026'
            ),
            React.createElement('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2' },
              'Welcome, ', React.createElement('span', { className: 'gradient-text-emerald' }, activeFaculty.name)
            ),
            React.createElement('p', { className: 'text-xs sm:text-sm text-slate-300 mt-1' },
              `${activeFaculty.designation} • Cabin ${activeFaculty.cabin} • ${activeFaculty.experience} Experience`
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
                onClick: () => onNavigate('internal-marks'),
                className: 'px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 hover:bg-slate-800 transition'
              },
              React.createElement(Icons.Edit, { className: 'w-4 h-4 text-emerald-400' }),
              'Enter Marks'
            )
          )
        )
      ),

      // Metrics Row
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
        React.createElement(StatCard, {
          title: 'Assigned Students',
          value: students.length.toString(),
          subtitle: 'II Year IT Section A & B',
          icon: Icons.Users,
          color: 'blue',
          onClick: () => onNavigate('student-list')
        }),
        React.createElement(StatCard, {
          title: 'Handled Courses',
          value: activeFaculty.subjects.length.toString(),
          subtitle: 'IT8401 DBMS, Lab & Electives',
          icon: Icons.BookOpen,
          color: 'emerald',
          onClick: () => onNavigate('my-subjects')
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
          title: 'Average Class Attendance',
          value: '89.2%',
          subtitle: '9 students at risk (<75%)',
          icon: Icons.PieChart,
          color: 'purple',
          onClick: () => onNavigate('student-performance')
        })
      ),

      // Two Column Layout: Today's Teaching Schedule & Quick Actions
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

        // Quick Shortcuts
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between space-y-4' },
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'text-base font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2' },
              React.createElement(Icons.Sparkles, { className: 'w-5 h-5 text-cyan-400' }),
              'Faculty Quick Actions'
            ),
            React.createElement(
              'div',
              { className: 'space-y-2.5' },
              React.createElement(
                'button',
                {
                  onClick: () => setActiveModal('create-assignment'),
                  className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                },
                React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Plus, { className: 'w-4 h-4 text-emerald-400' }), 'Create New Assignment'),
                React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
              ),
              React.createElement(
                'button',
                {
                  onClick: () => setActiveModal('upload-material'),
                  className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-xs font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                },
                React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Upload, { className: 'w-4 h-4 text-cyan-400' }), 'Upload Lecture Notes / PPT'),
                React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
              ),
              React.createElement(
                'button',
                {
                  onClick: () => setActiveModal('post-notice'),
                  className: 'w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 text-xs font-bold text-left text-slate-200 hover:text-white flex items-center justify-between transition'
                },
                React.createElement('span', { className: 'flex items-center gap-2' }, React.createElement(Icons.Bell, { className: 'w-4 h-4 text-amber-400' }), 'Broadcast Class Notice'),
                React.createElement(Icons.ChevronRight, { className: 'w-4 h-4 text-slate-500' })
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300' },
            '💡 Tip: CIA-1 marks submission window closes on Friday.'
          )
        )
      ),

      // Modals
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'create-assignment',
          onClose: () => setActiveModal(null),
          title: 'Create Course Assignment'
        },
        React.createElement(
          'form',
          { onSubmit: handleCreateAssignment, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Assignment Title'),
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
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Subject'),
              React.createElement('select', {
                value: newAsn.subjectCode,
                onChange: (e) => setNewAsn({ ...newAsn, subjectCode: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                subjects.map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.short}`))
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Due Date'),
              React.createElement('input', {
                type: 'date',
                value: newAsn.dueDate,
                onChange: (e) => setNewAsn({ ...newAsn, dueDate: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Instructions & Deliverables'),
            React.createElement('textarea', {
              rows: 3,
              required: true,
              placeholder: 'Specify submission format, test cases, and problem description...',
              value: newAsn.instructions,
              onChange: (e) => setNewAsn({ ...newAsn, instructions: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', { type: 'submit', className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold' }, 'Publish Assignment')
        )
      ),

      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'upload-material',
          onClose: () => setActiveModal(null),
          title: 'Upload Study Material / Lecture Notes'
        },
        React.createElement(
          'form',
          { onSubmit: handleUploadMaterial, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Material Title'),
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
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Subject'),
              React.createElement('select', {
                value: newMaterial.subjectCode,
                onChange: (e) => setNewMaterial({ ...newMaterial, subjectCode: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                subjects.map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.short}`))
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Category'),
              React.createElement('select', {
                value: newMaterial.category,
                onChange: (e) => setNewMaterial({ ...newMaterial, category: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('option', { value: 'Lecture Notes' }, 'Lecture Notes'),
                React.createElement('option', { value: 'Question Bank' }, 'Question Bank'),
                React.createElement('option', { value: 'Presentation Slides' }, 'Presentation Slides (PPT)'),
                React.createElement('option', { value: 'Lab Manual' }, 'Lab Manual')
              )
            )
          ),
          React.createElement('button', { type: 'submit', className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold' }, 'Upload Material')
        )
      ),

      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'post-notice',
          onClose: () => setActiveModal(null),
          title: 'Broadcast Department Notice'
        },
        React.createElement(
          'form',
          { onSubmit: handlePublishNotice, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Notice Title'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. Lab Cycle 1 Record Submission Deadline',
              value: newNotice.title,
              onChange: (e) => setNewNotice({ ...newNotice, title: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Category'),
              React.createElement('select', {
                value: newNotice.category,
                onChange: (e) => setNewNotice({ ...newNotice, category: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('option', { value: 'Academic' }, 'Academic'),
                React.createElement('option', { value: 'Event' }, 'Event / Symposium'),
                React.createElement('option', { value: 'Lab Notice' }, 'Lab Notice')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Priority'),
              React.createElement('select', {
                value: newNotice.priority,
                onChange: (e) => setNewNotice({ ...newNotice, priority: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('option', { value: 'Normal' }, 'Normal'),
                React.createElement('option', { value: 'High' }, 'High Priority'),
                React.createElement('option', { value: 'Urgent' }, 'Urgent')
              )
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Notice Content'),
            React.createElement('textarea', {
              rows: 3,
              required: true,
              placeholder: 'Detailed announcement text...',
              value: newNotice.content,
              onChange: (e) => setNewNotice({ ...newNotice, content: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', { type: 'submit', className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold' }, 'Broadcast Live')
        )
      )
    );
  }

  // ==========================================
  // VIEW: ATTENDANCE MANAGEMENT
  // ==========================================
  if (normalizedTab === 'attendance-management') {
    const presentTotal = attendanceSheet.filter(s => s.status === 'P').length;
    const absentTotal = attendanceSheet.filter(s => s.status === 'A').length;
    const odTotal = attendanceSheet.filter(s => s.status === 'OD').length;

    return React.createElement(
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
              subjects.map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.short}`))
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
  }

  // ==========================================
  // VIEW: INTERNAL MARKS ENTRY
  // ==========================================
  if (normalizedTab === 'internal-marks') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Internal Marks Spreadsheet Entry'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Enter marks for CIA-1 (50), CIA-2 (50), or Model Exam (100) with instant calculation')
        ),
        React.createElement(
          'button',
          {
            onClick: handleSaveMarks,
            className: 'px-5 py-2.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2'
          },
          React.createElement(Icons.CheckCircle, { className: 'w-4 h-4' }),
          'Publish Marks to Students'
        )
      ),

      // Controls
      React.createElement(
        'div',
        { className: 'glass-panel p-4 rounded-2xl border border-slate-700/60 flex flex-wrap items-center gap-4 text-xs' },
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
          React.createElement('label', { className: 'block font-semibold text-slate-400 mb-1' }, 'Assessment Type'),
          React.createElement('select', {
            value: marksExamType,
            onChange: (e) => setMarksExamType(e.target.value),
            className: 'p-2 rounded-xl glass-input'
          },
            React.createElement('option', { value: 'CIA-1' }, 'Continuous Internal Assessment 1 (Max 50)'),
            React.createElement('option', { value: 'CIA-2' }, 'Continuous Internal Assessment 2 (Max 50)'),
            React.createElement('option', { value: 'Model Exam' }, 'Model Examination (Max 100)'),
            React.createElement('option', { value: 'Assignment' }, 'Assignment & Seminar (Max 10)')
          )
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
                React.createElement('th', null, 'Percentage'),
                React.createElement('th', null, 'Estimated Grade')
              )
            ),
            React.createElement(
              'tbody',
              null,
              marksSheet.map(row => {
                const pct = ((row.score / row.maxScore) * 100).toFixed(1);
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
                      className: 'w-24 p-1.5 rounded-lg glass-input font-mono font-bold text-cyan-300 text-center'
                    }),
                    React.createElement('span', { className: 'text-xs text-slate-400 ml-2' }, `/ ${row.maxScore}`)
                  ),
                  React.createElement('td', { className: 'font-mono text-xs text-slate-200' }, `${pct}%`),
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
  }

  // ==========================================
  // VIEW: ASSIGNMENTS MANAGEMENT & EVALUATION
  // ==========================================
  if (normalizedTab === 'assignments') {
    return React.createElement(
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
      ),

      // Grade Modal
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'grade-modal',
          onClose: () => setActiveModal(null),
          title: `Evaluate Submission - ${gradingTarget?.subjectCode}`
        },
        React.createElement(
          'form',
          { onSubmit: handleConfirmGrade, className: 'space-y-4 text-xs' },
          React.createElement('p', { className: 'text-slate-300 font-semibold' }, gradingTarget?.title),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, `Score (Max ${gradingTarget?.maxMarks})`),
            React.createElement('input', {
              type: 'number',
              min: 0,
              max: gradingTarget?.maxMarks,
              required: true,
              value: gradeInput.score,
              onChange: (e) => setGradeInput({ ...gradeInput, score: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input font-bold text-cyan-400'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Remarks / Feedback'),
            React.createElement('textarea', {
              rows: 3,
              placeholder: 'Write constructive remarks...',
              value: gradeInput.remarks,
              onChange: (e) => setGradeInput({ ...gradeInput, remarks: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', { type: 'submit', className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold' }, 'Publish Evaluation')
        )
      )
    );
  }

  // ==========================================
  // VIEW: STUDENT LIST & ROSTER
  // ==========================================
  if (normalizedTab === 'student-list') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Student Roster'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'All registered Information Technology students across batches')
        ),
        React.createElement(
          'div',
          { className: 'flex items-center gap-3' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search by Roll No or Name...',
            value: studentSearch,
            onChange: (e) => setStudentSearch(e.target.value),
            className: 'p-2 rounded-xl glass-input text-xs w-56'
          }),
          React.createElement('select', {
            value: filterYear,
            onChange: (e) => setFilterYear(e.target.value),
            className: 'p-2 rounded-xl glass-input text-xs font-semibold'
          },
            React.createElement('option', { value: 'ALL' }, 'All Years'),
            React.createElement('option', { value: '2' }, 'II Year (IV Sem)'),
            React.createElement('option', { value: '3' }, 'III Year (VI Sem)'),
            React.createElement('option', { value: '4' }, 'IV Year (VIII Sem)')
          )
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
                React.createElement('th', null, 'Student Name'),
                React.createElement('th', null, 'Year / Sem'),
                React.createElement('th', null, 'Attendance %'),
                React.createElement('th', null, 'CGPA'),
                React.createElement('th', null, 'Mentor'),
                React.createElement('th', null, 'Status')
              )
            ),
            React.createElement(
              'tbody',
              null,
              filteredStudents.map(std => React.createElement(
                'tr',
                { key: std.rollNo },
                React.createElement('td', { className: 'font-mono text-xs font-bold text-cyan-400' }, std.rollNo),
                React.createElement('td', { className: 'font-semibold text-white' }, std.name),
                React.createElement('td', { className: 'text-slate-300 text-xs' }, `Year ${std.year} (Sem ${std.sem})`),
                React.createElement('td', { className: `font-mono text-xs font-bold ${std.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}` }, `${std.attendance}%`),
                React.createElement('td', { className: 'font-mono text-xs font-bold text-purple-300' }, std.cgpa),
                React.createElement('td', { className: 'text-slate-400 text-xs' }, std.mentor),
                React.createElement('td', null,
                  React.createElement('span', {
                    className: `badge-it ${
                      std.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      std.status === 'Low Attendance' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`
                  }, std.status)
                )
              ))
            )
          )
        )
      )
    );
  }

  // ==========================================
  // VIEW: MY SUBJECTS
  // ==========================================
  if (normalizedTab === 'my-subjects') {
    return React.createElement(
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
        subjects.filter(s => s.faculty === activeFaculty.name).map(subj => React.createElement(
          'div',
          { key: subj.code, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60' },
          React.createElement('div', { className: 'flex justify-between items-center mb-2' },
            React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30' }, subj.code),
            React.createElement('span', { className: 'text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300' }, `${subj.credits} Credits • ${subj.type}`)
          ),
          React.createElement('h3', { className: 'text-base font-bold text-white mt-1' }, subj.name),
          React.createElement('p', { className: 'text-xs text-slate-300 mt-2' }, subj.description),
          React.createElement('div', { className: 'mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400' },
            React.createElement('span', null, `Total Hours: ${subj.totalHours} hrs`),
            React.createElement('span', { className: 'text-emerald-400 font-bold' }, `Coverage: ${subj.completedUnits}/${subj.syllabusUnits} Units`)
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: STUDENT PERFORMANCE
  // ==========================================
  if (normalizedTab === 'student-performance') {
    const lowAttStudents = students.filter(s => s.attendance < 75);
    const topRankers = students.filter(s => s.cgpa >= 9.0);

    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Class Academic Performance & At-Risk Analytics'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Identify students with low attendance and track departmental rank holders')
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },

        // Low Attendance Alert Card
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-slate-950' },
          React.createElement('div', { className: 'flex items-center justify-between pb-3 mb-3 border-b border-rose-500/20' },
            React.createElement('h3', { className: 'text-base font-bold text-rose-300 flex items-center gap-2' },
              React.createElement(Icons.AlertTriangle, { className: 'w-5 h-5 text-rose-400' }),
              'Students with Low Attendance (< 75%)'
            ),
            React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300' },
              `${lowAttStudents.length} Students`
            )
          ),
          React.createElement(
            'div',
            { className: 'space-y-2.5 max-h-72 overflow-y-auto' },
            lowAttStudents.map(s => React.createElement(
              'div',
              { key: s.rollNo, className: 'p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs' },
              React.createElement('div', null,
                React.createElement('p', { className: 'font-bold text-white' }, `${s.name} (${s.rollNo})`),
                React.createElement('p', { className: 'text-slate-400 text-[11px]' }, `Parent Phone: ${s.phone}`)
              ),
              React.createElement('span', { className: 'font-mono font-bold text-rose-400 bg-rose-950/50 px-2 py-1 rounded-lg border border-rose-500/30' },
                `${s.attendance}%`
              )
            ))
          )
        ),

        // Top Performing Students
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-950' },
          React.createElement('div', { className: 'flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20' },
            React.createElement('h3', { className: 'text-base font-bold text-cyan-300 flex items-center gap-2' },
              React.createElement(Icons.Star, { className: 'w-5 h-5 text-cyan-400' }),
              'Top Performing Rank Holders (CGPA ≥ 9.0)'
            ),
            React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300' },
              `${topRankers.length} Star Performers`
            )
          ),
          React.createElement(
            'div',
            { className: 'space-y-2.5 max-h-72 overflow-y-auto' },
            topRankers.map(s => React.createElement(
              'div',
              { key: s.rollNo, className: 'p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs' },
              React.createElement('div', null,
                React.createElement('p', { className: 'font-bold text-white' }, `${s.name} (${s.rollNo})`),
                React.createElement('p', { className: 'text-slate-400 text-[11px]' }, `Year ${s.year} • Attendance: ${s.attendance}%`)
              ),
              React.createElement('span', { className: 'font-mono font-extrabold text-cyan-300 bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-500/30' },
                `CGPA: ${s.cgpa}`
              )
            ))
          )
        )
      )
    );
  }

  // Fallback
  return React.createElement('div', { className: 'p-8 text-center text-slate-400' }, `Staff View for ${currentTab} loaded.`);
};

// Expose to window for standalone execution
if (typeof window !== 'undefined') {
  window.ITStaffViews = StaffViews;
}
})();

