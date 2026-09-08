// IT DIGITAL HUB - Common UI Components (Topbar, Sidebar, StatCard, Modal, Toast)
(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));

const ToastContainer = () => {

  const { toasts, removeToast } = useAuth();

  if (!toasts || toasts.length === 0) return null;

  return React.createElement(
    'div',
    { className: 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none' },
    toasts.map(toast => {
      const isSuccess = toast.type === 'success';
      const isError = toast.type === 'error';
      const isInfo = toast.type === 'info';

      return React.createElement(
        'div',
        {
          key: toast.id,
          className: `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border text-sm font-medium animate-fade-in transition-all ${
            isSuccess ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' :
            isError ? 'bg-rose-950/80 border-rose-500/40 text-rose-200' :
            'bg-slate-900/90 border-cyan-500/40 text-cyan-200'
          }`
        },
        React.createElement(isSuccess ? Icons.CheckCircle : isError ? Icons.AlertTriangle : Icons.Sparkles, {
          className: `w-5 h-5 flex-shrink-0 ${isSuccess ? 'text-emerald-400' : isError ? 'text-rose-400' : 'text-cyan-400'}`
        }),
        React.createElement('span', { className: 'flex-1' }, toast.message),
        React.createElement(
          'button',
          {
            onClick: () => removeToast(toast.id),
            className: 'p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition'
          },
          React.createElement(Icons.X, { className: 'w-4 h-4' })
        )
      );
    })
  );
};

const StatCard = ({ title, value, subtitle, icon: IconComponent, trend, trendLabel, color = 'blue', onClick }) => {
  const colorMap = {
    blue: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    purple: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    rose: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400'
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return React.createElement(
    'div',
    {
      onClick: onClick,
      className: `glass-card p-5 rounded-2xl border bg-gradient-to-br ${currentTheme} ${onClick ? 'cursor-pointer' : ''} flex flex-col justify-between relative overflow-hidden group`
    },
    // Background glow
    React.createElement('div', {
      className: 'absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-300'
    }),
    React.createElement(
      'div',
      { className: 'flex items-start justify-between relative z-10' },
      React.createElement(
        'div',
        null,
        React.createElement('p', { className: 'text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1' }, title),
        React.createElement('h3', { className: 'text-2xl lg:text-3xl font-extrabold text-white tracking-tight' }, value)
      ),
      IconComponent && React.createElement(
        'div',
        { className: 'p-3 rounded-xl bg-slate-900/60 border border-white/10 text-white shadow-inner group-hover:scale-110 transition-transform' },
        React.createElement(IconComponent, { className: 'w-6 h-6' })
      )
    ),
    (subtitle || trend) && React.createElement(
      'div',
      { className: 'mt-4 flex items-center justify-between text-xs text-slate-300 relative z-10 pt-2 border-t border-white/5' },
      subtitle && React.createElement('span', { className: 'truncate text-slate-400' }, subtitle),
      trend && React.createElement(
        'span',
        { className: `inline-flex items-center gap-1 font-bold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}` },
        trend > 0 ? '↑' : '↓', ' ', Math.abs(trend), '% ', trendLabel || ''
      )
    )
  );
};

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return React.createElement(
    'div',
    { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in' },
    React.createElement(
      'div',
      {
        className: `w-full ${maxWidth} glass-panel rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]`
      },
      // Header
      React.createElement(
        'div',
        { className: 'flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70' },
        React.createElement('h3', { className: 'text-lg font-bold text-white flex items-center gap-2' }, title),
        React.createElement(
          'button',
          {
            onClick: onClose,
            className: 'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition'
          },
          React.createElement(Icons.X, { className: 'w-5 h-5' })
        )
      ),
      // Body
      React.createElement(
        'div',
        { className: 'p-6 overflow-y-auto space-y-4 text-slate-200' },
        children
      )
    )
  );
};

const Topbar = ({ currentTab, activeRole, onToggleSidebar, onNavigate }) => {
  const { currentUser, logout, notifications, markAllNotificationsRead, collegeInfo } = useAuth();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleColors = {
    student: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    staff: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    hod: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    admin: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  };

  return React.createElement(
    'header',
    { className: 'sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between gap-4' },
    // Left: Mobile toggle & Breadcrumb
    React.createElement(
      'div',
      { className: 'flex items-center gap-3' },
      React.createElement(
        'button',
        {
          onClick: onToggleSidebar,
          className: 'lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition'
        },
        React.createElement(Icons.Menu, { className: 'w-6 h-6' })
      ),
      React.createElement(
        'div',
        { className: 'hidden sm:flex flex-col' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400' },
          React.createElement('span', { className: 'text-cyan-400' }, 'GCE ERODE'),
          React.createElement('span', null, '•'),
          React.createElement('span', null, 'IT DEPARTMENT')
        ),
        React.createElement(
          'h2',
          { className: 'text-sm font-bold text-white capitalize' },
          currentTab.replace('-', ' ')
        )
      )
    ),

    // Middle: Global Search Input
    React.createElement(
      'div',
      { className: 'hidden md:flex flex-1 max-w-md mx-4 relative' },
      React.createElement(Icons.Search, {
        className: 'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400'
      }),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search subjects, timetable, students, circulars...',
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        className: 'w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder-slate-500'
      })
    ),

    // Right Actions
    React.createElement(
      'div',
      { className: 'flex items-center gap-2 sm:gap-4' },
      // Live Clock
      React.createElement(
        'div',
        { className: 'hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-cyan-300' },
        React.createElement(Icons.Calendar, { className: 'w-3.5 h-3.5 text-cyan-400' }),
        React.createElement('span', null, currentTime)
      ),

      // Role Badge
      React.createElement(
        'div',
        {
          className: `hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
            roleColors[activeRole] || roleColors.student
          }`
        },
        React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-current animate-pulse' }),
        React.createElement('span', null, activeRole)
      ),

      // Notification Center Popover
      React.createElement(
        'div',
        { className: 'relative' },
        React.createElement(
          'button',
          {
            onClick: () => setShowNotifications(!showNotifications),
            className: 'p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition relative'
          },
          React.createElement(Icons.Bell, { className: 'w-5 h-5' }),
          unreadCount > 0 && React.createElement(
            'span',
            { className: 'absolute top-1 right-1 w-4 h-4 bg-cyan-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center animate-bounce' },
            unreadCount
          )
        ),
        showNotifications && React.createElement(
          'div',
          { className: 'absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl border border-slate-700/70 shadow-2xl p-4 z-50 animate-fade-in' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-3 border-b border-slate-800' },
            React.createElement('h4', { className: 'font-bold text-sm text-white flex items-center gap-2' },
              React.createElement(Icons.Bell, { className: 'w-4 h-4 text-cyan-400' }),
              'Department Notifications'
            ),
            unreadCount > 0 && React.createElement(
              'button',
              {
                onClick: markAllNotificationsRead,
                className: 'text-xs text-cyan-400 hover:underline'
              },
              'Mark all read'
            )
          ),
          React.createElement(
            'div',
            { className: 'py-2 space-y-2 max-h-72 overflow-y-auto' },
            notifications.map(notif => React.createElement(
              'div',
              {
                key: notif.id,
                onClick: () => {
                  if (onNavigate) onNavigate(notif.link);
                  setShowNotifications(false);
                },
                className: `p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                  notif.read ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-cyan-950/40 border-cyan-500/30 text-slate-200'
                }`
              },
              React.createElement('p', { className: 'font-semibold text-white' }, notif.title),
              React.createElement('span', { className: 'text-[10px] text-slate-400 mt-1 block' }, notif.time)
            ))
          )
        )
      ),

      // User Profile Menu
      React.createElement(
        'div',
        { className: 'relative' },
        React.createElement(
          'button',
          {
            onClick: () => setShowProfileMenu(!showProfileMenu),
            className: 'flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 transition border border-transparent hover:border-slate-700'
          },
          React.createElement(
            'div',
            { className: 'w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-md' },
            currentUser?.name ? currentUser.name.charAt(0) : 'U'
          ),
          React.createElement(
            'div',
            { className: 'hidden lg:flex flex-col text-left' },
            React.createElement('span', { className: 'text-xs font-bold text-white truncate max-w-[120px]' }, currentUser?.name || 'User'),
            React.createElement('span', { className: 'text-[10px] text-slate-400 capitalize' }, currentUser?.role || 'Guest')
          ),
          React.createElement(Icons.ChevronDown, { className: 'w-3.5 h-3.5 text-slate-400 hidden lg:block' })
        ),
        showProfileMenu && React.createElement(
          'div',
          { className: 'absolute right-0 mt-3 w-56 glass-panel rounded-2xl border border-slate-700/70 shadow-2xl p-2 z-50 animate-fade-in' },
          React.createElement(
            'div',
            { className: 'p-3 border-b border-slate-800 text-xs' },
            React.createElement('p', { className: 'font-bold text-white truncate' }, currentUser?.name),
            React.createElement('p', { className: 'text-[11px] text-slate-400 truncate' }, currentUser?.email)
          ),
          React.createElement(
            'button',
            {
              onClick: () => {
                if (onNavigate) onNavigate(activeRole === 'student' ? 'my-profile' : activeRole === 'staff' ? 'my-profile' : activeRole === 'hod' ? 'hod-profile' : 'system-settings');
                setShowProfileMenu(false);
              },
              className: 'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition mt-1'
            },
            React.createElement(Icons.User, { className: 'w-4 h-4 text-cyan-400' }),
            'My Account'
          ),
          React.createElement(
            'button',
            {
              onClick: logout,
              className: 'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition mt-1'
            },
            React.createElement(Icons.LogOut, { className: 'w-4 h-4' }),
            'Sign Out'
          )
        )
      )
    )
  );
};

