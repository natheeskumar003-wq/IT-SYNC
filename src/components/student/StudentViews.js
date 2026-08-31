// IT DIGITAL HUB - Student Views (All 17+ Modules & Sub-views)
// Department of Information Technology - Government College of Engineering, Erode

(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));
const { StatCard, Modal } = (typeof window !== 'undefined' && window.UIComponents) || {};

const StudentViews = ({ currentTab, onNavigate }) => {

  const {
    studentProfile,
    subjects,
    attendance,
    internalMarks,
    semesterResults,
    timetable,
    studyMaterials,
    assignments,
    facultyList,
    announcements,
    questionPapers,
    placements,
    achievements,
    certificates,
    notifications,
    submitAssignment,
    addAchievement,
    addCertificate,
    showToast
  } = useAuth();

  // Modal States
  const [activeModal, setActiveModal] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);

  // Form states
  const [submittingAsnId, setSubmittingAsnId] = React.useState(null);
  const [submissionFileName, setSubmissionFileName] = React.useState('');

  const [newAchievement, setNewAchievement] = React.useState({
    title: '',
    category: 'Hackathon',
    issuedBy: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [newCertificate, setNewCertificate] = React.useState({
    name: '',
    issuer: '',
    issueDate: new Date().toISOString().split('T')[0],
    validTill: 'Lifetime',
    credentialId: ''
  });

  const [feedbackForm, setFeedbackForm] = React.useState({
    subject: 'IT8401 Database Management Systems',
    faculty: 'Dr. A. Venkatesh',
    courseContentRating: 5,
    teachingRating: 5,
    practicalLabRating: 5,
    comments: ''
  });

  const [leaveForm, setLeaveForm] = React.useState({
    reasonType: 'On-Duty (OD - Hackathon/Symposium)',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    description: '',
    proofFile: ''
  });

  const normalizedTab = 
    (currentTab === 'profile' || currentTab === 'my-profile') ? 'my-profile' :
    (currentTab === 'subjects' || currentTab === 'my-subjects') ? 'subjects' :
    (currentTab === 'attendance' || currentTab === 'student-attendance') ? 'attendance' :
    (currentTab === 'marks' || currentTab === 'internal-marks') ? 'internal-marks' :
    (currentTab === 'results' || currentTab === 'semester-results') ? 'semester-results' :
    (currentTab === 'materials' || currentTab === 'study-materials') ? 'study-materials' :
    (currentTab === 'assignments' || currentTab === 'student-assignments') ? 'assignments' :
    (currentTab === 'timetable' || currentTab === 'student-timetable') ? 'timetable' :
    (currentTab === 'faculty' || currentTab === 'faculty-details') ? 'faculty-details' :
    (currentTab === 'announcements' || currentTab === 'department-announcements') ? 'department-announcements' :
    (currentTab === 'question-papers' || currentTab === 'previous-year-question-papers') ? 'previous-year-question-papers' :
    (currentTab === 'placements' || currentTab === 'placement' || currentTab === 'placement-internship') ? 'placement-internship' :
    (currentTab === 'achievements' || currentTab === 'student-achievements') ? 'achievements' :
    (currentTab === 'certificates' || currentTab === 'student-certificates') ? 'certificates' :
    (currentTab === 'notifications' || currentTab === 'student-notifications') ? 'notifications' :
    (currentTab === 'feedback' || currentTab === 'student-feedback') ? 'feedback' :
    currentTab;

  // Calculate overall attendance
  const totalHours = attendance.reduce((acc, curr) => acc + curr.total, 0);
  const attendedHours = attendance.reduce((acc, curr) => acc + curr.attended, 0);
  const overallAttendancePct = totalHours > 0 ? ((attendedHours / totalHours) * 100).toFixed(1) : 0;
  const pendingAsnCount = assignments.filter(a => a.status === 'Pending').length;

  // Handle Assignment Submission
  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!submissionFileName) {
      showToast('Please select or name your solution file', 'error');
      return;
    }
    submitAssignment(submittingAsnId, submissionFileName);
    setActiveModal(null);
    setSubmissionFileName('');
  };

  // Handle Achievement Add
  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!newAchievement.title || !newAchievement.issuedBy) {
      showToast('Please fill all required achievement fields', 'error');
      return;
    }
    addAchievement(newAchievement);
    setActiveModal(null);
    setNewAchievement({ title: '', category: 'Hackathon', issuedBy: '', date: new Date().toISOString().split('T')[0], description: '' });
  };

  // Handle Certificate Upload
  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!newCertificate.name || !newCertificate.issuer) {
      showToast('Please fill all certificate fields', 'error');
      return;
    }
    addCertificate(newCertificate);
    setActiveModal(null);
    setNewCertificate({ name: '', issuer: '', issueDate: new Date().toISOString().split('T')[0], validTill: 'Lifetime', credentialId: '' });
  };

  // Handle Feedback Submit
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    showToast('Feedback submitted anonymously to Department Quality Cell. Thank you!', 'success');
    setFeedbackForm({
      subject: 'IT8401 Database Management Systems',
      faculty: 'Dr. A. Venkatesh',
      courseContentRating: 5,
      teachingRating: 5,
      practicalLabRating: 5,
      comments: ''
    });
  };

  // Handle Leave Apply
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    showToast(`Leave / OD Application (${leaveForm.reasonType}) submitted to Faculty Mentor!`, 'success');
    setActiveModal(null);
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
        { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900/60 relative overflow-hidden' },
        React.createElement('div', { className: 'absolute right-0 top-0 w-80 h-full bg-cyan-500/10 rounded-full blur-3xl pointer-events-none' }),
        React.createElement(
          'div',
          { className: 'relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
          React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
              React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, 'Academic Year 2026 - 2027'),
              React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }, 'Autonomous R2021')
            ),
            React.createElement('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-white tracking-tight' },
              'Welcome back, ', React.createElement('span', { className: 'gradient-text-it' }, studentProfile.name), ' 👋'
            ),
            React.createElement('p', { className: 'text-xs sm:text-sm text-slate-300 mt-1' },
              `Roll No: ${studentProfile.rollNo} • ${studentProfile.year} • Section ${studentProfile.section}`
            )
          ),
          React.createElement(
            'div',
            { className: 'flex items-center gap-3' },
            React.createElement(
              'button',
              {
                onClick: () => onNavigate('timetable'),
                className: 'px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 transition'
              },
              React.createElement(Icons.Calendar, { className: 'w-4 h-4 text-cyan-400' }),
              'View Timetable'
            ),
            React.createElement(
              'button',
              {
                onClick: () => onNavigate('assignments'),
                className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-semibold text-white flex items-center gap-2'
              },
              React.createElement(Icons.FileText, { className: 'w-4 h-4' }),
              'Submit Work'
            )
          )
        )
      ),

      // Key Metrics Row (4 StatCards)
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
        React.createElement(StatCard, {
          title: 'Attendance Percentage',
          value: `${overallAttendancePct}%`,
          subtitle: overallAttendancePct >= 75 ? 'Safe (> 75% Criteria)' : 'Warning: Low Attendance',
          icon: Icons.CheckCircle,
          trend: 2.1,
          trendLabel: 'this month',
          color: overallAttendancePct >= 75 ? 'emerald' : 'rose',
          onClick: () => onNavigate('attendance')
        }),
        React.createElement(StatCard, {
          title: 'Current Cumulative CGPA',
          value: studentProfile.cgpa.toFixed(2),
          subtitle: 'Rank 4 in Department',
          icon: Icons.Award,
          trend: 0.12,
          trendLabel: 'from Sem 3',
          color: 'blue',
          onClick: () => onNavigate('semester-results')
        }),
        React.createElement(StatCard, {
          title: 'Internal Average Score',
          value: `${studentProfile.internalAvg}%`,
          subtitle: 'CIA-1 & Model Performance',
          icon: Icons.BarChart,
          color: 'purple',
          onClick: () => onNavigate('internal-marks')
        }),
        React.createElement(StatCard, {
          title: 'Pending Assignments',
          value: pendingAsnCount.toString(),
          subtitle: pendingAsnCount > 0 ? 'Due within next 7 days' : 'All submissions up to date',
          icon: Icons.FileText,
          color: pendingAsnCount > 0 ? 'amber' : 'emerald',
          onClick: () => onNavigate('assignments')
        })
      ),

      // Two Column Layout: Today's Schedule & Quick Circulars
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },

        // Today's Classes (2 Cols)
        React.createElement(
          'div',
          { className: 'lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-700/60' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
                React.createElement(Icons.Calendar, { className: 'w-5 h-5 text-cyan-400' }),
                "Today's Lecture & Lab Schedule"
              ),
              React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' }, 'Tuesday • Semester 4 IT Section A')
            ),
            React.createElement(
              'button',
              { onClick: () => onNavigate('timetable'), className: 'text-xs text-cyan-400 hover:underline font-semibold' },
              'Full Week Grid →'
            )
          ),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            timetable.Tuesday.map((slot, idx) => React.createElement(
              'div',
              {
                key: idx,
                className: 'p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between gap-3 transition'
              },
              React.createElement(
                'div',
                { className: 'flex items-center gap-3' },
                React.createElement(
                  'span',
                  { className: 'w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono text-xs font-bold flex items-center justify-center' },
                  slot.period
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('p', { className: 'text-sm font-bold text-white' }, slot.subject),
                  React.createElement('p', { className: 'text-xs text-slate-400' }, `${slot.faculty} • ${slot.room}`)
                )
              ),
              React.createElement(
                'span',
                { className: 'text-xs font-mono text-cyan-400 font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800' },
                slot.time
              )
            ))
          )
        ),

        // Quick Circulars & Notices (1 Col)
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
              React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
                React.createElement(Icons.Bell, { className: 'w-5 h-5 text-amber-400' }),
                'Recent Notices'
              ),
              React.createElement(
                'button',
                { onClick: () => onNavigate('announcements'), className: 'text-xs text-cyan-400 hover:underline font-semibold' },
                'View All'
              )
            ),
            React.createElement(
              'div',
              { className: 'space-y-3' },
              announcements.slice(0, 3).map(ann => React.createElement(
                'div',
                {
                  key: ann.id,
                  onClick: () => onNavigate('announcements'),
                  className: 'p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer transition'
                },
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between mb-1' },
                  React.createElement('span', {
                    className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ann.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      ann.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`
                  }, ann.category),
                  React.createElement('span', { className: 'text-[10px] text-slate-500' }, ann.date)
                ),
                React.createElement('h4', { className: 'text-xs font-bold text-slate-200 line-clamp-1' }, ann.title),
                React.createElement('p', { className: 'text-[11px] text-slate-400 line-clamp-2 mt-1' }, ann.content)
              ))
            )
          ),
          React.createElement(
            'div',
            { className: 'mt-6 pt-4 border-t border-slate-800 flex items-center justify-between' },
            React.createElement('span', { className: 'text-xs text-slate-400' }, 'Faculty Mentor:'),
            React.createElement('span', { className: 'text-xs font-bold text-cyan-300' }, studentProfile.mentorName)
          )
        )
      )
    );
  }

  // ==========================================
  // VIEW: MY PROFILE
  // ==========================================
  if (normalizedTab === 'my-profile') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60' },
        React.createElement(
          'div',
          { className: 'flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800' },
          React.createElement(
            'div',
            { className: 'w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center text-4xl shadow-xl shadow-cyan-900/40 border border-white/20' },
            '👨‍🎓'
          ),
          React.createElement(
            'div',
            { className: 'flex-1 text-center sm:text-left' },
            React.createElement('div', { className: 'flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2' },
              React.createElement('span', { className: 'badge-it bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, 'Undergraduate B.Tech IT'),
              React.createElement('span', { className: 'badge-it bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }, 'Active Enrolled')
            ),
            React.createElement('h2', { className: 'text-2xl font-extrabold text-white' }, studentProfile.name),
            React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-0.5' },
              `Roll No: ${studentProfile.rollNo} • Register No: ${studentProfile.regNo} • Batch: ${studentProfile.batch}`
            )
          )
        ),

        // Profile Details Grid
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 text-xs' },

          // Academic Info Box
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3' },
            React.createElement('h4', { className: 'font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-2' },
              React.createElement(Icons.GraduationCap, { className: 'w-4 h-4' }),
              'Academic Details'
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Department'),
              React.createElement('span', { className: 'font-semibold text-white' }, studentProfile.department)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Current Year / Sem'),
              React.createElement('span', { className: 'font-semibold text-white' }, studentProfile.year)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Cumulative CGPA'),
              React.createElement('span', { className: 'font-bold text-cyan-300' }, `${studentProfile.cgpa} / 10.0`)
            ),
            React.createElement('div', { className: 'flex justify-between py-1' },
              React.createElement('span', { className: 'text-slate-400' }, 'Hostel / Day Scholar'),
              React.createElement('span', { className: 'font-semibold text-white' }, studentProfile.hostelStatus)
            )
          ),

          // Personal Info Box
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3' },
            React.createElement('h4', { className: 'font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-2' },
              React.createElement(Icons.User, { className: 'w-4 h-4' }),
              'Personal Information'
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Date of Birth'),
              React.createElement('span', { className: 'font-semibold text-white' }, studentProfile.dob)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Blood Group'),
              React.createElement('span', { className: 'font-bold text-rose-400' }, studentProfile.bloodGroup)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Email Address'),
              React.createElement('span', { className: 'font-semibold text-white truncate max-w-[170px]' }, studentProfile.email)
            ),
            React.createElement('div', { className: 'flex justify-between py-1' },
              React.createElement('span', { className: 'text-slate-400' }, 'Phone Number'),
              React.createElement('span', { className: 'font-semibold text-white' }, studentProfile.phone)
            )
          ),

          // Mentor & Guardian Box
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3' },
            React.createElement('h4', { className: 'font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-2' },
              React.createElement(Icons.Shield, { className: 'w-4 h-4' }),
              'Faculty Mentor & Parents'
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Faculty Mentor'),
              React.createElement('span', { className: 'font-semibold text-white' }, studentProfile.mentorName)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Mentor Email'),
              React.createElement('span', { className: 'font-semibold text-cyan-300 truncate max-w-[170px]' }, studentProfile.mentorEmail)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Father Name'),
              React.createElement('span', { className: 'font-semibold text-white' }, studentProfile.fatherName)
            ),
            React.createElement('div', { className: 'flex justify-between py-1' },
              React.createElement('span', { className: 'text-slate-400' }, 'Parent Contact'),
              React.createElement('span', { className: 'font-semibold text-white' }, studentProfile.fatherPhone)
            )
          )
        )
      )
    );
  }

  // ==========================================
  // VIEW: SUBJECTS
  // ==========================================
  if (normalizedTab === 'subjects') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Semester 4 IT Curriculum & Subjects'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Regulation 2021 Autonomous • 5 Theory + 2 Practical Courses')
        ),
        React.createElement('span', { className: 'px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' },
          'Total Credits: 20'
        )
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        subjects.map(subj => React.createElement(
          'div',
          {
            key: subj.code,
            className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 hover:border-cyan-500/30 transition flex flex-col justify-between'
          },
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30' }, subj.code),
              React.createElement('span', { className: 'text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300' }, `${subj.credits} Credits • ${subj.type}`)
            ),
            React.createElement('h3', { className: 'text-base font-bold text-white mt-1' }, subj.name),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-2 line-clamp-2' }, subj.description)
          ),
          React.createElement(
            'div',
            { className: 'mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
            React.createElement('span', { className: 'text-slate-400' }, `Faculty: ${subj.faculty}`),
            React.createElement('span', { className: 'text-emerald-400 font-bold' }, `${subj.completedUnits}/${subj.syllabusUnits} Units Done`)
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: ATTENDANCE
  // ==========================================
  if (normalizedTab === 'attendance') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Subject-wise Attendance Matrix'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Minimum 75% attendance mandatory for Semester Exam eligibility')
        ),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('apply-leave'),
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2 self-start sm:self-auto'
          },
          React.createElement(Icons.Calendar, { className: 'w-4 h-4' }),
          'Apply OD / Leave'
        )
      ),

      // Overall Progress Card
      React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-5' },
          React.createElement(
            'div',
            { className: 'w-20 h-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-mono font-extrabold text-xl text-emerald-400 shadow-lg shadow-emerald-950' },
            `${overallAttendancePct}%`
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'text-lg font-bold text-white' }, 'Overall Department Attendance'),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' },
              `Total Hours Conducted: ${totalHours} • Hours Attended: ${attendedHours}`
            ),
            React.createElement('span', { className: 'inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
              'Eligible for End-Sem Examinations'
            )
          )
        )
      ),

      // Detailed Attendance Table
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
                React.createElement('th', null, 'Subject Code'),
                React.createElement('th', null, 'Subject Name'),
                React.createElement('th', null, 'Total Classes'),
                React.createElement('th', null, 'Attended'),
                React.createElement('th', null, 'Percentage'),
                React.createElement('th', null, 'Status')
              )
            ),
            React.createElement(
              'tbody',
              null,
              attendance.map(item => React.createElement(
                'tr',
                { key: item.code },
                React.createElement('td', { className: 'font-mono text-xs font-bold text-cyan-400' }, item.code),
                React.createElement('td', { className: 'font-semibold text-white' }, item.name),
                React.createElement('td', { className: 'text-slate-300 font-mono' }, item.total),
                React.createElement('td', { className: 'text-emerald-400 font-mono font-bold' }, item.attended),
                React.createElement('td', null,
                  React.createElement(
                    'div',
                    { className: 'flex items-center gap-3' },
                    React.createElement(
                      'div',
                      { className: 'w-24 h-2 bg-slate-800 rounded-full overflow-hidden' },
                      React.createElement('div', {
                        className: `h-full rounded-full ${item.percentage >= 85 ? 'bg-emerald-400' : item.percentage >= 75 ? 'bg-amber-400' : 'bg-rose-400'}`,
                        style: { width: `${item.percentage}%` }
                      })
                    ),
                    React.createElement('span', { className: 'font-mono text-xs font-bold' }, `${item.percentage}%`)
                  )
                ),
                React.createElement('td', null,
                  React.createElement('span', {
                    className: `badge-it ${
                      item.status === 'Excellent' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      item.status === 'Good' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`
                  }, item.status)
                )
              ))
            )
          )
        )
      ),

      // Apply OD / Leave Modal
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'apply-leave',
          onClose: () => setActiveModal(null),
          title: 'Apply for On-Duty (OD) / Medical Leave'
        },
        React.createElement(
          'form',
          { onSubmit: handleLeaveSubmit, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Leave / OD Category'),
            React.createElement('select', {
              value: leaveForm.reasonType,
              onChange: (e) => setLeaveForm({ ...leaveForm, reasonType: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'On-Duty (OD - Hackathon/Symposium)' }, 'On-Duty (OD - Hackathon / Symposium / Project Expo)'),
              React.createElement('option', { value: 'On-Duty (OD - Placement Drive/Internship)' }, 'On-Duty (OD - Placement Drive / Internship)'),
              React.createElement('option', { value: 'Medical Leave' }, 'Medical Leave (Requires Doctor Certificate)'),
              React.createElement('option', { value: 'Personal Leave' }, 'Personal / Family Leave')
            )
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'From Date'),
              React.createElement('input', {
                type: 'date',
                value: leaveForm.fromDate,
                onChange: (e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'To Date'),
              React.createElement('input', {
                type: 'date',
                value: leaveForm.toDate,
                onChange: (e) => setLeaveForm({ ...leaveForm, toDate: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Event Details / Justification'),
            React.createElement('textarea', {
              rows: 3,
              placeholder: 'Provide event name, venue, or medical reason...',
              value: leaveForm.description,
              onChange: (e) => setLeaveForm({ ...leaveForm, description: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold'
          }, 'Submit Application to Mentor')
        )
      )
    );
  }

  // ==========================================
  // VIEW: INTERNAL MARKS
  // ==========================================
  if (normalizedTab === 'internal-marks') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Continuous Internal Assessment (CIA) Marks'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'CIA-1 (50) • CIA-2 (50) • Model Exam (100) • Assignment (10) • Final Internal (50)')
        ),
        React.createElement('span', { className: 'px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30' },
          'Sem 4 In-Progress'
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
                React.createElement('th', null, 'Subject Code'),
                React.createElement('th', null, 'Subject Name'),
                React.createElement('th', null, 'CIA-1 (50)'),
                React.createElement('th', null, 'CIA-2 (50)'),
                React.createElement('th', null, 'Model (100)'),
                React.createElement('th', null, 'Assignment (10)'),
                React.createElement('th', null, 'Total Internals (50)'),
                React.createElement('th', null, 'Grade Estimate')
              )
            ),
            React.createElement(
              'tbody',
              null,
              internalMarks.map(item => React.createElement(
                'tr',
                { key: item.code },
                React.createElement('td', { className: 'font-mono text-xs font-bold text-cyan-400' }, item.code),
                React.createElement('td', { className: 'font-semibold text-white' }, item.name),
                React.createElement('td', { className: 'text-slate-200 font-mono font-bold' }, item.cia1),
                React.createElement('td', { className: 'text-slate-200 font-mono font-bold' }, item.cia2),
                React.createElement('td', { className: 'text-slate-200 font-mono font-bold' }, item.model),
                React.createElement('td', { className: 'text-emerald-400 font-mono font-bold' }, item.assignment),
                React.createElement('td', { className: 'text-cyan-300 font-mono font-extrabold text-sm' }, `${item.totalInternal} / 50`),
                React.createElement('td', null,
                  React.createElement('span', { className: 'badge-it bg-purple-500/20 text-purple-300 border border-purple-500/30' },
                    item.gradeEstimate
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
  // VIEW: SEMESTER RESULTS
  // ==========================================
  if (normalizedTab === 'semester-results') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Anna University / Autonomous Semester Results'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Official End-Semester Examination Performance Sheets')
        ),
        React.createElement(
          'button',
          {
            onClick: () => showToast('Consolidated Transcript PDF generated & downloaded!', 'success'),
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2'
          },
          React.createElement(Icons.Download, { className: 'w-4 h-4' }),
          'Download Grade Sheet PDF'
        )
      ),

      // CGPA Overview Banner
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' },
        React.createElement(StatCard, { title: 'Cumulative CGPA', value: '8.74', subtitle: 'Scale 10.0 • First Class with Distinction', icon: Icons.Award, color: 'blue' }),
        React.createElement(StatCard, { title: 'Total Credits Earned', value: '69 / 165', subtitle: 'Semesters 1 to 3 completed', icon: Icons.BookOpen, color: 'emerald' }),
        React.createElement(StatCard, { title: 'Arrears / Backlogs', value: '0', subtitle: 'Clean Academic Record', icon: Icons.CheckCircle, color: 'purple' })
      ),

      // Semester-wise Cards
      React.createElement(
        'div',
        { className: 'space-y-4' },
        semesterResults.map(sem => React.createElement(
          'div',
          { key: sem.semester, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-3 mb-3 border-b border-slate-800' },
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-base font-bold text-white' }, `Semester ${sem.semester} Grade Sheet`),
              React.createElement('p', { className: 'text-xs text-slate-400' }, `Credits: ${sem.credits} • Result: ${sem.status}`)
            ),
            React.createElement('span', { className: 'font-mono text-sm font-extrabold text-cyan-400 px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30' },
              `GPA: ${sem.gpa.toFixed(2)}`
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs' },
            sem.courses.map(course => React.createElement(
              'div',
              { key: course.code, className: 'p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between' },
              React.createElement('div', { className: 'truncate mr-2' },
                React.createElement('p', { className: 'font-mono font-bold text-cyan-400 text-[11px]' }, course.code),
                React.createElement('p', { className: 'text-slate-200 font-medium truncate' }, course.name)
              ),
              React.createElement('span', { className: `font-bold px-2 py-0.5 rounded text-xs ${course.grade === 'O' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'}` },
                course.grade
              )
            ))
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: STUDY MATERIALS
  // ==========================================
  if (normalizedTab === 'study-materials') {
    const [filterSubject, setFilterSubject] = React.useState('ALL');

    const filteredMaterials = filterSubject === 'ALL'
      ? studyMaterials
      : studyMaterials.filter(m => m.subjectCode === filterSubject);

    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Study Materials & E-Notes'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Lecture Notes, PPTs, Lab Manuals and Solved Question Banks')
        ),
        React.createElement(
          'select',
          {
            value: filterSubject,
            onChange: (e) => setFilterSubject(e.target.value),
            className: 'p-2 rounded-xl glass-input text-xs font-semibold'
          },
          React.createElement('option', { value: 'ALL' }, 'All Subjects'),
          subjects.map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.short}`))
        )
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        filteredMaterials.map(mat => React.createElement(
          'div',
          {
            key: mat.id,
            className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 hover:border-cyan-500/30 transition flex flex-col justify-between'
          },
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'badge-it bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, mat.category),
              React.createElement('span', { className: 'font-mono text-xs text-slate-400' }, mat.fileSize)
            ),
            React.createElement('h3', { className: 'text-sm font-bold text-white mt-1' }, mat.title),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, `${mat.subjectCode} • ${mat.subjectName}`),
            React.createElement('p', { className: 'text-[11px] text-slate-500 mt-2' }, `Uploaded by ${mat.uploadedBy} on ${mat.date}`)
          ),
          React.createElement(
            'div',
            { className: 'mt-4 pt-3 border-t border-slate-800 flex items-center justify-between' },
            React.createElement('span', { className: 'text-[11px] text-slate-400' }, `📥 ${mat.downloads} downloads`),
            React.createElement(
              'button',
              {
                onClick: () => showToast(`Downloading ${mat.title}...`, 'success'),
                className: 'px-3 py-1.5 rounded-lg gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
              },
              React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
              'Download File'
            )
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: ASSIGNMENTS
  // ==========================================
  if (normalizedTab === 'assignments') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Course Assignments Tracker'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Submit code, reports, and check teacher evaluation feedback')
        )
      ),

      React.createElement(
        'div',
        { className: 'space-y-4' },
        assignments.map(asn => {
          const isPending = asn.status === 'Pending';
          const isSubmitted = asn.status === 'Submitted';
          const isGraded = asn.status === 'Graded';

          return React.createElement(
            'div',
            {
              key: asn.id,
              className: 'glass-panel p-5 rounded-2xl border border-slate-700/60'
            },
            React.createElement(
              'div',
              { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800' },
              React.createElement('div', null,
                React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, asn.subjectCode),
                  React.createElement('span', { className: 'text-xs text-slate-400' }, `• ${asn.subjectName}`)
                ),
                React.createElement('h3', { className: 'text-sm sm:text-base font-bold text-white mt-1' }, asn.title)
              ),
              React.createElement('span', {
                className: `badge-it ${
                  isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  isSubmitted ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`
              }, asn.status)
            ),

            React.createElement('p', { className: 'text-xs text-slate-300 mb-3' }, asn.instructions),

            React.createElement(
              'div',
              { className: 'flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-800/60' },
              React.createElement('div', { className: 'text-slate-400 space-x-3' },
                React.createElement('span', null, `Assigned: ${asn.assignedDate}`),
                React.createElement('span', { className: isPending ? 'text-amber-400 font-bold' : '' }, `Due: ${asn.dueDate}`),
                React.createElement('span', null, `Max Marks: ${asn.maxMarks}`)
              ),
              isPending ? React.createElement(
                'button',
                {
                  onClick: () => {
                    setSubmittingAsnId(asn.id);
                    setActiveModal('submit-assignment');
                  },
                  className: 'px-3.5 py-1.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
                },
                React.createElement(Icons.Upload, { className: 'w-3.5 h-3.5' }),
                'Submit Assignment'
              ) : isGraded ? React.createElement(
                'div',
                { className: 'flex items-center gap-2' },
                React.createElement('span', { className: 'font-bold text-emerald-400' }, `Score: ${asn.score} / ${asn.maxMarks}`),
                asn.remarks && React.createElement('span', { className: 'text-[11px] text-slate-400 italic' }, `("${asn.remarks}")`)
              ) : React.createElement(
                'span',
                { className: 'text-cyan-400 font-medium text-xs' },
                `Submitted on ${asn.submittedDate} (${asn.submissionFile})`
              )
            )
          );
        })
      ),

      // Assignment Submission Modal
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'submit-assignment',
          onClose: () => setActiveModal(null),
          title: 'Submit Assignment File'
        },
        React.createElement(
          'form',
          { onSubmit: handleAssignmentSubmit, className: 'space-y-4 text-xs' },
          React.createElement('p', { className: 'text-slate-300' },
            'Upload your solution archive (.zip, .pdf, .docx, .tar.gz) with your roll number.'
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Solution File Name / Attachment'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. 24IT001_Assignment_Solution.pdf',
              value: submissionFileName,
              onChange: (e) => setSubmissionFileName(e.target.value),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold'
          }, 'Confirm & Submit to Faculty')
        )
      )
    );
  }

  // ==========================================
  // VIEW: TIMETABLE
  // ==========================================
  if (normalizedTab === 'timetable') {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Timetable (Even Semester 2026)'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'B.Tech Information Technology • II Year / Semester IV')
        ),
        React.createElement(
          'button',
          {
            onClick: () => window.print(),
            className: 'px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5'
          },
          React.createElement(Icons.Printer, { className: 'w-4 h-4' }),
          'Print Schedule'
        )
      ),

      React.createElement(
        'div',
        { className: 'space-y-4' },
        days.map(day => React.createElement(
          'div',
          { key: day, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60' },
          React.createElement('h3', { className: 'text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider' }, day),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs' },
            timetable[day].map((slot, idx) => React.createElement(
              'div',
              {
                key: idx,
                className: `p-2.5 rounded-xl border flex flex-col justify-between ${
                  slot.subject.includes('Laboratory') || slot.subject.includes('Lab')
                    ? 'bg-cyan-950/40 border-cyan-500/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`
              },
              React.createElement('span', { className: 'font-mono text-[10px] text-slate-400' }, slot.time),
              React.createElement('p', { className: 'font-bold text-white my-1' }, slot.subject),
              React.createElement('span', { className: 'text-[10px] text-slate-400' }, `${slot.room}`)
            ))
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: FACULTY DIRECTORY
  // ==========================================
  if (normalizedTab === 'faculty-details') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'IT Department Faculty Directory'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Reach out to professors, counselors, and project guides')
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
        facultyList.map(faculty => React.createElement(
          'div',
          {
            key: faculty.id,
            className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 hover:border-cyan-500/30 transition flex flex-col justify-between'
          },
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'flex items-center gap-3 mb-3' },
              React.createElement(
                'div',
                { className: 'w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-xl text-white shadow-md' },
                '👨‍🏫'
              ),
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: 'text-sm font-bold text-white' }, faculty.name),
                React.createElement('p', { className: 'text-xs font-semibold text-cyan-400' }, faculty.designation)
              )
            ),
            React.createElement('p', { className: 'text-xs text-slate-300 mb-2' }, faculty.qualification),
            React.createElement('p', { className: 'text-[11px] text-slate-400 mb-1' }, `Specialization: ${faculty.specialization}`),
            React.createElement('p', { className: 'text-[11px] text-slate-400' }, `Cabin: ${faculty.cabin}`)
          ),
          React.createElement(
            'div',
            { className: 'mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
            React.createElement('a', { href: `mailto:${faculty.email}`, className: 'text-cyan-400 hover:underline flex items-center gap-1' },
              React.createElement(Icons.Mail, { className: 'w-3.5 h-3.5' }),
              'Email'
            ),
            React.createElement('span', { className: 'text-slate-400' }, faculty.phone)
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: ANNOUNCEMENTS
  // ==========================================
  if (normalizedTab === 'department-announcements') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Circulars & Official Notices'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Academic exams, hackathons, guest keynotes, and campus drives')
      ),
      React.createElement(
        'div',
        { className: 'space-y-4' },
        announcements.map(ann => React.createElement(
          'div',
          {
            key: ann.id,
            className: 'glass-panel p-6 rounded-2xl border border-slate-700/60'
          },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between mb-2' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('span', {
                className: `badge-it ${
                  ann.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  ann.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`
              }, ann.priority),
              React.createElement('span', { className: 'text-xs font-bold text-slate-400' }, ann.category)
            ),
            React.createElement('span', { className: 'text-xs text-slate-400' }, ann.date)
          ),
          React.createElement('h3', { className: 'text-base font-bold text-white mb-2' }, ann.title),
          React.createElement('p', { className: 'text-xs text-slate-300 leading-relaxed' }, ann.content),
          React.createElement(
            'div',
            { className: 'mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
            React.createElement('span', { className: 'text-slate-400' }, `Posted by: ${ann.author}`),
            ann.attachment && React.createElement(
              'button',
              {
                onClick: () => showToast(`Downloading ${ann.attachment}...`, 'success'),
                className: 'text-cyan-400 hover:underline flex items-center gap-1 font-semibold'
              },
              React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
              ann.attachment
            )
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: QUESTION PAPERS
  // ==========================================
  if (normalizedTab === 'previous-year-question-papers') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Previous Year Question Papers Bank'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Autonomous & Anna University End Semester Examination archives (2021-2025)')
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        questionPapers.map(qp => React.createElement(
          'div',
          {
            key: qp.id,
            className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between'
          },
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, qp.subjectCode),
            React.createElement('h3', { className: 'text-sm font-bold text-white mt-0.5' }, qp.subjectName),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, `${qp.year} • ${qp.type} (${qp.fileSize})`)
          ),
          React.createElement(
            'button',
            {
              onClick: () => showToast(`Downloaded QP: ${qp.subjectCode} ${qp.year}`, 'success'),
              className: 'p-2.5 rounded-xl gradient-btn-primary text-white'
            },
            React.createElement(Icons.Download, { className: 'w-4 h-4' })
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: PLACEMENT & INTERNSHIP
  // ==========================================
  if (normalizedTab === 'placement-internship') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'IT Placement & Internship Cell Drives'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'On-campus recruitment schedules, eligibility, and application tracking')
      ),
      React.createElement(
        'div',
        { className: 'space-y-4' },
        placements.map(drive => React.createElement(
          'div',
          {
            key: drive.id,
            className: 'glass-panel p-6 rounded-2xl border border-slate-700/60'
          },
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800' },
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-base font-bold text-white' }, drive.company),
              React.createElement('p', { className: 'text-xs text-cyan-400 font-semibold' }, `${drive.role} • ${drive.ctc}`)
            ),
            React.createElement('span', {
              className: `badge-it ${drive.applied ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`
            }, drive.status)
          ),
          React.createElement('p', { className: 'text-xs text-slate-300 mb-2' }, `Eligibility: ${drive.eligibility} • Location: ${drive.location}`),
          React.createElement(
            'div',
            { className: 'space-y-1 mb-4' },
            drive.rounds.map((r, i) => React.createElement('p', { key: i, className: 'text-[11px] text-slate-400' }, `• ${r}`))
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-between text-xs pt-3 border-t border-slate-800' },
            React.createElement('span', { className: 'text-slate-400' }, `Drive Date: ${drive.driveDate} (Deadline: ${drive.deadline})`),
            !drive.applied && React.createElement(
              'button',
              {
                onClick: () => showToast(`Application submitted for ${drive.company}!`, 'success'),
                className: 'px-4 py-1.5 rounded-xl gradient-btn-primary text-white font-bold'
              },
              'Register Now'
            )
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: ACHIEVEMENTS
  // ==========================================
  if (normalizedTab === 'achievements') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Student Honors & Achievements'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Hackathon prizes, research papers, and technical contest awards')
        ),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('add-achievement'),
            className: 'px-3.5 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
          },
          React.createElement(Icons.Plus, { className: 'w-4 h-4' }),
          'Add Achievement'
        )
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        achievements.map(ach => React.createElement(
          'div',
          { key: ach.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'badge-it bg-purple-500/20 text-purple-300 border border-purple-500/30' }, ach.category),
              React.createElement('span', { className: 'text-xs text-slate-400' }, ach.date)
            ),
            React.createElement('h3', { className: 'text-sm font-bold text-white mt-1' }, ach.title),
            React.createElement('p', { className: 'text-xs text-slate-300 mt-2' }, ach.description)
          ),
          React.createElement('p', { className: 'text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800' }, `Issued by: ${ach.issuedBy}`)
        ))
      ),

      // Add Achievement Modal
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'add-achievement',
          onClose: () => setActiveModal(null),
          title: 'Record New Student Achievement'
        },
        React.createElement(
          'form',
          { onSubmit: handleAddAchievement, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Achievement Title'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. 1st Place at National Smart India Hackathon',
              value: newAchievement.title,
              onChange: (e) => setNewAchievement({ ...newAchievement, title: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Category'),
              React.createElement('select', {
                value: newAchievement.category,
                onChange: (e) => setNewAchievement({ ...newAchievement, category: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('option', { value: 'Hackathon' }, 'Hackathon'),
                React.createElement('option', { value: 'Academic' }, 'Academic Award'),
                React.createElement('option', { value: 'Research' }, 'Research Paper'),
                React.createElement('option', { value: 'Sports' }, 'Sports / Cultural')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Date'),
              React.createElement('input', {
                type: 'date',
                value: newAchievement.date,
                onChange: (e) => setNewAchievement({ ...newAchievement, date: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Organizing Body / Issuer'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. IIT Madras / AICTE',
              value: newAchievement.issuedBy,
              onChange: (e) => setNewAchievement({ ...newAchievement, issuedBy: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Summary / Description'),
            React.createElement('textarea', {
              rows: 3,
              placeholder: 'Brief summary of the project or award...',
              value: newAchievement.description,
              onChange: (e) => setNewAchievement({ ...newAchievement, description: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold'
          }, 'Save Achievement')
        )
      )
    );
  }

  // ==========================================
  // VIEW: CERTIFICATES
  // ==========================================
  if (normalizedTab === 'certificates') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Verified Certifications (NPTEL, AWS, Coursera)'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Professional badges & verified credential IDs')
        ),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('add-certificate'),
            className: 'px-3.5 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
          },
          React.createElement(Icons.Upload, { className: 'w-4 h-4' }),
          'Upload Certificate'
        )
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
        certificates.map(cert => React.createElement(
          'div',
          { key: cert.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center justify-center mb-3' },
              React.createElement(Icons.Award, { className: 'w-5 h-5' })
            ),
            React.createElement('h3', { className: 'text-sm font-bold text-white' }, cert.name),
            React.createElement('p', { className: 'text-xs font-semibold text-cyan-400 mt-1' }, cert.issuer),
            React.createElement('p', { className: 'text-[11px] font-mono text-slate-400 mt-2' }, `ID: ${cert.credentialId}`)
          ),
          React.createElement(
            'div',
            { className: 'mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
            React.createElement('span', { className: 'text-slate-400' }, `Issued: ${cert.issueDate}`),
            React.createElement('span', { className: 'text-emerald-400 font-bold' }, 'Verified ✓')
          )
        ))
      ),

      // Add Certificate Modal
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'add-certificate',
          onClose: () => setActiveModal(null),
          title: 'Upload Professional Certificate'
        },
        React.createElement(
          'form',
          { onSubmit: handleAddCertificate, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Certificate Name'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. AWS Certified Solutions Architect',
              value: newCertificate.name,
              onChange: (e) => setNewCertificate({ ...newCertificate, name: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Issuing Organization'),
              React.createElement('input', {
                type: 'text',
                required: true,
                placeholder: 'e.g. AWS / NPTEL',
                value: newCertificate.issuer,
                onChange: (e) => setNewCertificate({ ...newCertificate, issuer: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Credential ID'),
              React.createElement('input', {
                type: 'text',
                placeholder: 'e.g. NPTEL24CS889',
                value: newCertificate.credentialId,
                onChange: (e) => setNewCertificate({ ...newCertificate, credentialId: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            )
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold'
          }, 'Save to Department Record')
        )
      )
    );
  }

  // ==========================================
  // VIEW: NOTIFICATIONS
  // ==========================================
  if (normalizedTab === 'notifications') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'All Alerts & Activity Feed'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Academic updates, exam schedules, and grading notifications')
      ),
      React.createElement(
        'div',
        { className: 'space-y-3' },
        notifications.map(notif => React.createElement(
          'div',
          {
            key: notif.id,
            className: `glass-panel p-4 rounded-2xl border flex items-center justify-between ${
              notif.read ? 'border-slate-800' : 'border-cyan-500/40 bg-cyan-950/20'
            }`
          },
          React.createElement(
            'div',
            { className: 'flex items-center gap-3' },
            React.createElement(Icons.Bell, { className: 'w-5 h-5 text-cyan-400' }),
            React.createElement(
              'div',
              null,
              React.createElement('p', { className: 'text-xs font-bold text-white' }, notif.title),
              React.createElement('span', { className: 'text-[10px] text-slate-400' }, notif.time)
            )
          ),
          React.createElement('span', { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${notif.read ? 'bg-slate-800 text-slate-400' : 'bg-cyan-500/20 text-cyan-300'}` },
            notif.read ? 'Read' : 'New'
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: FEEDBACK
  // ==========================================
  if (normalizedTab === 'feedback') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Confidential Faculty & Course Feedback Form'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Internal Quality Assurance Cell (IQAC) - Anna University Mandated Review')
      ),

      React.createElement(
        'div',
        { className: 'glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 max-w-2xl' },
        React.createElement(
          'form',
          { onSubmit: handleFeedbackSubmit, className: 'space-y-5 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1.5' }, 'Select Subject & Course'),
            React.createElement('select', {
              value: feedbackForm.subject,
              onChange: (e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              subjects.map(s => React.createElement('option', { key: s.code, value: `${s.code} ${s.name}` }, `${s.code} - ${s.name} (${s.faculty})`))
            )
          ),

          // Rating 1: Course Content
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold text-slate-300 mb-1' }, '1. Clarity of Course Content & Syllabus Coverage (1 to 5)'),
            React.createElement('div', { className: 'flex gap-2' },
              [1, 2, 3, 4, 5].map(val => React.createElement(
                'button',
                {
                  key: val,
                  type: 'button',
                  onClick: () => setFeedbackForm({ ...feedbackForm, courseContentRating: val }),
                  className: `w-10 h-10 rounded-xl font-bold text-xs border transition ${
                    feedbackForm.courseContentRating === val ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`
                },
                val, ' ★'
              ))
            )
          ),

          // Rating 2: Teaching Methodology
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold text-slate-300 mb-1' }, '2. Faculty Teaching Methodology & Problem Solving Pace'),
            React.createElement('div', { className: 'flex gap-2' },
              [1, 2, 3, 4, 5].map(val => React.createElement(
                'button',
                {
                  key: val,
                  type: 'button',
                  onClick: () => setFeedbackForm({ ...feedbackForm, teachingRating: val }),
                  className: `w-10 h-10 rounded-xl font-bold text-xs border transition ${
                    feedbackForm.teachingRating === val ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`
                },
                val, ' ★'
              ))
            )
          ),

          // Rating 3: Lab Support
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold text-slate-300 mb-1' }, '3. Lab Experiments Guidance & Hands-on Support'),
            React.createElement('div', { className: 'flex gap-2' },
              [1, 2, 3, 4, 5].map(val => React.createElement(
                'button',
                {
                  key: val,
                  type: 'button',
                  onClick: () => setFeedbackForm({ ...feedbackForm, practicalLabRating: val }),
                  className: `w-10 h-10 rounded-xl font-bold text-xs border transition ${
                    feedbackForm.practicalLabRating === val ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`
                },
                val, ' ★'
              ))
            )
          ),

          // Constructive comments
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Constructive Feedback / Suggestions'),
            React.createElement('textarea', {
              rows: 3,
              placeholder: 'Write any specific suggestions for improvements or appreciation...',
              value: feedbackForm.comments,
              onChange: (e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),

          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-3 rounded-xl gradient-btn-primary text-white font-bold'
          }, 'Submit Anonymous Review')
        )
      )
    );
  }

  // Fallback
  return React.createElement('div', { className: 'p-8 text-center text-slate-400' }, `View ${currentTab} loaded.`);
};

// Expose to window for standalone execution
if (typeof window !== 'undefined') {
  window.ITStudentViews = StudentViews;
}
})();

