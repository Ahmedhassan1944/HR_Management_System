/**
 * @file search.js
 * @description Global Search module — client-side instant search across
 *              all employee fields using a pre-built search index.
 */

'use strict';

const SearchModule = (() => {

  let _index  = [];   // Flat searchable index
  let _visible = false;

  const SEARCH_FIELDS = [
    'code', 'name', 'nameAr', 'email', 'telephone',
    'passportNo', 'civilNo', 'department', 'section', 'project', 'title',
  ];

  const MAX_RESULTS = 8;

  const inputEl   = document.getElementById('globalSearchInput');
  const resultsEl = document.getElementById('globalSearchResults');

  // ── Index Building ─────────────────────────────────────────

  /**
   * Builds the searchable index from the employee array.
   * Call once when employees data is loaded.
   * @param {Object[]} employees
   */
  function buildIndex(employees) {
    _index = employees.map(emp => ({
      emp,
      searchText: SEARCH_FIELDS
        .map(f => String(emp[f] ?? '').toLowerCase())
        .join(' '),
    }));
  }

  // ── Search Logic ───────────────────────────────────────────

  function _search(query) {
    if (!query || query.trim().length < 2) return [];
    const terms = query.toLowerCase().trim().split(/\s+/);
    return _index
      .filter(({ searchText }) => terms.every(t => searchText.includes(t)))
      .slice(0, MAX_RESULTS)
      .map(({ emp }) => emp);
  }

  // ── Results Rendering ──────────────────────────────────────

  function _renderResults(results, query) {
    if (results.length === 0) {
      resultsEl.innerHTML = `
        <div class="search-result-item" style="cursor:default;color:var(--color-text-muted);">
          <span>No employees found for "<strong>${_esc(query)}</strong>"</span>
        </div>
      `;
    } else {
      resultsEl.innerHTML = results.map(emp => `
        <div class="search-result-item" data-code="${_esc(emp.code)}" tabindex="0" role="option" aria-label="${_esc(emp.name)}">
          <span class="search-result-item__code">${_esc(emp.code)}</span>
          <div>
            <div class="search-result-item__name">${_esc(emp.name)}</div>
            <div class="search-result-item__meta">${_esc(emp.title || '')} · ${_esc(emp.department || '')} · ${_esc(emp.project || '')}</div>
          </div>
        </div>
      `).join('');

      // Result click listeners
      resultsEl.querySelectorAll('.search-result-item[data-code]').forEach(item => {
        item.addEventListener('click',   () => _selectResult(item.dataset.code));
        item.addEventListener('keydown', e => { if (e.key === 'Enter') _selectResult(item.dataset.code); });
      });
    }
    _show();
  }

  async function _selectResult(code) {
    _hide();
    inputEl.value = '';
    // Navigate to Employees page and open drawer
    AppRouter.navigate('employees');
    await new Promise(r => setTimeout(r, 100)); // allow page switch
    try {
      const emp = await API.getEmployeeByCode(code);
      if (emp) Drawer.open(emp);
    } catch (e) {
      Toast.show('Error', 'Could not load employee profile.', 'error');
    }
  }

  // ── Show / Hide ────────────────────────────────────────────

  function _show() {
    resultsEl.classList.add('global-search__results--visible');
    inputEl.setAttribute('aria-expanded', 'true');
    _visible = true;
  }

  function _hide() {
    resultsEl.classList.remove('global-search__results--visible');
    inputEl.setAttribute('aria-expanded', 'false');
    _visible = false;
  }

  // ── Event Listeners ────────────────────────────────────────

  let _debounce;

  inputEl?.addEventListener('input', () => {
    clearTimeout(_debounce);
    const query = inputEl.value.trim();
    if (!query || query.length < 2) { _hide(); return; }
    _debounce = setTimeout(() => {
      const results = _search(query);
      _renderResults(results, query);
    }, 150);
  });

  inputEl?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { _hide(); inputEl.blur(); }
  });

  document.addEventListener('click', e => {
    if (_visible && !e.target.closest('.global-search')) _hide();
  });

  // Ctrl+K shortcut
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      inputEl?.focus();
      inputEl?.select();
    }
  });

  function _esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return { buildIndex };
})();
