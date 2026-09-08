// IT DIGITAL HUB - Glassmorphism Login Page
// Government College of Engineering, Erode - Department of Information Technology

const Icons = (typeof require !== 'undefined') ? require('../common/Icons.js').Icons : (window.Icons || (window.ITAuthContext && window.ITAuthContext.Icons) || {});
const useAuth = (typeof require !== 'undefined') ? require('../../context/AuthContext.js').useAuth : (window.ITAuthContext && window.ITAuthContext.useAuth);
const Modal = (typeof require !== 'undefined') ? require('../common/UIComponents.js').Modal : (window.UIComponents && window.UIComponents.Modal);

const LoginPage = () => {
  const { login, demoCredentials, collegeInfo } = useAuth();
  
  const [selectedRole, setSelectedRole] = React.useState('student');
  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [forgotModalOpen, setForgotModalOpen] = React.useState(false);

  // When role changes, reset input fields for clean user credential entry
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setUserId('');
    setPassword('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(selectedRole, userId, password);
      setIsLoading(false);
    }, 450);
  };

  const roleMeta = {
    student: {
      label: 'Student',
      desc: 'Access attendance, internals, study materials & results',
      icon: Icons.GraduationCap,
      color: 'from-cyan-500 to-blue-600',
      idPlaceholder: 'e.g. 24IMT30 or Nathees Kumar T'
    },
    staff: {
      label: 'Faculty / Staff',
      desc: 'Mark attendance, enter marks, upload notes & assignments',
      icon: Icons.BookOpen,
      color: 'from-emerald-500 to-teal-600',
      idPlaceholder: 'e.g. ITSTAFF01'
    },
    hod: {
      label: 'HOD Portal',
      desc: 'Department analytics, staff audit & performance monitoring',
      icon: Icons.Award,
      color: 'from-purple-500 to-indigo-600',
      idPlaceholder: 'e.g. ITHOD01'
    },
    admin: {
      label: 'System Admin',
      desc: 'User management, curriculum configuration & logs',
      icon: Icons.Shield,
      color: 'from-amber-500 to-orange-600',
      idPlaceholder: 'e.g. ITADMIN01'
    }
  };

  return React.createElement(
    'div',
    { className: 'min-height-screen relative flex items-center justify-center min-h-screen p-4 sm:p-6 overflow-hidden select-none' },
    
    // Background Campus Image with Fallback and Dark Overlay
    React.createElement('div', {
      className: 'absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 transform scale-105',
      style: {
        backgroundImage: `url('assets/images/IT sync_dashboard sample img.jpeg'), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=85')`
      }
    }),
    // Dark Multi-stage Gradient Glass Overlay
    React.createElement('div', {
      className: 'absolute inset-0 z-0 bg-gradient-to-tr from-slate-950 via-slate-900/85 to-slate-950/90 backdrop-blur-sm'
    }),

    // Glowing Cyber Accents in background
    React.createElement('div', {
      className: 'absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none'
    }),
    React.createElement('div', {
      className: 'absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none'
    }),

    // Main Glassmorphism Login Container Card
    React.createElement(
      'div',
      {
        className: 'relative z-10 w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/60 shadow-2xl shadow-black/80 animate-fade-in'
      },

      // Institutional Header & Crest
      React.createElement(
        'div',
        { className: 'text-center mb-6' },
        // College Crest Badge
        React.createElement(
          'div',
          { className: 'inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-700 shadow-xl shadow-cyan-900/40 mb-3 border border-white/20' },
          React.createElement(Icons.Cpu, { className: 'w-8 h-8 text-white' })
        ),
        React.createElement(
          'h1',
          { className: 'text-2xl sm:text-3xl font-extrabold text-white tracking-tight' },
          collegeInfo.portalTitle
        ),
        React.createElement(
          'p',
          { className: 'text-sm font-semibold text-cyan-400 mt-1 uppercase tracking-wider' },
          collegeInfo.department
        ),
        React.createElement(
          'p',
          { className: 'text-xs text-slate-400 mt-0.5' },
          collegeInfo.name
        ),
        React.createElement(
          'span',
          { className: 'inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-slate-800/80 border border-slate-700 text-slate-300' },
          'Autonomous • Counseling Code: 7304'
        )
      ),

      // Four Role Selection Tabs
      React.createElement(
        'div',
        { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800' },
        Object.keys(roleMeta).map(roleKey => {
          const isSelected = selectedRole === roleKey;
          const meta = roleMeta[roleKey];
          const RoleIcon = meta.icon;

          return React.createElement(
            'button',
            {
              key: roleKey,
              type: 'button',
              onClick: () => handleRoleSelect(roleKey),
              className: `flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-200 text-xs font-semibold ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-950 border border-cyan-400/40 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/70'
              }`
            },
            React.createElement(RoleIcon, { className: `w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-slate-400'}` }),
            React.createElement('span', { className: 'truncate' }, meta.label)
          );
        })
      ),

      // Form Container
      React.createElement(
        'form',
        { onSubmit: handleLoginSubmit, className: 'space-y-4' },

        // User ID input
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { className: 'block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5' },
            `${roleMeta[selectedRole].label} Full Name / Roll Number / ID`
          ),
          React.createElement(
            'div',
            { className: 'relative' },
            React.createElement(Icons.User, {
              className: 'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400'
            }),
            React.createElement('input', {
              type: 'text',
              required: true,
              value: userId,
              onChange: (e) => setUserId(e.target.value),
              placeholder: roleMeta[selectedRole].idPlaceholder,
              className: 'w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder-slate-500 font-medium'
            })
          )
        ),

        // Password input with Show/Hide toggle
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'flex items-center justify-between mb-1.5' },
            React.createElement(
              'label',
              { className: 'block text-xs font-bold uppercase tracking-wider text-slate-300' },
              'Account Password'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => setForgotModalOpen(true),
                className: 'text-xs text-cyan-400 hover:text-cyan-300 font-medium transition'
              },
              'Forgot Password?'
            )
          ),
          React.createElement(
            'div',
            { className: 'relative' },
            React.createElement(Icons.Shield, {
              className: 'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400'
            }),
            React.createElement('input', {
              type: showPassword ? 'text' : 'password',
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: '••••••••',
              className: 'w-full pl-10 pr-11 py-2.5 text-sm rounded-xl glass-input placeholder-slate-500 font-medium'
            }),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => setShowPassword(!showPassword),
                className: 'absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition'
              },
              React.createElement(showPassword ? Icons.EyeOff : Icons.Eye, { className: 'w-4 h-4' })
            )
          )
        ),

        // Remember Me & Security Status
        React.createElement(
          'div',
          { className: 'flex items-center justify-between text-xs text-slate-400' },
          React.createElement(
            'label',
            { className: 'flex items-center gap-2 cursor-pointer' },
            React.createElement('input', {
              type: 'checkbox',
              checked: rememberMe,
              onChange: (e) => setRememberMe(e.target.checked),
              className: 'w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0'
            }),
            React.createElement('span', null, 'Keep me logged in')
          ),
          React.createElement(
            'span',
            { className: 'flex items-center gap-1 text-[11px] text-emerald-400 font-medium' },
            React.createElement(Icons.Shield, { className: 'w-3 h-3' }),
            'SSL 256-bit Encrypted'
          )
        ),

        // Submit Button
        React.createElement(
          'button',
          {
            type: 'submit',
            disabled: isLoading,
            className: 'w-full py-3 px-4 rounded-xl text-sm font-bold text-white gradient-btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2'
          },
          isLoading ? React.createElement(
            React.Fragment,
            null,
            React.createElement('span', { className: 'w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' }),
            'Authenticating...'
          ) : React.createElement(
            React.Fragment,
            null,
            `Login to ${roleMeta[selectedRole].label} Portal`,
            React.createElement(Icons.ArrowRight, { className: 'w-4 h-4' })
          )
        )
      )
    ),

    // Forgot Password Modal
    React.createElement(
      Modal,
      {
        isOpen: forgotModalOpen,
        onClose: () => setForgotModalOpen(false),
        title: 'Department Credential Recovery',
        maxWidth: 'max-w-md'
      },
      React.createElement(
        'div',
        { className: 'space-y-4 text-xs' },
        React.createElement(
          'p',
          { className: 'text-slate-300' },
          'Login is restricted to registered department members. Default account setup password is institutional (1234).'
        ),
        React.createElement(
          'div',
          { className: 'p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-slate-300' },
          React.createElement('p', { className: 'font-bold text-cyan-400' }, 'Institutional Login Notice:'),
          React.createElement('p', null, '• All authorized Student, Faculty Staff, HOD, and Admin accounts are configured.'),
          React.createElement('p', null, '• Use your registered Department ID and institutional password.')
        ),
        React.createElement(
          'p',
          { className: 'text-slate-400' },
          'Need account assistance or credential reset? Contact System Admin: admin.it@gceerode.ac.in or HOD Cabin 101.'
        ),
        React.createElement(
          'button',
          {
            onClick: () => setForgotModalOpen(false),
            className: 'w-full py-2 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition'
          },
          'Understood'
        )
      )
    )
  );
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LoginPage };
}
if (typeof window !== 'undefined') {
  window.LoginPage = LoginPage;
}
