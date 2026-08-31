/**
 * ==========================================================================
 * IT DIGITAL HUB - Information Technology Department Digital Portal
 * Master JavaScript File (Pure Vanilla JS - No Frameworks)
 * Full Interactive Functionality, PHP REST API Client & Offline Fallback
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initTheme();
  initSidebar();
  initDropdowns();
  initViewSwitcher();
  initAuthSystem();
  initAIAssistant();
  initDataStores();
  initInteractiveModules();
  initHODCharts();
});

/* --------------------------------------------------------------------------
 * 1. Theme Management (Dark / Light Mode)
 * -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('it_sync_theme') || 'light';
  applyTheme(savedTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('it_sync_theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcons = document.querySelectorAll('.theme-toggle-icon');
  const pillLabels = document.querySelectorAll('.theme-pill-label');
  
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="12" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  });

  pillLabels.forEach(label => {
    label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  });
}

/* --------------------------------------------------------------------------
 * 2. Mobile Responsive Sidebar Navigation
 * -------------------------------------------------------------------------- */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const menuBtn = document.querySelector('.menu-toggle-btn');
  const backdrop = document.querySelector('.sidebar-backdrop');

  if (!sidebar) return;

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
      if (backdrop) backdrop.classList.toggle('show');
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('show');
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('show');
    }
  });
}

/* --------------------------------------------------------------------------
 * 3. Dropdown Menus
 * -------------------------------------------------------------------------- */
function initDropdowns() {
  const notifBtn = document.getElementById('notifToggleBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const userBtn = document.getElementById('userMenuToggleBtn');
  const userDropdown = document.getElementById('userMenuDropdown');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (userDropdown) userDropdown.classList.remove('show');
      notifDropdown.classList.toggle('show');
    });
  }

  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (notifDropdown) notifDropdown.classList.remove('show');
      userDropdown.classList.toggle('show');
    });
  }

  document.addEventListener('click', (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && notifBtn && !notifBtn.contains(e.target)) {
      notifDropdown.classList.remove('show');
    }
    if (userDropdown && !userDropdown.contains(e.target) && userBtn && !userBtn.contains(e.target)) {
      userDropdown.classList.remove('show');
    }
  });
}

/* --------------------------------------------------------------------------
 * 4. Interactive View Switcher (Seamless Single Page Module Navigation)
 * -------------------------------------------------------------------------- */
function initViewSwitcher() {
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-item a');
  const breadcrumbActive = document.querySelector('.breadcrumb-active');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetViewId = link.getAttribute('data-view');
      
      // If link points to a sub-module view on this page
      if (targetViewId) {
        e.preventDefault();

        // Switch active menu item
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => item.classList.remove('active'));
        link.parentElement.classList.add('active');

        // Switch visible module view
        document.querySelectorAll('.module-view').forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
          targetView.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update breadcrumb
        const linkText = link.querySelector('span:not(.nav-icon):not(.nav-badge)')?.textContent || 'Module';
        if (breadcrumbActive) {
          breadcrumbActive.textContent = linkText;
        }

        // Close mobile sidebar if open
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          if (backdrop) backdrop.classList.remove('show');
        }
      }
    });
  });

  // Action links with data-nav-target
  document.querySelectorAll('[data-nav-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewId = btn.getAttribute('data-nav-target');
      const matchingNavLink = document.querySelector(`.sidebar-nav a[data-view="${targetViewId}"]`);
      if (matchingNavLink) {
        matchingNavLink.click();
      }
    });
  });
}

/* --------------------------------------------------------------------------
 * 5. Data Store Initialization (LocalStorage Mock Data)
 * -------------------------------------------------------------------------- */
