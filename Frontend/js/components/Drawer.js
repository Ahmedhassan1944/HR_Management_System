/**
 * @file Drawer.js
 * @description Employee profile drawer component controller.
 *              Manages open/close state, tab switching, and profile rendering.
 */

'use strict';

const Drawer = (() => {

  const drawerEl    = document.getElementById('employeeDrawer');
  const overlayEl   = document.getElementById('drawerOverlay');
  const closeBtn    = document.getElementById('drawerClose');
  const drawerBody  = document.getElementById('drawerBody');
  const drawerName  = document.getElementById('drawerName');
  const drawerSub   = document.getElementById('drawerSubtitle');
  const drawerAvatar= document.getElementById('drawerAvatar');

  let _currentEmployee = null;

  // ── Lifecycle ──────────────────────────────────────────────

  function open(employee) {
    _currentEmployee = employee;
    _renderProfile(employee);
    drawerEl.classList.add('drawer--open');
    overlayEl.classList.add('drawer-overlay--visible');
    drawerEl.setAttribute('aria-hidden', 'false');
    overlayEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus management
    setTimeout(() => closeBtn.focus(), 300);
  }

  function close() {
    drawerEl.classList.remove('drawer--open');
    overlayEl.classList.remove('drawer-overlay--visible');
    drawerEl.setAttribute('aria-hidden', 'true');
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    _currentEmployee = null;
  }

  // ── Tab Management ─────────────────────────────────────────

  function _initTabs() {
    const tabs = drawerEl.querySelectorAll('.drawer__tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => _switchTab(tab.dataset.tab));
      tab.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') _switchTab(tab.dataset.tab);
      });
    });
  }

  function _switchTab(tabKey) {
    drawerEl.querySelectorAll('.drawer__tab').forEach(t => {
      const isActive = t.dataset.tab === tabKey;
      t.classList.toggle('drawer__tab--active', isActive);
      t.setAttribute('aria-selected', String(isActive));
      t.tabIndex = isActive ? 0 : -1;
    });
    drawerBody.querySelectorAll('.drawer__tab-panel').forEach(p => {
      p.classList.toggle('drawer__tab-panel--active', p.dataset.panel === tabKey);
    });
  }

  // ── Profile Rendering ──────────────────────────────────────

  function _renderProfile(emp) {
    // Header
    const initials = (emp.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    drawerAvatar.textContent = initials;
    drawerName.textContent   = emp.name || '—';
    drawerSub.textContent    = [emp.title, emp.department].filter(Boolean).join(' · ');

    drawerBody.innerHTML = `
      <!-- Personal Tab -->
      <div class="drawer__tab-panel drawer__tab-panel--active" data-panel="personal">
        <div class="profile-section">
          <div class="profile-section__title">Personal Information</div>
          <div class="profile-fields">
            ${_field('Employee Code', emp.code)}
            ${_field('English Name', emp.name)}
            ${_field('Arabic Name', emp.nameAr || '—')}
            ${_field('Gender', emp.gender || '—')}
            ${_field('Date of Birth', _formatDate(emp.birthDate))}
            ${_field('Age', emp.age ? `${emp.age} years` : '—')}
            ${_field('Nationality', emp.nationality || '—')}
            ${_field('Classification', emp.class || '—')}
            ${_field('Employment Type', emp.direct || '—')}
            ${_field('Local / Expat', emp.localExpat || '—')}
          </div>
        </div>
      </div>

      <!-- Job Details Tab -->
      <div class="drawer__tab-panel" data-panel="job">
        <div class="profile-section">
          <div class="profile-section__title">Job Information</div>
          <div class="profile-fields">
            ${_field('Job Title', emp.title || '—')}
            ${_field('Department', emp.department || '—')}
            ${_field('Section', emp.section || '—')}
            ${_field('Project / Site', emp.project || '—')}
            ${_field('Acting As', emp.actingAs || '—')}
            ${_field('Hire Date', _formatDate(emp.hireDate))}
            ${_field('Tenure', emp.tenureYears ? `${emp.tenureYears} years` : '—')}
            ${_field('Remarks', emp.remarks || '—')}
          </div>
        </div>
      </div>

      <!-- Documents Tab -->
      <div class="drawer__tab-panel" data-panel="documents">
        <div class="profile-section">
          <div class="profile-section__title">Identity Documents</div>
          <div class="profile-fields">
            ${_field('Passport No.', emp.passportNo || '—')}
            ${_fieldWithBadge('Passport Expiry', _formatDate(emp.passportExp), emp.passportStatus)}
            ${_field('Civil / Resident ID', emp.civilNo || '—')}
            ${_fieldWithBadge('Civil ID Expiry', _formatDate(emp.civilExp), emp.civilStatus)}
          </div>
        </div>
        <div class="profile-section">
          <div class="profile-section__title">Contract</div>
          <div class="profile-fields">
            ${_fieldWithBadge('Contract Expiry', _formatDate(emp.contractExp), emp.contractStatus)}
          </div>
        </div>
        <div class="profile-section">
          <div class="profile-section__title">Banking Details</div>
          <div class="profile-fields">
            ${_field('Bank', emp.bank || '—')}
            ${_field('Account No.', emp.bankAcc || '—')}
            ${_field('SWIFT Code', emp.swift || '—')}
          </div>
        </div>
      </div>

      <!-- Contact Tab -->
      <div class="drawer__tab-panel" data-panel="contact">
        <div class="profile-section">
          <div class="profile-section__title">Contact Information</div>
          <div class="profile-fields">
            ${_field('Email', emp.email || '—')}
            ${_field('Telephone', emp.telephone || '—')}
          </div>
        </div>
        <div class="profile-section">
          <div class="profile-section__title">Emergency Contacts</div>
          <div class="profile-fields">
            ${_field('Contact 1 Phone', emp.emergency1 || '—')}
            ${_field('Contact 1 Relation', emp.relation1 || '—')}
            ${_field('Contact 2 Phone', emp.emergency2 || '—')}
            ${_field('Contact 2 Relation', emp.relation2 || '—')}
          </div>
        </div>
      </div>
    `;

    _initTabs();
    _switchTab('personal');
  }

  // ── Field Helpers ──────────────────────────────────────────

  function _field(label, value) {
    const isEmpty = !value || value === '—';
    return `
      <div class="form-group">
        <div class="profile-field__label">${_esc(label)}</div>
        <div class="profile-field__value ${isEmpty ? 'profile-field__value--empty' : ''}">${_esc(value)}</div>
      </div>
    `;
  }

  function _fieldWithBadge(label, value, status) {
    const badgeClass = _statusToBadgeClass(status);
    return `
      <div class="form-group">
        <div class="profile-field__label">${_esc(label)}</div>
        <div class="profile-field__value" style="display:flex;align-items:center;gap:8px;">
          ${_esc(value || '—')}
          ${status ? `<span class="badge badge--${badgeClass}">${_esc(status)}</span>` : ''}
        </div>
      </div>
    `;
  }

  function _statusToBadgeClass(status) {
    const map = { Valid: 'valid', 'Due Soon': 'due-soon', Critical: 'critical', Expired: 'expired', Missing: 'missing' };
    return map[status] ?? 'neutral';
  }

  function _formatDate(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return iso; }
  }

  function _esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Event Listeners ────────────────────────────────────────

  closeBtn?.addEventListener('click', close);
  overlayEl?.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawerEl?.classList.contains('drawer--open')) close();
  });

  return { open, close };
})();
