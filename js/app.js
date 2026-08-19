/* ============================================
   SchoolDesk — Main Application Logic
   ============================================ */

// ─── Global State ──────────────────────────────
let currentPage = 'dashboard';
let currentSubPage = null;
let currentEditId = null;
let searchQuery = '';
let feeFilter = 'all';

// ─── SVG Icons ─────────────────────────────────
const ICONS = {
  plus: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
  whatsapp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  email: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  students: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  teacher: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  fees: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  parent: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  save: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  download: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
};

// ─── Initialize App ────────────────────────────
async function initApp() {
  await db.init();
  loadTheme();
  window.renderPage = renderPage;
  await renderPage();
  if (window.syncFromSupabase) {
    window.syncFromSupabase();
  }
}


// ─── Navigation ────────────────────────────────
function navigate(page, subPage = null, id = null) {
  currentPage = page;
  currentSubPage = subPage;
  currentEditId = id;
  searchQuery = '';
  feeFilter = 'all';
  updateNav();
  renderPage();
  // Scroll to top
  document.getElementById('app-content').scrollTop = 0;
}

function goBack() {
  navigate(currentPage);
}

function updateNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === currentPage);
  });
  const backBtn = document.getElementById('back-btn');
  backBtn.style.display = currentSubPage ? 'flex' : 'none';
  const bottomNav = document.getElementById('bottom-nav');
  bottomNav.style.display = currentSubPage ? 'none' : 'flex';
}

function setPageTitle(baseTitle) {
  const titleEl = document.getElementById('page-title');
  titleEl.textContent = baseTitle;
  
  const headerSchoolNameEl = document.getElementById('header-school-name');
  if (headerSchoolNameEl) {
    const schoolName = localStorage.getItem('currentSchoolName') || 'SchoolDesk';
    headerSchoolNameEl.textContent = schoolName;
  }
}

// ─── Page Router ───────────────────────────────
async function renderPage() {
  const content = document.getElementById('app-content');

  switch (currentPage) {
    case 'dashboard':
      setPageTitle('Dashboard');
      await renderDashboard(content);
      break;
    case 'students':
      if (currentSubPage === 'view') {
        setPageTitle('Student Details');
        await renderStudentDetail(content, currentEditId);
      } else {
        setPageTitle('Students');
        await renderStudentsList(content);
      }
      break;
    case 'fees':
      setPageTitle('Fees');
      await renderFeesList(content);
      break;
    case 'teachers':
      if (currentSubPage === 'view') {
        setPageTitle('Teacher Details');
        await renderTeacherDetail(content, currentEditId);
      } else {
        setPageTitle('Teachers');
        await renderTeachersList(content);
      }
      break;
    case 'settings':
      setPageTitle('Settings');
      renderSettings(content);
      break;
  }
}