function initDataStores() {
  // 1. Leave Applications Seed
  if (!localStorage.getItem('it_sync_leaves')) {
    const initialLeaves = [
      { id: 'LEV-101', student: 'Student User', roll: '23IT042', type: 'Medical Leave', from: '2026-09-02', to: '2026-09-04', reason: 'Viral Fever & Doctor Visit', status: 'Approved' },
      { id: 'LEV-102', student: 'Student User', roll: '23IT042', type: 'On-Duty (Symposium)', from: '2026-09-14', to: '2026-09-14', reason: 'Paper Presentation at NIT Trichy', status: 'Pending' }
    ];
    localStorage.setItem('it_sync_leaves', JSON.stringify(initialLeaves));
  }

  // 2. Assignments Seed
  if (!localStorage.getItem('it_sync_assignments')) {
    const initialAssignments = [
      { id: 'ASN-1', title: 'Java Multi-threading & Socket Programming', subject: 'Java Programming', due: 'Tomorrow, 11:59 PM', status: 'Pending', grade: '--' },
      { id: 'ASN-2', title: 'ER Modeling & Complex SQL Queries', subject: 'DBMS', due: 'Sep 05, 2026', status: 'Submitted', grade: '92/100' },
      { id: 'ASN-3', title: 'TCP/IP Subnetting & Routing Lab', subject: 'Computer Networks', due: 'Sep 08, 2026', status: 'Pending', grade: '--' }
    ];
    localStorage.setItem('it_sync_assignments', JSON.stringify(initialAssignments));
  }

  // 3. Roll-Call Attendance Seed for Staff
  if (!localStorage.getItem('it_sync_roll_call')) {
    const initialRollCall = [
      { roll: '23IT001', name: 'Aarav Sharma', present: true },
      { roll: '23IT002', name: 'Ananya Ramesh', present: true },
      { roll: '23IT003', name: 'Bala Chandran', present: false },
      { roll: '23IT004', name: 'Deepika S.', present: true },
      { roll: '23IT005', name: 'Gokul Nathan', present: true },
      { roll: '23IT006', name: 'Harish Kumar', present: true },
      { roll: '23IT007', name: 'Kavya Murugan', present: true },
      { roll: '23IT008', name: 'Naveen Prasath', present: false },
      { roll: '23IT009', name: 'Pooja Sundar', present: true },
      { roll: '23IT010', name: 'Vigneshwaran R.', present: true }
    ];
    localStorage.setItem('it_sync_roll_call', JSON.stringify(initialRollCall));
  }
}

/* --------------------------------------------------------------------------
 * 6. Interactive Modules Logic (Leave, Attendance, Assignments, Symposium)
 * -------------------------------------------------------------------------- */
function initInteractiveModules() {
  renderLeaveTables();
  initLeaveForm();
  renderAssignments();
  initAttendanceCalculator();
  initRollCallManager();
  initMaterialsSearch();
  initSymposiumRegistration();
  initAdminUserTable();
  initAdminSubjectTable();
  initStudentProfile();
  initGradeSubmission();
}

/* 6A. Leave Management */
function renderLeaveTables() {
  const studentLeaveTableBody = document.getElementById('studentLeaveTableBody');
  const staffLeaveTableBody = document.getElementById('staffLeaveTableBody');
  const leaves = JSON.parse(localStorage.getItem('it_sync_leaves') || '[]');

  // Student Table
  if (studentLeaveTableBody) {
    studentLeaveTableBody.innerHTML = '';
    if (leaves.length === 0) {
      studentLeaveTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No leave applications found.</td></tr>`;
    } else {
      leaves.forEach(l => {
        const badgeClass = l.status === 'Approved' ? 'active' : l.status === 'Pending' ? 'pending' : 'rejected';
        studentLeaveTableBody.innerHTML += `
          <tr>
            <td><strong>#${l.id}</strong></td>
            <td>${l.type}</td>
            <td>${l.from} to ${l.to}</td>
            <td>${l.reason}</td>
            <td><span class="status-badge ${badgeClass}">${l.status}</span></td>
            <td><button class="table-btn" onclick="showToast('Application #${l.id} details on file')">View</button></td>
          </tr>
        `;
      });
    }
  }

  // Staff / HOD Approval Table
  if (staffLeaveTableBody) {
    staffLeaveTableBody.innerHTML = '';
    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    if (pendingLeaves.length === 0) {
      staffLeaveTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">All leave applications reviewed! No pending requests.</td></tr>`;
    } else {
      pendingLeaves.forEach(l => {
        staffLeaveTableBody.innerHTML += `
          <tr>
            <td><strong>#${l.id}</strong></td>
            <td><strong>${l.student}</strong> (${l.roll})</td>
            <td>${l.type}</td>
            <td>${l.from} to ${l.to}</td>
            <td>${l.reason}</td>
            <td>
              <div class="action-btn-group">
                <button class="table-btn primary" onclick="updateLeaveStatus('${l.id}', 'Approved')">Approve</button>
                <button class="table-btn danger" onclick="updateLeaveStatus('${l.id}', 'Rejected')">Reject</button>
              </div>
            </td>
          </tr>
        `;
      });
    }
  }
}

