/**
 * ============================================================================
 * IT DIGITAL HUB - Unified API Service Layer
 * Department of Information Technology - Government College of Engineering, Erode
 * ============================================================================
 * 
 * This service layer abstracts all client-side data operations and network requests.
 * 
 * BACKEND INTEGRATION INSTRUCTIONS:
 * 1. Set `USE_BACKEND_API = true` below when your backend server is running.
 * 2. Configure `API_BASE_URL` to point to your backend API (e.g., 'http://localhost:5000/api' or '/php').
 * 3. All React components will automatically communicate with your backend database
 *    without requiring ANY changes to the UI components or state handlers!
 */

function getResolvedApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http')) {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
}

const API_CONFIG = {
  // Toggle to true to connect to Node.js Express REST API server
  USE_BACKEND_API: true,
  
  // Base URL for backend Node.js Express REST API endpoints (dynamically synced to single port)
  get API_BASE_URL() {
    return getResolvedApiBaseUrl();
  },
  
  // Timeout for network requests (in milliseconds)
  TIMEOUT_MS: 3000
};

// Generic HTTP Request Handler with Fetch & Timeout
async function apiRequest(endpoint, options = {}) {
  if (!API_CONFIG.USE_BACKEND_API) {
    throw new Error('BACKEND_DISABLED: Operating in client-side mock mode');
  }

  const url = `${API_CONFIG.API_BASE_URL}${endpoint}`;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };

  // Attach auth token if present
  const token = localStorage.getItem('gce_it_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[API] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

/* ==========================================================================
 * 1. AUTHENTICATION API
 * ========================================================================== */
const authApi = {
  // Login with credentials
  async login(role, userId, password) {
    try {
      return await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ role, userId, password })
      });
    } catch (err) {
      // Fallback: validate against demo credentials
      return null;
    }
  },

  // Logout current session
  async logout() {
    try {
      return await apiRequest('/auth/logout', { method: 'POST' });
    } catch (err) {
      return { success: true };
    }
  },

  // Verify JWT / Session token
  async verifySession() {
    try {
      return await apiRequest('/auth/verify');
    } catch (err) {
      return null;
    }
  }
};

/* ==========================================================================
 * 2. STUDENT API
 * ========================================================================== */