const Sidebar = ({ navItems, currentTab, onSelectTab, isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile, activeRole }) => {
  const { currentUser, logout, collegeInfo } = useAuth();

  return React.createElement(
    React.Fragment,
    null,
    // Backdrop for Mobile
    isMobileOpen && React.createElement('div', {
      onClick: onCloseMobile,
      className: 'fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden'
    }),

    // Sidebar Element
    React.createElement(
      'aside',
      {
        className: `fixed top-0 bottom-0 left-0 z-40 bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`
      },
      // Top Brand Section
      React.createElement(
        'div',
        { className: 'p-5 border-b border-slate-800/80 flex items-center justify-between' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3 overflow-hidden' },
          // College Crest Badge
          React.createElement(
            'div',
            { className: 'w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30 flex-shrink-0' },
            React.createElement(Icons.Cpu, { className: 'w-6 h-6' })
          ),
          !isCollapsed && React.createElement(
            'div',
            { className: 'flex flex-col' },
            React.createElement('span', { className: 'font-extrabold text-sm tracking-tight text-white' }, collegeInfo.portalTitle),
            React.createElement('span', { className: 'text-[10px] font-semibold text-cyan-400 truncate max-w-[160px]' }, 'IT Dept • GCE Erode')
          )
        ),
        // Desktop collapse toggle
        React.createElement(
          'button',
          {
            onClick: onToggleCollapse,
            className: 'hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition'
          },
          React.createElement(Icons.ChevronRight, {
            className: `w-4 h-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`
          })
        ),
        // Mobile close button
        React.createElement(
          'button',
          {
            onClick: onCloseMobile,
            className: 'lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800'
          },
          React.createElement(Icons.X, { className: 'w-5 h-5' })
        )
      ),

      // Navigation Items List
      React.createElement(
        'nav',
        { className: 'flex-1 overflow-y-auto px-3 py-4 space-y-1' },
        navItems.map(item => {
          const isActive = currentTab === item.id;
          const Icon = Icons[item.icon] || Icons.Dashboard;

          return React.createElement(
            'button',
            {
              key: item.id,
              onClick: () => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              },
              title: isCollapsed ? item.label : undefined,
              className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`
            },
            React.createElement(Icon, {
              className: `w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
              }`
            }),
            !isCollapsed && React.createElement(
              'span',
              { className: 'flex-1 text-left truncate' },
              item.label
            ),
            !isCollapsed && item.badge && React.createElement(
              'span',
              { className: 'px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
              item.badge
            )
          );
        })
      ),

      // Bottom User Profile Card & Logout Pill
      React.createElement(
        'div',
        { className: 'p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2' },
        // Logged-in User Profile Card in Sidebar
        React.createElement(
          'div',
          {
            onClick: () => {
              if (onSelectTab) onSelectTab(activeRole === 'student' ? 'my-profile' : activeRole === 'staff' ? 'my-profile' : activeRole === 'hod' ? 'hod-profile' : 'system-settings');
            },
            title: isCollapsed ? (currentUser?.name || 'My Profile') : undefined,
            className: `flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition ${isCollapsed ? 'justify-center' : ''}`
          },
          React.createElement(
            'div',
            { className: 'w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-bold flex items-center justify-center text-sm shadow flex-shrink-0' },
            currentUser?.name ? currentUser.name.charAt(0) : 'U'
          ),
          !isCollapsed && React.createElement(
            'div',
            { className: 'flex-1 min-w-0' },
            React.createElement('p', { className: 'text-xs font-bold text-white truncate' }, currentUser?.name || 'User'),
            React.createElement('p', { className: 'text-[10px] text-cyan-400 capitalize truncate' }, `${activeRole || 'User'} • ${currentUser?.rollNo || currentUser?.id || 'Active'}`)
          )
        ),
        React.createElement(
          'button',
          {
            onClick: logout,
            title: isCollapsed ? 'Logout' : undefined,
            className: `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition group`
          },
          React.createElement(Icons.LogOut, { className: 'w-4 h-4 flex-shrink-0 text-rose-400 group-hover:-translate-x-0.5 transition-transform' }),
          !isCollapsed && React.createElement('span', { className: 'flex-1 text-left' }, 'Sign Out')
        )
      )
    )
  );
};

// ==========================================
// FLOATING AI VIRTUAL ASSISTANT (IT-BOT)
// ==========================================
const AIAssistant = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { id: 1, sender: 'bot', text: 'Hello! I am <strong>IT-Bot</strong>, your Department AI Assistant. How can I assist you today with timetables, internal exams, attendance rules, or symposium events?' }
  ]);
  const [inputText, setInputText] = React.useState('');
  const chatBottomRef = React.useRef(null);

  React.useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('exam') || q.includes('internal') || q.includes('schedule')) {
      return '📅 <strong>Internal Examination Schedule:</strong><br>Internal Assessment I starts on <strong>October 15, 2026</strong>. Detailed timetables and portions are in the Timetable module.';
    } else if (q.includes('attendance') || q.includes('percent') || q.includes('shortage') || q.includes('cutoff')) {
      return '📊 <strong>Attendance Criteria:</strong><br>A minimum of <strong>75% attendance</strong> is required by Autonomous regulations. Use our Target Attendance Calculator in the Attendance tab to estimate required classes!';
    } else if (q.includes('symposium') || q.includes('event') || q.includes('register') || q.includes('pass')) {
      return '🏆 <strong>IT Symposium 2026:</strong><br>The Annual National Level IT Symposium is on <strong>Oct 14, 2026</strong>. Events: Code Marathon, Web Canvas, Bug Hunter & PPT. Register in Events to generate your verified E-Pass!';
    } else if (q.includes('placement') || q.includes('company') || q.includes('job') || q.includes('salary') || q.includes('internship')) {
      return '💼 <strong>Placement Drives:</strong><br>Active drives: <strong>Zoho (8.5 LPA)</strong>, <strong>TCS Digital (7.2 LPA)</strong>, and <strong>Infosys (6.0 LPA)</strong>. Eligibility: CGPA >= 7.5 with 0 standing arrears.';
    } else if (q.includes('leave') || q.includes('od') || q.includes('medical') || q.includes('onduty')) {
      return '📝 <strong>Leave Policy:</strong><br>Submit leave/OD applications through the <strong>Apply OD / Leave</strong> form at least 24 hours in advance. Approvals are reviewed live by staff and HOD.';
    } else if (q.includes('hod') || q.includes('contact') || q.includes('faculty') || q.includes('staff') || q.includes('advisor')) {
      return '👤 <strong>Department Directory:</strong><br><strong>HOD:</strong> Dr. S. K. Murugesan (hod@gceerode.ac.in)<br><strong>Faculty In-Charge:</strong> Dr. A. Venkatesh<br><strong>Department Office:</strong> Room IT-301, 3rd Floor IT Block.';
    } else if (q.includes('notes') || q.includes('pdf') || q.includes('question paper') || q.includes('material') || q.includes('qp')) {
      return '📚 <strong>Study Materials:</strong><br>Lecture notes, lab manuals, and previous 5 years Anna University/Autonomous question papers are available in the <strong>Study Materials</strong> tab.';
    } else {
      return `🤖 <strong>IT-Bot Assistance:</strong><br>I can help you with Exam Schedules, Attendance Rules, Timetables, Notes/PDFs, Symposium Registrations, Leave approvals, and Placement Drives! Try clicking a suggestion chip below.`;
    }
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const reply = generateAIResponse(text);
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: reply };
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const quickChips = [
    "When are CIA exams?",
    "Attendance 75% rule",
    "IT Symposium 2026",
    "Placement drives",
    "Apply OD Leave"
  ];

  return React.createElement(
    React.Fragment,
    null,
    // Floating Action Button
    React.createElement(
      'button',
      {
        onClick: () => setIsOpen(!isOpen),
        title: 'Open IT-Bot Assistant',
        className: `fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 group`
      },
      isOpen 
        ? React.createElement(Icons.X, { className: 'w-6 h-6' })
        : React.createElement(Icons.Sparkles, { className: 'w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform' })
    ),

    // Floating Chat Window
    isOpen && React.createElement(
      'div',
      {
        className: 'fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[80vh] glass-panel rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-fade-in'
      },
      // Chat Header
      React.createElement(
        'div',
        { className: 'px-5 py-4 bg-gradient-to-r from-slate-900 via-cyan-950/70 to-slate-900 border-b border-slate-800 flex items-center justify-between' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3' },
          React.createElement(
            'div',
            { className: 'w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md' },
            React.createElement(Icons.Sparkles, { className: 'w-4 h-4' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h4', { className: 'text-sm font-bold text-white' }, 'IT-Bot Virtual Assistant'),
            React.createElement('p', { className: 'text-[10px] text-cyan-400 font-medium' }, '● Online • GCE Erode IT Dept')
          )
        ),
        React.createElement(
          'button',
          { onClick: () => setIsOpen(false), className: 'p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800' },
          React.createElement(Icons.X, { className: 'w-4 h-4' })
        )
      ),

      // Chat Messages Body
      React.createElement(
        'div',
        { className: 'flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-950/40' },
        messages.map(m => {
          const isUser = m.sender === 'user';
          return React.createElement(
            'div',
            { key: m.id, className: `flex ${isUser ? 'justify-end' : 'justify-start'}` },
            React.createElement(
              'div',
              {
                className: `max-w-[82%] px-4 py-3 rounded-2xl ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-bl-none shadow-lg'
                }`,
                dangerouslySetInnerHTML: { __html: m.text }
              }
            )
          );
        }),
        React.createElement('div', { ref: chatBottomRef })
      ),

      // Quick Chips
      React.createElement(
        'div',
        { className: 'px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar' },
        quickChips.map((chip, idx) => React.createElement(
          'button',
          {
            key: idx,
            onClick: () => handleSend(chip),
            className: 'px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/60 text-[10px] font-medium text-slate-300 whitespace-nowrap transition'
          },
          chip
        ))
      ),

      // Chat Input Form
      React.createElement(
        'form',
        {
          onSubmit: (e) => {
            e.preventDefault();
            handleSend();
          },
          className: 'p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2'
        },
        React.createElement('input', {
          type: 'text',
          value: inputText,
          onChange: (e) => setInputText(e.target.value),
          placeholder: 'Ask IT-Bot about exams, rules, notes...',
          className: 'flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500'
        }),
        React.createElement(
          'button',
          {
            type: 'submit',
            className: 'p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition'
          },
          React.createElement(Icons.ArrowRight, { className: 'w-4 h-4' })
        )
      )
    )
  );
};

// ==========================================
// FILE DIRECTORY UPLOADER COMPONENT
// ==========================================
const FileUploader = ({ onFileSelect, accept = ".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg,.pptx", label = "Choose file from directory", helperText = "PDF, DOC, PPTX or ZIP up to 25MB", required = false }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const fileData = {
        name: file.name,
        size: formatFileSize(file.size),
        rawSize: file.size,
        type: file.name.split('.').pop().toUpperCase(),
        mimeType: file.type,
        file: file,
        url: URL.createObjectURL(file)
      };
      setSelectedFile(fileData);
      if (onFileSelect) onFileSelect(fileData);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onFileSelect) onFileSelect(null);
  };

  return React.createElement(
    'div',
    { className: 'w-full' },
    React.createElement('input', {
      ref: fileInputRef,
      type: 'file',
      accept: accept,
      required: required && !selectedFile,
      onChange: handleFileChange,
      className: 'hidden'
    }),
    React.createElement(
      'div',
      {
        onClick: () => fileInputRef.current && fileInputRef.current.click(),
        className: `w-full p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${
          selectedFile
            ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
            : 'border-slate-700/80 hover:border-cyan-500/60 bg-slate-900/60 hover:bg-slate-900 text-slate-400'
        }`
      },
      selectedFile
        ? React.createElement(
            'div',
            { className: 'flex items-center justify-between w-full gap-3' },
            React.createElement(
              'div',
              { className: 'flex items-center gap-3 truncate' },
              React.createElement(
                'div',
                { className: 'w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0' },
                selectedFile.type
              ),
              React.createElement(
                'div',
                { className: 'truncate text-left' },
                React.createElement('p', { className: 'text-xs font-bold text-white truncate' }, selectedFile.name),
                React.createElement('p', { className: 'text-[10px] text-emerald-400 font-medium' }, `✓ Selected • ${selectedFile.size}`)
              )
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: handleClear,
                className: 'p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 text-xs font-semibold flex-shrink-0 transition'
              },
              'Change File'
            )
          )
        : React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { className: 'w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform' },
              React.createElement(Icons.Upload || Icons.FileText, { className: 'w-5 h-5' })
            ),
            React.createElement('p', { className: 'text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition' }, label),
            React.createElement('p', { className: 'text-[10px] text-slate-500' }, helperText)
          )
    )
  );
};

if (typeof window !== 'undefined') {
  window.UIComponents = { ...(window.UIComponents || {}), StatCard, Modal, Topbar, Sidebar, ToastContainer, AIAssistant, FileUploader };
}
})();

