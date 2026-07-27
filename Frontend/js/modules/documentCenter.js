/**
 * @file documentCenter.js
 * @description Document Center module — renders expiry summary cards
 *              and a filterable, sortable document expiry table.
 */

'use strict';

const DocumentCenterModule = (() => {

  let _table = null;
  let _allDocs = [];

  function render(docData) {
    const container = document.getElementById('documentsContent');
    if (!container) return;

    const { summary, documents } = docData;
    _allDocs = documents;

    // ── Summary Cards ─────────────────────────────────────────
    const summaryHtml = `
      <div class="expiry-summary-grid mb-6">
        ${_card('🔴', 'Expired',    summary.expired,   'expiry-card--expired',  'expired')}
        ${_card('🔥', 'Today',      summary.today,     'expiry-card--today',    'today')}
        ${_card('☀️', 'Tomorrow',   summary.tomorrow,  'expiry-card--tomorrow', 'tomorrow')}
        ${_card('📆', 'This Week',  summary.thisWeek,  'expiry-card--week',     'week')}
        ${_card('🗓️', 'Next Week',  summary.nextWeek,  'expiry-card--week',     'nextweek')}
        ${_card('🗒️', 'This Month', summary.thisMonth, 'expiry-card--month',    'month')}
        ${_card('📅', 'This Year',  summary.thisYear,  'expiry-card--year',     'year')}
      </div>
    `;

    container.innerHTML = summaryHtml + `<div id="docTableContainer"></div>`;

    // ── Expiry Card Click Filters ─────────────────────────────
    container.querySelectorAll('.expiry-card[data-filter]').forEach(card => {
      card.addEventListener('click', () => _filterByTimeframe(card.dataset.filter));
    });

    // ── Documents Table ───────────────────────────────────────
    _table = DataTable.create({
      containerId: 'docTableContainer',
      searchFields: ['employeeCode', 'employeeName', 'department', 'project', 'docType'],
      columns: [
        { key: 'employeeCode', label: 'Code' },
        { key: 'employeeName', label: 'Employee Name' },
        { key: 'docType',      label: 'Document Type' },
        { key: 'department',   label: 'Department' },
        { key: 'project',      label: 'Project' },
        {
          key: 'expiryDate',
          label: 'Expiry Date',
          render: val => val ? new Date(val).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '—',
        },
        {
          key: 'daysLeft',
          label: 'Days Left',
          render: val => {
            if (val === null || val === undefined) return '—';
            const n = Number(val);
            const color = n < 0 ? 'var(--color-expired)' : n <= 30 ? 'var(--color-critical)' : n <= 90 ? 'var(--color-warning)' : 'var(--color-valid)';
            return `<span style="font-weight:700;color:${color}">${n < 0 ? 'Expired ' + Math.abs(n) + 'd ago' : n + ' days'}</span>`;
          },
        },
        {
          key: 'status',
          label: 'Status',
          render: val => `<span class="badge badge--${_statusClass(val)}">${_esc(val || '—')}</span>`,
        },
      ],
      data: documents,
      pageSize: 25,
      emptyMessage: 'No documents found for the selected filter.',
    });

    // ── Type Filter ────────────────────────────────────────────
    const extraFilters = _table.getExtraFiltersContainer();
    if (extraFilters) {
      extraFilters.innerHTML = `
        <select class="filter-select" id="docTypeFilter" aria-label="Filter by document type">
          <option value="">All Document Types</option>
          <option value="Passport">Passport</option>
          <option value="Civil / Resident ID">Civil / Resident ID</option>
          <option value="Contract">Contract</option>
        </select>
        <select class="filter-select" id="docStatusFilter" aria-label="Filter by status">
          <option value="">All Statuses</option>
          <option value="Expired">Expired</option>
          <option value="Critical">Critical</option>
          <option value="Due Soon">Due Soon</option>
          <option value="Valid">Valid</option>
          <option value="Missing">Missing</option>
        </select>
      `;
      document.getElementById('docTypeFilter')?.addEventListener('change', _applyFilters);
      document.getElementById('docStatusFilter')?.addEventListener('change', _applyFilters);
    }
  }

  // ── Filter Handlers ────────────────────────────────────────

  function _applyFilters() {
    const type   = document.getElementById('docTypeFilter')?.value;
    const status = document.getElementById('docStatusFilter')?.value;
    _table?.applyFilter(doc =>
      (!type   || doc.docType === type)
      && (!status || doc.status === status)
    );
  }

  function _filterByTimeframe(filter) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    _table?.applyFilter(doc => {
      const days = doc.daysLeft;
      if (filter === 'expired')  return days !== null && days < 0;
      if (filter === 'today')    return days === 0;
      if (filter === 'tomorrow') return days === 1;
      if (filter === 'week')     return days !== null && days >= 0 && days <= 7;
      if (filter === 'nextweek') return days !== null && days >= 8 && days <= 14;
      if (filter === 'month')    return days !== null && days >= 0 && days <= 30;
      if (filter === 'year')     return days !== null && days >= 0 && days <= 365;
      return true;
    });
  }

  // ── Helpers ────────────────────────────────────────────────

  function _card(icon, label, count, cssClass, filterKey) {
    return `
      <div class="expiry-card ${cssClass}" data-filter="${filterKey}" tabindex="0" role="button"
           aria-label="Filter: ${_esc(label)}, ${count} documents">
        <div class="expiry-card__icon" aria-hidden="true">${icon}</div>
        <div class="expiry-card__count">${count}</div>
        <div class="expiry-card__label">${_esc(label)}</div>
      </div>
    `;
  }

  function _statusClass(status) {
    const m = { 'Valid':'valid','Due Soon':'due-soon','Critical':'critical','Expired':'expired','Missing':'missing' };
    return m[status] ?? 'neutral';
  }

  function _esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return { render };
})();
