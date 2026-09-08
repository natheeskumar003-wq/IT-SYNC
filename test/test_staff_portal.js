// Automated Verification Suite for Staff Portal
const React = {
  createElement: (type, props, ...children) => {
    if (typeof type === 'function') {
      return type({ ...(props || {}), children });
    }
    return {
      type,
      props: { ...(props || {}), children }
    };
  },
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: () => {},
  useContext: () => {},
  createContext: () => ({}),
  Fragment: 'Fragment'
};
global.React = React;

// Setup mock window environment
global.window = {
  UIComponents: {
    StatCard: (p) => ({ type: 'StatCard', props: p }),
    Modal: (p) => ({ type: 'Modal', props: p }),
    FileUploader: (p) => ({ type: 'FileUploader', props: p })
  },
  ITAuthContext: {
    Icons: new Proxy({}, { get: () => () => ({ type: 'Icon' }) }),
    useAuth: () => ({
      currentUser: { id: 'ITSTAFF01', role: 'staff', name: 'Dr. A. Venkatesh' },
      facultyList: [
        { id: 'ITHOD01', name: 'Dr. S. K. Murugesan', designation: 'Professor & HOD' },
        { id: 'ITSTAFF01', name: 'Dr. A. Venkatesh', designation: 'Associate Professor', classAdvisorLabel: 'Year 2 Class Advisor' }
      ],
      students: [
        { rollNo: '24IT001', name: 'Naveen Kumar R', year: 2, sem: 4, attendance: 89.5, cgpa: 8.74, phone: '+91 98421 54321', email: 'naveen@gceerode.ac.in', mentor: 'Dr. A. Venkatesh' },
        { rollNo: '24IT002', name: 'Abinaya S', year: 2, sem: 4, attendance: 94.2, cgpa: 9.15, phone: '+91 98422 11111', email: 'abinaya@gceerode.ac.in', mentor: 'Dr. A. Venkatesh' }
      ],
      subjects: [
        { code: 'IT8401', name: 'Database Management Systems', credits: 4, type: 'Theory', faculty: 'Dr. A. Venkatesh' }
      ],
      assignments: [
        { id: 'ASN-01', title: 'ER Diagram Design', subjectCode: 'IT8401', submissionsCount: 1, submissions: [{ rollNo: '24IT001', studentName: 'Naveen Kumar R', fileName: 'solution.pdf', fileType: 'PDF' }] }
      ],
      studyMaterials: [
        { id: 'MAT-01', title: 'Unit 1 Notes', subjectCode: 'IT8401', fileType: 'PDF', fileSize: '2.4 MB', downloads: 35 }
      ],
      announcements: [
        { id: 'ANN-01', title: 'Mid-term schedule', category: 'Academic', date: '2026-03-01', content: 'Mid-term exams commence next week.' }
      ],
      messages: [],
      classAdvisors: {},
      addStudent: (std) => console.log('[MOCK AUTH] addStudent called:', std.rollNo, std.name),
      updateStudent: (rollNo, data) => console.log('[MOCK AUTH] updateStudent called:', rollNo),
      deleteStudent: (rollNo) => console.log('[MOCK AUTH] deleteStudent called:', rollNo),
      addStudyMaterial: () => {},
      createAssignment: () => {},
      gradeAssignment: () => {},
      updateInternalMarksBatch: () => {},
      showToast: (msg, type) => console.log(`[TOAST ${type}] ${msg}`)
    })
  }
};

// Require StaffViews
require('../src/components/staff/StaffViews.js');
const StaffViews = window.ITStaffViews;

if (!StaffViews) {
  console.error('FAILED: window.ITStaffViews is not defined!');
  process.exit(1);
}

const tabsToTest = [
  'dashboard',
  'my-profile',
  'messages',
  'my-subjects',
  'student-list',
  'attendance-management',
  'internal-marks',
  'assignments',
  'upload-study-materials',
  'timetable',
  'announcements',
  'student-performance',
  'notifications'
];

console.log('==================================================');
console.log('TESTING ALL 13 STAFF PORTAL TABS & MODALS');
console.log('==================================================');

let failed = 0;
for (const tab of tabsToTest) {
  try {
    const element = React.createElement(StaffViews, { currentTab: tab, onNavigate: () => {} });
    console.log(`[PASS] Tab: ${tab.padEnd(25)} -> Rendered successfully`);
  } catch (err) {
    console.error(`[FAIL] Tab: ${tab} -> Error: ${err.message}`);
    console.error(err.stack);
    failed++;
  }
}

if (failed === 0) {
  console.log('==================================================');
  console.log('ALL 13/13 STAFF PORTAL TABS RENDERED FLAWLESSLY!');
  console.log('==================================================');
} else {
  console.error(`FAILED: ${failed} tabs failed to render.`);
  process.exit(1);
}
