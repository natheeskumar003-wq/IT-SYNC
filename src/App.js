// IT DIGITAL HUB - Main Application & Role-Based Layout
// Department of Information Technology - Government College of Engineering, Erode

import { useAuth } from './context/AuthContext.js';
import { LoginPage } from './components/auth/LoginPage.js';
import { Topbar, Sidebar, ToastContainer, AIAssistant } from './components/common/UIComponents.js';
import { StudentViews } from './components/student/StudentViews.js';
import { StaffViews } from './components/staff/StaffViews.js';
import { HODViews } from './components/hod/HODViews.js';
import { AdminViews } from './components/admin/AdminViews.js';

// Navigation Menus Config
const NAV_CONFIG = {
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'my-profile', label: 'My Profile', icon: 'User' },
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
    { id: 'achievements', label: 'Achievements', icon: 'Sparkles' },
    { id: 'certificates', label: 'Certificates', icon: 'Award' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'feedback', label: 'Feedback', icon: 'MessageSquare' }
  ],
  staff: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'my-profile', label: 'My Profile', icon: 'User' },
    { id: 'my-subjects', label: 'My Subjects', icon: 'BookOpen' },
    { id: 'student-list', label: 'Student List', icon: 'Users' },
    { id: 'attendance-management', label: 'Attendance Management', icon: 'CheckCircle' },
    { id: 'internal-marks', label: 'Internal Marks', icon: 'BarChart' },
    { id: 'assignments', label: 'Assignments', icon: 'FileText', badge: 'Submissions' },
    { id: 'upload-study-materials', label: 'Upload Study Materials', icon: 'Upload' },
    { id: 'timetable', label: 'Timetable', icon: 'Calendar' },
    { id: 'announcements', label: 'Announcements', icon: 'Bell' },
    { id: 'student-performance', label: 'Student Performance', icon: 'PieChart' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ],
  hod: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard', badge: 'Analytics' },
    { id: 'hod-profile', label: 'HOD Profile', icon: 'User' },
    { id: 'student-management', label: 'Student Management', icon: 'Users' },
    { id: 'staff-management', label: 'Staff Management', icon: 'Award', badge: 'Leave Req' },
    { id: 'attendance-monitoring', label: 'Attendance Monitoring', icon: 'CheckCircle', badge: '12 Low' },
    { id: 'internal-marks-monitoring', label: 'Internal Marks Monitoring', icon: 'BarChart' },
    { id: 'student-performance', label: 'Student Performance', icon: 'PieChart' },
    { id: 'subject-management', label: 'Subject Management', icon: 'BookOpen' },
    { id: 'timetable-management', label: 'Timetable Management', icon: 'Calendar' },
    { id: 'department-announcements', label: 'Department Announcements', icon: 'Bell' },
    { id: 'study-materials', label: 'Study Materials', icon: 'Download' },
    { id: 'placement-internship', label: 'Placement & Internship', icon: 'Briefcase', badge: '86.5%' },
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
    { id: 'study-materials', label: 'Study Materials', icon: 'Download' },
    { id: 'reports', label: 'Reports', icon: 'FileText', badge: 'Audit' },
    { id: 'system-settings', label: 'System Settings', icon: 'Settings' }
  ]
};

export const App = () => {
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
        activeRole === 'student' && React.createElement(StudentViews, { currentTab: currentTab, onNavigate: handleSelectTab }),
        activeRole === 'staff' && React.createElement(StaffViews, { currentTab: currentTab, onNavigate: handleSelectTab }),
        activeRole === 'hod' && React.createElement(HODViews, { currentTab: currentTab, onNavigate: handleSelectTab }),
        activeRole === 'admin' && React.createElement(AdminViews, { currentTab: currentTab, onNavigate: handleSelectTab })
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
