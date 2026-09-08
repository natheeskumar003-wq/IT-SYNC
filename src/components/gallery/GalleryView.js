// IT DIGITAL HUB - Fully Functional Gallery Module
// Covers: Department Gallery, Symposium Gallery, Event Gallery, Placement Gallery
// Microsoft/Notion Dark Glassmorphism UI with Interactive Likes, Comments, Lightbox, Upload & Permissions

(function () {
  const { useState, useEffect, useMemo, createElement: h, Fragment } = React;
  const Icons = (typeof window !== 'undefined' && window.ITAuthContext?.Icons) || window.Icons || {};
  const useAuth = (typeof window !== 'undefined' && window.ITAuthContext?.useAuth) || (() => ({}));

  // Helper for safe icon rendering
  const renderIcon = (IconComp, props) => {
    if (typeof IconComp === 'function') {
      return h(IconComp, props);
    }
    return null;
  };

  const SECTIONS = [
    { id: 'department', label: 'Department Gallery', icon: Icons.Folder || Icons.BookOpen, desc: 'Department labs, computing clusters, smart classrooms & faculty meets' },
    { id: 'symposium', label: 'Symposium Gallery', icon: Icons.Sparkles, desc: 'INFOBIT, National Hackathons, paper presentations & championships' },
    { id: 'event', label: 'Event Gallery', icon: Icons.Calendar, desc: 'TARANG Culturals, Sports Day, workshops, NSS, farewell & annual day' },
    { id: 'placement', label: 'Placement Gallery', icon: Icons.Briefcase, desc: 'Recruitment drives, top IT companies, training & offer letter celebrations' }
  ];

  const DEPARTMENTS = [
    'All Departments',
    'Information Technology',
    'Computer Science',
    'Electronics & Comm',
    'Mechanical',
    'Civil'
  ];

  const SYMPOSIUM_YEARS = ['All Years', '2026', '2025', '2024', '2023'];

  const EVENT_CATEGORIES = [
    'All',
    'Cultural Programs',
    'Sports Day',
    'Workshops & Seminars',
    'NSS & NCC',
    'Farewell & Freshers',
    'Annual Day'
  ];

  const PLACEMENT_COMPANIES = [
    'All Companies',
    'Zoho',
    'TCS',
    'Infosys',
    'Cognizant',
    'Wipro',
    'HCL',
    'Accenture'
  ];

  const SAMPLE_PRESET_IMAGES = [];

  // =========================================================================
  // MAIN GALLERY VIEW COMPONENT
  // =========================================================================
  const GalleryView = () => {
    const { currentUser, addToast } = useAuth();
    const role = (currentUser?.role || 'student').toLowerCase();
    const isStudent = role === 'student';
    const isTeacher = role === 'staff';
    const isHOD = role === 'hod';
    const isAdmin = role === 'admin';
    const canManageApprovals = isTeacher || isHOD || isAdmin;

    // State
    const [activeSection, setActiveSection] = useState('department');
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deptFilter, setDeptFilter] = useState('All Departments');
    const [yearFilter, setYearFilter] = useState('All Years');
    const [eventCatFilter, setEventCatFilter] = useState('All');
    const [companyFilter, setCompanyFilter] = useState('All Companies');
    const [statusFilter, setStatusFilter] = useState('all'); // all, Pending Teacher Approval, Approved, Rejected
    const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // all, photo, video
    const [studentTab, setStudentTab] = useState('approved'); // approved (public gallery) or my-uploads
    const [viewMode, setViewMode] = useState('grid'); // grid or masonry
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modals
    const [selectedPhoto, setSelectedPhoto] = useState(null); // Lightbox / Video Player
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);
    const [photoToEdit, setPhotoToEdit] = useState(null);
    const [mediaToEditPhoto, setMediaToEditPhoto] = useState(null);
    const [mediaToRotateVideo, setMediaToRotateVideo] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(isHOD || isAdmin);

    // Fetch Analytics for HOD & Admin
    const loadAnalytics = async () => {
      try {
        if (window.ITDepartmentApi?.gallery?.getAnalytics) {
          const res = await window.ITDepartmentApi.gallery.getAnalytics();
          if (res?.success && res?.data) {
            setAnalytics(res.data);
          }
        }
      } catch (e) {
        console.warn('Could not fetch gallery analytics', e);
      }
    };

    // Fetch Photos/Videos from Backend API
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const filters = {
          section: activeSection,
          search: searchQuery.trim(),
          userRole: role,
          userId: currentUser?.id || currentUser?.rollNo || ''
        };

        if (mediaTypeFilter !== 'all') {
          filters.mediaType = mediaTypeFilter;
        }

        if (activeSection === 'department' && deptFilter !== 'All Departments') {
          filters.department = deptFilter;
        }
        if (activeSection === 'symposium' && yearFilter !== 'All Years') {
          filters.eventYear = yearFilter;
        }
        if (activeSection === 'event' && eventCatFilter !== 'All') {
          filters.category = eventCatFilter;
        }
        if (activeSection === 'placement' && companyFilter !== 'All Companies') {
          filters.company = companyFilter;
        }

        // Student Workflow vs Staff Approval Workflow
        if (isStudent) {
          if (studentTab === 'my-uploads') {
            filters.view = 'my-uploads';
          } else {
            filters.status = 'approved';
          }
        } else if (statusFilter !== 'all') {
          filters.status = statusFilter;
        }

        if (window.ITDepartmentApi?.gallery?.getPhotos) {
          const res = await window.ITDepartmentApi.gallery.getPhotos(filters);
          if (res?.success && Array.isArray(res.data)) {
            setPhotos(res.data);
          } else {
            setPhotos([]);
          }
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        addToast?.('Failed to load gallery from server', 'error');
      } finally {
        setLoading(false);
      }
    };

    // Initial and Dependency-driven Data Refresh
    useEffect(() => {
      setCurrentPage(1);
      fetchPhotos();
      if (canManageApprovals) {
        loadAnalytics();
      }
    }, [activeSection, searchQuery, deptFilter, yearFilter, eventCatFilter, companyFilter, statusFilter, mediaTypeFilter, studentTab]);

    // Likes Toggle
    const handleToggleLike = async (photo) => {
      const uId = currentUser?.id || currentUser?.rollNo || 'ANON';
      const isAlreadyLiked = (photo.likedBy || []).includes(uId);

      // Optimistic UI update
      const updatedPhotos = photos.map(p => {
        if (p.id === photo.id) {
          const curLikes = p.likes || 0;
          const newLikes = isAlreadyLiked ? Math.max(0, curLikes - 1) : curLikes + 1;
          const newLikedBy = isAlreadyLiked
            ? (p.likedBy || []).filter(id => id !== uId)
            : [...(p.likedBy || []), uId];
          return { ...p, likes: newLikes, likedBy: newLikedBy };
        }
        return p;
      });
      setPhotos(updatedPhotos);

      if (selectedPhoto && selectedPhoto.id === photo.id) {
        const curLikes = selectedPhoto.likes || 0;
        setSelectedPhoto({
          ...selectedPhoto,
          likes: isAlreadyLiked ? Math.max(0, curLikes - 1) : curLikes + 1,
          likedBy: isAlreadyLiked
            ? (selectedPhoto.likedBy || []).filter(id => id !== uId)
            : [...(selectedPhoto.likedBy || []), uId]
        });
      }

      try {
        if (window.ITDepartmentApi?.gallery?.toggleLike) {
          await window.ITDepartmentApi.gallery.toggleLike(photo.id, uId);
        }
      } catch (e) {
        console.warn('Like sync failed', e);
      }
    };

    // Comment Submission
    const handleAddComment = async (photoId, commentText) => {
      if (!commentText.trim()) return;
      const uId = currentUser?.id || currentUser?.rollNo || 'ANON';
      const uName = currentUser?.name || 'User';

      try {
        if (window.ITDepartmentApi?.gallery?.addComment) {
          const res = await window.ITDepartmentApi.gallery.addComment(photoId, {
            userId: uId,
            userName: uName,
            userRole: role,
            text: commentText.trim()
          });

          if (res?.success && res?.data) {
            const newCmt = res.data;
            const updated = photos.map(p => {
              if (p.id === photoId) {
                return { ...p, comments: [...(p.comments || []), newCmt] };
              }
              return p;
            });
            setPhotos(updated);

            if (selectedPhoto && selectedPhoto.id === photoId) {
              setSelectedPhoto({
                ...selectedPhoto,
                comments: [...(selectedPhoto.comments || []), newCmt]
              });
            }
            addToast?.('Comment added successfully!', 'success');
          }
        }
      } catch (e) {
        addToast?.('Failed to submit comment', 'error');
      }
    };

    // Status Change (Approve/Reject)
    const handleStatusUpdate = async (photoId, newStatus) => {
      try {
        if (window.ITDepartmentApi?.gallery?.updateStatus) {
          const res = await window.ITDepartmentApi.gallery.updateStatus(photoId, newStatus);
          if (res?.success) {
            addToast?.(res.message || `Photograph ${newStatus}`, 'success');
            fetchPhotos();
            loadAnalytics();
            if (selectedPhoto && selectedPhoto.id === photoId) {
              setSelectedPhoto({ ...selectedPhoto, status: newStatus });
            }
          }
        }
      } catch (e) {
        addToast?.('Failed to update status', 'error');
      }
    };

    // Delete Photo
    const handleConfirmDelete = async () => {
      if (!photoToDelete) return;
      try {
        if (window.ITDepartmentApi?.gallery?.deletePhoto) {
          const res = await window.ITDepartmentApi.gallery.deletePhoto(photoToDelete.id);
          if (res?.success) {
            addToast?.('Photograph removed from gallery', 'info');
            setPhotos(photos.filter(p => p.id !== photoToDelete.id));
            if (selectedPhoto && selectedPhoto.id === photoToDelete.id) {
              setSelectedPhoto(null);
            }
            loadAnalytics();
          }
        }
      } catch (e) {
        addToast?.('Failed to delete photo', 'error');
      } finally {
        setPhotoToDelete(null);
      }
    };

    // Save Edited Photo (Crop, Rotate, Flip, Filters, Resize)
    const handleSavePhotoEdit = async (photoId, blob, dataUrl, editMeta) => {
      try {
        if (window.ITDepartmentApi?.gallery?.editPhoto) {
          const res = await window.ITDepartmentApi.gallery.editPhoto(photoId, { dataUrl, editMeta });
          if (res?.success && res.data) {
            addToast?.('Photo updated and saved successfully! Original version preserved.', 'success');
            const updatedPhoto = res.data;
            setPhotos(photos.map(p => p.id === photoId ? updatedPhoto : p));
            if (selectedPhoto && selectedPhoto.id === photoId) {
              setSelectedPhoto(updatedPhoto);
            }
            setMediaToEditPhoto(null);
          } else {
            throw new Error(res?.message || 'Failed to save edited photo');
          }
        }
      } catch (err) {
        addToast?.('Failed to save edited photo: ' + (err.message || 'Server error'), 'error');
      }
    };

    // Save Video Rotation (90° Left, 90° Right, 180°, 0°)
    const handleSaveVideoRotation = async (photoId, newRotation) => {
      try {
        if (window.ITDepartmentApi?.gallery?.rotateVideo) {
          const res = await window.ITDepartmentApi.gallery.rotateVideo(photoId, newRotation);
          if (res?.success && res.data) {
            addToast?.(`Video rotation set to ${res.data.rotation}° and saved successfully!`, 'success');
            const updatedMedia = res.data;
            setPhotos(photos.map(p => p.id === photoId ? updatedMedia : p));
            if (selectedPhoto && selectedPhoto.id === photoId) {
              setSelectedPhoto(updatedMedia);
            }
            setMediaToRotateVideo(null);
          } else {
            throw new Error(res?.message || 'Failed to rotate video');
          }
        }
      } catch (err) {
        addToast?.('Failed to rotate video: ' + (err.message || 'Server error'), 'error');
      }
    };

    // Download Media (Photo or Video)
    const handleDownload = (url, title, mediaType) => {
      try {
        const isVideo = mediaType === 'video' || (url && url.match(/\.(mp4|mov|avi|webm)($|\?)/i));
        const ext = isVideo ? 'mp4' : 'jpg';
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(title || 'gallery-media').replace(/[^a-zA-Z0-9_-]/g, '_')}.${ext}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast?.(`Downloading ${isVideo ? 'video' : 'photo'}...`, 'info');
      } catch (e) {
        window.open(url, '_blank');
      }
    };

    // Pagination Slicing
    const totalPages = Math.max(1, Math.ceil(photos.length / itemsPerPage));
    const paginatedPhotos = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return photos.slice(start, start + itemsPerPage);
    }, [photos, currentPage, itemsPerPage]);

    // Active Section Details
    const currentSectionInfo = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];
    const pendingCount = useMemo(() => {
      return photos.filter(p => (p.status || '').toLowerCase().includes('pending')).length;
    }, [photos]);
    const totalPendingCount = analytics?.pending ?? pendingCount;

    return h(
      'div',
      { className: 'space-y-6 animate-fade-in' },

      // =====================================================================
      // 1. TOP HEADER & HERO BANNER
      // =====================================================================
      h(
        'div',
        { className: 'relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/40' },
        h('div', { className: 'absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none' }),
        h('div', { className: 'absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none' }),

        h(
          'div',
          { className: 'relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6' },
          h(
            'div',
            { className: 'space-y-2' },
            h(
              'div',
              { className: 'flex items-center gap-2.5 flex-wrap' },
              h(
                'span',
                { className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' },
                renderIcon(Icons.Image, { className: 'w-3.5 h-3.5 text-cyan-400' }),
                'Visual Repository'
              ),
              canManageApprovals && totalPendingCount > 0 && h(
                'span',
                {
                  onClick: () => setStatusFilter(statusFilter === 'Pending Teacher Approval' ? 'all' : 'Pending Teacher Approval'),
                  className: `cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                    statusFilter === 'Pending Teacher Approval'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                      : 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                  }`
                },
                `⏳ ${totalPendingCount} Pending Teacher Approval`
              )
            ),
            h('h1', { className: 'text-2xl sm:text-4xl font-extrabold text-white tracking-tight' }, 'Department & Campus Gallery'),
            h('p', { className: 'text-xs sm:text-sm text-slate-400 max-w-2xl' }, currentSectionInfo.desc)
          ),

          // Actions Bar: Student Views, Stats Toggle, and Upload Button
          h(
            'div',
            { className: 'flex items-center gap-3 flex-wrap' },
            isStudent && h(
              'div',
              { className: 'flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800' },
              h(
                'button',
                {
                  onClick: () => setStudentTab('approved'),
                  className: `px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    studentTab === 'approved'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`
                },
                'Approved Gallery'
              ),
              h(
                'button',
                {
                  onClick: () => setStudentTab('my-uploads'),
                  className: `px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    studentTab === 'my-uploads'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`
                },
                'My Uploads'
              )
            ),
            (isHOD || isAdmin) && h(
              'button',
              {
                onClick: () => setShowAnalytics(!showAnalytics),
                className: `px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                  showAnalytics
                    ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
                }`
              },
              renderIcon(Icons.BarChart, { className: 'w-4 h-4' }),
              showAnalytics ? 'Hide Stats' : 'Analytics'
            ),
            h(
              'button',
              {
                onClick: () => setIsUploadOpen(true),
                className: 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              },
              renderIcon(Icons.Upload || Icons.Camera || Icons.Plus, { className: 'w-4 h-4' }),
              isStudent ? '+ Upload Photo / Video (For Approval)' : '+ Upload Photo / Video'
            )
          )
        )
      ),

      // =====================================================================
      // 2. ANALYTICS METRICS (HOD / ADMIN)
      // =====================================================================
      showAnalytics && analytics && h(
        'div',
        { className: 'grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in' },
        [
          { label: 'Total Photographs', value: analytics.totalPhotos || photos.length, icon: Icons.Image, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30' },
          { label: 'Approved & Live', value: analytics.approved || 0, icon: Icons.CheckCircle, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30' },
          { label: 'Pending Reviews', value: analytics.pending || 0, icon: Icons.AlertTriangle, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/10 border-amber-500/30' },
          { label: 'Community Interactions', value: `${analytics.totalLikes || 0} Likes • ${analytics.totalComments || 0} Comments`, icon: Icons.Heart, color: 'text-rose-400', bg: 'from-rose-500/20 to-pink-500/10 border-rose-500/30' }
        ].map((item, idx) =>
          h(
            'div',
            { key: idx, className: `p-4 rounded-2xl border bg-gradient-to-br ${item.bg} backdrop-blur-xl space-y-1` },
            h(
              'div',
              { className: 'flex items-center justify-between text-slate-400 text-xs font-semibold' },
              item.label,
              renderIcon(item.icon, { className: `w-4 h-4 ${item.color}` })
            ),
            h('div', { className: `text-xl sm:text-2xl font-black ${item.color}` }, item.value)
          )
        )
      ),

      // =====================================================================
      // 3. SECTION SELECTOR TABS (4 SEPARATE GALLERY SECTIONS)
      // =====================================================================
      h(
        'div',
        { className: 'grid grid-cols-2 lg:grid-cols-4 gap-3' },
        SECTIONS.map(sec => {
          const isActive = activeSection === sec.id;
          return h(
            'button',
            {
              key: sec.id,
              onClick: () => {
                setActiveSection(sec.id);
                setSearchQuery('');
                setStatusFilter('all');
              },
              className: `p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 ${
                isActive
                  ? 'bg-slate-900/90 border-cyan-500/60 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-700 text-slate-400'
              }`
            },
            h(
              'div',
              { className: 'flex items-center justify-between w-full' },
              h(
                'div',
                { className: `w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/80 text-slate-400'}` },
                renderIcon(sec.icon, { className: 'w-5 h-5' })
              ),
              isActive && h('span', { className: 'w-2 h-2 rounded-full bg-cyan-400 animate-pulse' })
            ),
            h(
              'div',
              null,
              h('h3', { className: `font-bold text-sm sm:text-base ${isActive ? 'text-white' : 'text-slate-300'}` }, sec.label),
              h('p', { className: 'text-[11px] text-slate-500 line-clamp-1 mt-0.5' }, sec.desc)
            )
          );
        })
      ),

      // =====================================================================
      // 4. FILTER CONTROLS & SEARCH BAR
      // =====================================================================
      h(
        'div',
        { className: 'p-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3' },
        
        // Search bar
        h(
          'div',
          { className: 'relative flex-1' },
          h('span', { className: 'absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500' },
            renderIcon(Icons.Search, { className: 'w-4 h-4' })
          ),
          h('input', {
            type: 'text',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: `Search photos by title, tags, or author in ${currentSectionInfo.label}...`,
            className: 'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition'
          }),
          searchQuery && h(
            'button',
            {
              onClick: () => setSearchQuery(''),
              className: 'absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white'
            },
            renderIcon(Icons.X, { className: 'w-4 h-4' })
          )
        ),

        // Contextual Section Filters
        h(
          'div',
          { className: 'flex items-center gap-2 flex-wrap' },

          // SECTION 1: Department Filter
          activeSection === 'department' && h(
            'select',
            {
              value: deptFilter,
              onChange: (e) => setDeptFilter(e.target.value),
              className: 'px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500'
            },
            DEPARTMENTS.map(d => h('option', { key: d, value: d }, d))
          ),

          // SECTION 2: Symposium Year Filter
          activeSection === 'symposium' && h(
            'select',
            {
              value: yearFilter,
              onChange: (e) => setYearFilter(e.target.value),
              className: 'px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500'
            },
            SYMPOSIUM_YEARS.map(y => h('option', { key: y, value: y }, y === 'All Years' ? 'All Symposium Years' : `Batch ${y}`))
          ),

          // SECTION 3: Event Category Filter
          activeSection === 'event' && h(
            'select',
            {
              value: eventCatFilter,
              onChange: (e) => setEventCatFilter(e.target.value),
              className: 'px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500'
            },
            EVENT_CATEGORIES.map(c => h('option', { key: c, value: c }, c === 'All' ? 'All Event Categories' : c))
          ),

          // SECTION 4: Placement Company Filter
          activeSection === 'placement' && h(
            'select',
            {
              value: companyFilter,
              onChange: (e) => setCompanyFilter(e.target.value),
              className: 'px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500'
            },
            PLACEMENT_COMPANIES.map(comp => h('option', { key: comp, value: comp }, comp === 'All Companies' ? 'All Recruiters' : comp))
          ),

          // Media Type Filter: Photos & Videos
          h(
            'select',
            {
              value: mediaTypeFilter,
              onChange: (e) => setMediaTypeFilter(e.target.value),
              className: 'px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500'
            },
            h('option', { value: 'all' }, 'All Media Types'),
            h('option', { value: 'photo' }, '📷 Photos Only'),
            h('option', { value: 'video' }, '🎥 Videos Only')
          ),

          // Status Filter for Staff / HOD / Admin
          canManageApprovals && h(
            'select',
            {
              value: statusFilter,
              onChange: (e) => setStatusFilter(e.target.value),
              className: 'px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500'
            },
            h('option', { value: 'all' }, 'Status: All'),
            h('option', { value: 'Approved' }, 'Status: Approved Only'),
            h('option', { value: 'Pending Teacher Approval' }, `Status: Pending (${totalPendingCount})`),
            h('option', { value: 'Rejected' }, 'Status: Rejected Only')
          ),

          // Refresh Button
          h(
            'button',
            {
              onClick: fetchPhotos,
              title: 'Refresh gallery',
              className: 'p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition'
            },
            renderIcon(Icons.RefreshCw, { className: `w-4 h-4 ${loading ? 'animate-spin' : ''}` })
          )
        )
      ),

      // =====================================================================
      // 5. PHOTO GRID / MASONRY LAYOUT
      // =====================================================================
      loading ? h(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' },
        [1, 2, 3, 4, 5, 6, 7, 8].map(i =>
          h(
            'div',
            { key: i, className: 'rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3 space-y-3 animate-pulse' },
            h('div', { className: 'aspect-video rounded-xl bg-slate-800/80' }),
            h('div', { className: 'h-4 bg-slate-800/80 rounded w-3/4' }),
            h('div', { className: 'h-3 bg-slate-800/60 rounded w-1/2' })
          )
        )
      ) : paginatedPhotos.length === 0 ? h(
        'div',
        { className: 'p-16 text-center rounded-3xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl space-y-4' },
        h(
          'div',
          { className: 'w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center' },
          renderIcon(Icons.Image || Icons.Folder, { className: 'w-8 h-8' })
        ),
        h('h3', { className: 'text-xl font-bold text-white' }, 'Gallery is Currently Empty'),
        h('p', { className: 'text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed' },
          'No photos or videos uploaded yet in this category. Students and faculty can upload media using the "+ Upload Photo / Video" button.'
        ),
        h(
          'div',
          { className: 'flex items-center justify-center gap-3 pt-2' },
          h(
            'button',
            {
              onClick: () => setIsUploadOpen(true),
              className: 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer'
            },
            isStudent ? '+ Upload Photo / Video (For Approval)' : '+ Upload Photo / Video'
          ),
          (searchQuery || statusFilter !== 'all' || mediaTypeFilter !== 'all') && h(
            'button',
            {
              onClick: () => {
                setSearchQuery('');
                setDeptFilter('All Departments');
                setYearFilter('All Years');
                setEventCatFilter('All');
                setCompanyFilter('All Companies');
                setStatusFilter('all');
                setMediaTypeFilter('all');
              },
              className: 'px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition'
            },
            'Reset Filters'
          )
        )
      ) : h(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
        paginatedPhotos.map(photo => {
          const uId = currentUser?.id || currentUser?.rollNo || 'ANON';
          const isLiked = (photo.likedBy || []).includes(uId);
          const pStatus = (photo.status || 'Approved').toLowerCase();
          const isPending = pStatus.includes('pending');
          const isRejected = pStatus === 'rejected';
          const canDelete = isAdmin || isHOD || isTeacher || (isStudent && photo.uploadedBy?.id === uId);
          const canEdit = isAdmin;
          const canEditMedia = isAdmin || isHOD || isTeacher || (isStudent && (photo.uploadedBy?.id === uId || !photo.uploadedBy?.id));
          const isVideo = photo.mediaType === 'video' || (photo.url && photo.url.match(/\.(mp4|mov|avi|webm)($|\?)/i)) || (photo.mimeType && photo.mimeType.startsWith('video/'));

          return h(
            'div',
            {
              key: photo.id,
              className: 'group relative rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col justify-between'
            },

            // Media Container (Photo or Video with Play Overlay)
            h(
              'div',
              {
                className: 'relative aspect-[4/3] overflow-hidden bg-slate-950 cursor-pointer',
                onClick: () => setSelectedPhoto(photo)
              },
              isVideo
                ? h(
                    'div',
                    { className: 'relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden' },
                    h('video', {
                      src: photo.url ? `${photo.url}#t=0.5` : '',
                      preload: 'metadata',
                      muted: true,
                      playsInline: true,
                      style: photo.rotation ? {
                        transform: `rotate(${photo.rotation}deg) scale(${photo.rotation % 180 !== 0 ? 0.75 : 1})`,
                        transition: 'transform 0.3s ease'
                      } : undefined,
                      className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none',
                      onError: (e) => { e.target.style.display = 'none'; }
                    }),
                    // Play Button Overlay for Video
                    h(
                      'div',
                      { className: 'absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all' },
                      h(
                        'div',
                        {
                          className: 'w-14 h-14 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/40 group-hover:scale-110 transition-transform pl-1'
                        },
                        h('span', { className: 'text-2xl font-black' }, '▶')
                      )
                    )
                  )
                : h('img', {
                    src: photo.url,
                    alt: photo.title,
                    loading: 'lazy',
                    className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500',
                    onError: (e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80';
                    }
                  }),
              h('div', { className: 'absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none' }),

              // Status & Type Badges
              h(
                'div',
                { className: 'absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10' },
                isVideo
                  ? h('span', { className: 'px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md flex items-center gap-1' }, '▶ VIDEO')
                  : h('span', { className: 'px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-cyan-600 text-white shadow-md flex items-center gap-1' }, '📷 PHOTO'),
                isPending && h(
                  'span',
                  { className: 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md backdrop-blur-md flex items-center gap-1' },
                  '⏳ Pending Teacher Approval'
                ),
                isRejected && h(
                  'span',
                  { className: 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white shadow-md' },
                  'Rejected'
                ),
                photo.category && h(
                  'span',
                  { className: 'px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md' },
                  photo.category
                )
              ),

              // Quick Hover Action Buttons
              h(
                'div',
                { className: 'absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10' },
                // Media Edit Quick Button
                canEditMedia && h(
                  'button',
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      if (isVideo) {
                        setMediaToRotateVideo(photo);
                      } else {
                        setMediaToEditPhoto(photo);
                      }
                    },
                    title: isVideo ? 'Rotate Video (90° Left, 90° Right, 180°)' : 'Edit Photo (Crop, Rotate, Filters, Sharpness, Resize)',
                    className: 'p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 backdrop-blur-md transition cursor-pointer'
                  },
                  renderIcon(isVideo ? Icons.RefreshCw : (Icons.Sliders || Icons.Edit), { className: 'w-3.5 h-3.5' })
                ),
                h(
                  'button',
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      handleDownload(photo.url, photo.title, photo.mediaType);
                    },
                    title: `Download ${isVideo ? 'video' : 'photo'}`,
                    className: 'p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md transition cursor-pointer'
                  },
                  renderIcon(Icons.Download, { className: 'w-3.5 h-3.5' })
                ),
                canEdit && h(
                  'button',
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setPhotoToEdit(photo);
                    },
                    title: 'Edit metadata',
                    className: 'p-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 backdrop-blur-md transition cursor-pointer'
                  },
                  renderIcon(Icons.Edit || Icons.FileText, { className: 'w-3.5 h-3.5' })
                ),
                canDelete && h(
                  'button',
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setPhotoToDelete(photo);
                    },
                    title: 'Delete media',
                    className: 'p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 backdrop-blur-md transition cursor-pointer'
                  },
                  renderIcon(Icons.Trash, { className: 'w-3.5 h-3.5' })
                )
              )
            ),

            // Card Body: Details on Each Card (Title, Uploaded By, Department, Category, Upload Date)
            h(
              'div',
              { className: 'p-4 space-y-3 flex-1 flex flex-col justify-between' },
              h(
                'div',
                { className: 'space-y-1.5' },
                // 1. Title
                h(
                  'h4',
                  {
                    onClick: () => setSelectedPhoto(photo),
                    className: 'font-bold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer flex items-center gap-1.5'
                  },
                  isVideo && h('span', { className: 'text-rose-400 text-xs' }, '▶'),
                  photo.title
                ),
                // 2. Department & 3. Category Tags
                h(
                  'div',
                  { className: 'flex items-center gap-1.5 flex-wrap text-[11px]' },
                  h('span', { className: 'px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-medium' },
                    photo.department || 'Information Technology'
                  ),
                  h('span', { className: 'px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium' },
                    photo.category || 'General'
                  )
                ),
                // Description (if available)
                photo.description && h('p', { className: 'text-xs text-slate-400 line-clamp-2 leading-relaxed pt-0.5' }, photo.description)
              ),

              // Metadata & Interactions Footer
              h(
                'div',
                { className: 'pt-3 border-t border-slate-800/80 flex flex-col gap-2 text-xs text-slate-400' },
                
                // 4. Uploaded By & 5. Upload Date
                h(
                  'div',
                  { className: 'flex items-center justify-between text-[11px] text-slate-400' },
                  h(
                    'div',
                    { className: 'flex items-center gap-1.5 truncate max-w-[150px]' },
                    h('div', { className: 'w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-[8px] flex items-center justify-center flex-shrink-0' },
                      photo.uploadedBy?.name ? photo.uploadedBy.name.charAt(0) : 'U'
                    ),
                    h('span', { className: 'truncate text-slate-300' }, `By: ${photo.uploadedBy?.name || 'Anonymous'}`)
                  ),
                  h('span', { className: 'text-slate-500 font-mono text-[10px]' }, photo.date || 'Recent')
                ),

                // Download Button & Social Actions
                h(
                  'div',
                  { className: 'flex items-center justify-between pt-1' },
                  h(
                    'button',
                    {
                      onClick: () => handleDownload(photo.url, photo.title, photo.mediaType),
                      className: 'px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer'
                    },
                    renderIcon(Icons.Download, { className: 'w-3 h-3 text-cyan-400' }),
                    isVideo ? 'Download Video' : 'Download Photo'
                  ),
                  h(
                    'div',
                    { className: 'flex items-center gap-2.5' },
                    h(
                      'button',
                      {
                        onClick: () => handleToggleLike(photo),
                        className: `flex items-center gap-1 font-semibold text-xs transition ${
                          isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
                        }`
                      },
                      renderIcon(Icons.Heart, { className: `w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}` }),
                      photo.likes || 0
                    ),
                    h(
                      'button',
                      {
                        onClick: () => setSelectedPhoto(photo),
                        className: 'flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition text-xs font-semibold'
                      },
                      renderIcon(Icons.MessageCircle, { className: 'w-3.5 h-3.5' }),
                      (photo.comments || []).length
                    )
                  )
                )
              ),

              // Quick Staff / HOD Approval Bar (if pending)
              canManageApprovals && isPending && h(
                'div',
                { className: 'pt-2 flex items-center gap-2' },
                h(
                  'button',
                  {
                    onClick: () => handleStatusUpdate(photo.id, 'Approved'),
                    className: 'flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition flex items-center justify-center gap-1'
                  },
                  renderIcon(Icons.CheckCircle, { className: 'w-3 h-3' }),
                  'Approve'
                ),
                h(
                  'button',
                  {
                    onClick: () => handleStatusUpdate(photo.id, 'Rejected'),
                    className: 'py-1.5 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition flex items-center justify-center gap-1'
                  },
                  renderIcon(Icons.X, { className: 'w-3 h-3' }),
                  'Reject'
                )
              ),
              canManageApprovals && isRejected && h(
                'div',
                { className: 'pt-2 flex items-center gap-2' },
                h(
                  'button',
                  {
                    onClick: () => handleStatusUpdate(photo.id, 'Approved'),
                    className: 'w-full py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-[11px] font-bold transition flex items-center justify-center gap-1'
                  },
                  renderIcon(Icons.RefreshCw, { className: 'w-3 h-3' }),
                  'Restore & Approve'
                )
              )
            )
          );
        })
      ),

      // =====================================================================
      // 6. PAGINATION CONTROLS
      // =====================================================================
      photos.length > itemsPerPage && h(
        'div',
        { className: 'p-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl flex items-center justify-between text-xs text-slate-400' },
        h(
          'span',
          null,
          `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, photos.length)} of ${photos.length} photos`
        ),
        h(
          'div',
          { className: 'flex items-center gap-1.5' },
          h(
            'button',
            {
              disabled: currentPage === 1,
              onClick: () => setCurrentPage(p => Math.max(1, p - 1)),
              className: 'px-3 py-1.5 rounded-xl border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-white font-bold transition'
            },
            'Previous'
          ),
          Array.from({ length: totalPages }, (_, i) => i + 1).map(page =>
            h(
              'button',
              {
                key: page,
                onClick: () => setCurrentPage(page),
                className: `w-8 h-8 rounded-xl font-bold transition ${
                  currentPage === page
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'hover:bg-slate-800 text-slate-300'
                }`
              },
              page
            )
          ),
          h(
            'button',
            {
              disabled: currentPage === totalPages,
              onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
              className: 'px-3 py-1.5 rounded-xl border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-white font-bold transition'
            },
            'Next'
          )
        )
      ),

      // =====================================================================
      // 7. LIGHTBOX & COMMENTS MODAL
      // =====================================================================
      selectedPhoto && h(LightboxModal, {
        photo: selectedPhoto,
        onClose: () => setSelectedPhoto(null),
        onToggleLike: () => handleToggleLike(selectedPhoto),
        onAddComment: (text) => handleAddComment(selectedPhoto.id, text),
        onDownload: () => handleDownload(selectedPhoto.url, selectedPhoto.title),
        onStatusUpdate: (status) => handleStatusUpdate(selectedPhoto.id, status),
        onEdit: () => {
          setPhotoToEdit(selectedPhoto);
        },
        onDelete: () => {
          setPhotoToDelete(selectedPhoto);
        },
        onEditPhoto: (p) => {
          setMediaToEditPhoto(p || selectedPhoto);
        },
        onRotateVideo: (p) => {
          setMediaToRotateVideo(p || selectedPhoto);
        },
        canManageApprovals,
        isAdmin,
        currentUser,
        onNavigateNext: () => {
          const idx = photos.findIndex(p => p.id === selectedPhoto.id);
          if (idx > -1 && idx < photos.length - 1) setSelectedPhoto(photos[idx + 1]);
        },
        onNavigatePrev: () => {
          const idx = photos.findIndex(p => p.id === selectedPhoto.id);
          if (idx > 0) setSelectedPhoto(photos[idx - 1]);
        }
      }),

      // =====================================================================
      // 8. UPLOAD PHOTO MODAL
      // =====================================================================
      isUploadOpen && h(UploadPhotoModal, {
        activeSection,
        role,
        currentUser,
        onClose: () => setIsUploadOpen(false),
        onUploaded: () => {
          setIsUploadOpen(false);
          fetchPhotos();
          loadAnalytics();
        }
      }),

      // =====================================================================
      // 8B. EDIT PHOTO MODAL (ADMIN METADATA)
      // =====================================================================
      photoToEdit && h(EditPhotoModal, {
        photo: photoToEdit,
        onClose: () => setPhotoToEdit(null),
        onUpdated: (updatedPhoto) => {
          setPhotoToEdit(null);
          fetchPhotos();
          loadAnalytics();
          if (selectedPhoto && selectedPhoto.id === updatedPhoto.id) {
            setSelectedPhoto(updatedPhoto);
          }
        }
      }),

      // =====================================================================
      // 8C. PHOTO EDITOR MODAL (CROP, ROTATE, FLIP, FILTERS, SHARPNESS, RESIZE)
      // =====================================================================
      mediaToEditPhoto && h(PhotoEditorModal, {
        photo: mediaToEditPhoto,
        imageUrl: mediaToEditPhoto.url,
        title: mediaToEditPhoto.title,
        onClose: () => setMediaToEditPhoto(null),
        onSave: (blob, dataUrl, editMeta) => {
          handleSavePhotoEdit(mediaToEditPhoto.id, blob, dataUrl, editMeta);
        }
      }),

      // =====================================================================
      // 8D. ROTATE VIDEO MODAL (90° LEFT, 90° RIGHT, 180°, RESET 0°)
      // =====================================================================
      mediaToRotateVideo && h(RotateVideoModal, {
        videoUrl: mediaToRotateVideo.url,
        currentRotation: mediaToRotateVideo.rotation || 0,
        title: mediaToRotateVideo.title,
        onClose: () => setMediaToRotateVideo(null),
        onSave: (newRotation) => {
          handleSaveVideoRotation(mediaToRotateVideo.id, newRotation);
        }
      }),

      // =====================================================================
      // 9. DELETE CONFIRMATION DIALOG
      // =====================================================================
      photoToDelete && h(
        'div',
        { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in' },
        h(
          'div',
          { className: 'w-full max-w-md rounded-2xl border border-rose-500/40 bg-slate-950 p-6 shadow-2xl space-y-4' },
          h(
            'div',
            { className: 'w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center' },
            renderIcon(Icons.Trash, { className: 'w-6 h-6' })
          ),
          h(
            'div',
            { className: 'space-y-1' },
            h('h3', { className: 'text-lg font-bold text-white' }, 'Delete Photograph?'),
            h('p', { className: 'text-xs text-slate-400' }, `Are you sure you want to permanently remove "${photoToDelete.title}" from the gallery? This action cannot be undone.`)
          ),
          h(
            'div',
            { className: 'flex items-center justify-end gap-3 pt-2' },
            h(
              'button',
              {
                onClick: () => setPhotoToDelete(null),
                className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition'
              },
              'Cancel'
            ),
            h(
              'button',
              {
                onClick: handleConfirmDelete,
                className: 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition'
              },
              'Confirm Delete'
            )
          )
        )
      )
    );
  };

  // =========================================================================
  // RESPONSIVE HTML5 VIDEO PLAYER COMPONENT
  // Includes: Play/Pause, Progress Bar, Volume, Fullscreen, PiP, Playback Speed,
  // Direct Streaming, and Error Notification for Missing/Corrupted Media
  // =========================================================================
  const ResponsiveVideoPlayer = ({ url, title, rotation: initialRotation = 0, onRotateChange }) => {
    const videoRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const hideTimerRef = React.useRef(null);

    const [currentRotation, setCurrentRotation] = useState(initialRotation || 0);

    React.useEffect(() => {
      setCurrentRotation(initialRotation || 0);
    }, [initialRotation]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPiP, setIsPiP] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showControls, setShowControls] = useState(true);

    // Sanitize URL for direct streaming from uploads folder
    let videoSrc = url || '';
    if (videoSrc && !videoSrc.startsWith('http://') && !videoSrc.startsWith('https://') && !videoSrc.startsWith('/')) {
      videoSrc = '/' + videoSrc;
    }
    videoSrc = videoSrc.replace(/\\/g, '/');

    const formatTime = (secs) => {
      if (isNaN(secs) || secs === Infinity || secs < 0) return '0:00';
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = Math.floor(secs % 60);
      if (h > 0) {
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
      }
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const resetControlsTimer = () => {
      setShowControls(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (isPlaying) {
        hideTimerRef.current = setTimeout(() => setShowControls(false), 3500);
      }
    };

    React.useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      };
    }, []);

    const togglePlay = (e) => {
      if (e) e.stopPropagation();
      if (!videoRef.current) return;
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play().catch(err => {
          console.warn('Play interrupted:', err);
        });
      } else {
        videoRef.current.pause();
      }
      resetControlsTimer();
    };

    const handleSeek = (e) => {
      const targetTime = parseFloat(e.target.value);
      setCurrentTime(targetTime);
      if (videoRef.current) {
        videoRef.current.currentTime = targetTime;
      }
      resetControlsTimer();
    };

    const handleVolume = (e) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      setIsMuted(val === 0);
      if (videoRef.current) {
        videoRef.current.volume = val;
        videoRef.current.muted = val === 0;
      }
      resetControlsTimer();
    };

    const toggleMute = (e) => {
      if (e) e.stopPropagation();
      if (!videoRef.current) return;
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      videoRef.current.muted = nextMute;
      if (!nextMute && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
      resetControlsTimer();
    };

    const SPEED_LIST = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const cycleSpeed = (e) => {
      if (e) e.stopPropagation();
      const currentIdx = SPEED_LIST.indexOf(playbackRate);
      const nextIdx = (currentIdx + 1) % SPEED_LIST.length;
      const nextSpeed = SPEED_LIST[nextIdx];
      setPlaybackRate(nextSpeed);
      if (videoRef.current) {
        videoRef.current.playbackRate = nextSpeed;
      }
      resetControlsTimer();
    };

    const togglePiP = async (e) => {
      if (e) e.stopPropagation();
      if (!videoRef.current) return;
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          setIsPiP(false);
        } else if (document.pictureInPictureEnabled) {
          await videoRef.current.requestPictureInPicture();
          setIsPiP(true);
        }
      } catch (err) {
        console.warn('PiP error:', err);
      }
      resetControlsTimer();
    };

    const toggleFullscreen = (e) => {
      if (e) e.stopPropagation();
      if (!containerRef.current) return;
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.warn('Fullscreen error:', err);
        });
      } else {
        document.exitFullscreen().catch(err => {
          console.warn('Exit fullscreen error:', err);
        });
      }
      resetControlsTimer();
    };

    const handleRetry = (e) => {
      if (e) e.stopPropagation();
      setHasError(false);
      setErrorMessage('');
      setIsBuffering(true);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(err => console.warn(err));
      }
    };

    const isPiPSupported = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document;

    return h(
      'div',
      {
        ref: containerRef,
        onMouseMove: resetControlsTimer,
        onClick: resetControlsTimer,
        className: 'relative w-full h-full max-h-[85vh] bg-black rounded-2xl overflow-hidden flex items-center justify-center select-none group'
      },

      // HTML5 Video Element (Streams directly from uploads without download)
      h('video', {
        ref: videoRef,
        src: videoSrc,
        playsInline: true,
        autoPlay: true,
        preload: 'metadata',
        onClick: togglePlay,
        onTimeUpdate: () => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        },
        onLoadedMetadata: () => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.playbackRate = playbackRate;
            videoRef.current.volume = isMuted ? 0 : volume;
          }
        },
        onPlay: () => {
          setIsPlaying(true);
          resetControlsTimer();
        },
        onPause: () => {
          setIsPlaying(false);
          setShowControls(true);
        },
        onEnded: () => {
          setIsPlaying(false);
          setShowControls(true);
        },
        onWaiting: () => setIsBuffering(true),
        onPlaying: () => setIsBuffering(false),
        onError: () => {
          setIsBuffering(false);
          setHasError(true);
          const err = videoRef.current?.error;
          let msg = 'The video file is missing or corrupted and cannot be played.';
          if (err) {
            if (err.code === 1) msg = 'Video playback was aborted.';
            else if (err.code === 2) msg = 'Network error while streaming video from server.';
            else if (err.code === 3) msg = 'Video decoding failed. The video file may be corrupted.';
            else if (err.code === 4) msg = 'Video format not supported or file missing on server.';
          }
          setErrorMessage(msg);
        },
        style: currentRotation ? {
          transform: `rotate(${currentRotation}deg) scale(${currentRotation % 180 !== 0 ? 0.75 : 1})`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        } : undefined,
        className: 'w-full h-full object-contain cursor-pointer'
      }),

      // Center Buffering Spinner
      isBuffering && !hasError && h(
        'div',
        { className: 'absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10 animate-fade-in' },
        h('div', { className: 'w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin' })
      ),

      // Center Big Play Button (when paused and not buffering)
      !isPlaying && !isBuffering && !hasError && h(
        'div',
        {
          onClick: togglePlay,
          className: 'absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all cursor-pointer z-10'
        },
        h(
          'div',
          { className: 'w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-110 transition-transform pl-1' },
          h('span', { className: 'text-2xl sm:text-3xl font-black' }, '▶')
        )
      ),

      // Error Display Overlay (Shown ONLY if video file is missing or corrupted - Requirement 10)
      hasError && h(
        'div',
        { className: 'absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/95 text-center space-y-3 animate-fade-in' },
        h('div', { className: 'w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-2xl mb-1' }, '⚠️'),
        h('h3', { className: 'text-base font-bold text-white' }, 'Video Playback Error'),
        h('p', { className: 'text-xs text-slate-300 max-w-md leading-relaxed' }, errorMessage || 'The video file is missing or corrupted and cannot be played.'),
        h('p', { className: 'text-[11px] text-slate-500 font-mono' }, 'Supported video formats: MP4, WEBM, MOV'),
        h(
          'button',
          {
            type: 'button',
            onClick: handleRetry,
            className: 'px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5'
          },
          '🔄 Retry Video Playback'
        )
      ),

      // Responsive HTML5 Controls Bar (Bottom Overlay)
      !hasError && h(
        'div',
        {
          className: `absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pt-10 pb-3 transition-opacity duration-300 z-20 flex flex-col gap-2 ${
            showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`
        },
        // Progress Bar / Timeline Scrubber
        h(
          'div',
          { className: 'flex items-center gap-2' },
          h('input', {
            type: 'range',
            min: 0,
            max: duration > 0 ? duration : 100,
            step: 0.1,
            value: currentTime,
            onChange: handleSeek,
            className: 'w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2 transition-all'
          })
        ),

        // Controls Row
        h(
          'div',
          { className: 'flex items-center justify-between text-white text-xs' },

          // Left Controls: Play/Pause, Volume, Time Display
          h(
            'div',
            { className: 'flex items-center gap-3' },
            h(
              'button',
              {
                type: 'button',
                onClick: togglePlay,
                title: isPlaying ? 'Pause (Space)' : 'Play (Space)',
                className: 'p-1.5 rounded-lg hover:bg-white/10 text-white transition cursor-pointer text-sm font-bold flex items-center justify-center'
              },
              isPlaying ? '⏸' : '▶'
            ),

            // Volume Control
            h(
              'div',
              { className: 'flex items-center gap-1.5' },
              h(
                'button',
                {
                  type: 'button',
                  onClick: toggleMute,
                  title: isMuted ? 'Unmute' : 'Mute',
                  className: 'p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer'
                },
                isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'
              ),
              h('input', {
                type: 'range',
                min: 0,
                max: 1,
                step: 0.05,
                value: isMuted ? 0 : volume,
                onChange: handleVolume,
                className: 'w-16 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400'
              })
            ),

            // Time Display
            h(
              'span',
              { className: 'text-[11px] font-mono text-slate-300 tracking-wider' },
              `${formatTime(currentTime)} / ${formatTime(duration)}`
            )
          ),

          // Right Controls: Playback Speed, Picture-in-Picture, Full Screen
          h(
            'div',
            { className: 'flex items-center gap-2' },
            // Playback Speed Button
            h(
              'button',
              {
                type: 'button',
                onClick: cycleSpeed,
                title: 'Playback Speed',
                className: 'px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-cyan-300 font-mono text-[11px] font-bold transition cursor-pointer'
              },
              `${playbackRate}x`
            ),

            // Picture-in-Picture Button (if supported)
            isPiPSupported && h(
              'button',
              {
                type: 'button',
                onClick: togglePiP,
                title: isPiP ? 'Exit Picture-in-Picture' : 'Picture-in-Picture',
                className: `p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer ${isPiP ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`
              },
              '📺'
            ),

            // Quick Video Rotate Button
            h(
              'button',
              {
                type: 'button',
                onClick: (e) => {
                  e.stopPropagation();
                  const nextRot = (currentRotation + 90) % 360;
                  setCurrentRotation(nextRot);
                  if (onRotateChange) onRotateChange(nextRot);
                },
                title: `Rotate Video (Current: ${currentRotation}°)`,
                className: 'px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-purple-300 font-mono text-[11px] font-bold transition cursor-pointer flex items-center gap-1'
              },
              '🔄',
              `${currentRotation}°`
            ),

            // Fullscreen Button
            h(
              'button',
              {
                type: 'button',
                onClick: toggleFullscreen,
                title: isFullscreen ? 'Exit Full Screen' : 'Full Screen',
                className: 'p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer text-sm'
              },
              isFullscreen ? '⤓' : '⤢'
            )
          )
        )
      )
    );
  };

  // =========================================================================
  // LIGHTBOX MODAL COMPONENT
  // =========================================================================
  const LightboxModal = ({
    photo,
    onClose,
    onToggleLike,
    onAddComment,
    onDownload,
    onStatusUpdate,
    onEdit,
    onDelete,
    onEditPhoto,
    onRotateVideo,
    canManageApprovals,
    isAdmin,
    currentUser,
    onNavigateNext,
    onNavigatePrev
  }) => {
    const [commentText, setCommentText] = useState('');
    const uId = currentUser?.id || currentUser?.rollNo || 'ANON';
    const isLiked = (photo.likedBy || []).includes(uId);
    const pStatus = (photo.status || 'Approved').toLowerCase();
    const isPending = pStatus.includes('pending');
    const isRejected = pStatus === 'rejected';
    const canEditMedia = isAdmin || canManageApprovals || (photo.uploadedBy?.id === uId || !photo.uploadedBy?.id);
    const isVideo = photo.mediaType === 'video' || (photo.url && photo.url.match(/\.(mp4|mov|avi|webm)($|\?)/i)) || (photo.mimeType && photo.mimeType.startsWith('video/'));

    const handleCommentSubmit = (e) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      onAddComment(commentText);
      setCommentText('');
    };

    return h(
      'div',
      { className: 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in' },
      h(
        'div',
        { className: 'relative w-full max-w-6xl max-h-[95vh] rounded-3xl border border-slate-800/80 bg-slate-950 shadow-2xl flex flex-col lg:flex-row overflow-hidden' },

        // Close Button
        h(
          'button',
          {
            onClick: onClose,
            className: 'absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-slate-700 backdrop-blur-md transition cursor-pointer'
          },
          renderIcon(Icons.X, { className: 'w-5 h-5' })
        ),

        // Left Side: Full Resolution Image or Built-in Responsive Video Player & Slideshow Nav
        h(
          'div',
          { className: 'relative flex-1 bg-black flex items-center justify-center min-h-[350px] lg:min-h-[550px] overflow-hidden p-2' },
          isVideo
            ? h(ResponsiveVideoPlayer, {
                url: photo.url,
                title: photo.title,
                rotation: photo.rotation || 0,
                onRotateChange: (newRot) => onRotateVideo?.({ ...photo, rotation: newRot })
              })
            : h('img', {
                src: photo.url,
                alt: photo.title,
                className: 'max-w-full max-h-[85vh] object-contain select-none'
              }),

          // Previous / Next Buttons
          h(
            'button',
            {
              onClick: onNavigatePrev,
              className: 'absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-slate-800 backdrop-blur-md transition'
            },
            renderIcon(Icons.ChevronRight ? () => h(Icons.ChevronRight, { className: 'w-5 h-5 rotate-180' }) : Icons.ArrowRight, { className: 'w-5 h-5' })
          ),
          h(
            'button',
            {
              onClick: onNavigateNext,
              className: 'absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-slate-800 backdrop-blur-md transition'
            },
            renderIcon(Icons.ChevronRight || Icons.ArrowRight, { className: 'w-5 h-5' })
          )
        ),

        // Right Side: Details & Interactive Comments Stream
        h(
          'div',
          { className: 'w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-slate-950 flex flex-col justify-between max-h-[50vh] lg:max-h-[90vh]' },

          // Header & Info
          h(
            'div',
            { className: 'p-5 border-b border-slate-800/80 space-y-3 overflow-y-auto' },
            h(
              'div',
              { className: 'flex items-center gap-2 flex-wrap' },
              h('span', { className: 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' }, photo.section),
              photo.category && h('span', { className: 'px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300' }, photo.category),
              isPending && h('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40' }, 'Under Review'),
              isRejected && h('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40' }, 'Rejected')
            ),
            h('h2', { className: 'text-lg font-bold text-white' }, photo.title),
            h('p', { className: 'text-xs text-slate-400 leading-relaxed' }, photo.description || 'No description available.'),

            // Author & Date
            h(
              'div',
              { className: 'flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-900' },
              h('span', null, `By: ${photo.uploadedBy?.name || 'Anonymous'} (${photo.uploadedBy?.role || 'user'})`),
              h('span', null, photo.date || 'Recent')
            ),

            // Lightbox Action Buttons
            h(
              'div',
              { className: 'flex items-center gap-2 pt-2' },
              h(
                'button',
                {
                  onClick: onToggleLike,
                  className: `flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    isLiked
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`
                },
                renderIcon(Icons.Heart, { className: `w-4 h-4 ${isLiked ? 'fill-current text-rose-500' : ''}` }),
                `${photo.likes || 0} Likes`
              ),
              canEditMedia && !isVideo && h(
                'button',
                {
                  onClick: () => onEditPhoto?.(photo),
                  title: 'Edit Photo (Crop, Rotate, Flip, Brightness, Contrast, Saturation, Sharpness, Resize)',
                  className: 'px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer'
                },
                renderIcon(Icons.Sliders || Icons.Edit, { className: 'w-4 h-4' }),
                'Edit Photo'
              ),
              canEditMedia && isVideo && h(
                'button',
                {
                  onClick: () => onRotateVideo?.(photo),
                  title: 'Rotate Video (90° Left, 90° Right, 180°)',
                  className: 'px-3 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer'
                },
                renderIcon(Icons.RefreshCw, { className: 'w-4 h-4' }),
                'Rotate Video'
              ),
              h(
                'button',
                {
                  onClick: onDownload,
                  className: 'p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition'
                },
                renderIcon(Icons.Download, { className: 'w-4 h-4' })
              ),
              isAdmin && h(
                'button',
                {
                  onClick: onEdit,
                  title: 'Edit metadata',
                  className: 'p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 transition'
                },
                renderIcon(Icons.Edit || Icons.FileText, { className: 'w-4 h-4' })
              ),
              (isAdmin || canManageApprovals) && h(
                'button',
                {
                  onClick: onDelete,
                  className: 'p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition'
                },
                renderIcon(Icons.Trash, { className: 'w-4 h-4' })
              )
            ),

            // Approvals Bar
            canManageApprovals && isPending && h(
              'div',
              { className: 'pt-2 flex items-center gap-2' },
              h(
                'button',
                {
                  onClick: () => onStatusUpdate('Approved'),
                  className: 'flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5'
                },
                renderIcon(Icons.CheckCircle, { className: 'w-4 h-4' }),
                'Approve & Publish'
              ),
              h(
                'button',
                {
                  onClick: () => onStatusUpdate('Rejected'),
                  className: 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5'
                },
                renderIcon(Icons.X, { className: 'w-4 h-4' }),
                'Reject'
              )
            ),
            canManageApprovals && isRejected && h(
              'div',
              { className: 'pt-2 flex items-center gap-2' },
              h(
                'button',
                {
                  onClick: () => onStatusUpdate('Approved'),
                  className: 'w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white font-bold text-xs transition flex items-center justify-center gap-1.5'
                },
                renderIcon(Icons.RefreshCw, { className: 'w-4 h-4' }),
                'Restore & Publish to Gallery'
              )
            )
          ),

          // Comments List
          h(
            'div',
            { className: 'flex-1 p-5 overflow-y-auto space-y-3' },
            h('h4', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, `Comments (${(photo.comments || []).length})`),
            (photo.comments || []).length === 0 ? h(
              'p',
              { className: 'text-xs text-slate-500 italic text-center py-6' },
              'No comments yet. Be the first to share your thoughts!'
            ) : (photo.comments || []).map(cmt =>
              h(
                'div',
                { key: cmt.id, className: 'p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1 text-xs' },
                h(
                  'div',
                  { className: 'flex items-center justify-between text-[11px]' },
                  h('span', { className: 'font-bold text-cyan-400' }, cmt.userName),
                  h('span', { className: 'text-slate-500 text-[10px]' }, cmt.timestamp || 'Recent')
                ),
                h('p', { className: 'text-slate-300 leading-relaxed' }, cmt.text)
              )
            )
          ),

          // Comment Input Form
          h(
            'form',
            { onSubmit: handleCommentSubmit, className: 'p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center gap-2' },
            h('input', {
              type: 'text',
              value: commentText,
              onChange: (e) => setCommentText(e.target.value),
              placeholder: 'Write a comment...',
              className: 'flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500'
            }),
            h(
              'button',
              {
                type: 'submit',
                disabled: !commentText.trim(),
                className: 'px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition'
              },
              'Post'
            )
          )
        )
      )
    );
  };

  // =========================================================================
  // PHOTO EDITOR MODAL COMPONENT (PREMIUM MEDIA STUDIO)
  // Features:
  // 1. Crop (Free, 1:1, 4:3, 16:9, Zoom, Pan X & Y)
  // 2. Rotate Left (-90°) & Rotate Right (+90°)
  // 3. Flip Horizontal & Flip Vertical
  // 4. Brightness (-100 to 100)
  // 5. Contrast (-100 to 100)
  // 6. Saturation (-100 to 100)
  // 7. Sharpness (0 to 100 via real-time 3x3 convolution unsharp mask)
  // 8. Resize (Width, Height, Lock Aspect Ratio, Quick Presets)
  // Live Canvas Preview, Save Changes & Cancel, Preserves Original
  // =========================================================================
  const PhotoEditorModal = ({ photo, imageUrl, title, onClose, onSave }) => {
    const { addToast } = useAuth();
    const canvasRef = React.useRef(null);
    const imageRef = React.useRef(null);

    const initialSrc = imageUrl || photo?.url || '';

    // Transform State
    const [aspectPreset, setAspectPreset] = useState('free'); // free, 1:1, 4:3, 16:9
    const [zoom, setZoom] = useState(1); // 1 to 2.5
    const [panX, setPanX] = useState(0); // -100 to 100
    const [panY, setPanY] = useState(0); // -100 to 100
    const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);

    // Color/Filter State
    const [brightness, setBrightness] = useState(0); // -100 to 100
    const [contrast, setContrast] = useState(0); // -100 to 100
    const [saturation, setSaturation] = useState(0); // -100 to 100
    const [sharpness, setSharpness] = useState(0); // 0 to 100

    // Resize State
    const [origDimensions, setOrigDimensions] = useState({ width: 800, height: 600 });
    const [targetWidth, setTargetWidth] = useState(800);
    const [targetHeight, setTargetHeight] = useState(600);
    const [lockAspect, setLockAspect] = useState(true);

    // Active tool tab: 'crop', 'orient', 'filters', 'resize'
    const [activeTab, setActiveTab] = useState('crop');
    const [saving, setSaving] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Load initial image
    useEffect(() => {
      if (!initialSrc) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageRef.current = img;
        const w = img.naturalWidth || 800;
        const h = img.naturalHeight || 600;
        setOrigDimensions({ width: w, height: h });
        setTargetWidth(w);
        setTargetHeight(h);
        setImageLoaded(true);
      };
      img.onerror = () => {
        addToast?.('Failed to load image for editing', 'error');
      };
      img.src = initialSrc;
    }, [initialSrc]);

    // Handle Dimension changes with aspect ratio lock
    const handleWidthChange = (val) => {
      const w = parseInt(val, 10) || 10;
      setTargetWidth(w);
      if (lockAspect && origDimensions.width > 0) {
        const ratio = origDimensions.height / origDimensions.width;
        setTargetHeight(Math.round(w * ratio));
      }
    };

    const handleHeightChange = (val) => {
      const h = parseInt(val, 10) || 10;
      setTargetHeight(h);
      if (lockAspect && origDimensions.height > 0) {
        const ratio = origDimensions.width / origDimensions.height;
        setTargetWidth(Math.round(h * ratio));
      }
    };

    // Fast Sharpness Convolution on ImageData
    const applySharpen = (ctx, w, h, amount) => {
      if (amount <= 0) return;
      try {
        const factor = (amount / 100) * 1.5;
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const copy = new Uint8ClampedArray(data);

        const centerWeight = 1 + 4 * factor;
        const edgeWeight = -factor;

        for (let y = 1; y < h - 1; y++) {
          const rowIdx = y * w;
          const upRowIdx = (y - 1) * w;
          const downRowIdx = (y + 1) * w;
          for (let x = 1; x < w - 1; x++) {
            const idx = (rowIdx + x) * 4;
            for (let c = 0; c < 3; c++) {
              const up = (upRowIdx + x) * 4 + c;
              const down = (downRowIdx + x) * 4 + c;
              const left = (rowIdx + (x - 1)) * 4 + c;
              const right = (rowIdx + (x + 1)) * 4 + c;
              const val = copy[idx + c] * centerWeight +
                          (copy[up] + copy[down] + copy[left] + copy[right]) * edgeWeight;
              data[idx + c] = val > 255 ? 255 : (val < 0 ? 0 : val);
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (e) {
        console.warn('Sharpen skipped (ImageData CORS restricted):', e);
      }
    };

    // Render Canvas Pipeline
    const renderToCanvas = (targetCanvas, isFull = false) => {
      const img = imageRef.current;
      if (!img || !targetCanvas) return;

      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      // Base dimensions
      let baseW = targetWidth > 0 ? targetWidth : (img.naturalWidth || 800);
      let baseH = targetHeight > 0 ? targetHeight : (img.naturalHeight || 600);

      // In preview mode, scale down for silky smooth performance
      let outW = baseW;
      let outH = baseH;
      if (!isFull) {
        const maxPrev = 600;
        if (outW > maxPrev || outH > maxPrev) {
          const s = Math.min(maxPrev / outW, maxPrev / outH);
          outW = Math.round(outW * s);
          outH = Math.round(outH * s);
        }
      }

      // If rotation is 90 or 270, swap canvas target dimensions
      const isSwapped = rotation === 90 || rotation === 270;
      const canvasW = isSwapped ? outH : outW;
      const canvasH = isSwapped ? outW : outH;

      targetCanvas.width = canvasW;
      targetCanvas.height = canvasH;

      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.save();

      // CSS Filters for Brightness, Contrast, Saturation
      const bPct = 100 + brightness;
      const cPct = 100 + contrast;
      const sPct = 100 + saturation;
      ctx.filter = `brightness(${bPct}%) contrast(${cPct}%) saturate(${sPct}%)`;

      // Center transformations
      ctx.translate(canvasW / 2, canvasH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Crop calculations
      let srcX = 0;
      let srcY = 0;
      let srcW = img.naturalWidth || 800;
      let srcH = img.naturalHeight || 600;

      if (aspectPreset !== 'free') {
        let targetRatio = 1;
        if (aspectPreset === '1:1') targetRatio = 1;
        else if (aspectPreset === '4:3') targetRatio = 4 / 3;
        else if (aspectPreset === '16:9') targetRatio = 16 / 9;

        const currentRatio = srcW / srcH;
        if (currentRatio > targetRatio) {
          const cropW = srcH * targetRatio;
          srcX = (srcW - cropW) / 2;
          srcW = cropW;
        } else {
          const cropH = srcW / targetRatio;
          srcY = (srcH - cropH) / 2;
          srcH = cropH;
        }
      }

      // Zoom & Pan adjustments
      if (zoom > 1) {
        const zoomedW = srcW / zoom;
        const zoomedH = srcH / zoom;
        const maxPanX = (srcW - zoomedW) / 2;
        const maxPanY = (srcH - zoomedH) / 2;
        srcX = srcX + (srcW - zoomedW) / 2 + (panX / 100) * maxPanX;
        srcY = srcY + (srcH - zoomedH) / 2 + (panY / 100) * maxPanY;
        srcW = zoomedW;
        srcH = zoomedH;
      }

      // Draw onto canvas centered
      ctx.drawImage(img, srcX, srcY, srcW, srcH, -outW / 2, -outH / 2, outW, outH);
      ctx.restore();

      // Sharpness Convolution Filter
      if (sharpness > 0) {
        applySharpen(ctx, canvasW, canvasH, sharpness);
      }
    };

    // Re-render preview canvas whenever controls change
    useEffect(() => {
      if (imageLoaded && canvasRef.current) {
        renderToCanvas(canvasRef.current, false);
      }
    }, [
      imageLoaded,
      aspectPreset,
      zoom,
      panX,
      panY,
      rotation,
      flipH,
      flipV,
      brightness,
      contrast,
      saturation,
      sharpness,
      targetWidth,
      targetHeight
    ]);

    // Reset All Controls
    const handleReset = () => {
      setAspectPreset('free');
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setBrightness(0);
      setContrast(0);
      setSaturation(0);
      setSharpness(0);
      setTargetWidth(origDimensions.width);
      setTargetHeight(origDimensions.height);
      setLockAspect(true);
      addToast?.('All photo adjustments reset to original', 'info');
    };

    // Save Changes
    const handleSave = () => {
      if (!imageRef.current) return;
      setSaving(true);
      try {
        const fullCanvas = document.createElement('canvas');
        renderToCanvas(fullCanvas, true);

        const dataUrl = fullCanvas.toDataURL('image/jpeg', 0.92);
        fullCanvas.toBlob((blob) => {
          const editMeta = {
            aspectPreset,
            zoom,
            panX,
            panY,
            rotation,
            flipH,
            flipV,
            brightness,
            contrast,
            saturation,
            sharpness,
            width: fullCanvas.width,
            height: fullCanvas.height
          };
          onSave(blob, dataUrl, editMeta);
          setSaving(false);
        }, 'image/jpeg', 0.92);
      } catch (err) {
        setSaving(false);
        addToast?.('Failed to save edited photo: ' + err.message, 'error');
      }
    };

    return h(
      'div',
      { className: 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fade-in' },
      h(
        'div',
        { className: 'relative w-full max-w-5xl max-h-[95vh] rounded-3xl border border-slate-800 bg-slate-950 p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden' },

        // Top Header
        h(
          'div',
          { className: 'flex items-center justify-between border-b border-slate-800/80 pb-3 flex-shrink-0' },
          h(
            'div',
            { className: 'flex items-center gap-3' },
            h('div', { className: 'w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center text-lg' }, '🎨'),
            h(
              'div',
              null,
              h('h2', { className: 'text-base sm:text-lg font-bold text-white' }, 'Photo Editing Studio'),
              h('p', { className: 'text-xs text-slate-400' }, title || photo?.title || 'Crop • Rotate • Flip • Filters • Sharpness • Resize')
            )
          ),
          h(
            'div',
            { className: 'flex items-center gap-2' },
            h(
              'button',
              {
                onClick: handleReset,
                title: 'Reset all edits',
                className: 'px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5'
              },
              renderIcon(Icons.RefreshCw, { className: 'w-3.5 h-3.5' }),
              'Reset'
            ),
            h(
              'button',
              {
                onClick: onClose,
                className: 'p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer'
              },
              renderIcon(Icons.X, { className: 'w-5 h-5' })
            )
          )
        ),

        // Main Studio Body (Two Columns: Canvas on Left, Controls on Right)
        h(
          'div',
          { className: 'flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 py-4 overflow-y-auto min-h-0' },

          // Left Preview Area (7 cols)
          h(
            'div',
            { className: 'lg:col-span-7 flex flex-col items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800/80 p-3 relative min-h-[300px] overflow-hidden' },
            
            // Canvas Display
            h('canvas', {
              ref: canvasRef,
              className: 'max-w-full max-h-[55vh] object-contain rounded-xl shadow-2xl border border-slate-800 bg-slate-950'
            }),

            // Floating live badges on preview
            h(
              'div',
              { className: 'absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none' },
              h('span', { className: 'px-2.5 py-1 rounded-md bg-black/75 border border-slate-800 text-cyan-300 font-mono backdrop-blur-md' },
                `${targetWidth} × ${targetHeight} px ${rotation ? `• ${rotation}°` : ''} ${zoom > 1 ? `• ${Math.round(zoom * 100)}% zoom` : ''}`
              ),
              sharpness > 0 && h('span', { className: 'px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono backdrop-blur-md' },
                `Sharpness: +${sharpness}`
              )
            )
          ),

          // Right Controls Sidebar (5 cols)
          h(
            'div',
            { className: 'lg:col-span-5 flex flex-col gap-3 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-3.5 overflow-y-auto' },

            // Tool Tabs
            h(
              'div',
              { className: 'grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-semibold' },
              [
                { id: 'crop', label: 'Crop' },
                { id: 'orient', label: 'Rotate' },
                { id: 'filters', label: 'Filters' },
                { id: 'resize', label: 'Resize' }
              ].map(tab =>
                h(
                  'button',
                  {
                    key: tab.id,
                    type: 'button',
                    onClick: () => setActiveTab(tab.id),
                    className: `py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-850'
                    }`
                  },
                  tab.label
                )
              )
            ),

            // TAB 1: CROP & ASPECT RATIO
            activeTab === 'crop' && h(
              'div',
              { className: 'space-y-4 pt-1 animate-fade-in' },
              h(
                'div',
                { className: 'space-y-1.5' },
                h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Crop Aspect Ratio'),
                h(
                  'div',
                  { className: 'grid grid-cols-2 gap-2' },
                  [
                    { id: 'free', label: 'Free / Original' },
                    { id: '1:1', label: '1:1 Square' },
                    { id: '4:3', label: '4:3 Standard' },
                    { id: '16:9', label: '16:9 Widescreen' }
                  ].map(preset =>
                    h(
                      'button',
                      {
                        key: preset.id,
                        type: 'button',
                        onClick: () => setAspectPreset(preset.id),
                        className: `p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          aspectPreset === preset.id
                            ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                        }`
                      },
                      preset.label
                    )
                  )
                )
              ),

              // Zoom
              h(
                'div',
                { className: 'space-y-1.5' },
                h(
                  'div',
                  { className: 'flex items-center justify-between text-xs' },
                  h('span', { className: 'font-bold uppercase tracking-wider text-slate-400' }, 'Crop Zoom'),
                  h('span', { className: 'font-mono text-cyan-300 font-bold' }, `${Math.round(zoom * 100)}%`)
                ),
                h('input', {
                  type: 'range',
                  min: 1,
                  max: 2.5,
                  step: 0.05,
                  value: zoom,
                  onChange: (e) => setZoom(parseFloat(e.target.value)),
                  className: 'w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400'
                })
              ),

              // Pan X & Y (if zoom > 1)
              zoom > 1 && h(
                'div',
                { className: 'space-y-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 animate-fade-in' },
                h(
                  'div',
                  { className: 'space-y-1' },
                  h(
                    'div',
                    { className: 'flex items-center justify-between text-xs' },
                    h('span', { className: 'text-slate-400' }, 'Horizontal Pan (X)'),
                    h('span', { className: 'font-mono text-slate-300 text-[11px]' }, `${panX}%`)
                  ),
                  h('input', {
                    type: 'range',
                    min: -100,
                    max: 100,
                    value: panX,
                    onChange: (e) => setPanX(parseInt(e.target.value, 10)),
                    className: 'w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400'
                  })
                ),
                h(
                  'div',
                  { className: 'space-y-1' },
                  h(
                    'div',
                    { className: 'flex items-center justify-between text-xs' },
                    h('span', { className: 'text-slate-400' }, 'Vertical Pan (Y)'),
                    h('span', { className: 'font-mono text-slate-300 text-[11px]' }, `${panY}%`)
                  ),
                  h('input', {
                    type: 'range',
                    min: -100,
                    max: 100,
                    value: panY,
                    onChange: (e) => setPanY(parseInt(e.target.value, 10)),
                    className: 'w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400'
                  })
                )
              )
            ),

            // TAB 2: ROTATE & FLIP
            activeTab === 'orient' && h(
              'div',
              { className: 'space-y-4 pt-1 animate-fade-in' },
              h(
                'div',
                { className: 'space-y-2' },
                h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Rotate Orientation'),
                h(
                  'div',
                  { className: 'grid grid-cols-2 gap-2' },
                  h(
                    'button',
                    {
                      type: 'button',
                      onClick: () => setRotation(r => ((r - 90) % 360 + 360) % 360),
                      className: 'p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer'
                    },
                    '↺ Rotate 90° Left'
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      onClick: () => setRotation(r => (r + 90) % 360),
                      className: 'p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer'
                    },
                    '↻ Rotate 90° Right'
                  )
                ),
                h(
                  'div',
                  { className: 'flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs' },
                  h('span', { className: 'text-slate-400' }, 'Current Rotation Angle:'),
                  h('span', { className: 'font-mono font-bold text-purple-400' }, `${rotation}°`)
                )
              ),

              h(
                'div',
                { className: 'space-y-2 pt-2 border-t border-slate-800' },
                h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Mirror & Flip'),
                h(
                  'div',
                  { className: 'grid grid-cols-2 gap-2' },
                  h(
                    'button',
                    {
                      type: 'button',
                      onClick: () => setFlipH(f => !f),
                      className: `p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                        flipH
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`
                    },
                    '⇄ Flip Horizontal'
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      onClick: () => setFlipV(f => !f),
                      className: `p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                        flipV
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`
                    },
                    '⇅ Flip Vertical'
                  )
                )
              )
            ),

            // TAB 3: LIGHTING, COLOR & SHARPNESS
            activeTab === 'filters' && h(
              'div',
              { className: 'space-y-3.5 pt-1 animate-fade-in' },
              
              // Brightness
              h(
                'div',
                { className: 'space-y-1' },
                h(
                  'div',
                  { className: 'flex items-center justify-between text-xs' },
                  h('span', { className: 'font-bold text-slate-400' }, '☀️ Brightness'),
                  h('span', { className: 'font-mono font-bold text-slate-300' }, `${brightness > 0 ? '+' : ''}${brightness}`)
                ),
                h('input', {
                  type: 'range',
                  min: -100,
                  max: 100,
                  value: brightness,
                  onChange: (e) => setBrightness(parseInt(e.target.value, 10)),
                  className: 'w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400'
                })
              ),

              // Contrast
              h(
                'div',
                { className: 'space-y-1' },
                h(
                  'div',
                  { className: 'flex items-center justify-between text-xs' },
                  h('span', { className: 'font-bold text-slate-400' }, '◐ Contrast'),
                  h('span', { className: 'font-mono font-bold text-slate-300' }, `${contrast > 0 ? '+' : ''}${contrast}`)
                ),
                h('input', {
                  type: 'range',
                  min: -100,
                  max: 100,
                  value: contrast,
                  onChange: (e) => setContrast(parseInt(e.target.value, 10)),
                  className: 'w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400'
                })
              ),

              // Saturation
              h(
                'div',
                { className: 'space-y-1' },
                h(
                  'div',
                  { className: 'flex items-center justify-between text-xs' },
                  h('span', { className: 'font-bold text-slate-400' }, '🎨 Saturation'),
                  h('span', { className: 'font-mono font-bold text-slate-300' }, `${saturation > 0 ? '+' : ''}${saturation}`)
                ),
                h('input', {
                  type: 'range',
                  min: -100,
                  max: 100,
                  value: saturation,
                  onChange: (e) => setSaturation(parseInt(e.target.value, 10)),
                  className: 'w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400'
                })
              ),

              // Sharpness (Real-time 3x3 Convolution)
              h(
                'div',
                { className: 'space-y-1 pt-2 border-t border-slate-800' },
                h(
                  'div',
                  { className: 'flex items-center justify-between text-xs' },
                  h('span', { className: 'font-bold text-purple-300' }, '✨ Sharpness (Convolution)'),
                  h('span', { className: 'font-mono font-bold text-purple-300' }, `${sharpness}`)
                ),
                h('input', {
                  type: 'range',
                  min: 0,
                  max: 100,
                  value: sharpness,
                  onChange: (e) => setSharpness(parseInt(e.target.value, 10)),
                  className: 'w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400'
                }),
                h('p', { className: 'text-[11px] text-slate-500 italic' }, 'Applies high-pass unsharp mask convolution kernel')
              )
            ),

            // TAB 4: RESIZE
            activeTab === 'resize' && h(
              'div',
              { className: 'space-y-4 pt-1 animate-fade-in' },
              h(
                'div',
                { className: 'grid grid-cols-2 gap-3' },
                h(
                  'div',
                  { className: 'space-y-1' },
                  h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Width (px)'),
                  h('input', {
                    type: 'number',
                    value: targetWidth,
                    onChange: (e) => handleWidthChange(e.target.value),
                    className: 'w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-purple-500'
                  })
                ),
                h(
                  'div',
                  { className: 'space-y-1' },
                  h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Height (px)'),
                  h('input', {
                    type: 'number',
                    value: targetHeight,
                    onChange: (e) => handleHeightChange(e.target.value),
                    className: 'w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-purple-500'
                  })
                )
              ),

              // Lock Aspect Ratio
              h(
                'label',
                { className: 'flex items-center gap-2 text-xs text-slate-300 cursor-pointer' },
                h('input', {
                  type: 'checkbox',
                  checked: lockAspect,
                  onChange: (e) => setLockAspect(e.target.checked),
                  className: 'rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0'
                }),
                'Lock Aspect Ratio'
              ),

              // Quick Presets
              h(
                'div',
                { className: 'space-y-1.5 pt-2 border-t border-slate-800' },
                h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Resolution Presets'),
                h(
                  'div',
                  { className: 'grid grid-cols-3 gap-2' },
                  [
                    { label: '100% (Original)', scale: 1 },
                    { label: '75%', scale: 0.75 },
                    { label: '50%', scale: 0.5 },
                    { label: '1080p FHD', w: 1920, h: 1080 },
                    { label: '720p HD', w: 1280, h: 720 },
                    { label: '800×600', w: 800, h: 600 }
                  ].map((p, idx) =>
                    h(
                      'button',
                      {
                        key: idx,
                        type: 'button',
                        onClick: () => {
                          if (p.scale) {
                            setTargetWidth(Math.round(origDimensions.width * p.scale));
                            setTargetHeight(Math.round(origDimensions.height * p.scale));
                          } else {
                            setTargetWidth(p.w);
                            setTargetHeight(p.h);
                          }
                        },
                        className: 'p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white transition cursor-pointer'
                      },
                      p.label
                    )
                  )
                )
              )
            )
          )
        ),

        // Bottom Bar (Save Changes & Cancel)
        h(
          'div',
          { className: 'flex items-center justify-between border-t border-slate-800/80 pt-3 flex-shrink-0' },
          h(
            'button',
            {
              type: 'button',
              onClick: onClose,
              disabled: saving,
              className: 'px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer'
            },
            'Cancel'
          ),
          h(
            'button',
            {
              type: 'button',
              onClick: handleSave,
              disabled: saving || !imageLoaded,
              className: 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition cursor-pointer flex items-center gap-2'
            },
            saving ? 'Processing & Saving...' : 'Save Changes'
          )
        )
      )
    );
  };

  // =========================================================================
  // ROTATE VIDEO MODAL COMPONENT (ORIENTATION ADJUSTER)
  // Features: 90° Left, 90° Right, 180°, Reset 0°, Live Preview, Save & Cancel
  // =========================================================================
  const RotateVideoModal = ({ videoUrl, currentRotation = 0, title, onClose, onSave }) => {
    const { addToast } = useAuth();
    const [rotation, setRotation] = useState(Number(currentRotation) || 0);
    const [saving, setSaving] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = React.useRef(null);

    let src = videoUrl || '';
    if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/')) {
      src = '/' + src;
    }
    src = src.replace(/\\/g, '/');

    const rotateLeft = () => {
      setRotation(prev => ((prev - 90) % 360 + 360) % 360);
    };

    const rotateRight = () => {
      setRotation(prev => (prev + 90) % 360);
    };

    const rotate180 = () => {
      setRotation(prev => (prev + 180) % 360);
    };

    const resetRotation = () => {
      setRotation(0);
    };

    const handleSave = async () => {
      setSaving(true);
      try {
        await onSave(rotation);
      } catch (err) {
        addToast?.('Failed to save video rotation: ' + err.message, 'error');
      } finally {
        setSaving(false);
      }
    };

    const togglePlay = () => {
      if (!videoRef.current) return;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => console.warn(e));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    return h(
      'div',
      { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in' },
      h(
        'div',
        { className: 'relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-5' },

        // Header
        h(
          'div',
          { className: 'flex items-center justify-between border-b border-slate-800/80 pb-4' },
          h(
            'div',
            { className: 'flex items-center gap-3' },
            h('div', { className: 'w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-lg' }, '🔄'),
            h(
              'div',
              null,
              h('h2', { className: 'text-lg font-bold text-white' }, 'Rotate Video'),
              h('p', { className: 'text-xs text-slate-400 mt-0.5' }, title || 'Adjust orientation (90° Left, 90° Right, 180°)')
            )
          ),
          h(
            'button',
            { onClick: onClose, className: 'p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer' },
            renderIcon(Icons.X, { className: 'w-5 h-5' })
          )
        ),

        // Live Rotated Video Preview
        h(
          'div',
          { className: 'relative w-full h-64 sm:h-80 bg-black rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-2' },
          h('video', {
            ref: videoRef,
            src,
            playsInline: true,
            controls: true,
            onClick: togglePlay,
            onPlay: () => setIsPlaying(true),
            onPause: () => setIsPlaying(false),
            style: {
              transform: `rotate(${rotation}deg) scale(${rotation % 180 !== 0 ? 0.72 : 1})`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            className: 'w-full h-full object-contain cursor-pointer'
          }),
          // Current Angle Badge
          h(
            'span',
            { className: 'absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md' },
            `Current Orientation: ${rotation}°`
          )
        ),

        // Rotation Action Buttons
        h(
          'div',
          { className: 'space-y-2' },
          h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Choose Rotation Angle'),
          h(
            'div',
            { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2.5' },
            h(
              'button',
              {
                type: 'button',
                onClick: rotateLeft,
                className: 'p-3 rounded-xl bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer'
              },
              '↺ 90° Left'
            ),
            h(
              'button',
              {
                type: 'button',
                onClick: rotateRight,
                className: 'p-3 rounded-xl bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer'
              },
              '↻ 90° Right'
            ),
            h(
              'button',
              {
                type: 'button',
                onClick: rotate180,
                className: 'p-3 rounded-xl bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer'
              },
              '🔃 180°'
            ),
            h(
              'button',
              {
                type: 'button',
                onClick: resetRotation,
                className: 'p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer'
              },
              '↩️ Reset (0°)'
            )
          )
        ),

        // Save & Cancel Footer
        h(
          'div',
          { className: 'flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80' },
          h(
            'button',
            {
              type: 'button',
              onClick: onClose,
              disabled: saving,
              className: 'px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer'
            },
            'Cancel'
          ),
          h(
            'button',
            {
              type: 'button',
              onClick: handleSave,
              disabled: saving,
              className: 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2'
            },
            saving ? 'Saving...' : 'Save Changes'
          )
        )
      )
    );
  };

  // =========================================================================
  // EDIT PHOTO MODAL COMPONENT (ADMIN METADATA & CATEGORY MANAGEMENT)
  // =========================================================================
  const EditPhotoModal = ({ photo, onClose, onUpdated }) => {
    const { addToast } = useAuth();
    const [title, setTitle] = useState(photo.title || '');
    const [description, setDescription] = useState(photo.description || '');
    const [section, setSection] = useState(photo.section || 'department');
    const [category, setCategory] = useState(photo.category || '');
    const [department, setDepartment] = useState(photo.department || 'Information Technology');
    const [eventYear, setEventYear] = useState(photo.eventYear || '2026');
    const [company, setCompany] = useState(photo.company || 'Zoho');
    const [status, setStatus] = useState(photo.status || 'Approved');
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
      e.preventDefault();
      if (!title.trim()) {
        addToast?.('Please enter a photo title', 'error');
        return;
      }

      setSaving(true);
      try {
        const updateData = {
          title: title.trim(),
          description: description.trim(),
          section,
          category: category.trim() || 'Campus Event',
          department: section === 'department' ? department : 'College Level',
          eventYear: section === 'symposium' ? eventYear : '2026',
          company: section === 'placement' ? company : null,
          status
        };

        if (window.ITDepartmentApi?.gallery?.updatePhoto) {
          const res = await window.ITDepartmentApi.gallery.updatePhoto(photo.id, updateData);
          if (res?.success) {
            addToast?.(res.message || 'Photograph updated successfully!', 'success');
            onUpdated(res.data || { ...photo, ...updateData });
          } else {
            throw new Error(res?.message || 'Update failed');
          }
        }
      } catch (err) {
        addToast?.('Failed to update photo: ' + (err.message || 'Server error'), 'error');
      } finally {
        setSaving(false);
      }
    };

    return h(
      'div',
      { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in' },
      h(
        'div',
        { className: 'relative w-full max-w-xl max-h-[90vh] rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-5' },
        h(
          'div',
          { className: 'flex items-center justify-between border-b border-slate-800/80 pb-4' },
          h(
            'div',
            null,
            h('h2', { className: 'text-lg font-bold text-white' }, 'Edit Photograph Metadata'),
            h('p', { className: 'text-xs text-slate-400 mt-0.5' }, 'Administrator Gallery Control & Category Governance')
          ),
          h(
            'button',
            { onClick: onClose, className: 'p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition' },
            renderIcon(Icons.X, { className: 'w-5 h-5' })
          )
        ),
        h(
          'form',
          { onSubmit: handleSave, className: 'space-y-4' },
          h(
            'div',
            { className: 'space-y-1.5' },
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Photo Title *'),
            h('input', {
              type: 'text',
              value: title,
              onChange: (e) => setTitle(e.target.value),
              required: true,
              className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500'
            })
          ),
          h(
            'div',
            { className: 'space-y-1.5' },
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Description'),
            h('textarea', {
              rows: 3,
              value: description,
              onChange: (e) => setDescription(e.target.value),
              className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
            })
          ),
          h(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
            h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Gallery Section'),
              h(
                'select',
                {
                  value: section,
                  onChange: (e) => setSection(e.target.value),
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                },
                SECTIONS.map(s => h('option', { key: s.id, value: s.id }, s.label))
              )
            ),
            h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Approval Status'),
              h(
                'select',
                {
                  value: status,
                  onChange: (e) => setStatus(e.target.value),
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                },
                h('option', { value: 'Approved' }, 'Approved (Visible Live)'),
                h('option', { value: 'Pending Approval' }, 'Pending Approval'),
                h('option', { value: 'Rejected' }, 'Rejected (Hidden)')
              )
            )
          ),
          h(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
            section === 'department' && h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Department'),
              h(
                'select',
                {
                  value: department,
                  onChange: (e) => setDepartment(e.target.value),
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                },
                DEPARTMENTS.filter(d => d !== 'All Departments').map(d => h('option', { key: d, value: d }, d))
              )
            ),
            section === 'symposium' && h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Event Year'),
              h(
                'select',
                {
                  value: eventYear,
                  onChange: (e) => setEventYear(e.target.value),
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                },
                SYMPOSIUM_YEARS.filter(y => y !== 'All Years').map(y => h('option', { key: y, value: y }, y))
              )
            ),
            section === 'placement' && h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Company'),
              h(
                'select',
                {
                  value: company,
                  onChange: (e) => setCompany(e.target.value),
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                },
                PLACEMENT_COMPANIES.filter(c => c !== 'All Companies').map(c => h('option', { key: c, value: c }, c))
              )
            ),
            h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Category / Tag'),
              h('input', {
                type: 'text',
                value: category,
                onChange: (e) => setCategory(e.target.value),
                className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
              })
            )
          ),
          h(
            'div',
            { className: 'flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80' },
            h(
              'button',
              {
                type: 'button',
                onClick: onClose,
                disabled: saving,
                className: 'px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition'
              },
              'Cancel'
            ),
            h(
              'button',
              {
                type: 'submit',
                disabled: saving,
                className: 'px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition'
              },
              saving ? 'Saving...' : 'Save Changes'
            )
          )
        )
      )
    );
  };

  // =========================================================================
  // UPLOAD PHOTO MODAL COMPONENT (WITH ANIMATED PROGRESS BAR & REAL MULTIPART UPLOAD)
  // =========================================================================
  // =========================================================================
  // UPLOAD PHOTO / VIDEO MODAL COMPONENT (SUPPORT PHOTOS & VIDEOS UP TO 100MB)
  // =========================================================================
  const UploadPhotoModal = ({ activeSection, role, currentUser, onClose, onUploaded }) => {
    const { addToast } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [section, setSection] = useState(activeSection || 'department');
    const [category, setCategory] = useState('');
    const [department, setDepartment] = useState('Information Technology');
    const [eventYear, setEventYear] = useState('2026');
    const [company, setCompany] = useState('Zoho');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileSizeText, setFileSizeText] = useState('');
    const [mediaType, setMediaType] = useState('photo'); // 'photo' or 'video'
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [isRotatingVideo, setIsRotatingVideo] = useState(false);
    const [videoRotation, setVideoRotation] = useState(0);

    // Handle Local File Reading & Format / Size Validation (100MB Limit)
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowedImageExts = ['.jpg', '.jpeg', '.png', '.webp'];
      const allowedVideoExts = ['.mp4', '.mov', '.avi', '.webm'];
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      const mime = (file.type || '').toLowerCase();

      const isImage = allowedImageExts.includes(ext) || mime.startsWith('image/');
      const isVideo = allowedVideoExts.includes(ext) || mime.startsWith('video/');

      if (!isImage && !isVideo) {
        addToast?.('Invalid format! Allowed: Photos (JPG, JPEG, PNG, WEBP) and Videos (MP4, MOV, AVI, WEBM).', 'error');
        e.target.value = '';
        return;
      }

      const maxSizeBytes = 100 * 1024 * 1024; // 100 MB maximum
      if (file.size > maxSizeBytes) {
        addToast?.('Upload failed: File size exceeds the maximum limit of 100 MB.', 'error');
        e.target.value = '';
        return;
      }

      const detectedType = isVideo ? 'video' : 'photo';
      setMediaType(detectedType);
      setSelectedFile(file);
      setSelectedFileName(file.name);
      setFileSizeText((file.size / (1024 * 1024)).toFixed(2) + ' MB');

      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    };

    // Submit Handler with Realistic Progress Bar Animation & Real Multipart Form Data
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!title.trim()) {
        addToast?.('Please enter a title', 'error');
        return;
      }

      if (!selectedFile && !imageUrl.trim()) {
        addToast?.('Please select a photo or video file to upload.', 'error');
        return;
      }

      setUploading(true);
      setUploadProgress(20);

      const interval = setInterval(() => {
        setUploadProgress(p => (p >= 85 ? 85 : p + 20));
      }, 150);

      try {
        let res;
        if (selectedFile) {
          const formData = new FormData();
          formData.append('section', section);
          formData.append('mediaType', mediaType);
          formData.append('title', title.trim());
          formData.append('description', description.trim());
          formData.append('category', category.trim() || 'General');
          formData.append('department', section === 'department' ? department : 'College Level');
          formData.append('eventYear', section === 'symposium' ? eventYear : '2026');
          if (section === 'placement') formData.append('company', company);
          formData.append('file', selectedFile);
          formData.append('image', selectedFile); // fallback support
          formData.append('rotation', videoRotation);
          formData.append('uploadedBy', JSON.stringify({
            id: currentUser?.id || currentUser?.rollNo || 'ANON',
            name: currentUser?.name || 'Academic User',
            role: role
          }));

          res = await window.ITDepartmentApi.gallery.uploadPhoto(formData);
        } else {
          const payload = {
            title: title.trim(),
            description: description.trim(),
            mediaType,
            section,
            category: category.trim() || 'General',
            department: section === 'department' ? department : 'College Level',
            eventYear: section === 'symposium' ? eventYear : '2026',
            company: section === 'placement' ? company : null,
            url: imageUrl.trim(),
            rotation: videoRotation,
            uploadedBy: {
              id: currentUser?.id || currentUser?.rollNo || 'ANON',
              name: currentUser?.name || 'Academic User',
              role: role
            }
          };
          res = await window.ITDepartmentApi.gallery.uploadPhoto(payload);
        }

        clearInterval(interval);
        setUploadProgress(100);

        if (res?.success) {
          setTimeout(() => {
            addToast?.(res?.message || (role === 'student' ? 'Media submitted for Teacher Approval!' : 'Media published live to gallery!'), 'success');
            onUploaded();
          }, 300);
        } else {
          throw new Error(res?.message || 'Upload failed');
        }
      } catch (err) {
        clearInterval(interval);
        setUploading(false);
        addToast?.('Upload failed: ' + (err.message || 'Server error'), 'error');
      }
    };

    return h(
      'div',
      { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in' },
      h(
        'div',
        { className: 'relative w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6' },

        // Header
        h(
          'div',
          { className: 'flex items-center justify-between border-b border-slate-800/80 pb-4' },
          h(
            'div',
            null,
            h('h2', { className: 'text-xl font-bold text-white' }, 'Upload Photo or Video to Gallery'),
            h('p', { className: 'text-xs text-slate-400 mt-0.5' },
              role === 'student'
                ? 'Student uploads will be forwarded to Faculty for review (Status: Pending Teacher Approval).'
                : 'Faculty and Admin uploads are published live to the Gallery immediately.'
            )
          ),
          h(
            'button',
            { onClick: onClose, className: 'p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer' },
            renderIcon(Icons.X, { className: 'w-5 h-5' })
          )
        ),

        // Notice Badge for Student Workflow
        role === 'student' && h(
          'div',
          { className: 'p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2' },
          renderIcon(Icons.AlertTriangle || Icons.Clock, { className: 'w-4 h-4 text-amber-400 flex-shrink-0' }),
          'Note: After uploading, your media will have status "Pending Teacher Approval" and will appear in the public gallery once approved by faculty.'
        ),

        // Progress Bar (if uploading)
        uploading && h(
          'div',
          { className: 'space-y-2 py-2 animate-fade-in' },
          h(
            'div',
            { className: 'flex items-center justify-between text-xs font-bold text-cyan-400' },
            h('span', null, `Uploading & Processing ${mediaType === 'video' ? 'Video' : 'Photo'}...`),
            h('span', null, `${uploadProgress}%`)
          ),
          h(
            'div',
            { className: 'h-2 w-full rounded-full bg-slate-800 overflow-hidden' },
            h('div', {
              className: 'h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-200',
              style: { width: `${uploadProgress}%` }
            })
          )
        ),

        // Upload Form
        h(
          'form',
          { onSubmit: handleSubmit, className: 'space-y-4' },

          // Section Selector
          h(
            'div',
            { className: 'space-y-1.5' },
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Target Gallery Section'),
            h(
              'div',
              { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2' },
              SECTIONS.map(s =>
                h(
                  'button',
                  {
                    type: 'button',
                    key: s.id,
                    onClick: () => setSection(s.id),
                    className: `p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      section === s.id
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`
                  },
                  s.label.replace(' Gallery', '')
                )
              )
            )
          ),

          // Title
          h(
            'div',
            { className: 'space-y-1.5' },
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Media Title *'),
            h('input', {
              type: 'text',
              value: title,
              onChange: (e) => setTitle(e.target.value),
              placeholder: 'e.g. INFOBIT 2026 Grand Finale or Cloud Computing Lab Demo',
              required: true,
              className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500'
            })
          ),

          // Contextual Row: Department / Year / Company + Category
          h(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },

            // Department
            section === 'department' && h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Department'),
              h(
                'select',
                {
                  value: department,
                  onChange: (e) => setDepartment(e.target.value),
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                },
                DEPARTMENTS.filter(d => d !== 'All Departments').map(d => h('option', { key: d, value: d }, d))
              )
            ),

            // Symposium Year
            section === 'symposium' && h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Event Year'),
              h(
                'select',
                {
                  value: eventYear,
                  onChange: (e) => setEventYear(e.target.value),
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                },
                SYMPOSIUM_YEARS.filter(y => y !== 'All Years').map(y => h('option', { key: y, value: y }, y))
              )
            ),

            // Placement Company
            section === 'placement' && h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Recruiting Company'),
              h(
                'select',
                {
                  value: company,
                  onChange: (e) => setCompany(e.target.value),
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                },
                PLACEMENT_COMPANIES.filter(c => c !== 'All Companies').map(c => h('option', { key: c, value: c }, c))
              )
            ),

            // Category tag
            h(
              'div',
              { className: 'space-y-1.5' },
              h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Category / Tag'),
              h('input', {
                type: 'text',
                value: category,
                onChange: (e) => setCategory(e.target.value),
                placeholder: 'e.g. Labs, Cultural, Hackathon, Placement',
                className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
              })
            )
          ),

          // Description
          h(
            'div',
            { className: 'space-y-1.5' },
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Description / Caption'),
            h('textarea', {
              rows: 3,
              value: description,
              onChange: (e) => setDescription(e.target.value),
              placeholder: 'Add details about the event, participants, key milestones, or highlights...',
              className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
            })
          ),

          // File / Video Picker
          h(
            'div',
            { className: 'space-y-2' },
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Upload File (Photo or Video)'),
            
            h(
              'label',
              { className: 'cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-slate-900/50 hover:bg-slate-900 transition text-center' },
              renderIcon(Icons.Upload, { className: 'w-8 h-8 text-cyan-400 mb-2' }),
              h('span', { className: 'text-xs font-bold text-white' }, 'Choose Photo or Video from Device'),
              h('span', { className: 'text-[11px] text-slate-400 mt-1' }, 'Photos: JPG, JPEG, PNG, WEBP • Videos: MP4, MOV, AVI, WEBM (Up to 100 MB)'),
              h('input', {
                type: 'file',
                accept: '.jpg,.jpeg,.png,.webp,.mp4,.mov,.avi,.webm,image/*,video/*',
                onChange: handleFileChange,
                className: 'hidden'
              })
            ),

            // Selected file indicator & Type badge
            selectedFileName && h(
              'div',
              { className: 'flex items-center justify-between p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-300' },
              h('div', { className: 'flex items-center gap-2 truncate' },
                h('span', { className: `px-2 py-0.5 rounded text-[10px] font-black uppercase ${mediaType === 'video' ? 'bg-rose-600 text-white' : 'bg-cyan-600 text-white'}` },
                  mediaType === 'video' ? '▶ Video' : '📷 Photo'
                ),
                h('span', { className: 'font-semibold truncate' }, selectedFileName),
                h('span', { className: 'text-[11px] text-slate-400 flex-shrink-0' }, `(${fileSizeText})`)
              ),
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    setSelectedFile(null);
                    setSelectedFileName('');
                    setSelectedFile(null);
                    setSelectedFileName('');
                    setFileSizeText('');
                    setImageUrl('');
                    setVideoRotation(0);
                  },
                  className: 'text-slate-400 hover:text-white ml-2 text-xs font-bold cursor-pointer'
                },
                '✕ Remove'
              )
            ),

            // Live Media Preview (Photo or Video Player)
            imageUrl && h(
              'div',
              { className: 'space-y-2 mt-3' },
              h(
                'div',
                { className: 'relative rounded-2xl overflow-hidden border border-slate-800 bg-black' },
                mediaType === 'video'
                  ? h('video', {
                      src: imageUrl,
                      controls: true,
                      style: videoRotation ? {
                        transform: `rotate(${videoRotation}deg) scale(${videoRotation % 180 !== 0 ? 0.72 : 1})`,
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      } : undefined,
                      className: 'w-full max-h-56 object-contain bg-black'
                    })
                  : h('img', {
                      src: imageUrl,
                      alt: 'Preview',
                      className: 'w-full max-h-56 object-contain bg-black'
                    }),
                h(
                  'span',
                  { className: 'absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 text-cyan-300 backdrop-blur-md' },
                  mediaType === 'video' ? `Video Preview (${videoRotation}°)` : 'Photo Preview'
                )
              ),

              // Action Buttons to Edit Photo or Rotate Video before upload
              mediaType === 'photo' && h(
                'div',
                { className: 'flex items-center justify-end' },
                h(
                  'button',
                  {
                    type: 'button',
                    onClick: () => setIsEditingPhoto(true),
                    className: 'px-3.5 py-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition cursor-pointer'
                  },
                  renderIcon(Icons.Sliders || Icons.Edit, { className: 'w-3.5 h-3.5' }),
                  '🎨 Edit Photo Before Upload (Crop, Rotate, Filters, Sharpness, Resize)'
                )
              ),
              mediaType === 'video' && h(
                'div',
                { className: 'flex items-center justify-end' },
                h(
                  'button',
                  {
                    type: 'button',
                    onClick: () => setIsRotatingVideo(true),
                    className: 'px-3.5 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition cursor-pointer'
                  },
                  renderIcon(Icons.RefreshCw, { className: 'w-3.5 h-3.5' }),
                  `🔄 Rotate Video Before Upload (${videoRotation}°)`
                )
              )
            )
          ),

          // Submit Actions
          h(
            'div',
            { className: 'flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80' },
            h(
              'button',
              {
                type: 'button',
                onClick: onClose,
                disabled: uploading,
                className: 'px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer'
              },
              'Cancel'
            ),
            h(
              'button',
              {
                type: 'submit',
                disabled: uploading,
                className: 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 transition cursor-pointer'
              },
              uploading ? 'Processing Upload...' : (role === 'student' ? 'Submit for Teacher Approval' : 'Publish Media to Gallery')
            )
          )
        )
      ),

      // Nested Photo Editor Modal (before upload)
      isEditingPhoto && h(PhotoEditorModal, {
        imageUrl,
        title: selectedFileName || title,
        onClose: () => setIsEditingPhoto(false),
        onSave: (blob, dataUrl, editMeta) => {
          const editedFile = new File([blob], selectedFileName || 'edited-photo.jpg', { type: 'image/jpeg' });
          setSelectedFile(editedFile);
          setImageUrl(dataUrl);
          setFileSizeText((blob.size / (1024 * 1024)).toFixed(2) + ' MB');
          setIsEditingPhoto(false);
          addToast?.('Photo edits applied! Ready for upload.', 'success');
        }
      }),

      // Nested Video Rotation Modal (before upload)
      isRotatingVideo && h(RotateVideoModal, {
        videoUrl: imageUrl,
        currentRotation: videoRotation,
        title: selectedFileName || title,
        onClose: () => setIsRotatingVideo(false),
        onSave: (newRot) => {
          setVideoRotation(newRot);
          setIsRotatingVideo(false);
          addToast?.(`Video rotation set to ${newRot}°!`, 'success');
        }
      })
    );
  };

  // Export to window
  if (typeof window !== 'undefined') {
    window.ITGalleryView = GalleryView;
    window.GalleryView = GalleryView;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GalleryView };
  }
})();