function initLeaveForm() {
  const form = document.getElementById('applyLeaveForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('leaveType').value;
      const from = document.getElementById('leaveFromDate').value;
      const to = document.getElementById('leaveToDate').value;
      const reason = document.getElementById('leaveReason').value.trim();

      if (!type || !from || !to || !reason) {
        showToast('Please fill all leave application fields.');
        return;
      }

      const leaves = JSON.parse(localStorage.getItem('it_sync_leaves') || '[]');
      const newLeave = {
        id: `LEV-${Math.floor(100 + Math.random() * 900)}`,
        student: 'Student User',
        roll: '23IT042',
        type,
        from,
        to,
        reason,
        status: 'Pending'
      };

      leaves.unshift(newLeave);
      localStorage.setItem('it_sync_leaves', JSON.stringify(leaves));
      form.reset();

      // Close modal if in modal
      const modal = document.getElementById('applyLeaveModal');
      if (modal) modal.classList.remove('show');

      renderLeaveTables();
      showToast('Leave application submitted successfully!');
    });
  }
}

window.updateLeaveStatus = function(id, newStatus) {
  const leaves = JSON.parse(localStorage.getItem('it_sync_leaves') || '[]');
  const index = leaves.findIndex(l => l.id === id);
  if (index !== -1) {
    leaves[index].status = newStatus;
    localStorage.setItem('it_sync_leaves', JSON.stringify(leaves));
    renderLeaveTables();
    showToast(`Leave application #${id} marked as ${newStatus}`);
  }
};

/* 6B. Assignments Submission & Grading */
function renderAssignments() {
  const list = document.getElementById('assignmentsContainer');
  if (!list) return;

  const assignments = JSON.parse(localStorage.getItem('it_sync_assignments') || '[]');
  list.innerHTML = '';

  assignments.forEach(a => {
    const isSubmitted = a.status === 'Submitted';
    list.innerHTML += `
      <div class="timetable-item ${isSubmitted ? 'success' : 'warning'}" style="margin-bottom:12px;">
        <div class="timetable-info">
          <div class="timetable-subject">${a.title}</div>
          <div class="timetable-meta">
            <span>📚 ${a.subject}</span>
            <span>⏰ Due: ${a.due}</span>
            <span>📊 Grade: <strong>${a.grade}</strong></span>
          </div>
        </div>
        <div>
          ${isSubmitted 
            ? `<span class="status-badge active">Submitted</span>` 
            : `<button class="table-btn primary" onclick="openSubmitModal('${a.id}', '${a.title}')">Submit Solution</button>`
          }
        </div>
      </div>
    `;
  });
}

window.openSubmitModal = function(id, title) {
  const modal = document.getElementById('submitAssignmentModal');
  const titleSpan = document.getElementById('submitModalAssignmentTitle');
  const idInput = document.getElementById('submitAssignmentId');
  if (modal) {
    if (titleSpan) titleSpan.textContent = title;
    if (idInput) idInput.value = id;
    modal.classList.add('show');
  }
};

const submitAssignmentForm = document.getElementById('submitAssignmentForm');
if (submitAssignmentForm) {
  submitAssignmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('submitAssignmentId').value;
    const assignments = JSON.parse(localStorage.getItem('it_sync_assignments') || '[]');
    const index = assignments.findIndex(a => a.id === id);
    if (index !== -1) {
      assignments[index].status = 'Submitted';
      assignments[index].grade = 'Under Evaluation';
      localStorage.setItem('it_sync_assignments', JSON.stringify(assignments));
      renderAssignments();
      document.getElementById('submitAssignmentModal').classList.remove('show');
      showToast('Assignment submitted successfully!');
    }
  });
}

function initGradeSubmission() {
  const gradeForm = document.getElementById('gradeAssignmentForm');
  if (gradeForm) {
    gradeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const marks = document.getElementById('gradeMarksInput').value;
      const modal = document.getElementById('gradeAssignmentModal');
      if (modal) modal.classList.remove('show');
      showToast(`Grade ${marks}/100 and feedback published to student!`);
    });
  }
}

/* 6C. Attendance Target Calculator */
function initAttendanceCalculator() {
  const calcBtn = document.getElementById('calculateAttendanceBtn');
  if (!calcBtn) return;

  calcBtn.addEventListener('click', () => {
    const attended = parseInt(document.getElementById('calcAttended').value) || 0;
    const total = parseInt(document.getElementById('calcTotal').value) || 0;
    const target = parseInt(document.getElementById('calcTarget').value) || 75;
    const resultBox = document.getElementById('calcResultBox');

    if (total <= 0 || attended > total) {
      showToast('Please enter valid attendance numbers.');
      return;
    }

    const currentPercent = ((attended / total) * 100).toFixed(1);
    
    let message = '';
    if (currentPercent >= target) {
      const canMiss = Math.floor((100 * attended - target * total) / target);
      message = `<span style="color:var(--success); font-weight:700;">Great job! Your attendance is ${currentPercent}%.</span><br>You can safely miss <strong>${canMiss}</strong> upcoming classes without dropping below ${target}%.`;
    } else {
      const needed = Math.ceil((target * total - 100 * attended) / (100 - target));
      message = `<span style="color:var(--danger); font-weight:700;">Current Attendance: ${currentPercent}% (Below ${target}%)</span><br>You must attend the next <strong>${needed} consecutive classes</strong> to reach ${target}%!`;
    }

    if (resultBox) {
      resultBox.innerHTML = message;
      resultBox.style.display = 'block';
    }
  });
}