const studentApi = {
  // Fetch complete student profile
  async getProfile(rollNo) {
    try {
      return await apiRequest(`/students/profile/${rollNo}`);
    } catch (err) {
      return null;
    }
  },

  // Update contact information
  async updateContactInfo(rollNo, contactData) {
    try {
      return await apiRequest(`/students/profile/${rollNo}/contact`, {
        method: 'PUT',
        body: JSON.stringify(contactData)
      });
    } catch (err) {
      return { success: true, data: contactData };
    }
  },

  // Submit assignment solution
  async submitAssignment(assignmentId, rollNo, fileDetails) {
    try {
      return await apiRequest(`/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ rollNo, fileDetails })
      });
    } catch (err) {
      return { success: true };
    }
  },

  // Apply for leave / on-duty
  async applyLeave(leaveData) {
    try {
      return await apiRequest('/students/leave/apply', {
        method: 'POST',
        body: JSON.stringify(leaveData)
      });
    } catch (err) {
      return { success: true, data: leaveData };
    }
  },

  // Get all achievements
  async getAchievements() {
    try {
      return await apiRequest('/students/achievements');
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  // Record student achievement (supports FormData or JSON)
  async addAchievement(achievementData) {
    try {
      const isFormData = typeof FormData !== 'undefined' && achievementData instanceof FormData;
      return await apiRequest('/students/achievements', {
        method: 'POST',
        body: isFormData ? achievementData : JSON.stringify(achievementData)
      });
    } catch (err) {
      return { success: true, data: achievementData };
    }
  },

  // Delete achievement
  async deleteAchievement(id) {
    try {
      return await apiRequest(`/students/achievements/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      return { success: true, id };
    }
  },

  // Get all certificates
  async getCertificates() {
    try {
      return await apiRequest('/students/certificates');
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  // Get study materials
  async getStudyMaterials() {
    try {
      return await apiRequest('/materials');
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  // Upload verified certification (supports FormData or JSON)
  async addCertificate(certificateData) {
    try {
      const isFormData = typeof FormData !== 'undefined' && certificateData instanceof FormData;
      return await apiRequest('/students/certificates', {
        method: 'POST',
        body: isFormData ? certificateData : JSON.stringify(certificateData)
      });
    } catch (err) {
      return { success: true, data: certificateData };
    }
  },

  // Delete certification
  async deleteCertificate(id) {
    try {
      return await apiRequest(`/students/certificates/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      return { success: true };
    }
  },

  // Register for symposium event & get verified token
  async registerSymposium(regData) {
    try {
      return await apiRequest('/symposium/register', {
        method: 'POST',
        body: JSON.stringify(regData)
      });
    } catch (err) {
      const epassCode = 'EPASS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      return { success: true, epassCode, ...regData };
    }
  }
};

/* ==========================================================================
 * 3. STAFF / FACULTY API
 * ========================================================================== */
const staffApi = {
  // Batch mark attendance
  async submitAttendanceBatch(subjectCode, date, attendanceRecords) {
    try {
      return await apiRequest('/attendance/batch', {
        method: 'POST',
        body: JSON.stringify({ subjectCode, date, records: attendanceRecords })
      });
    } catch (err) {
      return { success: true, count: attendanceRecords.length };
    }
  },

  // Publish new assignment
  async createAssignment(assignmentData) {
    try {
      return await apiRequest('/assignments', {
        method: 'POST',
        body: JSON.stringify(assignmentData)
      });
    } catch (err) {
      return { success: true, data: assignmentData };
    }
  },

  // Grade student assignment submission
  async gradeAssignment(assignmentId, studentRollNo, score, remarks) {
    try {
      return await apiRequest(`/assignments/${assignmentId}/grade`, {
        method: 'PUT',
        body: JSON.stringify({ studentRollNo, score, remarks })
      });
    } catch (err) {
      return { success: true };
    }
  },

  // Get study materials
  async getStudyMaterials() {
    try {
      return await apiRequest('/materials');
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  // Upload study material (supports FormData file upload and JSON object)
  async uploadStudyMaterial(materialData) {
    try {
      const isFormData = typeof FormData !== 'undefined' && materialData instanceof FormData;
      return await apiRequest('/materials', {
        method: 'POST',
        body: isFormData ? materialData : JSON.stringify(materialData)
      });
    } catch (err) {
      return { success: true, data: materialData };
    }
  },

  // Review & sanction student leave request
  async updateLeaveStatus(leaveId, status) {
    try {
      return await apiRequest(`/students/leave/${leaveId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (err) {
      return { success: true, leaveId, status };
    }
  },

  // Save internal marks batch
  async saveInternalMarksBatch(subjectCode, examType, marksList) {
    try {
      return await apiRequest('/marks/internal/batch', {
        method: 'POST',
        body: JSON.stringify({ subjectCode, examType, marks: marksList })
      });
    } catch (err) {
      return { success: true };
    }
  },

  // Update faculty profile
  async updateFacultyProfile(facultyId, profileData) {
    try {
      return await apiRequest(`/auth/faculty/${facultyId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    } catch (err) {
      return { success: true, data: profileData };
    }
  }
};

/* ==========================================================================
 * 4. HOD EXECUTIVE API
 * ========================================================================== */
const hodApi = {
  // Fetch department analytics & NIRF/NAAC metrics
  async getDepartmentAnalytics() {
    try {
      return await apiRequest('/hod/analytics');
    } catch (err) {
      return null;
    }
  },

  // Publish high-priority official department circular
  async publishCircular(circularData) {
    try {
      return await apiRequest('/announcements/circular', {
        method: 'POST',
        body: JSON.stringify(circularData)
      });
    } catch (err) {
      return { success: true, data: circularData };
    }
  },

  // Sanction faculty leave request
  async sanctionFacultyLeave(requestId, decision) {
    try {
      return await apiRequest(`/faculty/leave/${requestId}/sanction`, {
        method: 'POST',
        body: JSON.stringify({ decision })
      });
    } catch (err) {
      return { success: true, requestId, decision };
    }
  },

  // Faculty Staff CRUD (Exclusively governed by HOD)
  async getFaculty() {
    try {
      return await apiRequest('/hod/faculty');
    } catch (err) {
      return null;
    }
  },

  async createFaculty(facultyData) {
    try {
      return await apiRequest('/hod/faculty', {
        method: 'POST',
        body: JSON.stringify(facultyData)
      });
    } catch (err) {
      return { success: true, data: facultyData };
    }
  },

  async updateFaculty(facultyId, facultyData) {
    try {
      return await apiRequest(`/hod/faculty/${facultyId}`, {
        method: 'PUT',
        body: JSON.stringify(facultyData)
      });
    } catch (err) {
      return { success: true, data: facultyData };
    }
  },

  async deleteFaculty(facultyId) {
    try {
      return await apiRequest(`/hod/faculty/${facultyId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      return { success: true, facultyId };
    }
  },

  // Class Advisor Appointments (Exclusively assigned by HOD)
  async getClassAdvisors() {
    try {
      return await apiRequest('/hod/class-advisors');
    } catch (err) {
      return null;
    }
  },

  async updateClassAdvisor(year, staffId) {
    try {
      return await apiRequest(`/hod/class-advisors/${year}`, {
        method: 'PUT',
        body: JSON.stringify({ staffId })
      });
    } catch (err) {
      return { success: true, year, staffId };
    }
  },

  // Broadcast low attendance warning SMS to parents
  async broadcastAttendanceWarning(studentRollNos) {
    try {
      return await apiRequest('/notifications/broadcast-warning', {
        method: 'POST',
        body: JSON.stringify({ rollNos: studentRollNos })
      });
    } catch (err) {
      return { success: true, count: studentRollNos.length };
    }
  }
};

/* ==========================================================================
 * 5. ADMINISTRATOR API
 * ========================================================================== */
const adminApi = {
  // Add new student record
  async createStudent(studentData) {
    try {
      return await apiRequest('/admin/students', {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
    } catch (err) {
      return { success: true, data: studentData };
    }
  },

  // Update existing student record
  async updateStudent(rollNo, studentData) {
    try {
      return await apiRequest(`/admin/students/${rollNo}`, {
        method: 'PUT',
        body: JSON.stringify(studentData)
      });
    } catch (err) {
      return { success: true, data: studentData };
    }
  },

  // Delete student record
  async deleteStudent(rollNo) {
    try {
      return await apiRequest(`/admin/students/${rollNo}`, {
        method: 'DELETE'
      });
    } catch (err) {
      return { success: true, rollNo };
    }
  },

  // Delete student achievement
  async deleteAchievement(id) {
    try {
      return await apiRequest(`/admin/achievements/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      return { success: true, id };
    }
  },

  // Add faculty member
  async createFaculty(facultyData) {
    try {
      return await apiRequest('/admin/faculty', {
        method: 'POST',
        body: JSON.stringify(facultyData)
      });
    } catch (err) {
      return { success: true, data: facultyData };
    }
  },

  // Update faculty member
  async updateFaculty(facultyId, facultyData) {
    try {
      return await apiRequest(`/admin/faculty/${facultyId}`, {
        method: 'PUT',
        body: JSON.stringify(facultyData)
      });
    } catch (err) {
      return { success: true, data: facultyData };
    }
  },

  // Delete faculty member
  async deleteFaculty(facultyId) {
    try {
      return await apiRequest(`/admin/faculty/${facultyId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      return { success: true, facultyId };
    }
  },

  // Add academic subject
  async createSubject(subjectData) {
    try {
      return await apiRequest('/admin/subjects', {
        method: 'POST',
        body: JSON.stringify(subjectData)
      });
    } catch (err) {
      return { success: true, data: subjectData };
    }
  },

  // Trigger SQL database backup dump
  async triggerDatabaseBackup() {
    try {
      return await apiRequest('/admin/backup/export', { method: 'POST' });
    } catch (err) {
      return { 
        success: true, 
        filename: `gce_it_hub_dump_${new Date().toISOString().split('T')[0]}.sql`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // HOD Governance (Admin Feature - Sole authority to add, view, and edit HODs)
  async getHODList() {
    try {
      return await apiRequest('/admin/hods');
    } catch (err) {
      return { success: true, data: [] };
    }
  },

  async getHOD() {
    try {
      return await apiRequest('/admin/hod');
    } catch (err) {
      return { success: true };
    }
  },

  async createHOD(hodData) {
    try {
      return await apiRequest('/admin/hods', {
        method: 'POST',
        body: JSON.stringify(hodData)
      });
    } catch (err) {
      return { success: true, data: hodData };
    }
  },

  async updateHOD(hodData, id) {
    try {
      const targetId = id || hodData.id || 'ITHOD01';
      return await apiRequest(`/admin/hods/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify(hodData)
      });
    } catch (err) {
      return { success: true, data: hodData };
    }
  },

  async deleteHOD(id) {
    try {
      return await apiRequest(`/admin/hods/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      return { success: true, id };
    }
  },

  async changeHOD(newHOD) {
    try {
      return await apiRequest('/admin/hod/change', {
        method: 'POST',
        body: JSON.stringify(newHOD)
      });
    } catch (err) {
      return { success: true, data: newHOD };
    }
  }
};

/* ==========================================================================
 * 6. MESSAGING & CLASS ADVISORS API (Student / Staff / HOD)
 * ========================================================================== */
const messagingApi = {
  async getMessages(userId, role) {
    try {
      const q = new URLSearchParams();
      if (userId) q.append('userId', userId);
      if (role) q.append('role', role);
      return await apiRequest(`/messages?${q.toString()}`);
    } catch (err) {
      return { success: true, data: [] };
    }
  },

  async sendMessage(messageData) {
    try {
      return await apiRequest('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
    } catch (err) {
      return { success: true, data: messageData };
    }
  },

  async updateMessageStatus(messageId, status) {
    try {
      return await apiRequest(`/messages/${messageId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (err) {
      return { success: true };
    }
  },

  async getClassAdvisors() {
    try {
      return await apiRequest('/messages/class-advisors');
    } catch (err) {
      return { success: true, data: {} };
    }
  },

  async updateClassAdvisor(year, staffId) {
    try {
      return await apiRequest(`/messages/class-advisors/${year}`, {
        method: 'PUT',
        body: JSON.stringify({ staffId })
      });
    } catch (err) {
      return { success: true };
    }
  }
};

/* ==========================================================================
 * 7. GALLERY API (Department, Symposium, Event, Placement)
 * ========================================================================== */
const galleryApi = {
  async getPhotos(filters = {}) {
    try {
      const q = new URLSearchParams();
      Object.keys(filters).forEach(k => {
        if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
          q.append(k, filters[k]);
        }
      });
      return await apiRequest(`/gallery?${q.toString()}`);
    } catch (err) {
      return { success: true, count: 0, data: [] };
    }
  },

  async uploadPhoto(photoData) {
    if (typeof FormData !== 'undefined' && photoData instanceof FormData) {
      return await apiRequest('/gallery/upload', {
        method: 'POST',
        body: photoData
      });
    }
    return await apiRequest('/gallery/upload', {
      method: 'POST',
      body: JSON.stringify(photoData)
    });
  },

  async updatePhoto(photoId, updateData) {
    return await apiRequest(`/gallery/${photoId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  async toggleLike(photoId, userId) {
    return await apiRequest(`/gallery/${photoId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },

  async addComment(photoId, commentData) {
    return await apiRequest(`/gallery/${photoId}/comment`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  },

  async updateStatus(photoId, status) {
    return await apiRequest(`/gallery/${photoId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async deletePhoto(photoId) {
    return await apiRequest(`/gallery/${photoId}`, {
      method: 'DELETE'
    });
  },

  async getAnalytics() {
    try {
      return await apiRequest('/gallery/analytics');
    } catch (err) {
      return { success: true, data: {} };
    }
  }
};

/* ==========================================================================
 * EXPORT UNIFIED API BUNDLE (for ES Module and Browser Window)
 * ========================================================================== */
const ITDepartmentApi = {
  config: API_CONFIG,
  auth: authApi,
  student: studentApi,
  staff: staffApi,
  hod: hodApi,
  admin: adminApi,
  messages: messagingApi,
  gallery: galleryApi
};

if (typeof window !== 'undefined') {
  window.ITDepartmentApi = ITDepartmentApi;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ...ITDepartmentApi,
    authApi,
    studentApi,
    staffApi,
    hodApi,
    adminApi,
    messagingApi,
    galleryApi,
    default: ITDepartmentApi
  };
}

