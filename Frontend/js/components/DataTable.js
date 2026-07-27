/**
 * @file DataTable.js
 * @description Reusable, client-side data table component.
 *              Supports: sorting, pagination, search filtering, custom renderers.
 *
 * Usage:
 *   const table = DataTable.create({
 *     containerId: 'myContainer',
 *     columns: [{ key, label, render? }],
 *     data: [],
 *     pageSize: 25,
 *     onRowAction: (action, row) => {}
 *   });
 *   table.setData(rows);
 */

'use strict';

const DataTable = (() => {

  /**
   * Creates a DataTable instance inside the given container.
   * @param {Object} config
   * @returns {{ setData: Function, refresh: Function }}
   */
  function create(config) {
    const {
      containerId,
      columns = [],
      data = [],
      pageSize = 25,
      searchFields = [],
      onRowAction = null,
      emptyMessage = 'No records found.',
    } = config;

    const container = document.getElementById(containerId);
    if (!container) return null;

    // State
    let _data       = [...data];
    let _filtered   = [...data];
    let _sortKey    = null;
    let _sortDir    = 'asc';
    let _page       = 1;
    let _pageSize   = pageSize;
    let _searchTerm = '';

    // ── Build DOM ──────────────────────────────────────────────
    container.innerHTML = `
      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar__filters">
            <div class="table-search">
              <span class="table-search__icon" aria-hidden="true">🔍</span>
              <input
                type="search"
                class="table-search__input"
                id="${containerId}-search"
                placeholder="Search…"
                aria-label="Search table"
              >
            </div>
            <div id="${containerId}-extra-filters"></div>
          </div>
          <div class="table-toolbar__actions" id="${containerId}-actions"></div>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table" role="grid" aria-label="Data table">
            <thead id="${containerId}-thead"></thead>
            <tbody id="${containerId}-tbody"></tbody>
          </table>
        </div>
        <div class="table-pagination" id="${containerId}-pagination"></div>
      </div>
    `;

    const thead      = document.getElementById(`${containerId}-thead`);
    const tbody      = document.getElementById(`${containerId}-tbody`);
    const pagination = document.getElementById(`${containerId}-pagination`);
    const searchInput= document.getElementById(`${containerId}-search`);

    // ── Render Header ──────────────────────────────────────────
    function _renderHeader() {
      const ths = columns.map(col => `
        <th data-key="${col.key ?? ''}" class="${_sortKey === col.key ? 'sorted' : ''}"
            tabindex="0" scope="col">
          ${_escHtml(col.label ?? '')}
          ${col.sortable !== false ? `<span class="sort-icon" aria-hidden="true">${_sortKey === col.key ? (_sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>` : ''}
        </th>
      `).join('');
      thead.innerHTML = `<tr>${ths}</tr>`;

      // Sort listeners
      thead.querySelectorAll('th[data-key]').forEach(th => {
        th.addEventListener('click', () => _handleSort(th.dataset.key));
        th.addEventListener('keydown', e => { if (e.key === 'Enter') _handleSort(th.dataset.key); });
      });
    }

    // ── Render Rows ────────────────────────────────────────────
    function _renderRows() {
      const start = (_page - 1) * _pageSize;
      const page  = _filtered.slice(start, start + _pageSize);

      if (page.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="${columns.length}" style="padding:var(--space-12) var(--space-6); text-align:center; color:var(--color-text-muted);">
              <div class="empty-state__icon">📋</div>
              <div>${_escHtml(emptyMessage)}</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = page.map(row => {
        const cells = columns.map(col => {
          const raw   = row[col.key] ?? '';
          const value = col.render ? col.render(raw, row) : _escHtml(String(raw));
          return `<td>${value}</td>`;
        }).join('');
        return `<tr role="row">${cells}</tr>`;
      }).join('');

      // Attach row action listeners
      if (onRowAction) {
        tbody.querySelectorAll('[data-action]').forEach(el => {
          el.addEventListener('click', e => {
            e.stopPropagation();
            const btn = e.currentTarget;
            const rowIndex = parseInt(btn.closest('tr').rowIndex) - 1 + start;
            onRowAction(btn.dataset.action, _filtered[rowIndex]);
          });
        });
      }
    }

    // ── Render Pagination ──────────────────────────────────────
    function _renderPagination() {
      const total = _filtered.length;
      const pages = Math.ceil(total / _pageSize);
      const start = (_page - 1) * _pageSize + 1;
      const end   = Math.min(_page * _pageSize, total);

      let btns = '';
      btns += `<button class="pagination-btn" id="${containerId}-prev" aria-label="Previous page" ${_page <= 1 ? 'disabled' : ''}>‹</button>`;
      for (let i = 1; i <= pages; i++) {
        if (i === 1 || i === pages || Math.abs(i - _page) <= 1) {
          btns += `<button class="pagination-btn ${i === _page ? 'pagination-btn--active' : ''}" data-page="${i}" aria-label="Page ${i}" aria-current="${i === _page ? 'page' : 'false'}">${i}</button>`;
        } else if (Math.abs(i - _page) === 2) {
          btns += `<span style="padding:0 4px;color:var(--color-text-muted)">…</span>`;
        }
      }
      btns += `<button class="pagination-btn" id="${containerId}-next" aria-label="Next page" ${_page >= pages ? 'disabled' : ''}>›</button>`;

      pagination.innerHTML = `
        <div class="table-pagination__info">
          Showing <strong>${total === 0 ? 0 : start}–${end}</strong> of <strong>${total}</strong> records
        </div>
        <div class="table-pagination__controls">${btns}</div>
      `;

      pagination.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => { _page = parseInt(btn.dataset.page); _render(); });
      });
      const prevBtn = document.getElementById(`${containerId}-prev`);
      const nextBtn = document.getElementById(`${containerId}-next`);
      if (prevBtn) prevBtn.addEventListener('click', () => { _page--; _render(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { _page++; _render(); });
    }

    // ── Sorting ────────────────────────────────────────────────
    function _handleSort(key) {
      if (!key) return;
      if (_sortKey === key) {
        _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        _sortKey = key;
        _sortDir = 'asc';
      }
      _applyFiltersAndSort();
      _render();
    }

    // ── Filtering & Sorting ────────────────────────────────────
    function _applyFiltersAndSort() {
      let result = [..._data];
      const term = _searchTerm.toLowerCase().trim();

      if (term) {
        const fields = searchFields.length > 0 ? searchFields : columns.map(c => c.key);
        result = result.filter(row =>
          fields.some(f => String(row[f] ?? '').toLowerCase().includes(term))
        );
      }

      if (_sortKey) {
        result.sort((a, b) => {
          const av = String(a[_sortKey] ?? '').toLowerCase();
          const bv = String(b[_sortKey] ?? '').toLowerCase();
          return _sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
      }

      _filtered = result;
      _page     = 1;
    }

    // ── Full Render ────────────────────────────────────────────
    function _render() {
      _renderHeader();
      _renderRows();
      _renderPagination();
    }

    // ── Search Listener ────────────────────────────────────────
    let _searchDebounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(_searchDebounce);
      _searchDebounce = setTimeout(() => {
        _searchTerm = searchInput.value;
        _applyFiltersAndSort();
        _render();
      }, 200);
    });

    // ── Public Methods ─────────────────────────────────────────
    function setData(rows) {
      _data = [...rows];
      _applyFiltersAndSort();
      _render();
    }

    // Initial render
    _render();

    return {
      setData,
      refresh: () => _render(),
      getExtraFiltersContainer: () => document.getElementById(`${containerId}-extra-filters`),
      getActionsContainer: () => document.getElementById(`${containerId}-actions`),
      applyFilter: (fn) => {
        _filtered = _data.filter(fn);
        _page = 1;
        _render();
      },
    };
  }

  // ── Helpers ────────────────────────────────────────────────
  function _escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  return { create };
})();