/* 6D. Staff Roll-Call Attendance Marker */
function initRollCallManager() {
  const container = document.getElementById('rollCallContainer');
  if (!container) return;

  function renderRollCall() {
    const rollCall = JSON.parse(localStorage.getItem('it_sync_roll_call') || '[]');
    container.innerHTML = '';

    rollCall.forEach((student, index) => {
      container.innerHTML += `
        <div class="roll-call-row">
          <div class="roll-call-student">
            <span class="roll-call-reg">${student.roll}</span>
            <strong>${student.name}</strong>
          </div>
          <button class="btn-toggle-present ${student.present ? '' : 'absent'}" onclick="toggleStudentAttendance(${index})">
            ${student.present ? '✓ Present' : '✗ Absent'}
          </button>
        </div>
      `;
    });
  }

  window.toggleStudentAttendance = function(index) {
    const rollCall = JSON.parse(localStorage.getItem('it_sync_roll_call') || '[]');
    if (rollCall[index]) {
      rollCall[index].present = !rollCall[index].present;
      localStorage.setItem('it_sync_roll_call', JSON.stringify(rollCall));
      renderRollCall();
    }
  };

  const markAllBtn = document.getElementById('markAllPresentBtn');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      const rollCall = JSON.parse(localStorage.getItem('it_sync_roll_call') || '[]');
      rollCall.forEach(s => s.present = true);
      localStorage.setItem('it_sync_roll_call', JSON.stringify(rollCall));
      renderRollCall();
      showToast('All students marked Present');
    });
  }

  const saveAttendanceBtn = document.getElementById('saveAttendanceBatchBtn');
  if (saveAttendanceBtn) {
    saveAttendanceBtn.addEventListener('click', () => {
      showToast('Attendance recorded and synced to departmental database!');
    });
  }

  renderRollCall();
}

/* 6E. Study Materials Search & Filters */
function initMaterialsSearch() {
  const searchInput = document.getElementById('materialsSearchInput');
  const filterChips = document.querySelectorAll('.material-filter-chip');
  const materialCards = document.querySelectorAll('.material-card');

  if (!materialCards.length) return;

  function filterMaterials() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const activeChip = document.querySelector('.material-filter-chip.active');
    const selectedType = activeChip ? activeChip.getAttribute('data-type') : 'all';

    materialCards.forEach(card => {
      const title = card.querySelector('h4').textContent.toLowerCase();
      const type = card.getAttribute('data-type') || '';
      const matchesSearch = title.includes(query);
      const matchesType = selectedType === 'all' || type === selectedType;

      if (matchesSearch && matchesType) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterMaterials);
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterMaterials();
    });
  });
}

