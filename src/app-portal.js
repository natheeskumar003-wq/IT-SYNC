// IT DIGITAL HUB - Pre-compiled Application Portal
// High performance - No in-browser Babel compilation required

(function() {
const {
  useState,
  useEffect,
  useContext,
  createElement: h,
  Fragment
} = React;
const {
  AuthProvider,
  useAuth,
  Icons
} = window.ITAuthContext;

// Load sub-modules
const RootApp = () => {
  useEffect(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.remove();
    }
  }, []);
  return /*#__PURE__*/React.createElement(AuthProvider, null, /*#__PURE__*/React.createElement(AppPortal, null));
};

// Main App Controller
const AppPortal = () => {
  const {
    currentUser
  } = useAuth();
  const AIAssistantComp = window.UIComponents?.AIAssistant;
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-[#090d16] text-slate-100 font-sans"
  }, !currentUser ? /*#__PURE__*/React.createElement(StandaloneLoginPage, null) : /*#__PURE__*/React.createElement(StandaloneDashboardLayout, null), /*#__PURE__*/React.createElement(StandaloneToastContainer, null), AIAssistantComp && /*#__PURE__*/React.createElement(AIAssistantComp, null));
};

// ==========================================
// TOAST CONTAINER
// ==========================================
const StandaloneToastContainer = () => {
  const {
    toasts,
    removeToast
  } = useAuth();
  if (!toasts || toasts.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"
  }, toasts.map(toast => {
    const isSuccess = toast.type === 'success';
    const isError = toast.type === 'error';
    return /*#__PURE__*/React.createElement("div", {
      key: toast.id,
      className: `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border text-xs font-medium animate-fade-in transition-all ${isSuccess ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' : isError ? 'bg-rose-950/90 border-rose-500/40 text-rose-200' : 'bg-slate-900/90 border-cyan-500/40 text-cyan-200'}`
    }, isSuccess ? /*#__PURE__*/React.createElement(Icons.CheckCircle, {
      className: "w-4 h-4 text-emerald-400 flex-shrink-0"
    }) : isError ? /*#__PURE__*/React.createElement(Icons.AlertTriangle, {
      className: "w-4 h-4 text-rose-400 flex-shrink-0"
    }) : /*#__PURE__*/React.createElement(Icons.Sparkles, {
      className: "w-4 h-4 text-cyan-400 flex-shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "flex-1"
    }, toast.message), /*#__PURE__*/React.createElement("button", {
      onClick: () => removeToast(toast.id),
      className: "p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
    }, /*#__PURE__*/React.createElement(Icons.X, {
      className: "w-3.5 h-3.5"
    })));
  }));
};

