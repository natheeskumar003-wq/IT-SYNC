// IT DIGITAL HUB - HOD Views (Executive Department Analytics & Governance)
// Department of Information Technology - Government College of Engineering, Erode

(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));
const { StatCard, Modal } = (typeof window !== 'undefined' && window.UIComponents) || {};

const HODViews = ({ currentTab, onNavigate }) => {

  const {
    currentUser,
    collegeInfo,
    facultyList,
    students,
    subjects,
    hodAnalytics,
    announcements,
    placements,
    addAnnouncement,
    showToast
  } = useAuth();

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
    (currentTab === 'placements' || currentTab === 'placement-internship') ? 'placement-internship' :
    (currentTab === 'reports' || currentTab === 'department-reports') ? 'reports' :
    (currentTab === 'notifications' || currentTab === 'hod-notifications') ? 'notifications' :
    currentTab;

  const [activeModal, setActiveModal] = React.useState(null);


  // Leave approval requests for faculty
  const [leaveRequests, setLeaveRequests] = React.useState([
    { id: 'LR-101', faculty: 'Dr. M. Deepa', role: 'Assoc. Prof', reason: 'Attending IEEE International Conference at IIT Madras', from: '2026-09-04', to: '2026-09-06', status: 'Pending' },
    { id: 'LR-102', faculty: 'Prof. P. Kavin', role: 'Asst. Prof', reason: 'Doctoral Viva-Voce Examination at NIT Surathkal', from: '2026-09-12', to: '2026-09-13', status: 'Pending' }
  ]);

  // HOD Circular creator
  const [hodCircular, setHodCircular] = React.useState({
    title: '',
    category: 'Academic',
    priority: 'High',
    content: '',
    author: 'Dr. S. K. Murugesan (Professor & HOD)'
  });

  const handleApproveLeave = (id) => {
    setLeaveRequests(prev => prev.map(lr => lr.id === id ? { ...lr, status: 'Approved' } : lr));
    showToast('Faculty duty leave sanctioned & logged in Department Register!', 'success');
  };

  const handleRejectLeave = (id) => {
    setLeaveRequests(prev => prev.map(lr => lr.id === id ? { ...lr, status: 'Rejected' } : lr));
    showToast('Faculty leave request rejected.', 'info');
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

  // ==========================================
  // VIEW: HOD DASHBOARD (EXECUTIVE ANALYTICS)
  // ==========================================
  if (normalizedTab === 'dashboard') {
    return React.createElement(
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
                onClick: () => setActiveModal('publish-circular'),
                className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-semibold text-white flex items-center gap-2'
              },
              React.createElement(Icons.Bell, { className: 'w-4 h-4' }),
              'Issue Department Circular'
            ),
            React.createElement(
              'button',
              {
                onClick: () => onNavigate('reports'),
                className: 'px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 hover:bg-slate-800 transition'
              },
              React.createElement(Icons.FileText, { className: 'w-4 h-4 text-purple-400' }),
              'Export Academic Report'
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
          value: hodAnalytics.totalStudents.toString(),
          subtitle: '4 Batches (I to IV Year)',
          icon: Icons.Users,
          color: 'blue',
          onClick: () => onNavigate('student-management')
        }),
        React.createElement(StatCard, {
          title: 'Faculty Members',
          value: hodAnalytics.totalStaff.toString(),
          subtitle: '100% Ph.D. / M.Tech',
          icon: Icons.Award,
          color: 'purple',
          onClick: () => onNavigate('staff-management')
        }),
        React.createElement(StatCard, {
          title: 'Dept Avg Attendance',
          value: `${hodAnalytics.averageAttendance}%`,
          subtitle: 'Target: > 85%',
          icon: Icons.CheckCircle,
          color: 'emerald',
          onClick: () => onNavigate('attendance-monitoring')
        }),
        React.createElement(StatCard, {
          title: 'CIA Internal Average',
          value: `${hodAnalytics.averageInternalMarks}%`,
          subtitle: 'Even Sem Midterm Audit',
          icon: Icons.BarChart,
          color: 'blue',
          onClick: () => onNavigate('internal-marks-monitoring')
        }),
        React.createElement(StatCard, {
          title: 'Low Attendance Alert',
          value: `${hodAnalytics.lowAttendanceCount} Students`,
          subtitle: '< 75% Cutoff Threshold',
          icon: Icons.AlertTriangle,
          color: 'rose',
          onClick: () => onNavigate('attendance-monitoring')
        }),
        React.createElement(StatCard, {
          title: 'Placement Conversion',
          value: hodAnalytics.placementRate,
          subtitle: 'Highest: ₹18.5 LPA (Amazon)',
          icon: Icons.Briefcase,
          color: 'amber',
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
            hodAnalytics.semesterAttendanceTrend.map(sem => React.createElement(
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
            hodAnalytics.internalMarksDistribution.map((item, idx) => React.createElement(
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
      ),

      // Visual Interactive Charts Row 2: Placement Breakdown & Faculty Workload
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },

        // Placement Recruiter Statistics
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
            React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
              React.createElement(Icons.Briefcase, { className: 'w-5 h-5 text-amber-400' }),
              'Campus Placement Highlights (Batch 2026)'
            ),
            React.createElement('span', { className: 'text-xs font-mono font-bold text-emerald-400' }, '52 / 60 Placed (86.5%)')
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 sm:grid-cols-3 gap-3' },
            hodAnalytics.placementStats.topRecruiters.map(rec => React.createElement(
              'div',
              { key: rec.name, className: 'p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs' },
              React.createElement('p', { className: 'font-bold text-white truncate' }, rec.name),
              React.createElement('p', { className: 'text-xs text-cyan-400 font-extrabold mt-1' }, `${rec.offers} Offers`),
              React.createElement('p', { className: 'text-[10px] text-slate-400' }, `Highest: ${rec.highestCtc}`)
            ))
          )
        ),

        // Faculty Workload Matrix
        React.createElement(
          'div',
          { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
            React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
              React.createElement(Icons.Users, { className: 'w-5 h-5 text-purple-400' }),
              'Faculty Weekly Teaching Workload Distribution'
            ),
            React.createElement('span', { className: 'text-xs font-mono text-purple-400' }, 'AICTE Standard')
          ),
          React.createElement(
            'div',
            { className: 'space-y-2.5 max-h-60 overflow-y-auto' },
            hodAnalytics.facultyWorkload.map(fw => React.createElement(
              'div',
              { key: fw.name, className: 'p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs' },
              React.createElement('span', { className: 'font-semibold text-white truncate max-w-[200px]' }, fw.name),
              React.createElement('span', { className: 'font-mono font-bold text-cyan-300' },
                `${fw.totalHours} hrs/week (T:${fw.theoryHours} / L:${fw.labHours} / A:${fw.adminHours})`
              )
            ))
          )
        )
      ),

      // Modals
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'publish-circular',
          onClose: () => setActiveModal(null),
          title: 'Issue Official Department Circular (HOD)'
        },
        React.createElement(
          'form',
          { onSubmit: handlePublishHODCircular, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Circular Subject / Heading'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. Mandatory Attendance Cutoff for End-Semester Practical Exams',
              value: hodCircular.title,
              onChange: (e) => setHodCircular({ ...hodCircular, title: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Category'),
              React.createElement('select', {
                value: hodCircular.category,
                onChange: (e) => setHodCircular({ ...hodCircular, category: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('option', { value: 'Academic' }, 'Academic Notification'),
                React.createElement('option', { value: 'Examination' }, 'Examination Schedule'),
                React.createElement('option', { value: 'Administrative' }, 'Department Administrative Policy')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Priority Badge'),
              React.createElement('select', {
                value: hodCircular.priority,
                onChange: (e) => setHodCircular({ ...hodCircular, priority: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              },
                React.createElement('option', { value: 'High' }, 'High Priority'),
                React.createElement('option', { value: 'Urgent' }, 'Urgent / Immediate Action')
              )
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Circular Official Text'),
            React.createElement('textarea', {
              rows: 4,
              required: true,
              placeholder: 'Enter official directive text from Head of Department...',
              value: hodCircular.content,
              onChange: (e) => setHodCircular({ ...hodCircular, content: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', { type: 'submit', className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold' }, 'Publish Live Department Circular')
        )
      )
    );
  }

  // ==========================================
  // VIEW: STAFF MANAGEMENT & LEAVE SANCTIONING
  // ==========================================
  if (normalizedTab === 'staff-management') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Faculty Governance & Workload Allocation'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'Roster of 18 IT faculty members, research contributions, and duty leave approvals')
      ),

      // Faculty Leave Requests to Sanction
      React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-slate-950' },
        React.createElement('h3', { className: 'text-base font-bold text-white mb-3 flex items-center gap-2' },
          React.createElement(Icons.Calendar, { className: 'w-5 h-5 text-purple-400' }),
          'Pending Faculty On-Duty (OD) / Conference Leave Applications'
        ),
        React.createElement(
          'div',
          { className: 'space-y-3' },
          leaveRequests.map(lr => React.createElement(
            'div',
            { key: lr.id, className: 'p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs' },
            React.createElement('div', null,
              React.createElement('p', { className: 'font-bold text-white' }, `${lr.faculty} (${lr.role})`),
              React.createElement('p', { className: 'text-slate-300 mt-0.5' }, lr.reason),
              React.createElement('p', { className: 'text-slate-500 text-[11px] mt-0.5' }, `Duration: ${lr.from} to ${lr.to}`)
            ),
            React.createElement('div', { className: 'flex items-center gap-2' },
              lr.status === 'Pending' ? React.createElement(
                React.Fragment,
                null,
                React.createElement('button', {
                  onClick: () => handleApproveLeave(lr.id),
                  className: 'px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition'
                }, 'Sanction Leave'),
                React.createElement('button', {
                  onClick: () => handleRejectLeave(lr.id),
                  className: 'px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition'
                }, 'Reject')
              ) : React.createElement('span', {
                className: `badge-it ${lr.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`
              }, lr.status)
            )
          ))
        )
      ),

      // Faculty Roster
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
        facultyList.map(f => React.createElement(
          'div',
          { key: f.id, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between' },
          React.createElement('div', null,
            React.createElement('div', { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, f.id),
              React.createElement('span', { className: 'text-xs text-slate-400 font-semibold' }, `${f.publications} Papers`)
            ),
            React.createElement('h3', { className: 'text-sm font-bold text-white' }, f.name),
            React.createElement('p', { className: 'text-xs font-semibold text-purple-400 mt-0.5' }, f.designation),
            React.createElement('p', { className: 'text-[11px] text-slate-300 mt-1' }, f.qualification),
            React.createElement('p', { className: 'text-[11px] text-slate-400 mt-1' }, `Cabin: ${f.cabin}`)
          ),
          React.createElement('div', { className: 'mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400' },
            React.createElement('span', null, f.phone),
            React.createElement('span', { className: 'text-cyan-400 font-semibold truncate max-w-[140px]' }, f.email)
          )
        ))
      )
    );
  }

  // ==========================================
  // VIEW: ATTENDANCE MONITORING
  // ==========================================
  if (normalizedTab === 'attendance-monitoring') {
    const lowAttStudents = students.filter(s => s.attendance < 75);

    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Attendance Audit & Warning Dispatcher'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Anna University Autonomous 75% Eligibility Rule Enforcement')
        ),
        React.createElement(
          'button',
          {
            onClick: () => showToast(`Automated SMS & Email alerts dispatched to parents of ${lowAttStudents.length} low attendance students!`, 'success'),
            className: 'px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center gap-2'
          },
          React.createElement(Icons.AlertTriangle, { className: 'w-4 h-4' }),
          'Broadcast Warning SMS to Parents'
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
                React.createElement('th', null, 'Faculty Mentor'),
                React.createElement('th', null, 'Parent Phone'),
                React.createElement('th', null, 'Action')
              )
            ),
            React.createElement(
              'tbody',
              null,
              lowAttStudents.map(s => React.createElement(
                'tr',
                { key: s.rollNo },
                React.createElement('td', { className: 'font-mono text-xs font-bold text-rose-400' }, s.rollNo),
                React.createElement('td', { className: 'font-semibold text-white' }, s.name),
                React.createElement('td', { className: 'text-slate-300 text-xs' }, `Year ${s.year} (Sem ${s.sem})`),
                React.createElement('td', { className: 'font-mono font-bold text-rose-400' }, `${s.attendance}%`),
                React.createElement('td', { className: 'text-slate-300 text-xs' }, s.mentor),
                React.createElement('td', { className: 'text-slate-400 font-mono text-xs' }, s.phone),
                React.createElement('td', null,
                  React.createElement('button', {
                    onClick: () => showToast(`Counseling notice sent to ${s.name}'s mentor!`, 'success'),
                    className: 'px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-cyan-300'
                  }, 'Summon for Counseling')
                )
              ))
            )
          )
        )
      )
    );
  }

  // ==========================================
  // VIEW: REPORTS (NAAC / NBA / ACADEMIC)
  // ==========================================
  if (normalizedTab === 'reports') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Department Academic & Accreditation Reports'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Pre-formatted NAAC Tier-1, NBA Criterion 4 & Anna University Compliance Reports')
        ),
        React.createElement(
          'button',
          {
            onClick: () => showToast('Full Department Dossier PDF generated successfully!', 'success'),
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2'
          },
          React.createElement(Icons.Download, { className: 'w-4 h-4' }),
          'Generate Comprehensive Dossier'
        )
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-xs' },
        [
          { title: 'NBA Criterion 4: Student Performance & Placements', file: 'NBA_Tier1_Criterion4_IT_2026.pdf', size: '4.2 MB' },
          { title: 'NAAC SSR Academic Matrix & Curriculum Delivery', file: 'NAAC_IT_Curriculum_Delivery.pdf', size: '3.8 MB' },
          { title: 'Autonomous End-Semester CIA Result Audit Summary', file: 'CIA_Audit_Summary_Even2026.pdf', size: '2.1 MB' },
          { title: 'Faculty Research, Publications & Patents Report', file: 'IT_Faculty_Research_2026.pdf', size: '5.5 MB' },
          { title: 'Department Infrastructure & Computing Lab Audit', file: 'IT_Laboratories_Infrastructure.pdf', size: '3.1 MB' },
          { title: 'IQAC Confidential Student Feedback Analysis Report', file: 'IQAC_Feedback_Report_2026.pdf', size: '1.9 MB' }
        ].map((rep, idx) => React.createElement(
          'div',
          { key: idx, className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between' },
          React.createElement('div', null,
            React.createElement(Icons.FileText, { className: 'w-6 h-6 text-purple-400 mb-2' }),
            React.createElement('h4', { className: 'font-bold text-white text-sm' }, rep.title),
            React.createElement('p', { className: 'text-slate-400 font-mono text-[11px] mt-1' }, `${rep.file} (${rep.size})`)
          ),
          React.createElement('button', {
            onClick: () => showToast(`Exported ${rep.file}`, 'success'),
            className: 'mt-4 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-bold text-center flex items-center justify-center gap-1.5'
          },
            React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
            'Download Report'
          )
        ))
      )
    );
  }

  // Fallback for other HOD sub-views
  return React.createElement('div', { className: 'p-8 text-center text-slate-400' }, `HOD View for ${currentTab} loaded.`);
};

// Expose to window for standalone execution
if (typeof window !== 'undefined') {
  window.ITHODViews = HODViews;
}
})();

