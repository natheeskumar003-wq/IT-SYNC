// IT DIGITAL HUB - Main Application & Role-Based Layout
// Department of Information Technology - Government College of Engineering, Erode

const useAuth = (typeof require !== 'undefined') ? require('./context/AuthContext.js').useAuth : (window.ITAuthContext && window.ITAuthContext.useAuth);
const LoginPage = (typeof require !== 'undefined') ? require('./components/auth/LoginPage.js').LoginPage : window.LoginPage;
const { Topbar, Sidebar, ToastContainer, AIAssistant } = (typeof require !== 'undefined') ? require('./components/common/UIComponents.js') : (window.UIComponents || {});
const StudentViews = (typeof require !== 'undefined') ? require('./components/student/StudentViews.js') : window.ITStudentViews;
const StaffViews = (typeof require !== 'undefined') ? require('./components/staff/StaffViews.js') : window.ITStaffViews;
const HODViews = (typeof require !== 'undefined') ? require('./components/hod/HODViews.js') : window.ITHODViews;
const AdminViews = (typeof require !== 'undefined') ? require('./components/admin/AdminViews.js') : window.ITAdminViews;

// Navigation Menus Config
const NAV_CONFIG = {
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'my-profile', label: 'My Profile', icon: 'User' },
    { id: 'messages', label: 'Messages & Requests', icon: 'MessageSquare', badge: 'Hub' },
    { id: 'subjects', label: 'Subjects', icon: 'BookOpen' },
    { id: 'attendance', label: 'Attendance', icon: 'CheckCircle', badge: '89.5%' },
    { id: 'internal-marks', label: 'Internal Marks', icon: 'BarChart' },
    { id: 'semester-results', label: 'Semester Results', icon: 'Award' },
    { id: 'study-materials', label: 'Study Materials', icon: 'Download' },
    { id: 'assignments', label: 'Assignments', icon: 'FileText', badge: '2 Due' },
    { id: 'timetable', label: 'Timetable', icon: 'Calendar' },
    { id: 'faculty-details', label: 'Faculty Details', icon: 'Users' },
    { id: 'department-announcements', label: 'Department Announcements', icon: 'Bell', badge: 'New' },
    { id: 'previous-year-question-papers', label: 'Previous Year Question Papers', icon: 'Database' },
    { id: 'placement-internship', label: 'Placement & Internship', icon: 'Briefcase', badge: 'Drives' },
    { id: 'gallery', label: 'Gallery', icon: 'Image', badge: 'Hub' },
    { id: 'achievements', label: 'Achievements', icon: 'Sparkles' },
    { id: 'certificates', label: 'Certificates', icon: 'Award' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ],
  staff: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'my-profile', label: 'My Profile', icon: 'User' },
    { id: 'messages', label: 'Messages & Requests', icon: 'MessageSquare', badge: 'Hub' },
    { id: 'my-subjects', label: 'My Subjects', icon: 'BookOpen' },
    { id: 'student-list', label: 'Student List', icon: 'Users' },
    { id: 'attendance-management', label: 'Attendance Management', icon: 'CheckCircle' },
    { id: 'internal-marks', label: 'Internal Marks', icon: 'BarChart' },
    { id: 'assignments', label: 'Assignments', icon: 'FileText', badge: 'Submissions' },
    { id: 'upload-study-materials', label: 'Upload Study Materials', icon: 'Upload' },
    { id: 'timetable', label: 'Timetable', icon: 'Calendar' },
    { id: 'announcements', label: 'Announcements', icon: 'Bell' },
    { id: 'gallery', label: 'Gallery', icon: 'Image', badge: 'Review' },
    { id: 'achievements', label: 'Achievements', icon: 'Sparkles' },
    { id: 'student-performance', label: 'Student Performance', icon: 'PieChart' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ],
  hod: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard', badge: 'Analytics' },
    { id: 'hod-profile', label: 'HOD Profile', icon: 'User' },
    { id: 'messages', label: 'Messages & DM Hub', icon: 'Send', badge: 'DM' },
    { id: 'student-management', label: 'Student Management', icon: 'Users' },
    { id: 'staff-management', label: 'Staff Management', icon: 'Award', badge: 'Advisors' },
    { id: 'attendance-monitoring', label: 'Attendance Monitoring', icon: 'CheckCircle', badge: '12 Low' },
    { id: 'internal-marks-monitoring', label: 'Internal Marks Monitoring', icon: 'BarChart' },
    { id: 'student-performance', label: 'Student Performance', icon: 'PieChart' },
    { id: 'subject-management', label: 'Subject Management', icon: 'BookOpen' },
    { id: 'timetable-management', label: 'Timetable Management', icon: 'Calendar' },
    { id: 'department-announcements', label: 'Department Announcements', icon: 'Bell' },
    { id: 'study-materials', label: 'Study Materials', icon: 'Download' },
    { id: 'placement-internship', label: 'Placement & Internship', icon: 'Briefcase', badge: '86.5%' },
    { id: 'gallery', label: 'Gallery', icon: 'Image', badge: 'Hub' },
    { id: 'achievements', label: 'Achievements', icon: 'Sparkles' },
    { id: 'reports', label: 'Reports', icon: 'FileText', badge: 'NAAC/NBA' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'user-management', label: 'User Management', icon: 'Users' },
    { id: 'student-management', label: 'Student Management', icon: 'GraduationCap' },
    { id: 'staff-management', label: 'Staff Management', icon: 'Award' },
    { id: 'hod-management', label: 'HOD Management', icon: 'Shield' },
    { id: 'department-settings', label: 'Department Settings', icon: 'Cpu' },
    { id: 'subject-management', label: 'Subject Management', icon: 'BookOpen' },
    { id: 'semester-management', label: 'Semester Management', icon: 'Calendar' },
    { id: 'attendance-management', label: 'Attendance Management', icon: 'CheckCircle' },
    { id: 'marks-management', label: 'Marks Management', icon: 'BarChart' },
    { id: 'timetable-management', label: 'Timetable Management', icon: 'Calendar' },
    { id: 'announcements', label: 'Announcements', icon: 'Bell' },
    { id: 'gallery', label: 'Gallery', icon: 'Image', badge: 'Media' },
    { id: 'achievements', label: 'Achievements', icon: 'Sparkles' },
    { id: 'study-materials', label: 'Study Materials', icon: 'Download' },
    { id: 'reports', label: 'Reports', icon: 'FileText', badge: 'Audit' },
    { id: 'system-settings', label: 'System Settings', icon: 'Settings' }
  ]
};