// ==========================================
// LOGIN PAGE (GLASSMORPHISM & CAMPUS BACKGROUND)
// ==========================================
const StandaloneLoginPage = () => {
  const {
    login,
    demoCredentials,
    collegeInfo
  } = useAuth();
  const [selectedRole, setSelectedRole] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const handleRoleSelect = role => {
    setSelectedRole(role);
    setUserId('');
    setPassword('');
  };
  const handleLoginSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole, userId, password);
      setIsLoading(false);
    }, 400);
  };
  const roleTabs = [{
    key: 'student',
    label: 'Student',
    icon: Icons.GraduationCap
  }, {
    key: 'staff',
    label: 'Staff',
    icon: Icons.BookOpen
  }, {
    key: 'hod',
    label: 'HOD',
    icon: Icons.Award
  }, {
    key: 'admin',
    label: 'Admin',
    icon: Icons.Shield
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 transform scale-105",
    style: {
      backgroundImage: `url('assets/images/IT sync_dashboard sample img.jpeg'), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=85')`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 z-0 bg-gradient-to-tr from-slate-950 via-slate-900/85 to-slate-950/90 backdrop-blur-sm"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/60 shadow-2xl shadow-black/80 animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-700 shadow-xl shadow-cyan-900/40 mb-3 border border-white/20"
  }, /*#__PURE__*/React.createElement(Icons.Cpu, {
    className: "w-8 h-8 text-white"
  })), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
  }, collegeInfo.portalTitle), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-cyan-400 mt-1 uppercase tracking-wider"
  }, collegeInfo.department), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-300 mt-0.5"
  }, collegeInfo.name), /*#__PURE__*/React.createElement("span", {
    className: "inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-slate-800/80 border border-slate-700 text-slate-300"
  }, "Autonomous • Counseling Code: 7304")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mb-6 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800"
  }, roleTabs.map(tab => {
    const isSelected = selectedRole === tab.key;
    const TabIcon = tab.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.key,
      type: "button",
      onClick: () => handleRoleSelect(tab.key),
      className: `flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 text-xs font-semibold ${isSelected ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-950 border border-cyan-400/40 scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-slate-900/70'}`
    }, /*#__PURE__*/React.createElement(TabIcon, {
      className: `w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-slate-400'}`
    }), /*#__PURE__*/React.createElement("span", null, tab.label));
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleLoginSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
  }, selectedRole.toUpperCase(), " Full Name / Roll Number / ID"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Icons.User, {
    className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: userId,
    onChange: e => setUserId(e.target.value),
    placeholder: selectedRole === 'student' ? 'e.g. 24IMT30 or Nathees Kumar T' : 'e.g. ITSTAFF01',
    className: "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder-slate-500 font-medium"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-300"
  }, "Password"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setForgotModalOpen(true),
    className: "text-xs text-cyan-400 hover:text-cyan-300 font-medium"
  }, "Forgot Password?")), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Icons.Shield, {
    className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
  }), /*#__PURE__*/React.createElement("input", {
    type: showPassword ? 'text' : 'password',
    required: true,
    value: password,
    onChange: e => setPassword(e.target.value),
    className: "w-full pl-10 pr-11 py-2.5 text-sm rounded-xl glass-input placeholder-slate-500 font-medium"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPassword(!showPassword),
    className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
  }, showPassword ? /*#__PURE__*/React.createElement(Icons.EyeOff, {
    className: "w-4 h-4"
  }) : /*#__PURE__*/React.createElement(Icons.Eye, {
    className: "w-4 h-4"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-slate-400"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: rememberMe,
    onChange: e => setRememberMe(e.target.checked),
    className: "w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
  }), /*#__PURE__*/React.createElement("span", null, "Keep me logged in")), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1 text-[11px] text-emerald-400 font-medium"
  }, /*#__PURE__*/React.createElement(Icons.Shield, {
    className: "w-3 h-3"
  }), " SSL 256-bit Encrypted")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: isLoading,
    className: "w-full py-3 px-4 rounded-xl text-sm font-bold text-white gradient-btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
  }, isLoading ? /*#__PURE__*/React.createElement("span", null, "Authenticating...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "Login to ", selectedRole.toUpperCase(), " Portal"), /*#__PURE__*/React.createElement(Icons.ArrowRight, {
    className: "w-4 h-4"
  }))))) , forgotModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md glass-panel rounded-2xl p-6 border border-slate-700 space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-bold text-white flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "Department Credential Assistance"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setForgotModalOpen(false),
    className: "text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(Icons.X, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-300"
  }, "Login is restricted to registered department members. Default account setup password is institutional:"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-slate-200"
  }, /*#__PURE__*/React.createElement("p", null, "• Setup Password: ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-cyan-400 font-bold"
  }, "1234")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-[11px]"
  }, "Log in using your registered Roll Number or Staff/Admin ID.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setForgotModalOpen(false),
    className: "w-full py-2 rounded-xl bg-cyan-600 text-white font-bold"
  }, "Close"))));
};

// ==========================================
// DASHBOARD LAYOUT & VIEW LOADER
// ==========================================
const StandaloneDashboardLayout = () => {
  const {
    currentUser
  } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentUser?.role]);
  const activeRole = currentUser?.role || 'student';
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col"
  }, /*#__PURE__*/React.createElement(StandaloneRouter, {
    activeRole: activeRole,
    currentTab: activeTab,
    onSelectTab: setActiveTab,
    isCollapsed: isCollapsed,
    onToggleCollapse: () => setIsCollapsed(!isCollapsed),
    isMobileOpen: isMobileOpen,
    onToggleMobile: () => setIsMobileOpen(!isMobileOpen),
    onCloseMobile: () => setIsMobileOpen(false)
  }));
};