/* 6F. Department Symposium 2026 Registration & E-Pass */
function initSymposiumRegistration() {
  const regForm = document.getElementById('symposiumRegForm');
  if (!regForm) return;

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sympName').value;
    const roll = document.getElementById('sympRoll').value;
    const event = document.getElementById('sympEvent').value;
    const college = document.getElementById('sympCollege').value;

    const passContainer = document.getElementById('generatedEPassContainer');
    if (passContainer) {
      const epassCode = 'EPASS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      passContainer.innerHTML = `
        <div class="epass-container">
          <div class="epass-header">
            <div>
              <h4 style="font-size:1.1rem; color:#38bdf8;">IT SYMPOSIUM 2026</h4>
              <p style="font-size:0.75rem; color:#94a3b8;">Department of Information Technology</p>
            </div>
            <span class="badge-tag" style="background:#10b981; color:#ffffff; border:none;">DELEGATE PASS</span>
          </div>
          <div class="epass-details">
            <div class="epass-item">
              <span>Participant</span>
              <span>${name}</span>
            </div>
            <div class="epass-item">
              <span>Roll / Reg No</span>
              <span>${roll}</span>
            </div>
            <div class="epass-item">
              <span>Registered Event</span>
              <span>${event}</span>
            </div>
            <div class="epass-item">
              <span>Institution</span>
              <span>${college}</span>
            </div>
            <div class="epass-item">
              <span>Pass Security Code</span>
              <strong style="color:#38bdf8;">${epassCode}</strong>
            </div>
          </div>
        </div>
      `;
      passContainer.style.display = 'block';
      showToast('E-Pass Generated! Digital badge verified.');
    }
  });
}

/* 6G. Admin User & Subject Table Management */
function initAdminUserTable() {
  const addUserForm = document.getElementById('adminAddUserForm');
  const userTableBody = document.getElementById('adminUserTableBody');
  const userTableBodyAlt = document.getElementById('adminUserTableBodyAlt');

  if (addUserForm) {
    addUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newUserName').value.trim();
      const email = document.getElementById('newUserEmail').value.trim();
      const role = document.getElementById('newUserRole').value;

      if (!name || !email || !role) return;

      const userId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
      const rowHtml = `
        <td>${userId}</td>
        <td><strong>${name}</strong></td>
        <td>${email}</td>
        <td><span class="status-badge ${role === 'Student' ? 'upcoming' : 'active'}">${role}</span></td>
        <td><span class="status-badge active">Active</span></td>
        <td>
          <div class="action-btn-group">
            <button class="table-btn" onclick="showToast('Editing ${name}')">Edit</button>
            <button class="table-btn danger" onclick="this.closest('tr').remove(); showToast('User ${name} removed');">Delete</button>
          </div>
        </td>
      `;

      if (userTableBody) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = rowHtml;
        userTableBody.prepend(newRow);
      }
      if (userTableBodyAlt) {
        const newRowAlt = document.createElement('tr');
        newRowAlt.innerHTML = rowHtml;
        userTableBodyAlt.prepend(newRowAlt);
      }

      addUserForm.reset();
      const modal = document.getElementById('addUserModal');
      if (modal) modal.classList.remove('show');
      showToast(`User ${name} added successfully!`);
    });
  }
}

function initAdminSubjectTable() {
  const addSubjectForm = document.getElementById('adminAddSubjectForm');
  const subjectTableBody = document.getElementById('adminSubjectTableBody');

  if (addSubjectForm && subjectTableBody) {
    addSubjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('newSubjectCode').value.trim();
      const title = document.getElementById('newSubjectTitle').value.trim();
      const credits = document.getElementById('newSubjectCredits').value;
      const faculty = document.getElementById('newSubjectFaculty').value;

      if (!code || !title) return;

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${code}</td>
        <td><strong>${title}</strong></td>
        <td>Sem VI</td>
        <td>${credits}</td>
        <td>${faculty}</td>
        <td><button class="table-btn" onclick="showToast('Editing ${code}')">Edit</button></td>
      `;

      subjectTableBody.prepend(newRow);
      addSubjectForm.reset();
      const modal = document.getElementById('addSubjectModal');
      if (modal) modal.classList.remove('show');
      showToast(`Subject ${code} (${title}) added successfully!`);
    });
  }
}

/* 6H. Student Profile Form Handler */
function initStudentProfile() {
  const profileForm = document.getElementById('studentProfileUpdateForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPhone = document.getElementById('profPhoneInput').value;
      const phoneDisplay = document.getElementById('profPhoneDisplay');
      if (phoneDisplay) phoneDisplay.textContent = newPhone;

      const modal = document.getElementById('studentProfileModal');
      if (modal) modal.classList.remove('show');
      showToast('Profile contact information updated successfully!');
    });
  }
}

/* --------------------------------------------------------------------------
 * 7. AI Assistant Chatbot ("IT-Bot")
 * -------------------------------------------------------------------------- */
