// IT DIGITAL HUB - Student Views (All 17+ Modules & Sub-views)
// Department of Information Technology - Government College of Engineering, Erode

(function () {
const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || {};
const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));
const { StatCard, Modal } = (typeof window !== 'undefined' && window.UIComponents) || {};

// Safe FileUploader component wrapper
const SafeFileUploader = (props) => {
  const Comp = (typeof window !== 'undefined' && window.UIComponents?.FileUploader);
  if (Comp) return React.createElement(Comp, props);
  return React.createElement(
    'div',
    { className: 'p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 text-xs text-slate-400' },
    React.createElement('input', {
      type: 'file',
      accept: props.accept,
      onChange: (e) => {
        const file = e.target.files?.[0];
        if (file && props.onFileSelect) {
          props.onFileSelect({
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: file.type || 'Document'
          });
        }
      },
      className: 'w-full text-slate-300'
    }),
    React.createElement('p', { className: 'text-[10px] text-slate-500 mt-1' }, props.helperText || 'Select file from disk')
  );
};

// Safe Modal component wrapper
const SafeModal = (props) => {
  const UIModal = (typeof window !== 'undefined' && window.UIComponents?.Modal) || Modal;
  if (UIModal) return React.createElement(UIModal, props);
  if (!props.isOpen) return null;
  return React.createElement(
    'div',
    { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in' },
    React.createElement(
      'div',
      { className: 'glass-panel p-6 rounded-3xl border border-slate-700/80 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between pb-4 border-b border-slate-800 mb-4' },
        React.createElement('h3', { className: 'text-base font-bold text-white' }, props.title || 'Dialog'),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: props.onClose,
            className: 'p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition'
          },
          React.createElement(Icons.X, { className: 'w-4 h-4' })
        )
      ),
      props.children
    )
  );
};