// Router component connecting to StudentViews, StaffViews, HODViews, AdminViews
const StandaloneRouter = ({
  activeRole,
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onToggleMobile,
  onCloseMobile
}) => {
  const {
    logout,
    notifications,
    markAllNotificationsRead,
    collegeInfo,
    currentUser
  } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navConfigs = {
    student: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: Icons.Dashboard
    }, {
      id: 'my-profile',
      label: 'My Profile',
      icon: Icons.User
    }, {
      id: 'messages',
      label: 'Messages & Requests',
      icon: Icons.MessageSquare,
      badge: 'Hub'
    }, {
      id: 'subjects',
      label: 'Subjects',
      icon: Icons.BookOpen
    }, {
      id: 'attendance',
      label: 'Attendance',
      icon: Icons.CheckCircle,
      badge: '89.5%'
    }, {
      id: 'internal-marks',
      label: 'Internal Marks',
      icon: Icons.BarChart
    }, {
      id: 'semester-results',
      label: 'Semester Results',
      icon: Icons.Award
    }, {
      id: 'study-materials',
      label: 'Study Materials',
      icon: Icons.Download
    }, {
      id: 'assignments',
      label: 'Assignments',
      icon: Icons.FileText,
      badge: '2 Due'
    }, {
      id: 'timetable',
      label: 'Timetable',
      icon: Icons.Calendar
    }, {
      id: 'faculty-details',
      label: 'Faculty Details',
      icon: Icons.Users
    }, {
      id: 'department-announcements',
      label: 'Announcements',
      icon: Icons.Bell,
      badge: 'New'
    }, {
      id: 'previous-year-question-papers',
      label: 'Question Papers',
      icon: Icons.Database
    }, {
      id: 'placement-internship',
      label: 'Placement & Internship',
      icon: Icons.Briefcase,
      badge: 'Drives'
    }, {
      id: 'gallery',
      label: 'Gallery',
      icon: Icons.Image,
      badge: 'Hub'
    }, {
      id: 'achievements',
      label: 'Achievements',
      icon: Icons.Sparkles
    }, {
      id: 'certificates',
      label: 'Certificates',
      icon: Icons.Award
    }, {
      id: 'notifications',
      label: 'Notifications',
      icon: Icons.Bell
    }],
    staff: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: Icons.Dashboard
    }, {
      id: 'my-profile',
      label: 'My Profile',
      icon: Icons.User
    }, {
      id: 'messages',
      label: 'Messages & Requests',
      icon: Icons.MessageSquare,
      badge: 'Hub'
    }, {
      id: 'my-subjects',
      label: 'My Subjects',
      icon: Icons.BookOpen
    }, {
      id: 'student-list',
      label: 'Student List',
      icon: Icons.Users
    }, {
      id: 'attendance-management',
      label: 'Attendance Management',
      icon: Icons.CheckCircle
    }, {
      id: 'internal-marks',
      label: 'Internal Marks',
      icon: Icons.BarChart
    }, {
      id: 'assignments',
      label: 'Assignments',
      icon: Icons.FileText,
      badge: 'Review'
    }, {
      id: 'upload-study-materials',
      label: 'Upload Materials',
      icon: Icons.Upload
    }, {
      id: 'timetable',
      label: 'Timetable',
      icon: Icons.Calendar
    }, {
      id: 'announcements',
      label: 'Announcements',
      icon: Icons.Bell
    }, {
      id: 'gallery',
      label: 'Gallery',
      icon: Icons.Image,
      badge: 'Review'
    }, {
      id: 'achievements',
      label: 'Achievements',
      icon: Icons.Sparkles
    }, {
      id: 'student-performance',
      label: 'Student Performance',
      icon: Icons.PieChart
    }, {
      id: 'notifications',
      label: 'Notifications',
      icon: Icons.Bell
    }],
    hod: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: Icons.Dashboard,
      badge: 'Analytics'
    }, {
      id: 'hod-profile',
      label: 'HOD Profile',
      icon: Icons.User
    }, {
      id: 'messages',
      label: 'Messages & DM Hub',
      icon: Icons.Send,
      badge: 'DM'
    }, {
      id: 'student-management',
      label: 'Student Management',
      icon: Icons.Users
    }, {
      id: 'staff-management',
      label: 'Staff Management',
      icon: Icons.Award,
      badge: 'Advisors'
    }, {
      id: 'attendance-monitoring',
      label: 'Attendance Audit',
      icon: Icons.CheckCircle,
      badge: '12 Low'
    }, {
      id: 'internal-marks-monitoring',
      label: 'Internal Marks Audit',
      icon: Icons.BarChart
    }, {
      id: 'student-performance',
      label: 'Student Performance',
      icon: Icons.PieChart
    }, {
      id: 'subject-management',
      label: 'Subject Management',
      icon: Icons.BookOpen
    }, {
      id: 'timetable-management',
      label: 'Timetable Management',
      icon: Icons.Calendar
    }, {
      id: 'department-announcements',
      label: 'Department Circulars',
      icon: Icons.Bell
    }, {
      id: 'study-materials',
      label: 'Study Materials',
      icon: Icons.Download
    }, {
      id: 'placement-internship',
      label: 'Placement Stats',
      icon: Icons.Briefcase,
      badge: '86.5%'
    }, {
      id: 'gallery',
      label: 'Gallery',
      icon: Icons.Image,
      badge: 'Hub'
    }, {
      id: 'achievements',
      label: 'Achievements',
      icon: Icons.Sparkles
    }, {
      id: 'reports',
      label: 'Reports',
      icon: Icons.FileText,
      badge: 'NAAC/NBA'
    }, {
      id: 'notifications',
      label: 'Notifications',
      icon: Icons.Bell
    }],
    admin: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: Icons.Dashboard
    }, {
      id: 'user-management',
      label: 'User Management',
      icon: Icons.Users
    }, {
      id: 'student-management',
      label: 'Student Management',
      icon: Icons.GraduationCap
    }, {
      id: 'staff-management',
      label: 'Staff Management',
      icon: Icons.Award
    }, {
      id: 'hod-management',
      label: 'HOD Management',
      icon: Icons.Shield
    }, {
      id: 'department-settings',
      label: 'Department Settings',
      icon: Icons.Cpu
    }, {
      id: 'subject-management',
      label: 'Subject Management',
      icon: Icons.BookOpen
    }, {
      id: 'semester-management',
      label: 'Semester Management',
      icon: Icons.Calendar
    }, {
      id: 'attendance-management',
      label: 'Attendance Settings',
      icon: Icons.CheckCircle
    }, {
      id: 'marks-management',
      label: 'Marks Management',
      icon: Icons.BarChart
    }, {
      id: 'timetable-management',
      label: 'Timetable Management',
      icon: Icons.Calendar
    }, {
      id: 'announcements',
      label: 'Announcements',
      icon: Icons.Bell
    }, {
      id: 'gallery',
      label: 'Gallery',
      icon: Icons.Image,
      badge: 'Media'
    }, {
      id: 'achievements',
      label: 'Achievements',
      icon: Icons.Sparkles
    }, {
      id: 'study-materials',
      label: 'Study Materials',
      icon: Icons.Download
    }, {
      id: 'reports',
      label: 'Reports & Logs',
      icon: Icons.FileText,
      badge: 'Audit'
    }, {
      id: 'system-settings',
      label: 'System Settings',
      icon: Icons.Settings
    }]
  };
  const currentNav = navConfigs[activeRole] || navConfigs.student;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-screen"
  }, isMobileOpen && /*#__PURE__*/React.createElement("div", {
    onClick: onCloseMobile,
    className: "fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
  }), /*#__PURE__*/React.createElement("aside", {
    className: `fixed top-0 bottom-0 left-0 z-40 bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-800/80 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30 flex-shrink-0"
  }, /*#__PURE__*/React.createElement(Icons.Cpu, {
    className: "w-6 h-6"
  })), !isCollapsed && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-sm tracking-tight text-white"
  }, collegeInfo.portalTitle), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-semibold text-cyan-400 truncate max-w-[160px]"
  }, "IT Dept • GCE Erode"))), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleCollapse,
    className: "hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
  }, /*#__PURE__*/React.createElement(Icons.ChevronRight, {
    className: `w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onCloseMobile,
    className: "lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(Icons.X, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "flex-1 overflow-y-auto px-3 py-4 space-y-1"
  }, currentNav.map(item => {
    const isActive = currentTab === item.id;
    const ItemIcon = item.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: () => {
        onSelectTab(item.id);
        if (onCloseMobile) onCloseMobile();
      },
      title: isCollapsed ? item.label : undefined,
      className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${isActive ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-950/50' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'}`
    }, /*#__PURE__*/React.createElement(ItemIcon, {
      className: `w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`
    }), !isCollapsed && /*#__PURE__*/React.createElement("span", {
      className: "flex-1 text-left truncate"
    }, item.label), !isCollapsed && item.badge && /*#__PURE__*/React.createElement("span", {
      className: "px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
    }, item.badge));
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-t border-slate-800/80 bg-slate-950/60"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: logout,
    title: isCollapsed ? 'Logout' : undefined,
    className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition"
  }, /*#__PURE__*/React.createElement(Icons.LogOut, {
    className: "w-5 h-5 flex-shrink-0 text-rose-400"
  }), !isCollapsed && /*#__PURE__*/React.createElement("span", {
    className: "flex-1 text-left"
  }, "Sign Out")))), /*#__PURE__*/React.createElement("div", {
    className: `flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`
  }, /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleMobile,
    className: "lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
  }, /*#__PURE__*/React.createElement(Icons.Menu, {
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-cyan-400"
  }, "GCE ERODE"), /*#__PURE__*/React.createElement("span", null, "•"), /*#__PURE__*/React.createElement("span", null, "IT DEPARTMENT")), /*#__PURE__*/React.createElement("h2", {
    className: "text-sm font-bold text-white capitalize"
  }, currentTab.replace(/-/g, ' ')))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline-flex px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
  }, activeRole), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowNotifs(!showNotifs),
    className: "p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 relative"
  }, /*#__PURE__*/React.createElement(Icons.Bell, {
    className: "w-5 h-5"
  }), notifications.filter(n => !n.read).length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute top-1 right-1 w-4 h-4 bg-cyan-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center animate-bounce"
  }, notifications.filter(n => !n.read).length)), showNotifs && /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl border border-slate-700 shadow-2xl p-4 z-50 animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-3 border-b border-slate-800"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icons.Bell, {
    className: "w-4 h-4 text-cyan-400"
  }), " Notifications"), /*#__PURE__*/React.createElement("button", {
    onClick: markAllNotificationsRead,
    className: "text-xs text-cyan-400 hover:underline"
  }, "Mark all read")), /*#__PURE__*/React.createElement("div", {
    className: "py-2 space-y-2 max-h-72 overflow-y-auto"
  }, notifications.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    onClick: () => {
      onSelectTab(n.link);
      setShowNotifs(false);
    },
    className: `p-2.5 rounded-xl border text-xs cursor-pointer ${n.read ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-cyan-950/40 border-cyan-500/30 text-slate-200'}`
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-white"
  }, n.title), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 block mt-1"
  }, n.time)))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 pl-2 border-l border-slate-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-md"
  }, currentUser?.name ? currentUser.name.charAt(0) : 'U'), /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:flex flex-col text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-white truncate max-w-[120px]"
  }, currentUser?.name), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 capitalize"
  }, activeRole))))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"
  }, /*#__PURE__*/React.createElement(DynamicRoleView, {
    activeRole: activeRole,
    currentTab: currentTab,
    onNavigate: onSelectTab
  })), /*#__PURE__*/React.createElement("footer", {
    className: "border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500"
  }, /*#__PURE__*/React.createElement("p", null, "© 2026 Department of Information Technology • Government College of Engineering, Erode (Autonomous). All Rights Reserved."))));
};

