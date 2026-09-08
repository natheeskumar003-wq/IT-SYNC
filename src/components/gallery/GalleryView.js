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

  const SAMPLE_PRESET_IMAGES = [
    { title: 'Tech Lab Station', url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&auto=format&fit=crop&q=80' },
    { title: 'Cloud Data Center', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80' },
    { title: 'Hackathon Sprint', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80' },
    { title: 'Auditorium Keynote', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80' },
    { title: 'Cultural Stage', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80' },
    { title: 'Recruitment Panel', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80' },
    { title: 'Offer Letter Toast', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80' },
    { title: 'Student Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80' }
  ];

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
    const [statusFilter, setStatusFilter] = useState('all'); // all, approved, pending, rejected
    const [viewMode, setViewMode] = useState('grid'); // grid or masonry
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modals
    const [selectedPhoto, setSelectedPhoto] = useState(null); // Lightbox
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);
    const [photoToEdit, setPhotoToEdit] = useState(null);
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

    // Fetch Photos from Backend API
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const filters = {
          section: activeSection,
          search: searchQuery.trim(),
          userRole: role,
          userId: currentUser?.id || currentUser?.rollNo || ''
        };

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
        if (statusFilter !== 'all') {
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
        addToast?.('Failed to load gallery photos from server', 'error');
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
    }, [activeSection, searchQuery, deptFilter, yearFilter, eventCatFilter, companyFilter, statusFilter]);

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

    // Download Image
    const handleDownload = (url, title) => {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(title || 'gallery-image').replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast?.('Downloading high-resolution image...', 'info');
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
                  onClick: () => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending'),
                  className: `cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                      : 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                  }`
                },
                `⏳ ${totalPendingCount} Awaiting Review`
              )
            ),
            h('h1', { className: 'text-2xl sm:text-4xl font-extrabold text-white tracking-tight' }, 'Department & Campus Gallery'),
            h('p', { className: 'text-xs sm:text-sm text-slate-400 max-w-2xl' }, currentSectionInfo.desc)
          ),

          // Upload Photo Glowing Button
          h(
            'div',
            { className: 'flex items-center gap-3 flex-wrap' },
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
                className: 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0'
              },
              renderIcon(Icons.Camera || Icons.Plus, { className: 'w-4 h-4' }),
              isStudent ? 'Upload Photo (For Review)' : 'Upload New Photo'
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

          // Status Filter for Staff / HOD / Admin
          canManageApprovals && h(
            'button',
            {
              onClick: () => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending'),
              className: `px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`
            },
            renderIcon(Icons.Clock || Icons.AlertTriangle, { className: 'w-3.5 h-3.5' }),
            `Pending (${totalPendingCount})`
          ),

          canManageApprovals && h(
            'select',
            {
              value: statusFilter,
              onChange: (e) => setStatusFilter(e.target.value),
              className: 'px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500'
            },
            h('option', { value: 'all' }, 'Status: All'),
            h('option', { value: 'approved' }, 'Status: Approved Only'),
            h('option', { value: 'pending' }, 'Status: Pending Review'),
            h('option', { value: 'rejected' }, 'Status: Rejected Only')
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
          renderIcon(Icons.Image, { className: 'w-8 h-8' })
        ),
        h('h3', { className: 'text-lg font-bold text-white' }, 'No Photographs Found'),
        h('p', { className: 'text-xs sm:text-sm text-slate-400 max-w-md mx-auto' },
          'No images match your current filter or search criteria. Try switching sections or upload a new photo.'
        ),
        h(
          'button',
          {
            onClick: () => {
              setSearchQuery('');
              setDeptFilter('All Departments');
              setYearFilter('All Years');
              setEventCatFilter('All');
              setCompanyFilter('All Companies');
              setStatusFilter('all');
            },
            className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition'
          },
          'Reset Filters'
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

          return h(
            'div',
            {
              key: photo.id,
              className: 'group relative rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col justify-between'
            },

            // Image Container with Hover Actions
            h(
              'div',
              { className: 'relative aspect-[4/3] overflow-hidden bg-slate-950 cursor-pointer', onClick: () => setSelectedPhoto(photo) },
              h('img', {
                src: photo.url,
                alt: photo.title,
                loading: 'lazy',
                className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500',
                onError: (e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80';
                }
              }),
              h('div', { className: 'absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity' }),

              // Status Badge
              h(
                'div',
                { className: 'absolute top-3 left-3 flex items-center gap-1.5 flex-wrap' },
                isPending && h(
                  'span',
                  { className: 'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md backdrop-blur-md flex items-center gap-1' },
                  '⏳ Pending Review'
                ),
                isRejected && h(
                  'span',
                  { className: 'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white shadow-md' },
                  'Rejected'
                ),
                photo.category && h(
                  'span',
                  { className: 'px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md' },
                  photo.category
                )
              ),

              // Quick Actions Overlay on Hover
              h(
                'div',
                { className: 'absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity' },
                h(
                  'button',
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      handleDownload(photo.url, photo.title);
                    },
                    title: 'Download photo',
                    className: 'p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md transition'
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
                    title: 'Edit photo metadata',
                    className: 'p-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 backdrop-blur-md transition'
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
                    title: 'Delete photo',
                    className: 'p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 backdrop-blur-md transition'
                  },
                  renderIcon(Icons.Trash, { className: 'w-3.5 h-3.5' })
                )
              )
            ),

            // Card Body Details
            h(
              'div',
              { className: 'p-4 space-y-2 flex-1 flex flex-col justify-between' },
              h(
                'div',
                { className: 'space-y-1' },
                h(
                  'h4',
                  {
                    onClick: () => setSelectedPhoto(photo),
                    className: 'font-bold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer'
                  },
                  photo.title
                ),
                h('p', { className: 'text-xs text-slate-400 line-clamp-2 leading-relaxed' }, photo.description || 'No description provided.')
              ),

              // Metadata & Interactions Footer
              h(
                'div',
                { className: 'pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400' },
                
                // Uploader info
                h(
                  'div',
                  { className: 'flex items-center gap-1.5 truncate max-w-[140px]' },
                  h('div', { className: 'w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0' },
                    photo.uploadedBy?.name ? photo.uploadedBy.name.charAt(0) : 'U'
                  ),
                  h('span', { className: 'truncate text-[11px] text-slate-300' }, photo.uploadedBy?.name || 'Anonymous')
                ),

                // Likes & Comments
                h(
                  'div',
                  { className: 'flex items-center gap-3' },
                  h(
                    'button',
                    {
                      onClick: () => handleToggleLike(photo),
                      className: `flex items-center gap-1 font-semibold text-xs transition ${
                        isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
                      }`
                    },
                    renderIcon(Icons.Heart, { className: `w-4 h-4 ${isLiked ? 'fill-current text-rose-500' : ''}` }),
                    photo.likes || 0
                  ),
                  h(
                    'button',
                    {
                      onClick: () => setSelectedPhoto(photo),
                      className: 'flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition text-xs font-semibold'
                    },
                    renderIcon(Icons.MessageCircle, { className: 'w-4 h-4' }),
                    (photo.comments || []).length
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
      // 8B. EDIT PHOTO MODAL (ADMIN)
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
            className: 'absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-slate-700 backdrop-blur-md transition'
          },
          renderIcon(Icons.X, { className: 'w-5 h-5' })
        ),

        // Left Side: Full Resolution Image & Slideshow Nav
        h(
          'div',
          { className: 'relative flex-1 bg-black flex items-center justify-center min-h-[350px] lg:min-h-[550px] overflow-hidden' },
          h('img', {
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
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Handle Local File Reading & Strict Format / Size Validation
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (!allowedExtensions.includes(ext) || (file.type && !allowedMimes.includes(file.type))) {
        addToast?.('Invalid image format! Only JPG, JPEG, PNG, and WEBP image files are accepted.', 'error');
        e.target.value = '';
        return;
      }

      const maxSizeBytes = 10 * 1024 * 1024; // 10 MB maximum
      if (file.size > maxSizeBytes) {
        addToast?.('Upload failed: File size exceeds the maximum limit of 10 MB.', 'error');
        e.target.value = '';
        return;
      }

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
        addToast?.('Please enter a photo title', 'error');
        return;
      }

      if (!selectedFile && !imageUrl.trim()) {
        addToast?.('Please select an image file to upload (JPG, JPEG, PNG, WEBP) or choose a preset.', 'error');
        return;
      }

      setUploading(true);
      setUploadProgress(15);

      const interval = setInterval(() => {
        setUploadProgress(p => (p >= 85 ? 85 : p + 20));
      }, 150);

      try {
        let res;
        if (selectedFile) {
          const formData = new FormData();
          formData.append('image', selectedFile);
          formData.append('title', title.trim());
          formData.append('description', description.trim());
          formData.append('section', section);
          formData.append('category', category.trim() || 'Campus Event');
          formData.append('department', section === 'department' ? department : 'College Level');
          formData.append('eventYear', section === 'symposium' ? eventYear : '2026');
          if (section === 'placement') formData.append('company', company);
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
            section,
            category: category.trim() || 'Campus Event',
            department: section === 'department' ? department : 'College Level',
            eventYear: section === 'symposium' ? eventYear : '2026',
            company: section === 'placement' ? company : null,
            url: imageUrl.trim() || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
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
            addToast?.(res?.message || 'Photograph uploaded successfully!', 'success');
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
            h('h2', { className: 'text-xl font-bold text-white' }, 'Upload Photograph to Gallery'),
            h('p', { className: 'text-xs text-slate-400 mt-0.5' },
              role === 'student'
                ? 'Student uploads will be forwarded to Department Faculty for review (Pending Approval).'
                : 'Faculty and Admin uploads are published live to the Gallery immediately.'
            )
          ),
          h(
            'button',
            { onClick: onClose, className: 'p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition' },
            renderIcon(Icons.X, { className: 'w-5 h-5' })
          )
        ),

        // Progress Bar (if uploading)
        uploading && h(
          'div',
          { className: 'space-y-2 py-2 animate-fade-in' },
          h(
            'div',
            { className: 'flex items-center justify-between text-xs font-bold text-cyan-400' },
            h('span', null, 'Uploading & Optimizing Photograph...'),
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
                    className: `p-2.5 rounded-xl border text-xs font-bold transition ${
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
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Photo Title *'),
            h('input', {
              type: 'text',
              value: title,
              onChange: (e) => setTitle(e.target.value),
              placeholder: 'e.g. AI Laboratory Neural Network Practical',
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
                placeholder: 'e.g. Hackathon, Cultural, Interview Round',
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

          // Image File / URL Source Picker
          h(
            'div',
            { className: 'space-y-2' },
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-400' }, 'Photo Source (Upload File or URL)'),
            
            h(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
              h(
                'label',
                { className: 'cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500 bg-slate-900/50 hover:bg-slate-900 transition' },
                renderIcon(Icons.Upload, { className: 'w-6 h-6 text-cyan-400 mb-1' }),
                h('span', { className: 'text-xs font-bold text-white' }, 'Choose from Device'),
                h('span', { className: 'text-[10px] text-slate-500' }, 'PNG, JPG, JPEG, WEBP up to 10MB'),
                h('input', {
                  type: 'file',
                  accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
                  onChange: handleFileChange,
                  className: 'hidden'
                })
              ),
              h(
                'div',
                { className: 'flex flex-col justify-center gap-2' },
                h('input', {
                  type: 'text',
                  value: imageUrl,
                  onChange: (e) => {
                    setImageUrl(e.target.value);
                    if (selectedFile) {
                      setSelectedFile(null);
                      setSelectedFileName('');
                      setFileSizeText('');
                    }
                  },
                  placeholder: 'Or paste image URL...',
                  className: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500'
                }),
                h('span', { className: 'text-[10px] text-slate-500' }, 'Or select one of our curated high-res presets below:')
              )
            ),

            // Selected file indicator
            selectedFileName && h(
              'div',
              { className: 'flex items-center justify-between p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-300' },
              h('div', { className: 'flex items-center gap-2 truncate' },
                renderIcon(Icons.CheckCircle, { className: 'w-4 h-4 text-cyan-400 flex-shrink-0' }),
                h('span', { className: 'font-semibold truncate' }, selectedFileName),
                h('span', { className: 'text-[10px] text-slate-400 flex-shrink-0' }, `(${fileSizeText})`)
              ),
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    setSelectedFile(null);
                    setSelectedFileName('');
                    setFileSizeText('');
                    setImageUrl('');
                  },
                  className: 'text-slate-400 hover:text-white ml-2 text-xs font-bold'
                },
                '✕ Remove'
              )
            ),

            // Presets
            h(
              'div',
              { className: 'flex items-center gap-2 overflow-x-auto py-1' },
              SAMPLE_PRESET_IMAGES.map((preset, idx) =>
                h(
                  'button',
                  {
                    type: 'button',
                    key: idx,
                    onClick: () => {
                      setSelectedFile(null);
                      setSelectedFileName('');
                      setFileSizeText('');
                      setImageUrl(preset.url);
                      if (!title) setTitle(preset.title);
                    },
                    className: `flex-shrink-0 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                      imageUrl === preset.url && !selectedFile
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`
                  },
                  preset.title
                )
              )
            ),

            // Live Image Preview
            imageUrl && h(
              'div',
              { className: 'relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black mt-2' },
              h('img', {
                src: imageUrl,
                alt: 'Preview',
                className: 'w-full h-full object-cover'
              }),
              h(
                'span',
                { className: 'absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-cyan-300 backdrop-blur-md' },
                selectedFile ? 'Device File Preview' : 'Live Preview'
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
                className: 'px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition'
              },
              'Cancel'
            ),
            h(
              'button',
              {
                type: 'submit',
                disabled: uploading,
                className: 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 transition'
              },
              uploading ? 'Processing Upload...' : (role === 'student' ? 'Submit for Review' : 'Publish Photograph')
            )
          )
        )
      )
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