// ═══════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════
async function renderDashboard(container) {
  const stats = await db.getStats();

  container.innerHTML = `
    <div class="animate-fade">
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card students animate-slide delay-1" onclick="navigate('students')">
          <div class="stat-icon students">
            ${ICONS.students}
          </div>
          <div class="stat-value">${stats.totalStudents}</div>
          <div class="stat-label">Students</div>
        </div>
        <div class="stat-card teachers animate-slide delay-2" onclick="navigate('teachers')">
          <div class="stat-icon teachers">
            ${ICONS.teacher}
          </div>
          <div class="stat-value">${stats.totalTeachers}</div>
          <div class="stat-label">Teachers</div>
        </div>
        <div class="stat-card collected animate-slide delay-3" onclick="navigate('fees')">
          <div class="stat-icon collected">
            ${ICONS.fees}
          </div>
          <div class="stat-value">${formatCurrency(stats.totalCollected)}</div>
          <div class="stat-label">Collected</div>
        </div>
        <div class="stat-card pending animate-slide delay-4" onclick="navigate('fees')">
          <div class="stat-icon pending">
            ${ICONS.warning}
          </div>
          <div class="stat-value">${formatCurrency(stats.totalPending)}</div>
          <div class="stat-label">Pending</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-title">Quick Actions</div>
      <div class="quick-actions">
        <button class="quick-action-btn" onclick="openStudentForm()">
          <div class="quick-action-icon" style="background:rgba(99,102,241,0.15);color:var(--accent-primary)">
            ${ICONS.students}
          </div>
          Add Student
        </button>
        <button class="quick-action-btn" onclick="openFeeForm()">
          <div class="quick-action-icon" style="background:rgba(16,185,129,0.15);color:var(--accent-success)">
            ${ICONS.fees}
          </div>
          Record Fee
        </button>
        <button class="quick-action-btn" onclick="openTeacherForm()">
          <div class="quick-action-icon" style="background:rgba(6,182,212,0.15);color:var(--accent-info)">
            ${ICONS.teacher}
          </div>
          Add Teacher
        </button>
        <button class="quick-action-btn" onclick="openParentForm()">
          <div class="quick-action-icon" style="background:rgba(236,72,153,0.15);color:#EC4899">
            ${ICONS.parent}
          </div>
          Add Parent
        </button>
      </div>

      <!-- Recent Activity -->
      <div class="section-title">Recent Activity</div>
      <div class="card">
        ${stats.recentActivity.length > 0 ? `
          <div class="activity-list">
            ${stats.recentActivity.map(a => `
              <div class="activity-item">
                <div class="activity-dot ${a.type}"></div>
                <div class="activity-content">
                  <div class="activity-text">${a.text}</div>
                  <div class="activity-time">${timeAgo(a.time)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state" style="padding:24px">
            <div class="empty-state-text">No activity yet. Start by adding students!</div>
          </div>
        `}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════
// STUDENTS LIST
// ═══════════════════════════════════════════════
async function renderStudentsList(container) {
  let students = await db.getAllStudents();

  // Filter by search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    students = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.class && s.class.toLowerCase().includes(q)) ||
      (s.rollNumber && s.rollNumber.toString().includes(q))
    );
  }

  // Sort by name
  students.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  container.innerHTML = `
    <div class="animate-fade">
      <div class="search-container">
        <span class="search-icon">${ICONS.search}</span>
        <input type="text" class="search-input" id="student-search"
               placeholder="Search students..." value="${searchQuery}"
               oninput="handleStudentSearch(this.value)">
      </div>

      ${students.length > 0 ? `
        <div class="record-list">
          ${students.map((s, i) => `
            <div class="record-card animate-slide delay-${Math.min(i + 1, 6)}" onclick="navigate('students','view','${s.id}')">
              <div class="record-avatar" style="background:${getAvatarColor(s.name)}">
                ${getInitials(s.name)}
              </div>
              <div class="record-info">
                <div class="record-name">${s.name}</div>
                <div class="record-meta">
                  <span>Class ${s.class || '—'}${s.section ? '-' + s.section : ''}</span>
                  ${s.rollNumber ? `<span>Roll #${s.rollNumber}</span>` : ''}
                </div>
              </div>
              <div class="record-actions" onclick="event.stopPropagation()">
                <button class="record-action-btn" onclick="openStudentForm('${s.id}')" title="Edit">
                  ${ICONS.edit}
                </button>
                <button class="record-action-btn delete" onclick="deleteStudent('${s.id}')" title="Delete">
                  ${ICONS.trash}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${ICONS.students}</div>
          <div class="empty-state-title">No students yet</div>
          <div class="empty-state-text">Add your first student to get started with managing records.</div>
          <button class="btn btn-primary" onclick="openStudentForm()">
            ${ICONS.plus} Add Student
          </button>
        </div>
      `}
    </div>

    <button class="fab" onclick="openStudentForm()" title="Add Student">
      ${ICONS.plus}
    </button>
  `;
}

const handleStudentSearch = debounce((value) => {
  searchQuery = value;
  renderStudentsList(document.getElementById('app-content'));
}, 300);

// ═══════════════════════════════════════════════
// STUDENT DETAIL
// ═══════════════════════════════════════════════
async function renderStudentDetail(container, id) {
  const student = await db.getStudent(id);
  if (!student) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Student not found</div></div>';
    return;
  }

  const parent = await db.getParentByStudent(id);
  const fees = await db.getFeesByStudent(id);
  fees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const cleanPhone = (ph) => (ph || '').replace(/\D/g, '');

  container.innerHTML = `
    <div class="animate-fade">
      <div class="detail-header">
        <div class="detail-avatar" style="background:${getAvatarColor(student.name)}">
          ${getInitials(student.name)}
        </div>
        <div class="detail-name">${student.name}</div>
        <div class="detail-subtitle">Class ${student.class || '—'}${student.section ? ' - Section ' + student.section : ''}</div>
      </div>

      <!-- Student Info -->
      <div class="detail-section">
        <div class="detail-section-title">Student Information</div>
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-item-label">Roll Number</div>
            <div class="detail-item-value">${student.rollNumber || '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Gender</div>
            <div class="detail-item-value">${student.gender || '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Date of Birth</div>
            <div class="detail-item-value">${formatDate(student.dateOfBirth)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Admission Date</div>
            <div class="detail-item-value">${formatDate(student.admissionDate)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Phone</div>
            <div class="detail-item-value">${student.phone ? `<a href="tel:${student.phone}" style="color:var(--accent-primary)">${student.phone}</a>` : '—'}</div>
          </div>
          <div class="detail-item full">
            <div class="detail-item-label">Address</div>
            <div class="detail-item-value">${student.address || '—'}</div>
          </div>
        </div>
      </div>

      <!-- Parent Info -->
      <div class="detail-section">
        <div class="detail-section-title">Parent / Guardian</div>
        ${parent ? `
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-item-label">Father</div>
              <div class="detail-item-value">${parent.fatherName || '—'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Mother</div>
              <div class="detail-item-value">${parent.motherName || '—'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Father's Phone</div>
              <div class="detail-item-value">${parent.fatherPhone || '—'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Mother's Phone</div>
              <div class="detail-item-value">${parent.motherPhone || '—'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Email</div>
              <div class="detail-item-value">${parent.email || '—'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Occupation</div>
              <div class="detail-item-value">${parent.occupation || '—'}</div>
            </div>
            <div class="detail-item full">
              <div class="detail-item-label">Address</div>
              <div class="detail-item-value">${parent.address || '—'}</div>
            </div>
          </div>
          <div class="contact-buttons">
            ${parent.fatherPhone ? `
              <a href="tel:${parent.fatherPhone}" class="contact-btn call">${ICONS.phone} Call Father</a>
              <a href="https://wa.me/${cleanPhone(parent.fatherPhone)}" target="_blank" class="contact-btn whatsapp">${ICONS.whatsapp} WhatsApp</a>
            ` : ''}
            ${parent.motherPhone ? `
              <a href="tel:${parent.motherPhone}" class="contact-btn call">${ICONS.phone} Call Mother</a>
              <a href="https://wa.me/${cleanPhone(parent.motherPhone)}" target="_blank" class="contact-btn whatsapp">${ICONS.whatsapp} WhatsApp</a>
            ` : ''}
            ${parent.email ? `
              <a href="mailto:${parent.email}" class="contact-btn email-btn">${ICONS.email} Email</a>
            ` : ''}
          </div>
          <div class="mt-8">
            <button class="btn btn-outline btn-sm" onclick="openParentForm('${id}','${parent.id}')">
              ${ICONS.edit} Edit Parent Info
            </button>
          </div>
        ` : `
          <div class="card" style="text-align:center;padding:24px">
            <p style="color:var(--text-secondary);margin-bottom:16px">No parent info added yet</p>
            <button class="btn btn-primary btn-sm" onclick="openParentForm('${id}')">
              ${ICONS.plus} Add Parent
            </button>
          </div>
        `}
      </div>

      <!-- Fee History -->
      <div class="detail-section">
        <div class="flex-between mb-16">
          <div class="detail-section-title" style="margin-bottom:0;border-bottom:none;padding-bottom:0">Fee History</div>
          <button class="btn btn-primary btn-sm" onclick="openFeeForm('${id}')">
            ${ICONS.plus} Add Fee
          </button>
        </div>
        ${fees.length > 0 ? `
          <div class="record-list">
            ${fees.map(f => `
              <div class="record-card" style="cursor:default">
                <div class="record-info">
                  <div class="record-name">${f.feeType} Fee</div>
                  <div class="record-meta">
                    <span>${formatDate(f.date)}</span>
                    <span>${f.paymentMethod || ''}</span>
                  </div>
                </div>
                <div class="flex gap-8" style="align-items:center">
                  <span class="fee-amount ${f.status}">${formatCurrency(f.amount)}</span>
                  <span class="badge badge-${f.status === 'paid' ? 'paid' : f.status === 'pending' ? 'pending' : 'overdue'}">${f.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card" style="text-align:center;padding:20px">
            <p style="color:var(--text-secondary)">No fee records yet</p>
          </div>
        `}
      </div>

      <!-- Actions -->
      <div class="detail-actions">
        <button class="btn btn-primary" style="flex:1" onclick="openStudentForm('${id}')">
          ${ICONS.edit} Edit Student
        </button>
        <button class="btn btn-danger" onclick="deleteStudent('${id}')">
          ${ICONS.trash} Delete
        </button>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════
// TEACHERS LIST
// ═══════════════════════════════════════════════
async function renderTeachersList(container) {
  let teachers = await db.getAllTeachers();

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    teachers = teachers.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.subject && t.subject.toLowerCase().includes(q))
    );
  }

  teachers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  container.innerHTML = `
    <div class="animate-fade">
      <div class="search-container">
        <span class="search-icon">${ICONS.search}</span>
        <input type="text" class="search-input" id="teacher-search"
               placeholder="Search teachers..." value="${searchQuery}"
               oninput="handleTeacherSearch(this.value)">
      </div>

      ${teachers.length > 0 ? `
        <div class="record-list">
          ${teachers.map((t, i) => `
            <div class="record-card animate-slide delay-${Math.min(i + 1, 6)}" onclick="navigate('teachers','view','${t.id}')">
              <div class="record-avatar" style="background:${getAvatarColor(t.name)}">
                ${getInitials(t.name)}
              </div>
              <div class="record-info">
                <div class="record-name">${t.name}</div>
                <div class="record-meta">
                  <span>${t.subject || 'No subject'}</span>
                  ${t.phone ? `<span>${t.phone}</span>` : ''}
                </div>
              </div>
              <div class="record-actions" onclick="event.stopPropagation()">
                <button class="record-action-btn" onclick="openTeacherForm('${t.id}')" title="Edit">
                  ${ICONS.edit}
                </button>
                <button class="record-action-btn delete" onclick="deleteTeacher('${t.id}')" title="Delete">
                  ${ICONS.trash}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${ICONS.teacher}</div>
          <div class="empty-state-title">No teachers yet</div>
          <div class="empty-state-text">Add teachers to manage their contacts and subjects.</div>
          <button class="btn btn-primary" onclick="openTeacherForm()">
            ${ICONS.plus} Add Teacher
          </button>
        </div>
      `}
    </div>

    <button class="fab" onclick="openTeacherForm()" title="Add Teacher">
      ${ICONS.plus}
    </button>
  `;
}

const handleTeacherSearch = debounce((value) => {
  searchQuery = value;
  renderTeachersList(document.getElementById('app-content'));
}, 300);

// ═══════════════════════════════════════════════
// TEACHER DETAIL
// ═══════════════════════════════════════════════
async function renderTeacherDetail(container, id) {
  const teacher = await db.getTeacher(id);
  if (!teacher) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Teacher not found</div></div>';
    return;
  }

  const cleanPhone = (ph) => (ph || '').replace(/\D/g, '');

  container.innerHTML = `
    <div class="animate-fade">
      <div class="detail-header">
        <div class="detail-avatar" style="background:${getAvatarColor(teacher.name)}">
          ${getInitials(teacher.name)}
        </div>
        <div class="detail-name">${teacher.name}</div>
        <div class="detail-subtitle">${teacher.subject || 'No subject assigned'}</div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Teacher Information</div>
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-item-label">Phone</div>
            <div class="detail-item-value">${teacher.phone ? `<a href="tel:${teacher.phone}" style="color:var(--accent-primary)">${teacher.phone}</a>` : '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Email</div>
            <div class="detail-item-value">${teacher.email || '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Qualification</div>
            <div class="detail-item-value">${teacher.qualification || '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Join Date</div>
            <div class="detail-item-value">${formatDate(teacher.joinDate)}</div>
          </div>
          <div class="detail-item full">
            <div class="detail-item-label">Address</div>
            <div class="detail-item-value">${teacher.address || '—'}</div>
          </div>
        </div>
      </div>

      <div class="contact-buttons mb-24">
        ${teacher.phone ? `
          <a href="tel:${teacher.phone}" class="contact-btn call">${ICONS.phone} Call</a>
          <a href="https://wa.me/${cleanPhone(teacher.phone)}" target="_blank" class="contact-btn whatsapp">${ICONS.whatsapp} WhatsApp</a>
        ` : ''}
        ${teacher.email ? `
          <a href="mailto:${teacher.email}" class="contact-btn email-btn">${ICONS.email} Email</a>
        ` : ''}
      </div>

      <div class="detail-actions">
        <button class="btn btn-primary" style="flex:1" onclick="openTeacherForm('${id}')">
          ${ICONS.edit} Edit Teacher
        </button>
        <button class="btn btn-danger" onclick="deleteTeacher('${id}')">
          ${ICONS.trash} Delete
        </button>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════
// FEES LIST
// ═══════════════════════════════════════════════
async function renderFeesList(container) {
  let fees = await db.getAllFees();
  const students = await db.getAllStudents();
  const studentMap = {};
  students.forEach(s => studentMap[s.id] = s.name);

  // Filter
  if (feeFilter !== 'all') {
    fees = fees.filter(f => f.status === feeFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    fees = fees.filter(f => {
      const studentName = (studentMap[f.studentId] || '').toLowerCase();
      return studentName.includes(q) || (f.feeType || '').toLowerCase().includes(q);
    });
  }

  fees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  container.innerHTML = `
    <div class="animate-fade">
      <div class="search-container">
        <span class="search-icon">${ICONS.search}</span>
        <input type="text" class="search-input" id="fee-search"
               placeholder="Search by student name..." value="${searchQuery}"
               oninput="handleFeeSearch(this.value)">
      </div>

      <div class="filter-tabs">
        <button class="filter-tab ${feeFilter === 'all' ? 'active' : ''}" onclick="setFeeFilter('all')">All</button>
        <button class="filter-tab ${feeFilter === 'paid' ? 'active' : ''}" onclick="setFeeFilter('paid')">Paid</button>
        <button class="filter-tab ${feeFilter === 'pending' ? 'active' : ''}" onclick="setFeeFilter('pending')">Pending</button>
        <button class="filter-tab ${feeFilter === 'overdue' ? 'active' : ''}" onclick="setFeeFilter('overdue')">Overdue</button>
      </div>

      ${fees.length > 0 ? `
        <div class="record-list">
          ${fees.map((f, i) => `
            <div class="record-card animate-slide delay-${Math.min(i + 1, 6)}">
              <div class="record-avatar" style="background:${getAvatarColor(studentMap[f.studentId] || 'Fee')}">
                ${getInitials(studentMap[f.studentId] || '??')}
              </div>
              <div class="record-info">
                <div class="record-name">${studentMap[f.studentId] || 'Unknown Student'}</div>
                <div class="record-meta">
                  <span>${f.feeType}</span>
                  <span>${formatDate(f.date)}</span>
                </div>
              </div>
              <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:4px">
                <span class="fee-amount ${f.status}">${formatCurrency(f.amount)}</span>
                <span class="badge badge-${f.status === 'paid' ? 'paid' : f.status === 'pending' ? 'pending' : 'overdue'}">${f.status}</span>
              </div>
              <div class="record-actions" onclick="event.stopPropagation()" style="margin-left:4px">
                <button class="record-action-btn" onclick="openFeeForm(null,'${f.id}')" title="Edit">
                  ${ICONS.edit}
                </button>
                <button class="record-action-btn delete" onclick="deleteFee('${f.id}')" title="Delete">
                  ${ICONS.trash}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${ICONS.fees}</div>
          <div class="empty-state-title">No fee records</div>
          <div class="empty-state-text">${feeFilter !== 'all' ? `No ${feeFilter} fees found.` : 'Start recording fees to track payments.'}</div>
          <button class="btn btn-primary" onclick="openFeeForm()">
            ${ICONS.plus} Record Fee
          </button>
        </div>
      `}
    </div>

    <button class="fab" onclick="openFeeForm()" title="Record Fee">
      ${ICONS.plus}
    </button>
  `;
}

function setFeeFilter(filter) {
  feeFilter = filter;
  renderFeesList(document.getElementById('app-content'));
}

const handleFeeSearch = debounce((value) => {
  searchQuery = value;
  renderFeesList(document.getElementById('app-content'));
}, 300);

// ═══════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════
function renderSettings(container) {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  container.innerHTML = `
    <div class="animate-fade">
      <div class="settings-list">
        <div class="settings-item" onclick="document.getElementById('theme-switch').click()">
          <div class="settings-item-left">
            <div class="settings-icon" style="background:rgba(99,102,241,0.15);color:var(--accent-primary)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            </div>
            <div class="settings-item-info">
              <h3>Dark Mode</h3>
              <p>Toggle dark and light theme</p>
            </div>
          </div>
          <label class="toggle-switch" onclick="event.stopPropagation()">
            <input type="checkbox" id="theme-switch" ${isDark ? 'checked' : ''} onchange="toggleTheme()">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="settings-item" onclick="changeSchoolName()">
          <div class="settings-item-left">
            <div class="settings-icon" style="background:rgba(245,158,11,0.15);color:var(--accent-warning)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div class="settings-item-info">
              <h3>Change School Name</h3>
              <p>Update the display name of your school</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        <div class="settings-item" onclick="exportData()">
          <div class="settings-item-left">
            <div class="settings-icon" style="background:rgba(16,185,129,0.15);color:var(--accent-success)">
              ${ICONS.download}
            </div>
            <div class="settings-item-info">
              <h3>Export Data</h3>
              <p>Download backup as JSON file</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        <div class="settings-item" onclick="importData()">
          <div class="settings-item-left">
            <div class="settings-icon" style="background:rgba(6,182,212,0.15);color:var(--accent-info)">
              ${ICONS.upload}
            </div>
            <div class="settings-item-info">
              <h3>Import Data</h3>
              <p>Restore from a JSON backup file</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        <div class="settings-item" onclick="clearAllData()">
          <div class="settings-item-left">
            <div class="settings-icon" style="background:rgba(239,68,68,0.15);color:var(--accent-danger)">
              ${ICONS.trash}
            </div>
            <div class="settings-item-info">
              <h3>Clear All Data</h3>
              <p>Delete all records permanently</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- About -->
      <div class="card about-card mt-24">
        <div class="about-logo">S</div>
        <div class="about-name">SchoolDesk</div>
        <div class="about-version">Version 1.0.0</div>
        <div class="about-developer" style="margin-top: 4px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; color: var(--accent-primary);">DEVELOPED BY NOMAN SHAIKH</div>
        <div class="about-desc" style="margin-top: 12px;">A modern school management app for tracking students, fees, parents & teachers.</div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════
// MODAL / FORM SYSTEM
// ═══════════════════════════════════════════════
function openModal(title, formHTML, onSubmit) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <div class="modal-handle"></div>
    <div class="modal-header">
      <h2 class="modal-title">${title}</h2>
      <button class="modal-close" onclick="closeModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form id="modal-form" onsubmit="handleFormSubmit(event)">
      ${formHTML}
      <button type="submit" class="btn btn-primary btn-block mt-24">
        ${ICONS.save} Save
      </button>
    </form>
  `;
  window._currentFormSubmit = onSubmit;
  overlay.classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  window._currentFormSubmit = null;
}

function closeModalOverlay(event) {
  if (event.target === event.currentTarget) closeModal();
}

async function handleFormSubmit(event) {
  event.preventDefault();
  if (window._currentFormSubmit) {
    await window._currentFormSubmit(event.target);
  }
}

// ═══════════════════════════════════════════════
// STUDENT FORM
// ═══════════════════════════════════════════════
async function openStudentForm(editId = null) {
  let student = {};
  if (editId) {
    student = await db.getStudent(editId) || {};
  }

  const classOptions = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];

  const formHTML = `
    <div class="form-group">
      <label class="form-label">Full Name *</label>
      <input type="text" class="form-input" name="name" value="${student.name || ''}" required placeholder="Enter student name">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Class</label>
        <select class="form-select" name="class">
          <option value="">Select Class</option>
          ${classOptions.map(c => `<option value="${c}" ${student.class === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Section</label>
        <select class="form-select" name="section">
          <option value="">Select</option>
          ${['A', 'B', 'C', 'D', 'E'].map(s => `<option value="${s}" ${student.section === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Roll Number</label>
        <input type="number" class="form-input" name="rollNumber" value="${student.rollNumber || ''}" placeholder="e.g. 1">
      </div>
      <div class="form-group">
        <label class="form-label">Gender</label>
        <select class="form-select" name="gender">
          <option value="">Select</option>
          ${['Male', 'Female', 'Other'].map(g => `<option value="${g}" ${student.gender === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Date of Birth</label>
        <input type="date" class="form-input" name="dateOfBirth" value="${student.dateOfBirth || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Admission Date</label>
        <input type="date" class="form-input" name="admissionDate" value="${student.admissionDate || ''}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Phone</label>
      <input type="tel" class="form-input" name="phone" value="${student.phone || ''}" placeholder="Phone number">
    </div>
    <div class="form-group">
      <label class="form-label">Address</label>
      <textarea class="form-textarea" name="address" placeholder="Full address">${student.address || ''}</textarea>
    </div>
  `;

  openModal(editId ? 'Edit Student' : 'Add Student', formHTML, async (form) => {
    const data = {
      name: form.name.value.trim(),
      class: form.class.value,
      section: form.section.value,
      rollNumber: form.rollNumber.value,
      dateOfBirth: form.dateOfBirth.value,
      gender: form.gender.value,
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      admissionDate: form.admissionDate.value,
    };

    if (!data.name) {
      showToast('Please enter a name', 'error');
      return;
    }

    try {
      if (editId) {
        await db.updateStudent(editId, data);
        showToast('Student updated!', 'success');
      } else {
        await db.addStudent(data);
        showToast('Student added!', 'success');
      }
      closeModal();
      renderPage();
    } catch (err) {
      showToast('Error saving student', 'error');
    }
  });
}

// ═══════════════════════════════════════════════
// TEACHER FORM
// ═══════════════════════════════════════════════
async function openTeacherForm(editId = null) {
  let teacher = {};
  if (editId) {
    teacher = await db.getTeacher(editId) || {};
  }

  const formHTML = `
    <div class="form-group">
      <label class="form-label">Full Name *</label>
      <input type="text" class="form-input" name="name" value="${teacher.name || ''}" required placeholder="Enter teacher name">
    </div>
    <div class="form-group">
      <label class="form-label">Subject</label>
      <input type="text" class="form-input" name="subject" value="${teacher.subject || ''}" placeholder="e.g. Mathematics">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Phone</label>
        <input type="tel" class="form-input" name="phone" value="${teacher.phone || ''}" placeholder="Phone number">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" name="email" value="${teacher.email || ''}" placeholder="Email address">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Qualification</label>
        <input type="text" class="form-input" name="qualification" value="${teacher.qualification || ''}" placeholder="e.g. M.Sc, B.Ed">
      </div>
      <div class="form-group">
        <label class="form-label">Join Date</label>
        <input type="date" class="form-input" name="joinDate" value="${teacher.joinDate || ''}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Address</label>
      <textarea class="form-textarea" name="address" placeholder="Full address">${teacher.address || ''}</textarea>
    </div>
  `;

  openModal(editId ? 'Edit Teacher' : 'Add Teacher', formHTML, async (form) => {
    const data = {
      name: form.name.value.trim(),
      subject: form.subject.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      qualification: form.qualification.value.trim(),
      address: form.address.value.trim(),
      joinDate: form.joinDate.value,
    };

    if (!data.name) {
      showToast('Please enter a name', 'error');
      return;
    }

    try {
      if (editId) {
        await db.updateTeacher(editId, data);
        showToast('Teacher updated!', 'success');
      } else {
        await db.addTeacher(data);
        showToast('Teacher added!', 'success');
      }
      closeModal();
      renderPage();
    } catch (err) {
      showToast('Error saving teacher', 'error');
    }
  });
}

// ═══════════════════════════════════════════════
// PARENT FORM
// ═══════════════════════════════════════════════
async function openParentForm(studentId = null, editId = null) {
  let parent = {};
  if (editId) {
    parent = await db.getParent(editId) || {};
  }

  // If no studentId, let user pick
  let studentSelectHTML = '';
  if (!studentId && !editId) {
    const students = await db.getAllStudents();
    if (students.length === 0) {
      showToast('Please add a student first', 'warning');
      return;
    }
    studentSelectHTML = `
      <div class="form-group">
        <label class="form-label">Student *</label>
        <select class="form-select" name="studentId" required>
          <option value="">Select Student</option>
          ${students.map(s => `<option value="${s.id}">${s.name} (Class ${s.class || '—'})</option>`).join('')}
        </select>
      </div>
    `;
  }

  const formHTML = `
    ${studentSelectHTML}
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Father's Name</label>
        <input type="text" class="form-input" name="fatherName" value="${parent.fatherName || ''}" placeholder="Father's name">
      </div>
      <div class="form-group">
        <label class="form-label">Mother's Name</label>
        <input type="text" class="form-input" name="motherName" value="${parent.motherName || ''}" placeholder="Mother's name">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Father's Phone</label>
        <input type="tel" class="form-input" name="fatherPhone" value="${parent.fatherPhone || ''}" placeholder="Phone number">
      </div>
      <div class="form-group">
        <label class="form-label">Mother's Phone</label>
        <input type="tel" class="form-input" name="motherPhone" value="${parent.motherPhone || ''}" placeholder="Phone number">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" name="email" value="${parent.email || ''}" placeholder="Email address">
      </div>
      <div class="form-group">
        <label class="form-label">Occupation</label>
        <input type="text" class="form-input" name="occupation" value="${parent.occupation || ''}" placeholder="Occupation">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Address</label>
      <textarea class="form-textarea" name="address" placeholder="Full address">${parent.address || ''}</textarea>
    </div>
  `;

  openModal(editId ? 'Edit Parent' : 'Add Parent', formHTML, async (form) => {
    const sid = studentId || (form.studentId ? form.studentId.value : parent.studentId);

    if (!sid) {
      showToast('Please select a student', 'error');
      return;
    }

    const data = {
      studentId: sid,
      fatherName: form.fatherName.value.trim(),
      motherName: form.motherName.value.trim(),
      fatherPhone: form.fatherPhone.value.trim(),
      motherPhone: form.motherPhone.value.trim(),
      email: form.email.value.trim(),
      address: form.address.value.trim(),
      occupation: form.occupation.value.trim(),
    };

    try {
      if (editId) {
        await db.updateParent(editId, data);
        showToast('Parent info updated!', 'success');
      } else {
        await db.addParent(data);
        showToast('Parent added!', 'success');
      }
      closeModal();
      renderPage();
    } catch (err) {
      showToast('Error saving parent info', 'error');
    }
  });
}

// ═══════════════════════════════════════════════
// FEE FORM
// ═══════════════════════════════════════════════
async function openFeeForm(prefillStudentId = null, editId = null) {
  let fee = {};
  if (editId) {
    fee = await db.getFee(editId) || {};
  }

  const students = await db.getAllStudents();
  if (students.length === 0 && !editId) {
    showToast('Please add a student first', 'warning');
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const selectedStudentId = prefillStudentId || fee.studentId || '';

  const formHTML = `
    <div class="form-group">
      <label class="form-label">Student *</label>
      <select class="form-select" name="studentId" required>
        <option value="">Select Student</option>
        ${students.map(s => `<option value="${s.id}" ${s.id === selectedStudentId ? 'selected' : ''}>${s.name} (Class ${s.class || '—'})</option>`).join('')}
      </select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Amount *</label>
        <input type="number" class="form-input" name="amount" value="${fee.amount || ''}" required placeholder="e.g. 5000" min="0">
      </div>
      <div class="form-group">
        <label class="form-label">Fee Type</label>
        <select class="form-select" name="feeType">
          ${['Tuition', 'Exam', 'Transport', 'Library', 'Sports', 'Other'].map(t => `<option value="${t}" ${fee.feeType === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="date" class="form-input" name="date" value="${fee.date || today}">
      </div>
      <div class="form-group">
        <label class="form-label">Due Date</label>
        <input type="date" class="form-input" name="dueDate" value="${fee.dueDate || ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" name="status">
          ${['paid', 'pending', 'overdue'].map(s => `<option value="${s}" ${fee.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Payment Method</label>
        <select class="form-select" name="paymentMethod">
          <option value="">Select</option>
          ${['Cash', 'Online', 'Cheque'].map(m => `<option value="${m}" ${fee.paymentMethod === m ? 'selected' : ''}>${m}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Remarks</label>
      <textarea class="form-textarea" name="remarks" placeholder="Any notes...">${fee.remarks || ''}</textarea>
    </div>
  `;

  openModal(editId ? 'Edit Fee' : 'Record Fee', formHTML, async (form) => {
    const data = {
      studentId: form.studentId.value,
      amount: form.amount.value,
      feeType: form.feeType.value,
      date: form.date.value,
      dueDate: form.dueDate.value,
      status: form.status.value,
      paymentMethod: form.paymentMethod.value,
      remarks: form.remarks.value.trim(),
    };

    if (!data.studentId) {
      showToast('Please select a student', 'error');
      return;
    }
    if (!data.amount || data.amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    try {
      if (editId) {
        await db.updateFee(editId, data);
        showToast('Fee updated!', 'success');
      } else {
        await db.addFee(data);
        showToast('Fee recorded!', 'success');
      }
      closeModal();
      renderPage();
    } catch (err) {
      showToast('Error saving fee', 'error');
    }
  });
}

// ═══════════════════════════════════════════════
// DELETE FUNCTIONS
// ═══════════════════════════════════════════════
async function deleteStudent(id) {
  const confirmed = await confirmAction('Delete this student and all their parent/fee records?');
  if (confirmed) {
    const parent = await db.getParentByStudent(id);
    if (parent) await db.deleteParent(parent.id);
    const fees = await db.getFeesByStudent(id);
    for (const fee of fees) await db.deleteFee(fee.id);
    await db.deleteStudent(id);
    showToast('Student deleted', 'success');
    navigate('students');
  }
}

async function deleteTeacher(id) {
  const confirmed = await confirmAction('Delete this teacher?');
  if (confirmed) {
    await db.deleteTeacher(id);
    showToast('Teacher deleted', 'success');
    navigate('teachers');
  }
}

async function deleteFee(id) {
  const confirmed = await confirmAction('Delete this fee record?');
  if (confirmed) {
    await db.deleteFee(id);
    showToast('Fee record deleted', 'success');
    renderPage();
  }
}

// ═══════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') !== 'light';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  updateThemeIcon();
  // Update settings toggle if on settings page
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) themeSwitch.checked = !isDark;
}

function loadTheme() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const darkIcon = document.getElementById('theme-icon-dark');
  const lightIcon = document.getElementById('theme-icon-light');
  if (darkIcon) darkIcon.style.display = isLight ? 'none' : 'block';
  if (lightIcon) lightIcon.style.display = isLight ? 'block' : 'none';
}

// ═══════════════════════════════════════════════
// SETTINGS FUNCTIONS
// ═══════════════════════════════════════════════
async function changeSchoolName() {
  const currentName = localStorage.getItem('currentSchoolName') || 'SchoolDesk';
  const newName = prompt('Enter new school name:', currentName);
  
  if (newName !== null && newName.trim() !== '' && newName.trim() !== currentName) {
    const finalName = newName.trim();
    
    // Attempt remote update first if function is available
    if (window.updateSchoolName) {
      showToast('Updating school name...', 'info');
      const success = await window.updateSchoolName(finalName);
      if (!success) {
        showToast('Failed to update school name. Name might be taken.', 'error');
        return;
      }
    }
    
    localStorage.setItem('currentSchoolName', finalName);
    // Refresh the page title/header immediately
    setPageTitle(currentPage.charAt(0).toUpperCase() + currentPage.slice(1));
    showToast('School name updated successfully', 'success');
  }
}

async function exportData() {
  try {
    const data = await db.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schooldesk-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
  } catch (err) {
    showToast('Error exporting data', 'error');
  }
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      await db.importData(text);
      showToast('Data imported successfully!', 'success');
      navigate('dashboard');
    } catch (err) {
      showToast('Invalid backup file', 'error');
    }
  };
  input.click();
}

async function clearAllData() {
  const confirmed = await confirmAction('Are you sure you want to delete ALL data? This cannot be undone.');
  if (confirmed) {
    await db.clearAll();
    showToast('All data cleared', 'info');
    navigate('dashboard');
  }
}

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', initApp);