// Sub-views connector
const DynamicRoleView = ({
  activeRole,
  currentTab,
  onNavigate
}) => {
  // Dedicated Gallery Module
  if (currentTab === 'gallery' && (window.ITGalleryView || window.GalleryView)) {
    const GalleryComp = window.ITGalleryView || window.GalleryView;
    return /*#__PURE__*/React.createElement(GalleryComp, {
      onNavigate: onNavigate
    });
  }

  // Load modules
  if (activeRole === 'student' && window.ITStudentViews) {
    const Comp = window.ITStudentViews;
    return /*#__PURE__*/React.createElement(Comp, {
      currentTab: currentTab,
      onNavigate: onNavigate
    });
  }
  if (activeRole === 'staff' && window.ITStaffViews) {
    const Comp = window.ITStaffViews;
    return /*#__PURE__*/React.createElement(Comp, {
      currentTab: currentTab,
      onNavigate: onNavigate
    });
  }
  if (activeRole === 'hod' && window.ITHODViews) {
    const Comp = window.ITHODViews;
    return /*#__PURE__*/React.createElement(Comp, {
      currentTab: currentTab,
      onNavigate: onNavigate
    });
  }
  if (activeRole === 'admin' && window.ITAdminViews) {
    const Comp = window.ITAdminViews;
    return /*#__PURE__*/React.createElement(Comp, {
      currentTab: currentTab,
      onNavigate: onNavigate
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "p-12 text-center text-slate-400 glass-panel rounded-2xl border border-slate-800 animate-pulse"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-base text-cyan-400"
  }, "Loading ", activeRole.toUpperCase(), " Module..."), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, "Please wait a moment"));
};

// Mount to React DOM
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(/*#__PURE__*/React.createElement(RootApp, null));
})();