function initAIAssistant() {
  const fabBtn = document.getElementById('aiFabBtn');
  const chatWindow = document.getElementById('aiChatWindow');
  const closeBtn = document.getElementById('aiChatCloseBtn');
  const sendBtn = document.getElementById('aiChatSendBtn');
  const input = document.getElementById('aiChatInput');
  const chatBody = document.getElementById('aiChatBody');

  if (!fabBtn || !chatWindow) return;

  fabBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('show');
    if (chatWindow.classList.contains('show') && input) {
      input.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('show');
    });
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    appendChatBubble(text, 'user');
    input.value = '';

    setTimeout(() => {
      const response = generateAIResponse(text);
      appendChatBubble(response, 'bot');
    }, 450);
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent;
      if (input) input.value = prompt;
      handleSend();
    });
  });

  function appendChatBubble(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

function generateAIResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('exam') || q.includes('internal') || q.includes('schedule')) {
    return '📅 <strong>Internal Examination Schedule:</strong><br>Internal Assessment I starts on <strong>October 15, 2026</strong>. Timetable and syllabus portions are available in the Timetable section.';
  } else if (q.includes('attendance') || q.includes('percent') || q.includes('shortage')) {
    return '📊 <strong>Attendance Criteria:</strong><br>A minimum of <strong>75% attendance</strong> is mandatory to appear for examinations. You can use our Target Attendance Calculator to estimate your required classes!';
  } else if (q.includes('symposium') || q.includes('event') || q.includes('register')) {
    return '🏆 <strong>IT Symposium 2026:</strong><br>The Annual National Level IT Symposium is scheduled on <strong>Oct 14, 2026</strong>. Events include Coding, Web Design, Bug Hunt & Paper Presentation. Register in the Events tab to generate your verified E-Pass!';
  } else if (q.includes('placement') || q.includes('company') || q.includes('job') || q.includes('salary')) {
    return '💼 <strong>Placement Drives:</strong><br>Upcoming campus recruitment drives: <strong>Zoho (8.5 LPA)</strong>, <strong>TCS Digital (7.2 LPA)</strong>, and <strong>Infosys (6.0 LPA)</strong>. Eligibility: CGPA >= 7.5 with 0 standing arrears.';
  } else if (q.includes('leave') || q.includes('od') || q.includes('medical')) {
    return '📝 <strong>Leave Policy:</strong><br>Submit leave/OD applications through the <strong>Leave Portal</strong> at least 24 hours in advance. Approvals are reviewed live by faculty and HOD.';
  } else if (q.includes('hod') || q.includes('contact') || q.includes('faculty') || q.includes('staff')) {
    return '👤 <strong>Department Contact:</strong><br><strong>HOD:</strong> Dr. K. Senthil (hod@itdept.edu)<br><strong>Faculty In-Charge:</strong> Prof. Rajesh Kumar (rajesh.k@itdept.edu)<br><strong>Department Office:</strong> Room IT-301, 3rd Floor IT Block.';
  } else if (q.includes('notes') || q.includes('pdf') || q.includes('question paper') || q.includes('material')) {
    return '📚 <strong>Study Materials:</strong><br>Lecture notes, lab manuals, and previous 5 years Anna University question papers are available in the <strong>Materials</strong> tab.';
  } else {
    return `🤖 <strong>IT Sync Assistant:</strong><br>I can help you with Exam Schedules, Attendance Rules, Timetables, Notes/PDFs, Symposium Registrations, Leave approvals, and Placement Drives! Try asking "When are the exams?" or click a quick suggestion.`;
  }
}

/* --------------------------------------------------------------------------
 * 8. Authentication System (Async PHP API with Seamless Fallback)
 * -------------------------------------------------------------------------- */
