/**
 * @file employees.js
 * @description Employees module — renders the employee directory table
 *              with filtering, sorting, and profile drawer integration.
 */

'use strict';

const EmployeesModule = (() => {

  let _table = null;
  let _lookups = {};

  async function render(employees) {
    const container = document.getElementById('employeesContent');
    const actionsEl = document.getElementById('employeesHeaderActions');
    if (!container) return;

    // Load lookups for filters (cached)
    try {
      _lookups = await API.getLookupData();
    } catch (e) {
      console.warn('[EmployeesModule] Lookups not loaded:', e);
    }

    // Build table container
    container.innerHTML = `<div id="employeesTableContainer"></div>`;

    // Create DataTable
    _table = DataTable.create({
      containerId: 'employeesTableContainer',
      searchFields: ['code', 'name', 'nameAr', 'department', 'project', 'title', 'section', 'nationality'],
      columns: [
        {
          key: '_avatar',
          label: '',
          sortable: false,
          render: (_, row) => `
            <div class="employee-info">
              <div class="employee-avatar" aria-hidden="true">${_initials(row.name)}</div>
              <div>
                <div class="employee-name">${_esc(row.name)}</div>
                <div class="employee-code">${_esc(row.code)}</div>
              </div>
            </div>
          `,
        },
        { key: 'title',      label: 'Job Title' },
        { key: 'department', label: 'Department' },
        { key: 'project',    label: 'Project' },
        { key: 'nationality',label: 'Nationality' },
        {
          key: 'passportStatus',
          label: 'Passport',
          render: val => `<span class="badge badge--${_statusClass(val)}">${_esc(val || '—')}</span>`,
        },
        {
          key: 'civilStatus',
          label: 'Civil ID',
          render: val => `<span class="badge badge--${_statusClass(val)}">${_esc(val || '—')}</span>`,
        },
        {
          key: 'contractStatus',
          label: 'Contract',
          render: val => `<span class="badge badge--${_statusClass(val)}">${_esc(val || '—')}</span>`,
        },
        {
          key: '_actions',
          label: 'Actions',
          sortable: false,
          render: (_, row) => `
            <button class="btn btn--secondary btn--sm" data-action="view" data-code="${_esc(row.code)}" aria-label="View profile of ${_esc(row.name)}">
              View
            </button>
          `,
        },
      ],
      data: employees,
      pageSize: 25,
      onRowAction: (action, row) => {
        if (action === 'view') _openProfile(row.code);
      },
      emptyMessage: 'No employees found matching your search.',
    });

    // ── Extra Filters (Department, Project) ────────────────
    const filtersContainer = _table.getExtraFiltersContainer();
    if (filtersContainer && _lookups) {
      filtersContainer.innerHTML = `
        ${_select('filterDept',  'All Departments', _lookups.departments ?? [])}
        ${_select('filterProj',  'All Projects',    _lookups.projects ?? [])}
        ${_select('filterClass', 'All Classes',     _lookups.classes ?? [])}
      `;
      ['filterDept', 'filterProj', 'filterClass'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', _applyFilters);
      });
    }
  }

  // ── Profile Opener ─────────────────────────────────────────

  async function _openProfile(code) {
    try {
      const emp = await API.getEmployeeByCode(code);
      if (emp) Drawer.open(emp);
    } catch (e) {
      Toast.show('Error', 'Could not load employee profile.', 'error');
    }
  }

  // ── Filter Handler ─────────────────────────────────────────

  function _applyFilters() {
    const dept  = document.getElementById('filterDept')?.value;
    const proj  = document.getElementById('filterProj')?.value;
    const cls   = document.getElementById('filterClass')?.value;

    _table?.applyFilter(emp => {
      return (!dept || emp.department === dept)
          && (!proj || emp.project === proj)
          && (!cls  || emp.class === cls);
    });
  }

  // ── Helpers ────────────────────────────────────────────────

  function _select(id, placeholder, options) {
    const opts = options.map(o => `<option value="${_esc(o)}">${_esc(o)}</option>`).join('');
    return `
      <select class="filter-select" id="${id}" aria-label="${_esc(placeholder)}">
        <option value="">${_esc(placeholder)}</option>
        ${opts}
      </select>
    `;
  }

  function _initials(name) {
    return (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
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