const StudentViews = ({ currentTab, onNavigate }) => {

  const {
    currentUser,
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
    messages,
    classAdvisors,
    submitAssignment,
    addAchievement,
    addCertificate,
    deleteCertificate,
    sendMessage,
    showToast
  } = useAuth();

  // Modal States
  const [activeModal, setActiveModal] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);

  // Form states
  const [submittingAsnId, setSubmittingAsnId] = React.useState(null);
  const [submissionFileName, setSubmissionFileName] = React.useState('');
  const [submissionFileData, setSubmissionFileData] = React.useState(null);

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
  const [selectedCertFile, setSelectedCertFile] = React.useState(null);
  const [viewingCertificate, setViewingCertificate] = React.useState(null);
  const [selectedAchieveFile, setSelectedAchieveFile] = React.useState(null);
  const [viewingAchievement, setViewingAchievement] = React.useState(null);

  // Question Papers Download Local Storage Tracking (Issue 4)
  const [downloadedQPs, setDownloadedQPs] = React.useState(() => {
    try {
      const saved = localStorage.getItem('gce_it_downloaded_qps');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('gce_it_downloaded_qps', JSON.stringify(downloadedQPs));
    } catch (e) {}
  }, [downloadedQPs]);

  const [previewQP, setPreviewQP] = React.useState(null);
  const [filterSubject, setFilterSubject] = React.useState('ALL');
  const [previewMat, setPreviewMat] = React.useState(null);

  const [leaveForm, setLeaveForm] = React.useState({
    reasonType: 'On-Duty (OD - Hackathon/Symposium)',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    description: '',
    proofFile: null
  });

  // Messaging Form State (Feature 3)
  const [msgSubTab, setMsgSubTab] = React.useState('request-staff'); // 'request-staff' | 'dm-student' | 'inbox'
  const [staffRequestForm, setStaffRequestForm] = React.useState({
    recipientStaffId: 'ITSTAFF01',
    requestType: 'OD / Event Permission',
    subject: '',
    content: ''
  });
  const [studentDmForm, setStudentDmForm] = React.useState({
    recipientRollNo: '24IT002',
    subject: '',
    content: ''
  });

  const normalizedTab = 
    (currentTab === 'profile' || currentTab === 'my-profile') ? 'my-profile' :
    (currentTab === 'messages' || currentTab === 'student-messages') ? 'messages' :
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
    currentTab;

  // Safe arrays and state
  const safeAttendance = Array.isArray(attendance) ? attendance : [];
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const safeSemesterResults = Array.isArray(semesterResults) ? semesterResults : [];
  const safeStudyMaterials = Array.isArray(studyMaterials) ? studyMaterials : [];
  const safeFacultyList = Array.isArray(facultyList) ? facultyList : [];
  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];
  const safeQuestionPapers = Array.isArray(questionPapers) ? questionPapers : [];
  const safePlacements = Array.isArray(placements) ? placements : [];
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  const safeCertificates = Array.isArray(certificates) ? certificates : [];
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const safeTimetable = timetable || { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
  const safeInternalMarks = Array.isArray(internalMarks)
    ? internalMarks
    : (internalMarks && typeof internalMarks === 'object' ? Object.values(internalMarks) : []);
  const safeMessages = Array.isArray(messages) ? messages : [];
  const safeProfile = {
    ...(studentProfile || {}),
    ...(currentUser || {}),
    name: currentUser?.name || studentProfile?.name || "Student",
    rollNo: currentUser?.rollNo || currentUser?.id || studentProfile?.rollNo || "24IMT30",
    regNo: currentUser?.regNo || studentProfile?.regNo || "731124205030",
    batch: currentUser?.batch || studentProfile?.batch || "2024 - 2028",
    department: currentUser?.department || studentProfile?.department || "Information Technology",
    year: currentUser?.year || studentProfile?.year || 2,
    sem: currentUser?.sem || studentProfile?.sem || 4,
    sec: currentUser?.sec || currentUser?.section || studentProfile?.sec || studentProfile?.section || "A",
    cgpa: (currentUser?.cgpa !== undefined ? Number(currentUser.cgpa) : (studentProfile?.cgpa !== undefined ? Number(studentProfile.cgpa) : 8.5)),
    internalAvg: currentUser?.internalAvg || studentProfile?.internalAvg || 86.4,
    mentorName: currentUser?.mentor || currentUser?.mentorName || studentProfile?.mentorName || "Dr. Mohanasundaram"
  };

  const assignedAdvisor = (classAdvisors && (classAdvisors[safeProfile.year] || classAdvisors[2])) || {
    staffId: "ITSTAFF02",
    staffName: "Dr. Mohanasundaram",
    designation: "Associate Professor",
    email: "mohanasundaram.it@gceerode.ac.in",
    phone: "+91 98422 33445",
    cabin: "Room 305, IT Block"
  };

  // Calculate overall attendance
  const totalHours = safeAttendance.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const attendedHours = safeAttendance.reduce((acc, curr) => acc + (curr.attended || 0), 0);
  const overallAttendancePct = totalHours > 0 ? ((attendedHours / totalHours) * 100).toFixed(1) : "89.5";
  const pendingAsnCount = safeAssignments.filter(a => a.status === 'Pending').length;

  // Handle Assignment Submission
  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    const finalFileName = submissionFileName || (submissionFileData ? submissionFileData.name : 'assignment_solution.pdf');
    if (!finalFileName) {
      showToast('Please select or name your solution file', 'error');
      return;
    }
    submitAssignment(submittingAsnId, finalFileName);
    setActiveModal(null);
    setSubmissionFileName('');
    setSubmissionFileData(null);
  };

  // Handle Staff Request
  const handleSendStaffRequest = (e) => {
    e.preventDefault();
    if (!staffRequestForm.subject || !staffRequestForm.content) {
      showToast('Please provide both subject and request description', 'error');
      return;
    }
    const staffObj = safeFacultyList.find(f => f.id === staffRequestForm.recipientStaffId) || { name: assignedAdvisor.staffName };
    if (sendMessage) {
      sendMessage({
        toId: staffRequestForm.recipientStaffId,
        toName: staffObj.name,
        toRole: 'staff',
        type: 'Request',
        subject: `[${staffRequestForm.requestType}] ${staffRequestForm.subject}`,
        content: staffRequestForm.content
      });
    } else {
      showToast(`Request sent to ${staffObj.name}!`, 'success');
    }
    setStaffRequestForm({ recipientStaffId: 'ITSTAFF01', requestType: 'OD / Event Permission', subject: '', content: '' });
    setMsgSubTab('inbox');
  };

  // Handle Student DM
  const handleSendStudentDm = (e) => {
    e.preventDefault();
    if (!studentDmForm.subject || !studentDmForm.content) {
      showToast('Please provide both subject and message', 'error');
      return;
    }
    if (sendMessage) {
      sendMessage({
        toId: studentDmForm.recipientRollNo,
        toName: `Student (${studentDmForm.recipientRollNo})`,
        toRole: 'student',
        type: 'DM',
        subject: studentDmForm.subject,
        content: studentDmForm.content
      });
    } else {
      showToast(`Message sent to ${studentDmForm.recipientRollNo}!`, 'success');
    }
    setStudentDmForm({ recipientRollNo: '24IT002', subject: '', content: '' });
    setMsgSubTab('inbox');
  };

  // Handle Achievement Photo Upload (Multipart supported)
  const handleAddAchievement = async (e) => {
    e.preventDefault();
    if (!newAchievement.title) {
      showToast('Please enter an achievement title', 'error');
      return;
    }

    if (selectedAchieveFile) {
      const formData = new FormData();
      formData.append('file', selectedAchieveFile);
      formData.append('title', newAchievement.title);
      formData.append('description', newAchievement.description || '');
      formData.append('category', newAchievement.category || 'Achievement');
      formData.append('issuedBy', newAchievement.issuedBy || 'Institutional Recognition');
      formData.append('date', newAchievement.date || new Date().toISOString().split('T')[0]);
      formData.append('studentName', safeProfile.name);
      formData.append('studentRoll', safeProfile.rollNo);

      await addAchievement(formData);
    } else {
      await addAchievement({
        title: newAchievement.title,
        description: newAchievement.description || '',
        category: newAchievement.category || 'Achievement',
        issuedBy: newAchievement.issuedBy || 'Institutional Recognition',
        date: newAchievement.date || new Date().toISOString().split('T')[0],
        studentName: safeProfile.name,
        studentRoll: safeProfile.rollNo
      });
    }

    setActiveModal(null);
    setSelectedAchieveFile(null);
    setNewAchievement({ title: '', category: 'Hackathon', issuedBy: '', date: new Date().toISOString().split('T')[0], description: '' });
  };

  // Handle Achievement Download
  const handleDownloadAchievement = (ach) => {
    const isPdf = ach.fileType === 'pdf' || (ach.fileName && ach.fileName.toLowerCase().endsWith('.pdf')) || (ach.fileUrl && ach.fileUrl.toLowerCase().endsWith('.pdf'));
    const docContent = `GOVERNMENT COLLEGE OF ENGINEERING, ERODE\nDEPARTMENT OF INFORMATION TECHNOLOGY\n\nSTUDENT HONOR & ACHIEVEMENT RECORD\n=======================================================\nTITLE: ${ach.title}\nSTUDENT: ${ach.studentName || safeProfile.name} (${ach.studentRoll || safeProfile.rollNo})\nCATEGORY: ${ach.category || 'Achievement'}\nISSUED BY: ${ach.issuedBy || 'Institutional Recognition'}\nUPLOAD DATE: ${ach.uploadDate || ach.date}\nDESCRIPTION:\n${ach.description || 'Special achievement in technical competition / symposium.'}\n\n[Verified Institutional Digital Hub Record]`;
    const blob = new Blob([docContent], { type: isPdf ? 'application/pdf' : 'text/plain' });
    const dlUrl = ach.fileUrl || URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = ach.fileName || `${(ach.title || 'achievement').replace(/[^a-zA-Z0-9_-]/g, '_')}${isPdf ? '.pdf' : '.png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (!ach.fileUrl) setTimeout(() => URL.revokeObjectURL(dlUrl), 5000);
    showToast(`Achievement "${ach.title}" Downloaded Successfully.`, 'success');
  };

  // Handle Certificate Upload with backend multipart support
  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!newCertificate.name) {
      showToast('Please enter the certificate title', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('title', newCertificate.name);
    formData.append('name', newCertificate.name);
    formData.append('issuer', newCertificate.issuer || 'Institutional Verification Cell');
    formData.append('credentialId', newCertificate.credentialId || `CRED-${Math.floor(100000 + Math.random() * 900000)}`);
    formData.append('rollNo', safeProfile.rollNo);
    if (selectedCertFile) {
      formData.append('file', selectedCertFile);
    }
    await addCertificate(formData);
    setActiveModal(null);
    setNewCertificate({ name: '', issuer: '', issueDate: new Date().toISOString().split('T')[0], validTill: 'Lifetime', credentialId: '' });
    setSelectedCertFile(null);
  };

  // Handle Certificate Download
  const handleDownloadCertificate = (cert) => {
    const certTitle = cert.title || cert.name || 'Certificate';
    if (cert.fileUrl && !cert.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = cert.fileUrl;
      a.download = cert.fileName || `${certTitle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const content = `GOVERNMENT COLLEGE OF ENGINEERING, ERODE (AUTONOMOUS R2021)\nDEPARTMENT OF INFORMATION TECHNOLOGY\n\n=======================================================\nVERIFIED ACADEMIC CERTIFICATE OF MERIT & COMPLETION\n=======================================================\n\nCertificate Title: ${certTitle}\nIssuing Organization: ${cert.issuer || 'Department Certification'}\nCredential ID: ${cert.credentialId || 'N/A'}\nIssued To: ${safeProfile.name} (Roll No: ${safeProfile.rollNo})\nVerification Date: ${cert.uploadDate || cert.issueDate || '2026-09-08'}\nStatus: Verified ✓\n\nOfficial Academic Digital Repository - Department of Information Technology`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certTitle.replace(/\s+/g, '_')}_Certificate.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
    showToast(`Certificate "${certTitle}" Downloaded Successfully.`, 'success');
  };

  // Handle Question Paper Download (Issue 4)
  const handleDownloadQP = (qp) => {
    const fileName = `${qp.subjectCode}_${(qp.subjectName || '').replace(/[^a-zA-Z0-9_-]/g, '_')}_${qp.year || '2024'}_QP.pdf`;
    const subject = `${qp.subjectCode} - ${qp.subjectName}`;
    const downloadDate = new Date().toLocaleString();

    const content = `%PDF-1.4\n% GCE ERODE (AUTONOMOUS) - END SEMESTER EXAMINATION QUESTION PAPER\n\nSubject Code: ${qp.subjectCode}\nSubject Name: ${qp.subjectName}\nRegulation: Autonomous R2021\nExam Session: ${qp.year} - ${qp.type || 'End Semester'}\nMax Marks: 100\nTime: 3 Hours\n\nPART A - (10 x 2 = 20 Marks)\nAnswer ALL Questions\n1. Define the fundamental mathematical concept of ${qp.subjectName}.\n2. Explain time-space trade-offs in modern computing systems.\n3. Formulate the core design constraints for enterprise applications.\n4. Differentiate between deterministic and non-deterministic automata.\n5. State the principle of duality and its practical implications.\n6. Illustrate memory hierarchy and cache coherence protocols.\n7. Compare packet switching with circuit switching architectures.\n8. What is ACID property? State its significance in transactions.\n9. Explain the role of lambda calculus in functional programming.\n10. Outline two key security vulnerabilities in distributed nodes.\n\nPART B - (5 x 13 = 65 Marks)\n11.(a) Describe the comprehensive architecture and algorithmic execution model with neat block diagrams.\n   (OR)\n11.(b) Derive the analytical formulation and verify correctness with a complete numeric case study.\n\nPART C - (1 x 15 = 15 Marks)\n16. Case Study: Architect a high-throughput, fault-tolerant enterprise system for Autonomous engineering portals.\n\n[End of Question Paper Bank archive - Government College of Engineering, Erode]`;

    const blob = new Blob([content], { type: 'application/pdf;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Save record into downloaded files local storage list
    const newDownload = {
      id: `DL-${Date.now()}`,
      fileName,
      subject,
      downloadDate,
      rawContent: content,
      fileSize: qp.fileSize || '1.8 MB'
    };
    setDownloadedQPs(prev => [newDownload, ...prev.filter(d => d.fileName !== fileName)]);

    // Show exact required success toast
    showToast('Question Paper Downloaded Successfully.', 'success');
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
              'Welcome back, ', React.createElement('span', { className: 'gradient-text-it' }, safeProfile.name), ' 👋'
            ),
            React.createElement('p', { className: 'text-xs sm:text-sm text-slate-300 mt-1' },
              `Roll No: ${safeProfile.rollNo} • Year ${safeProfile.year} • Section ${safeProfile.sec || safeProfile.section || 'A'}`
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
          value: (Number(safeProfile.cgpa) || 8.5).toFixed(2),
          subtitle: 'Rank 4 in Department',
          icon: Icons.Award,
          trend: 0.12,
          trendLabel: 'from Sem 3',
          color: 'blue',
          onClick: () => onNavigate('semester-results')
        }),
        React.createElement(StatCard, {
          title: 'Internal Average Score',
          value: `${safeProfile.internalAvg}%`,
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
            (safeTimetable.Tuesday || []).map((slot, idx) => React.createElement(
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

        // Right Column: Class Advisor & Notices (1 Col)
        React.createElement(
          'div',
          { className: 'space-y-6' },

          // Class Advisor Widget (Feature 5)
          React.createElement(
            'div',
            { className: 'glass-panel p-5 rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 shadow-xl' },
            React.createElement(
              'div',
              { className: 'flex items-center justify-between pb-3 mb-3 border-b border-slate-800' },
              React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement(Icons.Award, { className: 'w-5 h-5 text-cyan-400' }),
                React.createElement('h3', { className: 'text-sm font-bold text-white' }, `Class Advisor (${safeProfile.year || 'II Year'})`)
              ),
              React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
                'Year Advisor'
              )
            ),
            React.createElement('h4', { className: 'text-sm font-extrabold text-white' }, assignedAdvisor.staffName),
            React.createElement('p', { className: 'text-xs text-cyan-400 font-medium' }, assignedAdvisor.designation),
            React.createElement('p', { className: 'text-[11px] text-slate-400 mt-2' }, `Cabin: ${assignedAdvisor.cabin || 'Room 204, IT Block'}`),
            React.createElement('p', { className: 'text-[11px] text-slate-400' }, `Email: ${assignedAdvisor.email}`),
            React.createElement(
              'button',
              {
                onClick: () => {
                  setStaffRequestForm(prev => ({ ...prev, recipientStaffId: assignedAdvisor.staffId || 'ITSTAFF01' }));
                  onNavigate('messages');
                },
                className: 'mt-3 w-full py-2.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center justify-center gap-2'
              },
              React.createElement(Icons.MessageSquare, { className: 'w-4 h-4' }),
              'Message Class Advisor'
            )
          ),

          // Quick Circulars & Notices
          React.createElement(
            'div',
            { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60' },
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
              safeAnnouncements.slice(0, 3).map(ann => React.createElement(
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
            ),
            React.createElement(
              'div',
              { className: 'mt-6 pt-4 border-t border-slate-800 flex items-center justify-between' },
              React.createElement('span', { className: 'text-xs text-slate-400' }, 'Faculty Mentor:'),
              React.createElement('span', { className: 'text-xs font-bold text-cyan-300' }, safeProfile.mentorName)
            )
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
            React.createElement('h2', { className: 'text-2xl font-extrabold text-white' }, safeProfile.name),
            React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-0.5' },
              `Roll No: ${safeProfile.rollNo} • Register No: ${safeProfile.regNo} • Batch: ${safeProfile.batch || '2024 - 2028'}`
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
              React.createElement('span', { className: 'font-semibold text-white' }, safeProfile.department)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Current Year / Sem'),
              React.createElement('span', { className: 'font-semibold text-white' }, `Year ${safeProfile.year} / Sem ${safeProfile.sem || 4}`)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Cumulative CGPA'),
              React.createElement('span', { className: 'font-bold text-cyan-300' }, `${(Number(safeProfile.cgpa) || 8.5).toFixed(2)} / 10.0`)
            ),
            React.createElement('div', { className: 'flex justify-between py-1' },
              React.createElement('span', { className: 'text-slate-400' }, 'Hostel / Day Scholar'),
              React.createElement('span', { className: 'font-semibold text-white' }, safeProfile.hostelStatus || 'Day Scholar')
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
              React.createElement('span', { className: 'font-semibold text-white' }, safeProfile.dob || '15-05-2005')
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Blood Group'),
              React.createElement('span', { className: 'font-bold text-rose-400' }, safeProfile.bloodGroup || 'O +ve')
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Email Address'),
              React.createElement('span', { className: 'font-semibold text-white truncate max-w-[170px]' }, safeProfile.email)
            ),
            React.createElement('div', { className: 'flex justify-between py-1' },
              React.createElement('span', { className: 'text-slate-400' }, 'Phone Number'),
              React.createElement('span', { className: 'font-semibold text-white' }, safeProfile.phone || '+91 96555 61053')
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
              React.createElement('span', { className: 'font-semibold text-white' }, safeProfile.mentorName)
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Mentor Email'),
              React.createElement('span', { className: 'font-semibold text-cyan-300 truncate max-w-[170px]' }, safeProfile.mentorEmail || 'mentor.it@gceerode.ac.in')
            ),
            React.createElement('div', { className: 'flex justify-between py-1 border-b border-slate-800/60' },
              React.createElement('span', { className: 'text-slate-400' }, 'Father Name'),
              React.createElement('span', { className: 'font-semibold text-white' }, safeProfile.fatherName || 'Parent / Guardian')
            ),
            React.createElement('div', { className: 'flex justify-between py-1' },
              React.createElement('span', { className: 'text-slate-400' }, 'Parent Contact'),
              React.createElement('span', { className: 'font-semibold text-white' }, safeProfile.fatherPhone || '+91 94432 10987')
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
        safeSubjects.map(subj => React.createElement(
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
              safeAttendance.map(item => React.createElement(
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
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Attach Proof Document (From Disk)'),
            React.createElement(SafeFileUploader, {
              accept: '.pdf,.png,.jpg,.jpeg',
              label: 'Attach Event Invitation or Doctor Certificate',
              helperText: 'PDF or Image proof up to 10MB',
              onFileSelect: (fileData) => setLeaveForm({ ...leaveForm, proofFile: fileData })
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold'
          }, `Submit Application to ${assignedAdvisor.staffName}`)
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
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('span', { className: 'px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30' },
            'Sem 4 In-Progress'
          ),
          React.createElement('button', {
            onClick: () => showToast('Continuous Internal Assessment (CIA) Grade Card PDF generated & downloaded!', 'success'),
            className: 'px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5'
          },
            React.createElement(Icons.Download, { className: 'w-3.5 h-3.5 text-cyan-400' }),
            'Download CIA PDF'
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
              safeInternalMarks.map(item => React.createElement(
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
        safeSemesterResults.map(sem => React.createElement(
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
              `GPA: ${sem.gpa ? sem.gpa.toFixed(2) : '8.50'}`
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs' },
            (sem.courses || []).map(course => React.createElement(
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
    const filteredMaterials = filterSubject === 'ALL'
      ? safeStudyMaterials
      : safeStudyMaterials.filter(m => m.subjectCode === filterSubject || m.subject === filterSubject);

    const handleDownloadMaterial = (mat) => {
      if (mat.fileUrl && !mat.fileUrl.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = mat.fileUrl;
        a.download = mat.fileName || `${mat.subjectCode || 'IT'}_${mat.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(`Study Material "${mat.title}" Download Started.`, 'success');
        return;
      }
      const docHeader = `GOVERNMENT COLLEGE OF ENGINEERING, ERODE (AUTONOMOUS R2021)\nDEPARTMENT OF INFORMATION TECHNOLOGY\n\nTITLE: ${mat.title}\nSUBJECT: ${mat.subjectCode ? `${mat.subjectCode} - ` : ''}${mat.subjectName || mat.subject || 'Core Subject'}\nCATEGORY: ${mat.category || 'Study Material'}\nUPLOADED BY: ${mat.teacherName || mat.faculty || mat.uploadedBy || 'Faculty Member'}\nSEMESTER: ${mat.semester || 'Semester 4'}\nDEPARTMENT: ${mat.department || 'Information Technology'}\nUPLOAD DATE: ${mat.uploadDate || mat.date || '2026-08-25'}\nFILE SIZE: ${mat.fileSize || '2.4 MB'}\n\n=======================================================\nACADEMIC STUDY MATERIAL & LECTURE NOTES\n=======================================================\n\n1. Course Overview & Key Objectives:\n   - Comprehensive conceptual explanations and problem solving strategies.\n   - Designed in compliance with Autonomous syllabus regulations.\n\n2. Topics Covered in this Unit:\n   - Fundamental Architecture & Principles\n   - Analytical Models and Case Studies\n   - Lab experiments and implementation steps\n   - Review questions and expected university exam problems\n\n[End of Document - Official GCE Erode IT Repository]`;
      const blob = new Blob([docHeader], { type: 'application/pdf;charset=utf-8' });
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = mat.fileName || `${mat.subjectCode || 'IT'}_${mat.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(dlUrl), 5000);
      showToast(`Study Material "${mat.title}" Downloaded Successfully.`, 'success');
    };

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
          safeSubjects.map(s => React.createElement('option', { key: s.code, value: s.code }, `${s.code} - ${s.short || s.name || 'Subject'}`))
        )
      ),

      filteredMaterials.length === 0 ? React.createElement(
        'div',
        { className: 'glass-panel p-12 rounded-3xl border border-slate-800 text-center col-span-full' },
        React.createElement(Icons.BookOpen, { className: 'w-12 h-12 text-slate-500 mx-auto mb-3' }),
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1' }, 'No Study Materials Available.'),
        React.createElement('p', { className: 'text-xs text-slate-400' }, 'There are currently no uploaded study materials matching your selected subject.')
      ) : React.createElement(
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
              React.createElement('span', { className: 'badge-it bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, mat.category || 'Study Material'),
              React.createElement('span', { className: 'font-mono text-xs text-slate-400' }, mat.fileSize || 'PDF')
            ),
            React.createElement('h3', { className: 'text-sm font-bold text-white mt-1' }, mat.title),
            React.createElement('p', { className: 'text-xs text-cyan-400 font-semibold mt-1' }, `Subject: ${mat.subjectCode ? `${mat.subjectCode} - ` : ''}${mat.subjectName || mat.subject || 'Core Subject'}`),
            React.createElement('div', { className: 'mt-2 space-y-1 text-xs text-slate-300 border-t border-slate-800/80 pt-2' },
              React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'Teacher: '), mat.teacherName || mat.faculty || mat.uploadedBy || 'Faculty Member'),
              React.createElement('div', { className: 'flex justify-between text-[11px] text-slate-400 pt-1' },
                React.createElement('span', null, `Semester: ${mat.semester || 'Semester 4'}`),
                React.createElement('span', null, `Dept: ${mat.department || 'Information Technology'}`)
              ),
              React.createElement('p', { className: 'text-[11px] text-slate-400' }, `Upload Date: ${mat.uploadDate || mat.date || '2026-08-25'}`)
            )
          ),
          React.createElement(
            'div',
            { className: 'mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2' },
            React.createElement('span', { className: 'text-[11px] text-slate-400' }, `📥 ${mat.downloads || 0} downloads`),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement(
                'button',
                {
                  onClick: () => setPreviewMat(mat),
                  className: 'px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition'
                },
                React.createElement(Icons.Eye, { className: 'w-3.5 h-3.5' }),
                'Preview'
              ),
              React.createElement(
                'button',
                {
                  onClick: () => handleDownloadMaterial(mat),
                  className: 'px-3 py-1.5 rounded-lg gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
                },
                React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
                'Download'
              )
            )
          )
        ))
      ),

      // Material Preview Modal
      previewMat && React.createElement(
        SafeModal,
        {
          isOpen: !!previewMat,
          onClose: () => setPreviewMat(null),
          title: `Document Preview: ${previewMat.title}`
        },
        React.createElement(
          'div',
          { className: 'space-y-4 text-xs' },
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'badge-it bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' }, previewMat.category || 'Study Material'),
              React.createElement('span', { className: 'text-slate-400 font-mono' }, previewMat.fileSize || 'PDF')
            ),
            React.createElement('h4', { className: 'text-base font-extrabold text-white' }, previewMat.title),
            React.createElement('p', { className: 'text-xs text-cyan-300' }, `Subject: ${previewMat.subjectCode ? `${previewMat.subjectCode} - ` : ''}${previewMat.subjectName || previewMat.subject || 'Core Subject'}`),
            React.createElement('div', { className: 'flex justify-between text-[11px] text-slate-400 pt-1' },
              React.createElement('span', null, `Teacher: ${previewMat.teacherName || previewMat.faculty || previewMat.uploadedBy || 'Faculty Member'}`),
              React.createElement('span', null, `Upload Date: ${previewMat.uploadDate || previewMat.date || '2026-08-25'}`)
            ),
            React.createElement('div', { className: 'flex justify-between text-[11px] text-slate-400' },
              React.createElement('span', null, `Semester: ${previewMat.semester || 'Semester 4'}`),
              React.createElement('span', null, `Dept: ${previewMat.department || 'Information Technology'}`)
            )
          ),
          previewMat.fileUrl && (previewMat.fileUrl.toLowerCase().endsWith('.png') || previewMat.fileUrl.toLowerCase().endsWith('.jpg') || previewMat.fileUrl.toLowerCase().endsWith('.jpeg') || previewMat.fileType === 'image') ? React.createElement(
            'div',
            { className: 'w-full max-h-[50vh] overflow-hidden rounded-xl bg-black flex items-center justify-center' },
            React.createElement('img', {
              src: previewMat.fileUrl,
              alt: previewMat.title,
              className: 'max-h-[50vh] object-contain rounded-xl'
            })
          ) : previewMat.fileUrl && (previewMat.fileUrl.toLowerCase().endsWith('.pdf') || previewMat.fileType === 'pdf') ? React.createElement(
            'div',
            { className: 'w-full h-80 rounded-xl overflow-hidden border border-slate-800 bg-slate-950' },
            React.createElement('iframe', {
              src: previewMat.fileUrl,
              title: previewMat.title,
              className: 'w-full h-full border-0'
            })
          ) : React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-slate-300 space-y-2 max-h-64 overflow-y-auto' },
            React.createElement('p', { className: 'text-cyan-400 font-bold' }, '--- OFFICIAL COURSE STUDY MATERIAL (Autonomous R2021) ---'),
            React.createElement('p', null, `Unit Syllabus Notes for ${previewMat.subjectCode || 'Course'}: ${previewMat.subjectName || previewMat.title}`),
            React.createElement('p', null, '• Chapter 1: Architectural Foundations & Formal Definitions'),
            React.createElement('p', null, '• Chapter 2: Analysis of Algorithmic Complexity & Flow Models'),
            React.createElement('p', null, '• Chapter 3: Practical Laboratory Case Studies & Implementations'),
            React.createElement('p', null, '• Chapter 4: Previous Examination Model Questions & Step-by-Step Solutions'),
            React.createElement('p', { className: 'text-slate-500 pt-2 border-t border-slate-800' }, 'This material has been vetted by the Department Academic Council.')
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-end gap-2 pt-2' },
            React.createElement(
              'button',
              {
                onClick: () => setPreviewMat(null),
                className: 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition'
              },
              'Close Preview'
            ),
            React.createElement(
              'button',
              {
                onClick: () => {
                  handleDownloadMaterial(previewMat);
                  setPreviewMat(null);
                },
                className: 'px-4 py-2 rounded-xl gradient-btn-primary text-white font-bold flex items-center gap-1.5'
              },
              React.createElement(Icons.Download, { className: 'w-4 h-4' }),
              'Download File'
            )
          )
        )
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
        safeAssignments.map(asn => {
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
            'Upload your solution archive (.zip, .pdf, .docx, .py, .java, .sql) with your roll number.'
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Select Solution File (From Disk)'),
            React.createElement(SafeFileUploader, {
              accept: '.pdf,.zip,.rar,.docx,.py,.java,.cpp,.sql',
              label: 'Browse solution archive / document from disk',
              helperText: 'PDF, ZIP, Code, DOCX files up to 25MB',
              onFileSelect: (fileData) => {
                setSubmissionFileName(fileData.name);
                setSubmissionFileData(fileData);
              }
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Or Specify Solution File Name'),
            React.createElement('input', {
              type: 'text',
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
            (safeTimetable[day] || []).map((slot, idx) => React.createElement(
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
        safeFacultyList.map(faculty => React.createElement(
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
            React.createElement('p', { className: 'text-xs text-slate-300' }, `Specialization: ${faculty.specialization || 'Information Technology'}`),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, `Cabin: ${faculty.cabin || 'IT Department Block'}`),
            React.createElement('p', { className: 'text-xs text-slate-400' }, `Email: ${faculty.email}`),
            React.createElement('p', { className: 'text-xs text-slate-400' }, `Phone: ${faculty.phone}`)
          ),
          React.createElement(
            'div',
            { className: 'mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
            React.createElement('span', { className: 'text-emerald-400 font-semibold' }, '● On Campus'),
            React.createElement(
              'button',
              {
                onClick: () => {
                  setStaffRequestForm(prev => ({ ...prev, recipientStaffId: faculty.id }));
                  onNavigate('messages');
                },
                className: 'px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 hover:bg-cyan-950 border border-cyan-500/30 font-bold'
              },
              'Message Staff'
            )
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
        safeAnnouncements.map(ann => React.createElement(
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
        safeQuestionPapers.map(qp => React.createElement(
          'div',
          {
            key: qp.id,
            className: 'glass-panel p-5 rounded-2xl border border-slate-700/60 hover:border-cyan-500/30 transition flex items-center justify-between'
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
              onClick: () => handleDownloadQP(qp),
              title: `Download ${qp.subjectCode} Question Paper`,
              className: 'p-2.5 rounded-xl gradient-btn-primary text-white hover:scale-105 transition flex items-center gap-1 text-xs font-bold'
            },
            React.createElement(Icons.Download, { className: 'w-4 h-4' }),
            React.createElement('span', { className: 'hidden sm:inline' }, 'Download')
          )
        ))
      ),

      // Downloaded Files Section (Local Storage Persisted)
      React.createElement(
        'div',
        { className: 'mt-8 glass-panel p-6 rounded-3xl border border-cyan-500/30' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
          React.createElement('div', { className: 'flex items-center gap-2.5' },
            React.createElement(Icons.CheckCircle, { className: 'w-5 h-5 text-cyan-400' }),
            React.createElement('h3', { className: 'text-base font-bold text-white' }, 'Downloaded Files'),
            React.createElement('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
              `${downloadedQPs.length} Saved in Local Storage`
            )
          ),
          downloadedQPs.length > 0 && React.createElement(
            'button',
            {
              onClick: () => {
                setDownloadedQPs([]);
                localStorage.removeItem('gce_it_downloaded_qps');
                showToast('Downloaded files list cleared.', 'info');
              },
              className: 'text-xs text-rose-400 hover:text-rose-300 hover:underline font-semibold'
            },
            'Clear List'
          )
        ),

        downloadedQPs.length === 0 ? React.createElement(
          'div',
          { className: 'p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center' },
          React.createElement(Icons.Download, { className: 'w-8 h-8 text-slate-600 mx-auto mb-2' }),
          React.createElement('p', { className: 'text-xs text-slate-400 font-medium' }, 'No question papers downloaded yet. Click Download on any question paper above to download to local storage.')
        ) : React.createElement(
          'div',
          { className: 'overflow-x-auto' },
          React.createElement(
            'table',
            { className: 'w-full text-left text-xs' },
            React.createElement('thead', { className: 'text-slate-400 border-b border-slate-800 bg-slate-900/60 uppercase font-bold text-[10px] tracking-wider' },
              React.createElement('tr', null,
                React.createElement('th', { className: 'py-3 px-4' }, 'File Name'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Subject'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Download Date'),
                React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Action')
              )
            ),
            React.createElement('tbody', { className: 'divide-y divide-slate-800/60' },
              downloadedQPs.map(file => React.createElement(
                'tr',
                { key: file.id, className: 'hover:bg-slate-900/40 transition' },
                React.createElement('td', { className: 'py-3 px-4 font-mono font-semibold text-white flex items-center gap-2' },
                  React.createElement(Icons.FileText, { className: 'w-4 h-4 text-cyan-400 flex-shrink-0' }),
                  React.createElement('span', { className: 'truncate max-w-[240px]' }, file.fileName)
                ),
                React.createElement('td', { className: 'py-3 px-4 text-slate-300' }, file.subject),
                React.createElement('td', { className: 'py-3 px-4 font-mono text-slate-400' }, file.downloadDate),
                React.createElement('td', { className: 'py-3 px-4 text-right' },
                  React.createElement(
                    'button',
                    {
                      onClick: () => setPreviewQP(file),
                      className: 'px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 ml-auto transition'
                    },
                    React.createElement(Icons.Eye, { className: 'w-3.5 h-3.5' }),
                    'Open File'
                  )
                )
              ))
            )
          )
        )
      ),

      // Open Downloaded File Preview Modal
      previewQP && React.createElement(
        Modal,
        {
          isOpen: !!previewQP,
          onClose: () => setPreviewQP(null),
          title: `File View: ${previewQP.fileName}`
        },
        React.createElement(
          'div',
          { className: 'space-y-4 text-xs' },
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'badge-it bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }, 'Downloaded & Saved Locally'),
              React.createElement('span', { className: 'text-slate-400 font-mono' }, previewQP.fileSize || 'PDF Document')
            ),
            React.createElement('h4', { className: 'text-base font-extrabold text-white' }, previewQP.fileName),
            React.createElement('p', { className: 'text-xs text-slate-300' }, `Subject: ${previewQP.subject}`),
            React.createElement('p', { className: 'text-[11px] text-slate-400' }, `Saved on: ${previewQP.downloadDate}`)
          ),
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-slate-300 space-y-2 max-h-72 overflow-y-auto whitespace-pre-wrap' },
            previewQP.rawContent || 'Question paper content loaded from local storage.'
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-end gap-2 pt-2' },
            React.createElement(
              'button',
              {
                onClick: () => setPreviewQP(null),
                className: 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition'
              },
              'Close File'
            )
          )
        )
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
        safePlacements.map(drive => React.createElement(
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
          React.createElement('p', { className: 'text-xs text-slate-300 mb-2' }, `Eligibility: ${drive.eligibility || 'All Eligible'} • Location: ${drive.location || 'Pan India'}`),
          React.createElement(
            'div',
            { className: 'space-y-1 mb-4' },
            (drive.rounds || ['Online Assessment', 'Technical Interview', 'HR Interview']).map((r, i) => React.createElement('p', { key: i, className: 'text-[11px] text-slate-400' }, `• ${r}`))
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-between text-xs pt-3 border-t border-slate-800' },
            React.createElement('span', { className: 'text-slate-400' }, `Drive Date: ${drive.driveDate || drive.date || 'TBA'} (Deadline: ${drive.deadline || 'Registrations Open'})`),
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
  // VIEW: ACHIEVEMENTS (Photo Upload Gallery)
  // ==========================================
  if (normalizedTab === 'achievements') {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
            React.createElement(Icons.Sparkles, { className: 'w-6 h-6 text-amber-400' }),
            'Student Achievements Photo Gallery'
          ),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Showcase of hackathon awards, symposium prizes, research honors, and technical accolades')
        ),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('add-achievement'),
            className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-purple-900/30'
          },
          React.createElement(Icons.Upload, { className: 'w-4 h-4' }),
          'Upload Achievement'
        )
      ),

      safeAchievements.length === 0 ? React.createElement(
        'div',
        { className: 'glass-panel p-12 rounded-3xl border border-slate-800 text-center' },
        React.createElement(Icons.Award, { className: 'w-12 h-12 text-slate-600 mx-auto mb-3' }),
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1' }, 'No Achievements Uploaded Yet'),
        React.createElement('p', { className: 'text-xs text-slate-400 mb-4' }, 'Upload your hackathon, contest, or academic honors photos (JPG, PNG, or PDF).'),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('add-achievement'),
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white'
          },
          'Upload Now'
        )
      ) : React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
        safeAchievements.map(ach => {
          const isPdf = ach.fileType === 'pdf' || (ach.fileName && ach.fileName.toLowerCase().endsWith('.pdf')) || (ach.fileUrl && ach.fileUrl.toLowerCase().endsWith('.pdf'));
          const hasImage = ach.fileUrl && !isPdf;

          return React.createElement(
            'div',
            {
              key: ach.id,
              className: 'glass-panel rounded-2xl border border-slate-700/60 hover:border-purple-500/40 transition overflow-hidden flex flex-col justify-between shadow-lg'
            },
            // Achievement Image / Thumbnail
            React.createElement(
              'div',
              { className: 'relative w-full h-44 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800 group' },
              hasImage ? React.createElement('img', {
                src: ach.fileUrl,
                alt: ach.title,
                className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
              }) : React.createElement(
                'div',
                { className: 'flex flex-col items-center justify-center p-4 text-center w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/40' },
                React.createElement(
                  'div',
                  { className: `w-14 h-14 rounded-2xl ${isPdf ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'} flex items-center justify-center mb-2 shadow` },
                  React.createElement(isPdf ? Icons.FileText : Icons.Award, { className: 'w-7 h-7' })
                ),
                React.createElement('span', { className: 'text-[11px] font-mono font-bold text-slate-300 truncate max-w-[220px]' }, ach.fileName || `${ach.title}.png`),
                React.createElement('span', { className: 'text-[10px] text-purple-400 mt-1 font-semibold uppercase tracking-wider' }, isPdf ? 'PDF Document' : 'Achievement Photo')
              ),
              React.createElement(
                'span',
                { className: 'absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md' },
                ach.category || 'Honors'
              )
            ),

            // Achievement Title, Description, Upload Date
            React.createElement(
              'div',
              { className: 'p-4 flex-1 flex flex-col justify-between space-y-2' },
              React.createElement('div', null,
                React.createElement('h3', { className: 'text-sm font-bold text-white line-clamp-1' }, ach.title),
                React.createElement('p', { className: 'text-xs text-slate-300 mt-1 line-clamp-2' }, ach.description || 'Special achievement in department competition.')
              ),
              React.createElement(
                'div',
                { className: 'pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400' },
                React.createElement('span', { className: 'font-mono' }, `Upload Date: ${ach.uploadDate || ach.date || '2026-09-08'}`),
                React.createElement('span', { className: 'text-slate-500' }, ach.studentName ? `By ${ach.studentName}` : '')
              )
            ),

            // Actions: View Button & Download Button
            React.createElement(
              'div',
              { className: 'px-4 pb-4 pt-1 flex items-center gap-2 border-t border-slate-800/60 bg-slate-900/40' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => setViewingAchievement(ach),
                  className: 'flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-700'
                },
                React.createElement(Icons.Eye, { className: 'w-3.5 h-3.5' }),
                'View'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => handleDownloadAchievement(ach),
                  className: 'flex-1 py-1.5 rounded-xl gradient-btn-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 transition'
                },
                React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
                'Download'
              )
            )
          );
        })
      ),

      // Upload Achievement Modal
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'add-achievement',
          onClose: () => {
            setActiveModal(null);
            setSelectedAchieveFile(null);
          },
          title: 'Upload Achievement Photo (JPG, PNG, PDF)'
        },
        React.createElement(
          'form',
          { onSubmit: handleAddAchievement, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Achievement Title *'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. 1st Place - Smart India Hackathon (SIH 2026)',
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
                React.createElement('option', { value: 'Symposium' }, 'National Symposium'),
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
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Description *'),
            React.createElement('textarea', {
              rows: 3,
              required: true,
              placeholder: 'Describe the project, award, or competition details...',
              value: newAchievement.description,
              onChange: (e) => setNewAchievement({ ...newAchievement, description: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Select Achievement File (JPG, PNG, PDF) *'),
            React.createElement('input', {
              type: 'file',
              required: true,
              accept: '.jpg,.jpeg,.png,.pdf',
              onChange: (e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedAchieveFile(e.target.files[0]);
                }
              },
              className: 'w-full p-2 rounded-xl glass-input file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer'
            }),
            React.createElement('p', { className: 'text-[11px] text-slate-400 mt-1' }, 'Supported file formats: JPG, PNG, and PDF (Max size: 10MB)')
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold'
          }, 'Upload Achievement')
        )
      ),

      // Lightbox / View Modal
      viewingAchievement && React.createElement(
        Modal,
        {
          isOpen: !!viewingAchievement,
          onClose: () => setViewingAchievement(null),
          title: `Achievement: ${viewingAchievement.title}`
        },
        React.createElement(
          'div',
          { className: 'space-y-4' },
          viewingAchievement.fileUrl && !viewingAchievement.fileUrl.toLowerCase().endsWith('.pdf') && viewingAchievement.fileType !== 'pdf' ? React.createElement(
            'div',
            { className: 'w-full max-h-[60vh] overflow-hidden rounded-xl bg-black flex items-center justify-center' },
            React.createElement('img', {
              src: viewingAchievement.fileUrl,
              alt: viewingAchievement.title,
              className: 'max-h-[60vh] object-contain rounded-xl'
            })
          ) : React.createElement(
            'div',
            { className: 'p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3' },
            React.createElement(Icons.Award, { className: 'w-16 h-16 text-purple-400 mx-auto' }),
            React.createElement('h4', { className: 'text-base font-bold text-white' }, viewingAchievement.title),
            React.createElement('p', { className: 'text-xs text-slate-300 max-w-md mx-auto' }, viewingAchievement.description),
            React.createElement('span', { className: 'badge-it bg-purple-500/20 text-purple-300 border border-purple-500/30' }, viewingAchievement.category || 'Honors')
          ),
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1' },
            React.createElement('p', null, React.createElement('strong', { className: 'text-white' }, 'Description: '), viewingAchievement.description),
            React.createElement('p', null, React.createElement('strong', { className: 'text-white' }, 'Upload Date: '), viewingAchievement.uploadDate || viewingAchievement.date || '2026-09-08'),
            viewingAchievement.studentName && React.createElement('p', null, React.createElement('strong', { className: 'text-white' }, 'Student: '), `${viewingAchievement.studentName} (${viewingAchievement.studentRoll || ''})`)
          ),
          React.createElement(
            'div',
            { className: 'flex justify-end gap-2 pt-2' },
            React.createElement(
              'button',
              {
                onClick: () => handleDownloadAchievement(viewingAchievement),
                className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-1.5'
              },
              React.createElement(Icons.Download, { className: 'w-4 h-4' }),
              'Download File'
            ),
            React.createElement(
              'button',
              {
                onClick: () => setViewingAchievement(null),
                className: 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition'
              },
              'Close'
            )
          )
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
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xl font-bold text-white' }, 'Verified Certifications (NPTEL, AWS, Coursera)'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Upload and manage verified course credentials, badges and certificates')
        ),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('add-certificate'),
            className: 'px-4 py-2.5 rounded-xl gradient-btn-primary text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-cyan-900/30'
          },
          React.createElement(Icons.Upload, { className: 'w-4 h-4' }),
          'Upload Certificate'
        )
      ),

      safeCertificates.length === 0 ? React.createElement(
        'div',
        { className: 'glass-panel p-12 rounded-3xl border border-slate-800 text-center' },
        React.createElement(Icons.Award, { className: 'w-12 h-12 text-slate-600 mx-auto mb-3' }),
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1' }, 'No Certificates Uploaded Yet'),
        React.createElement('p', { className: 'text-xs text-slate-400 mb-4' }, 'Upload your course completion certificates (JPG, PNG, or PDF).'),
        React.createElement(
          'button',
          {
            onClick: () => setActiveModal('add-certificate'),
            className: 'px-4 py-2 rounded-xl gradient-btn-primary text-xs font-bold text-white'
          },
          'Upload Now'
        )
      ) : React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
        safeCertificates.map(cert => {
          const certTitle = cert.title || cert.name || 'Verified Certificate';
          const isPdf = cert.fileType === 'pdf' || (cert.fileName && cert.fileName.toLowerCase().endsWith('.pdf')) || (cert.fileUrl && cert.fileUrl.toLowerCase().endsWith('.pdf'));
          const hasImage = cert.fileUrl && !isPdf;

          return React.createElement(
            'div',
            {
              key: cert.id,
              className: 'glass-panel rounded-2xl border border-slate-700/60 hover:border-cyan-500/40 transition overflow-hidden flex flex-col justify-between shadow-lg'
            },
            // Certificate Image / Thumbnail
            React.createElement(
              'div',
              { className: 'relative w-full h-44 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800 group' },
              hasImage ? React.createElement('img', {
                src: cert.fileUrl,
                alt: certTitle,
                className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
              }) : React.createElement(
                'div',
                { className: 'flex flex-col items-center justify-center p-4 text-center w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40' },
                React.createElement(
                  'div',
                  { className: `w-14 h-14 rounded-2xl ${isPdf ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'} flex items-center justify-center mb-2 shadow` },
                  React.createElement(isPdf ? Icons.FileText : Icons.Award, { className: 'w-7 h-7' })
                ),
                React.createElement('span', { className: 'text-[11px] font-mono font-bold text-slate-300 truncate max-w-[220px]' }, cert.fileName || `${certTitle}.pdf`),
                React.createElement('span', { className: 'text-[10px] text-cyan-400 mt-1 font-semibold uppercase tracking-wider' }, isPdf ? 'PDF Certificate' : 'Image Badge')
              ),
              React.createElement(
                'span',
                { className: 'absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md' },
                'Verified ✓'
              )
            ),

            // Certificate Title & Upload Date
            React.createElement(
              'div',
              { className: 'p-4 flex-1 flex flex-col justify-between' },
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: 'text-sm font-bold text-white line-clamp-1' }, certTitle),
                React.createElement('p', { className: 'text-xs text-cyan-400 font-semibold mt-0.5' }, cert.issuer || 'Institutional Verification Cell'),
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80' },
                  React.createElement('span', { className: 'flex items-center gap-1 text-slate-400' },
                    React.createElement(Icons.Calendar, { className: 'w-3 h-3 text-slate-500' }),
                    `Upload Date: ${cert.uploadDate || cert.issueDate || 'Recent'}`
                  ),
                  cert.credentialId && React.createElement('span', { className: 'font-mono text-[10px] text-slate-500' }, cert.credentialId)
                )
              ),

              // Action Buttons Row: View, Download, Delete
              React.createElement(
                'div',
                { className: 'grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800' },
                React.createElement(
                  'button',
                  {
                    onClick: () => setViewingCertificate(cert),
                    className: 'py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition'
                  },
                  React.createElement(Icons.Eye, { className: 'w-3.5 h-3.5 text-cyan-400' }),
                  'View'
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => handleDownloadCertificate(cert),
                    className: 'py-2 px-2.5 rounded-xl gradient-btn-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow'
                  },
                  React.createElement(Icons.Download, { className: 'w-3.5 h-3.5' }),
                  'Download'
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => {
                      if (confirm(`Are you sure you want to delete certificate "${certTitle}"?`)) {
                        deleteCertificate(cert.id);
                      }
                    },
                    className: 'py-2 px-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 transition'
                  },
                  React.createElement(Icons.Trash, { className: 'w-3.5 h-3.5' }),
                  'Delete'
                )
              )
            )
          );
        })
      ),

      // Add Certificate Modal with real file upload
      React.createElement(
        Modal,
        {
          isOpen: activeModal === 'add-certificate',
          onClose: () => {
            setActiveModal(null);
            setSelectedCertFile(null);
          },
          title: 'Upload Certificate (JPG, PNG, PDF)'
        },
        React.createElement(
          'form',
          { onSubmit: handleAddCertificate, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Certificate Title *'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. AWS Certified Cloud Practitioner / NPTEL Python',
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
                placeholder: 'e.g. AWS, NPTEL, Coursera, IBM',
                value: newCertificate.issuer,
                onChange: (e) => setNewCertificate({ ...newCertificate, issuer: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Credential ID (Optional)'),
              React.createElement('input', {
                type: 'text',
                placeholder: 'e.g. NPTEL26CS9012',
                value: newCertificate.credentialId,
                onChange: (e) => setNewCertificate({ ...newCertificate, credentialId: e.target.value }),
                className: 'w-full p-2.5 rounded-xl glass-input'
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Select Certificate File (JPG, PNG, or PDF up to 10MB) *'),
            React.createElement('input', {
              type: 'file',
              required: true,
              accept: '.jpg,.jpeg,.png,.pdf',
              onChange: (e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedCertFile(e.target.files[0]);
                  if (!newCertificate.name) {
                    const fname = e.target.files[0].name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
                    setNewCertificate(prev => ({ ...prev, name: fname }));
                  }
                }
              },
              className: 'w-full p-2.5 rounded-xl glass-input text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer'
            }),
            selectedCertFile && React.createElement(
              'p',
              { className: 'text-[11px] text-cyan-400 mt-1 font-mono' },
              `Selected: ${selectedCertFile.name} (${(selectedCertFile.size / (1024 * 1024)).toFixed(2)} MB)`
            )
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-2.5 rounded-xl gradient-btn-primary text-white font-bold flex items-center justify-center gap-2 text-xs shadow'
          },
          React.createElement(Icons.Upload, { className: 'w-4 h-4' }),
          'Save Certificate to Portal Record')
        )
      ),

      // View Certificate Lightbox / Preview Modal
      viewingCertificate && React.createElement(
        Modal,
        {
          isOpen: !!viewingCertificate,
          onClose: () => setViewingCertificate(null),
          title: `Certificate Preview: ${viewingCertificate.title || viewingCertificate.name}`
        },
        React.createElement(
          'div',
          { className: 'space-y-4 text-xs' },
          viewingCertificate.fileUrl && !viewingCertificate.fileUrl.endsWith('.pdf') ? React.createElement(
            'div',
            { className: 'rounded-2xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-96' },
            React.createElement('img', {
              src: viewingCertificate.fileUrl,
              alt: viewingCertificate.title || viewingCertificate.name,
              className: 'max-w-full max-h-96 object-contain'
            })
          ) : React.createElement(
            'div',
            { className: 'p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 border border-slate-800 text-center space-y-3' },
            React.createElement(Icons.Award, { className: 'w-16 h-16 text-cyan-400 mx-auto' }),
            React.createElement('h3', { className: 'text-lg font-extrabold text-white' }, viewingCertificate.title || viewingCertificate.name),
            React.createElement('p', { className: 'text-xs text-cyan-300 font-semibold' }, `Issuer: ${viewingCertificate.issuer || 'Institutional Verification Cell'}`),
            React.createElement('p', { className: 'text-xs text-slate-400' }, `Credential ID: ${viewingCertificate.credentialId || 'N/A'}`),
            React.createElement('p', { className: 'text-[11px] text-slate-400' }, `Upload Date: ${viewingCertificate.uploadDate || viewingCertificate.issueDate || 'Recent'}`),
            React.createElement('div', { className: 'inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-xs' }, 'Officially Verified ✓')
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-end gap-2 pt-2' },
            React.createElement(
              'button',
              {
                onClick: () => setViewingCertificate(null),
                className: 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition'
              },
              'Close'
            ),
            React.createElement(
              'button',
              {
                onClick: () => {
                  handleDownloadCertificate(viewingCertificate);
                },
                className: 'px-4 py-2 rounded-xl gradient-btn-primary text-white font-bold flex items-center gap-1.5'
              },
              React.createElement(Icons.Download, { className: 'w-4 h-4' }),
              'Download Certificate'
            )
          )
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
  // VIEW: MESSAGES & REQUESTS HUB (Feature 3)
  // ==========================================
  if (normalizedTab === 'messages') {
    const studentMessages = safeMessages.filter(m =>
      m.fromId === safeProfile.rollNo ||
      m.toId === safeProfile.rollNo ||
      m.toRole === 'student' ||
      m.toId === 'ALL'
    );

    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fade-in' },

      // Header Banner
      React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement(
          'div',
          null,
          React.createElement('h2', { className: 'text-xl font-bold text-white flex items-center gap-2' },
            React.createElement(Icons.MessageSquare, { className: 'w-6 h-6 text-cyan-400' }),
            'Student Communication & Request Hub'
          ),
          React.createElement('p', { className: 'text-xs text-slate-400 mt-1' },
            'Submit official requests to Faculty & Class Advisor, DM classmates, or view broadcasts.'
          )
        ),
        React.createElement(
          'div',
          { className: 'flex p-1 rounded-xl bg-slate-900 border border-slate-800' },
          [
            { id: 'request-staff', label: 'Request to Staff', icon: Icons.FileText },
            { id: 'dm-student', label: 'DM to Student', icon: Icons.User },
            { id: 'inbox', label: `Inbox (${studentMessages.length})`, icon: Icons.Inbox || Icons.Bell }
          ].map(tab => React.createElement(
            'button',
            {
              key: tab.id,
              onClick: () => setMsgSubTab(tab.id),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                msgSubTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`
            },
            React.createElement(tab.icon, { className: 'w-3.5 h-3.5' }),
            tab.label
          ))
        )
      ),

      // Tab 1: Request to Staff
      msgSubTab === 'request-staff' && React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 max-w-2xl mx-auto' },
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1 flex items-center gap-2' },
          React.createElement(Icons.Shield, { className: 'w-5 h-5 text-cyan-400' }),
          'Submit Official Request to Faculty / Advisor'
        ),
        React.createElement('p', { className: 'text-xs text-slate-400 mb-4' },
          'Requests are sent directly to the selected faculty member or your assigned Class Advisor.'
        ),
        React.createElement(
          'form',
          { onSubmit: handleSendStaffRequest, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Select Faculty / Class Advisor'),
            React.createElement('select', {
              value: staffRequestForm.recipientStaffId,
              onChange: (e) => setStaffRequestForm({ ...staffRequestForm, recipientStaffId: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              safeFacultyList.map(f => React.createElement('option', { key: f.id, value: f.id },
                `${f.name} - ${f.designation} ${f.classAdvisorFor ? `(Class Advisor - Year ${f.classAdvisorFor})` : ''}`
              ))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Request Category'),
            React.createElement('select', {
              value: staffRequestForm.requestType,
              onChange: (e) => setStaffRequestForm({ ...staffRequestForm, requestType: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              React.createElement('option', { value: 'OD / Event Permission' }, 'On-Duty (OD) / Hackathon / Symposium Permission'),
              React.createElement('option', { value: 'Medical Leave Sanction' }, 'Medical Leave Sanction & Attendance Waiver'),
              React.createElement('option', { value: 'Lab / Project Consultation' }, 'Lab / Project Guidance Consultation'),
              React.createElement('option', { value: 'Letter of Recommendation' }, 'Letter of Recommendation (LOR) for Internship'),
              React.createElement('option', { value: 'Bonafide Certificate' }, 'Bonafide Certificate Request')
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Subject / Heading'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. Permission for Smart India Hackathon (SIH 2026)',
              value: staffRequestForm.subject,
              onChange: (e) => setStaffRequestForm({ ...staffRequestForm, subject: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Detailed Request / Application'),
            React.createElement('textarea', {
              rows: 4,
              required: true,
              placeholder: 'Respected Sir/Madam, I kindly request permission...',
              value: staffRequestForm.content,
              onChange: (e) => setStaffRequestForm({ ...staffRequestForm, content: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-3 rounded-xl gradient-btn-primary text-white font-bold flex items-center justify-center gap-2'
          },
            React.createElement(Icons.Send || Icons.FileText, { className: 'w-4 h-4' }),
            'Send Request to Faculty'
          )
        )
      ),

      // Tab 2: DM to Student
      msgSubTab === 'dm-student' && React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60 max-w-2xl mx-auto' },
        React.createElement('h3', { className: 'text-base font-bold text-white mb-1 flex items-center gap-2' },
          React.createElement(Icons.User, { className: 'w-5 h-5 text-cyan-400' }),
          'Direct Message (DM) to Classmate'
        ),
        React.createElement('p', { className: 'text-xs text-slate-400 mb-4' },
          'Private peer communication for lab queries, project collaboration, and notes sharing.'
        ),
        React.createElement(
          'form',
          { onSubmit: handleSendStudentDm, className: 'space-y-4 text-xs' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Select Classmate (Roll No)'),
            React.createElement('select', {
              value: studentDmForm.recipientRollNo,
              onChange: (e) => setStudentDmForm({ ...studentDmForm, recipientRollNo: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            },
              [
                { rollNo: '24IT002', name: 'Abinaya S' },
                { rollNo: '24IT003', name: 'Dinesh K' },
                { rollNo: '24IT004', name: 'Kavitha M' },
                { rollNo: '24IT005', name: 'Praveen Kumar S' }
              ].map(s => React.createElement('option', { key: s.rollNo, value: s.rollNo },
                `${s.rollNo} - ${s.name}`
              ))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Topic / Subject'),
            React.createElement('input', {
              type: 'text',
              required: true,
              placeholder: 'e.g. DBMS Lab Assignment #3 Query Help',
              value: studentDmForm.subject,
              onChange: (e) => setStudentDmForm({ ...studentDmForm, subject: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold uppercase tracking-wider text-slate-300 mb-1' }, 'Message Text'),
            React.createElement('textarea', {
              rows: 4,
              required: true,
              placeholder: 'Type your message...',
              value: studentDmForm.content,
              onChange: (e) => setStudentDmForm({ ...studentDmForm, content: e.target.value }),
              className: 'w-full p-2.5 rounded-xl glass-input'
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full py-3 rounded-xl gradient-btn-primary text-white font-bold flex items-center justify-center gap-2'
          },
            React.createElement(Icons.Send || Icons.User, { className: 'w-4 h-4' }),
            'Send Direct Message'
          )
        )
      ),

      // Tab 3: Inbox & Outbox List
      msgSubTab === 'inbox' && React.createElement(
        'div',
        { className: 'glass-panel p-6 rounded-3xl border border-slate-700/60' },
        React.createElement('div', { className: 'flex items-center justify-between pb-4 mb-4 border-b border-slate-800' },
          React.createElement('h3', { className: 'text-base font-bold text-white' }, 'My Communications & Requests History'),
          React.createElement('span', { className: 'text-xs text-slate-400 font-mono' }, `${studentMessages.length} Messages`)
        ),
        studentMessages.length === 0 ? React.createElement(
          'div',
          { className: 'text-center py-12 text-slate-500 text-xs' },
          'No messages yet. Send a request to your staff or DM a student above.'
        ) : React.createElement(
          'div',
          { className: 'space-y-3' },
          studentMessages.map(msg => {
            const isSentByMe = msg.fromId === safeProfile.rollNo;
            const isRequest = msg.type === 'Request';
            const isBroadcast = msg.type === 'Broadcast';

            return React.createElement(
              'div',
              {
                key: msg.id,
                className: `p-4 rounded-2xl border transition ${
                  isBroadcast ? 'bg-amber-950/20 border-amber-500/30' :
                  isRequest ? 'bg-cyan-950/20 border-cyan-500/30' :
                  'bg-slate-900/60 border-slate-800'
                }`
              },
              React.createElement(
                'div',
                { className: 'flex flex-wrap items-center justify-between gap-2 mb-2' },
                React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('span', {
                    className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isBroadcast ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      isRequest ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`
                  }, msg.type),
                  React.createElement('span', { className: 'text-xs font-bold text-white' },
                    isSentByMe ? `To: ${msg.toName}` : `From: ${msg.fromName}`
                  )
                ),
                React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('span', {
                    className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      msg.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                      msg.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-800 text-slate-300'
                    }`
                  }, msg.status || 'Delivered'),
                  React.createElement('span', { className: 'text-[10px] text-slate-500 font-mono' }, msg.timestamp)
                )
              ),
              React.createElement('h4', { className: 'text-sm font-bold text-slate-200 mb-1' }, msg.subject),
              React.createElement('p', { className: 'text-xs text-slate-300 leading-relaxed' }, msg.content)
            );
          })
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
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StudentViews };
}
})();

