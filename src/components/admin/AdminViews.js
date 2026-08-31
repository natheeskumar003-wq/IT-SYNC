// IT DIGITAL HUB - Admin Views (System Administration, User CRUD, Curriculum, Settings)
// Department of Information Technology - Government College of Engineering, Erode

(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));
const { StatCard, Modal } = (typeof window !== 'undefined' && window.UIComponents) || {};

const AdminViews = ({ currentTab, onNavigate }) => {

  const {
    collegeInfo,
    students,
    facultyList,
    subjects,
    announcements,
    auditLogs,
    addStudent,
    updateStudent,
    deleteStudent,
    addFaculty,
    deleteFaculty,
    resetAllData,
    showToast
  } = useAuth();

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
    (currentTab === 'reports' || currentTab === 'system-reports') ? 'reports' :
    (currentTab === 'settings' || currentTab === 'system-settings') ? 'system-settings' :
    currentTab;

  const [activeModal, setActiveModal] = React.useState(null);


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

  // ==========================================
  // VIEW: ADMIN DASHBOARD (SYSTEM OVERVIEW)
  // ==========================================
  if (normalizedTab === 'dashboard') {
    return React.createElement(
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
      ),

      // Student Form Modal
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'student-form-modal',
          onClose: () => setActiveModal(null),
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
          React.createElement('button', { type: 'submit', className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold' },
            editingRollNo ? 'Update Student Record' : 'Enroll Student'
          )
        )
      ),

      // Faculty Form Modal
      React.createElement(
        Modal,
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
          React.createElement('button', { type: 'submit', className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold' }, 'Save Faculty Member')
        )
      )
    );
  }

  // ==========================================
  // VIEW: USER & STUDENT MANAGEMENT
  // ==========================================
  if (normalizedTab === 'student-management' || normalizedTab === 'user-management') {
    return React.createElement(
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
  if (normalizedTab === 'staff-management') {
    return React.createElement(
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
  // VIEW: DEPARTMENT SETTINGS
  // ==========================================
  if (normalizedTab === 'department-settings') {
    return React.createElement(
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
  if (normalizedTab === 'system-settings') {
    return React.createElement(
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

  // Fallback
  return React.createElement('div', { className: 'p-8 text-center text-slate-400' }, `Admin View for ${currentTab} loaded.`);
};

// Expose to window for standalone execution
if (typeof window !== 'undefined') {
  window.ITAdminViews = AdminViews;
}
})();