const App = () => {
  const { currentUser, logout } = useAuth();
  
  // Navigation State
  const [currentTab, setCurrentTab] = React.useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // When role changes, reset tab to dashboard
  React.useEffect(() => {
    setCurrentTab('dashboard');
  }, [currentUser?.role]);

  // If user is not authenticated, show modern Glassmorphism Login Page
  if (!currentUser) {
    return React.createElement(
      'div',
      { className: 'min-h-screen bg-slate-950 text-slate-100 font-sans' },
      React.createElement(LoginPage, null),
      React.createElement(ToastContainer, null)
    );
  }

  const activeRole = currentUser.role || 'student';
  const navItems = NAV_CONFIG[activeRole] || NAV_CONFIG.student;

  const handleSelectTab = (tabId) => {
    if (tabId === 'logout') {
      logout();
    } else {
      setCurrentTab(tabId);
    }
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-[#0a0f1d] text-slate-100 font-sans flex flex-col' },
    
    // Sidebar
    React.createElement(Sidebar, {
      navItems: navItems,
      currentTab: currentTab,
      onSelectTab: handleSelectTab,
      isCollapsed: isSidebarCollapsed,
      onToggleCollapse: () => setIsSidebarCollapsed(!isSidebarCollapsed),
      isMobileOpen: isMobileOpen,
      onCloseMobile: () => setIsMobileOpen(false),
      activeRole: activeRole
    }),

    // Main App View Wrapper
    React.createElement(
      'div',
      {
        className: `flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`
      },
      // Top Navigation Bar
      React.createElement(Topbar, {
        currentTab: currentTab,
        activeRole: activeRole,
        onToggleSidebar: () => setIsMobileOpen(true),
        onNavigate: handleSelectTab
      }),

      // Main Content Area
      React.createElement(
        'main',
        { className: 'flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto' },
        currentTab === 'gallery' && (typeof window !== 'undefined' && (window.ITGalleryView || window.GalleryView))
          ? React.createElement(window.ITGalleryView || window.GalleryView, { onNavigate: handleSelectTab })
          : (
              (activeRole === 'student' && React.createElement(StudentViews, { currentTab: currentTab, onNavigate: handleSelectTab })) ||
              (activeRole === 'staff' && React.createElement(StaffViews, { currentTab: currentTab, onNavigate: handleSelectTab })) ||
              (activeRole === 'hod' && React.createElement(HODViews, { currentTab: currentTab, onNavigate: handleSelectTab })) ||
              (activeRole === 'admin' && React.createElement(AdminViews, { currentTab: currentTab, onNavigate: handleSelectTab }))
            )
      ),

      // Footer
      React.createElement(
        'footer',
        { className: 'border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500' },
        React.createElement('p', null,
          '© 2026 Department of Information Technology • Government College of Engineering, Erode (Autonomous). All Rights Reserved.'
        )
      )
    ),

    // Toast Notifications Bus
    React.createElement(ToastContainer, null),

    // Floating IT-Bot Virtual Assistant
    React.createElement(AIAssistant, null)
  );
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App };
}
if (typeof window !== 'undefined') {
  window.App = App;
}