function initAuthSystem() {
  const loginForm = document.getElementById('loginForm');
  const errorAlert = document.getElementById('loginErrorAlert');
  const togglePwBtn = document.getElementById('togglePasswordBtn');
  const forgotPwBtn = document.getElementById('forgotPasswordBtn');
  const forgotModal = document.getElementById('forgotPasswordModal');
  const closeForgotBtn = document.getElementById('closeForgotModalBtn');
  const forgotForm = document.getElementById('forgotPasswordForm');

  // 8A. Show / Hide Password Toggle
  if (togglePwBtn) {
    togglePwBtn.addEventListener('click', () => {
      const pwInput = document.getElementById('password');
      const eyeIcon = document.getElementById('eyeIcon');
      if (pwInput) {
        if (pwInput.type === 'password') {
          pwInput.type = 'text';
          eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;
        } else {
          pwInput.type = 'password';
          eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
        }
      }
    });
  }

  // 8B. Forgot Password Modal
  if (forgotPwBtn && forgotModal) {
    forgotPwBtn.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.classList.add('show');
    });
  }

  if (closeForgotBtn && forgotModal) {
    closeForgotBtn.addEventListener('click', () => {
      forgotModal.classList.remove('show');
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = document.getElementById('resetUserIdentifier').value.trim();
      if (forgotModal) forgotModal.classList.remove('show');
      showToast(`Password recovery link dispatched to ${identifier || 'registered email'}`);
    });
  }

  // 8C. Role Selection Modal Trigger & Configuration
  const authModal = document.getElementById('loginAuthModal');
  const closeAuthBtn = document.getElementById('closeAuthModalBtn');
  const roleButtons = document.querySelectorAll('.open-role-modal-btn');
  const quickAutofillBtn = document.getElementById('quickAutofillBtn');
  // Role configurations for dynamic modal content
  const roleConfigs = {
    student: {
      title: 'Student Sign In',
      subtitle: 'Enter your Roll Number & Password to enter Student Hub',
      userLabel: 'Roll Number / Username',
      placeholder: '24IT001',
      defaultUser: '24IT001',
      defaultPass: 'student123',
      role: 'student',
      badgeColor: '#0284c7',
      badgeIcon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`
    },
    staff: {
      title: 'Teacher / Faculty Sign In',
      subtitle: 'Enter Faculty ID & Password to access Class ERP & Roll Call',
      userLabel: 'Faculty ID / Username',
      placeholder: 'ITSTAFF01',
      defaultUser: 'ITSTAFF01',
      defaultPass: 'staff123',
      role: 'staff',
      badgeColor: '#059669',
      badgeIcon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
    },
    hod: {
      title: 'Head of Department (HOD) Sign In',
      subtitle: 'Executive clearance for department analytics & approvals',
      userLabel: 'HOD Executive Username',
      placeholder: 'ITHOD01',
      defaultUser: 'ITHOD01',
      defaultPass: 'hod123',
      role: 'hod',
      badgeColor: '#d97706',
      badgeIcon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
    },
    admin: {
      title: 'System Administrator Sign In',
      subtitle: 'Root credentials for User Directory & Infrastructure diagnostics',
      userLabel: 'Admin ID / Username',
      placeholder: 'ITADMIN01',
      defaultUser: 'ITADMIN01',
      defaultPass: 'admin123',
      role: 'admin',
      badgeColor: '#7c3aed',
      badgeIcon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
    }
  };

  window.openRoleLoginModal = function(roleKey) {
    const config = roleConfigs[roleKey] || roleConfigs.student;
    const modalTitle = document.getElementById('modalAuthTitle');
    const modalSubtitle = document.getElementById('modalAuthSubtitle');
    const userLabel = document.getElementById('usernameLabel');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleInput = document.getElementById('role');
    const badgeEl = document.getElementById('modalRoleBadge');
    const quickRoleName = document.getElementById('quickRoleName');
    const errorAlert = document.getElementById('loginErrorAlert');

    if (errorAlert) errorAlert.classList.remove('show');
    if (modalTitle) modalTitle.textContent = config.title;
    if (modalSubtitle) modalSubtitle.textContent = config.subtitle;
    if (userLabel) userLabel.textContent = config.userLabel;
    if (usernameInput) {
      usernameInput.placeholder = `e.g. ${config.placeholder}`;
      usernameInput.value = config.defaultUser || config.role;
    }
    if (passwordInput) passwordInput.value = config.defaultPass || '1234';
    if (roleInput) roleInput.value = config.role;
    if (quickRoleName) quickRoleName.textContent = config.role;
    if (badgeEl) {
      badgeEl.style.backgroundColor = config.badgeColor;
      badgeEl.innerHTML = config.badgeIcon;
    }

    if (authModal) authModal.classList.add('show');
  };

  roleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const role = btn.getAttribute('data-role');
      openRoleLoginModal(role);
    });
  });

  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const role = card.getAttribute('data-role');
      openRoleLoginModal(role);
    });
  });

  if (closeAuthBtn && authModal) {
    closeAuthBtn.addEventListener('click', () => {
      authModal.classList.remove('show');
    });
  }

  if (quickAutofillBtn) {
    quickAutofillBtn.addEventListener('click', () => {
      const currentRole = document.getElementById('role').value || 'student';
      const config = roleConfigs[currentRole] || roleConfigs.student;
      document.getElementById('username').value = config.defaultUser;
      document.getElementById('password').value = config.defaultPass;
      showToast(`Autofilled demo credentials for ${currentRole.toUpperCase()}`);
    });
  }

  // 8D. Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const role = document.getElementById('role').value;

      if (errorAlert) errorAlert.classList.remove('show');

      if (!username || !password || !role) {
        displayLoginError('Please fill in all fields.');
        return;
      }

      // Try Backend PHP Authentication
      try {
        const response = await fetch('php/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role })
        });

        const resData = await response.json();
        if (resData.success && resData.data && resData.data.redirect) {
          localStorage.setItem('it_sync_user', username);
          localStorage.setItem('it_sync_role', role);
          localStorage.setItem('it_sync_logged_in', 'true');
          showToast('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = resData.data.redirect;
          }, 350);
          return;
        } else if (!resData.success) {
          displayLoginError(resData.message || 'Invalid credentials.');
          return;
        }
      } catch (err) {
        // Fallback for static file serving / offline demo
      }

      // Fallback Client Demo Authentication
      const validCreds = {
        student: { ids: ['24it001', 'student', '23it042'], passes: ['student123', '1234'] },
        staff: { ids: ['itstaff01', 'staff', 'prof.rajesh'], passes: ['staff123', '1234'] },
        hod: { ids: ['ithod01', 'hod', 'dr.senthil'], passes: ['hod123', '1234'] },
        admin: { ids: ['itadmin01', 'admin', 'superadmin'], passes: ['admin123', '1234'] }
      };

      const normalizedUsername = username.toLowerCase();
      const roleConfig = validCreds[role];

      if (roleConfig && (roleConfig.ids.includes(normalizedUsername) || normalizedUsername.includes(role)) && roleConfig.passes.includes(password)) {
        localStorage.setItem('it_sync_user', username);
        localStorage.setItem('it_sync_role', role);
        localStorage.setItem('it_sync_logged_in', 'true');
        showToast('Login successful! Redirecting...');
        setTimeout(() => redirectToDashboard(role), 350);
      } else {
        const expected = role === 'student' ? '24IT001 / student123' :
                         role === 'staff' ? 'ITSTAFF01 / staff123' :
                         role === 'hod' ? 'ITHOD01 / hod123' : 'ITADMIN01 / admin123';
        displayLoginError(`Invalid username or password. Demo credentials for ${role.toUpperCase()}: ${expected}`);
      }
    });
  }

  // 8E. Logout Handlers
  const logoutBtns = document.querySelectorAll('.logout-action');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  });
}

function displayLoginError(msg) {
  const errorAlert = document.getElementById('loginErrorAlert');
  const errorMessage = document.getElementById('loginErrorMessage');
  if (errorAlert && errorMessage) {
    errorMessage.textContent = msg;
    errorAlert.classList.add('show');
  }
}

function redirectToDashboard(role) {
  switch (role) {
    case 'student': window.location.href = 'student.html'; break;
    case 'staff': window.location.href = 'staff.html'; break;
    case 'hod': window.location.href = 'hod.html'; break;
    case 'admin': window.location.href = 'admin.html'; break;
    default: window.location.href = 'index.html';
  }
}

async function handleLogout() {
  try {
    await fetch('php/logout.php');
  } catch (err) {}

  localStorage.removeItem('it_sync_user');
  localStorage.removeItem('it_sync_role');
  localStorage.removeItem('it_sync_logged_in');
  showToast('Logging out...');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 350);
}

/* --------------------------------------------------------------------------
 * 9. HOD Dashboard Charts (High-DPI Pure HTML5 Canvas)
 * -------------------------------------------------------------------------- */
function initHODCharts() {
  const perfCanvas = document.getElementById('performanceChartCanvas');
  const statsCanvas = document.getElementById('deptStatsCanvas');

  if (perfCanvas) {
    renderBarChartCanvas(perfCanvas, [
      { label: 'O Grade', value: 35, color: '#10b981' },
      { label: 'A+ Grade', value: 45, color: '#3b82f6' },
      { label: 'A Grade', value: 12, color: '#8b5cf6' },
      { label: 'B Grade', value: 6, color: '#f59e0b' },
      { label: 'Arrears', value: 2, color: '#ef4444' }
    ]);
  }

  if (statsCanvas) {
    renderDoughnutChartCanvas(statsCanvas, [
      { label: 'Curriculum & Labs', value: 40, color: '#3b82f6' },
      { label: 'Research & Papers', value: 25, color: '#10b981' },
      { label: 'Student Mentoring', value: 20, color: '#8b5cf6' },
      { label: 'Admin & Events', value: 15, color: '#f59e0b' }
    ]);
  }
}

function renderBarChartCanvas(canvas, data) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const paddingLeft = 30;
  const paddingBottom = 35;
  const paddingTop = 20;
  const paddingRight = 20;
  const chartWidth = rect.width - paddingLeft - paddingRight;
  const chartHeight = rect.height - paddingTop - paddingBottom;
  const barWidth = chartWidth / data.length - 16;
  const maxValue = 50;

  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(rect.width - paddingRight, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  data.forEach((item, index) => {
    const x = paddingLeft + index * (barWidth + 16) + 8;
    const barH = (item.value / maxValue) * chartHeight;
    const y = paddingTop + (chartHeight - barH);

    ctx.fillStyle = item.color;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
    } else {
      ctx.rect(x, y, barWidth, barH);
    }
    ctx.fill();

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${item.value}%`, x + barWidth / 2, y - 6);

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText(item.label, x + barWidth / 2, rect.height - 10);
  });
}

function renderDoughnutChartCanvas(canvas, data) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const radius = Math.min(centerX, centerY) - 25;
  const innerRadius = radius * 0.62;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = -Math.PI / 2;

  data.forEach(item => {
    const sliceAngle = (item.value / total) * (Math.PI * 2);
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();

    ctx.fillStyle = item.color;
    ctx.fill();

    startAngle = endAngle;
  });

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#0f172a';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100%', centerX, centerY - 6);

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText('Workload', centerX, centerY + 12);
}

/* --------------------------------------------------------------------------
 * 10. Floating Toast Utility
 * -------------------------------------------------------------------------- */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
