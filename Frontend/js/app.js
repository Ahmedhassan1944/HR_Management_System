/**
 * @file app.js
 * @description Application bootstrap, SPA router, and shared state manager.
 *              This is the last script loaded and the entry point for execution.
 *
 *  Responsibilities:
 *  1. Initialize the app on DOMContentLoaded.
 *  2. Load initial data from GAS (employees, documents, settings).
 *  3. Build the global search index.
 *  4. Route page navigation requests.
 *  5. Manage the collapsible sidebar.
 */

'use strict';

// ═══════════════════════════════════════════════════════════════
//  APP STATE  (shared in-memory data store)
// ═══════════════════════════════════════════════════════════════

const AppState = {
  employees:   [],
  documents:   null,
  insights:    null,
  settings:    {},
  currentPage: 'dashboard',
};

// ═══════════════════════════════════════════════════════════════
//  ROUTER
// ═══════════════════════════════════════════════════════════════

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  insights:  'HR Insights',
  employees: 'Employees',
  documents: 'Document Center',
  settings:  'Settings',
};

const AppRouter = (() => {

  const _pageModuleMap = {
    dashboard: () => {
      if (AppState.employees.length && AppState.documents) {
        DashboardModule.render(AppState.employees, AppState.documents);
      }
    },
    insights: async () => {
      if (!AppState.insights) {
        _showPageLoading('insightsContent');
        try {
          AppState.insights = await API.getInsightsData();
        } catch (e) {
          Toast.show('Error', 'Could not load HR Insights data.', 'error');
          return;
        }
      }
      InsightsModule.render(AppState.insights);
    },
    employees: async () => {
      if (AppState.employees.length) {
        await EmployeesModule.render(AppState.employees);
      }
    },
    documents: async () => {
      if (!AppState.documents) {
        _showPageLoading('documentsContent');
        try {
          AppState.documents = await API.getDocumentCenterData();
        } catch (e) {
          Toast.show('Error', 'Could not load Document Center data.', 'error');
          return;
        }
      }
      DocumentCenterModule.render(AppState.documents);
    },
    settings: () => SettingsModule.render(),
  };

  /**
   * Navigates to a page by key.
   * @param {string} page
   */
  async function navigate(page) {
    if (!PAGE_TITLES[page]) return;

    // Deactivate current page
    document.getElementById(`page-${AppState.currentPage}`)?.classList.remove('page-view--active');

    // Update active nav item
    document.querySelectorAll('.sidebar__nav-item').forEach(item => {
      const isActive = item.dataset.page === page;
      item.classList.toggle('sidebar__nav-item--active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    // Update header title
    const titleEl = document.getElementById('headerPageTitle');
    if (titleEl) titleEl.textContent = PAGE_TITLES[page];

    // Activate page
    AppState.currentPage = page;
    document.getElementById(`page-${page}`)?.classList.add('page-view--active');

    // Render module
    const moduleFn = _pageModuleMap[page];
    if (moduleFn) await moduleFn();

    // Mobile: close sidebar after navigation
    if (window.innerWidth <= 768) {
      document.querySelector('.sidebar')?.classList.remove('sidebar--mobile-open');
    }
  }

  function _showPageLoading(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;padding:80px 0;gap:16px;color:var(--color-text-muted);">
        <div class="app-loading__spinner" style="width:32px;height:32px;border-width:2px;"></div>
        <span>Loading data…</span>
      </div>
    `;
  }

  return { navigate };
})();

// ═══════════════════════════════════════════════════════════════
//  SIDEBAR TOGGLE
// ═══════════════════════════════════════════════════════════════

function _initSidebar() {
  const shell   = document.getElementById('appShell');
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');

  toggleBtn?.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      sidebar.classList.toggle('sidebar--mobile-open');
    } else {
      shell.classList.toggle('app-shell--collapsed');
      sidebar.classList.toggle('sidebar--collapsed');
      const isExpanded = !shell.classList.contains('app-shell--collapsed');
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));
    }
  });

  // Sidebar nav click delegation
  document.querySelector('.sidebar__nav')?.addEventListener('click', e => {
    const item = e.target.closest('.sidebar__nav-item[data-page]');
    if (item) AppRouter.navigate(item.dataset.page);
  });

  document.querySelector('.sidebar__nav')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const item = e.target.closest('.sidebar__nav-item[data-page]');
      if (item) AppRouter.navigate(item.dataset.page);
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//  REFRESH BUTTON
// ═══════════════════════════════════════════════════════════════

function _initRefreshBtn() {
  document.getElementById('refreshBtn')?.addEventListener('click', async () => {
    API.invalidateCache();
    AppState.employees = [];
    AppState.documents = null;
    AppState.insights  = null;
    Toast.show('Refreshing', 'Reloading data from server…', 'info', 2000);
    await _loadInitialData();
    await AppRouter.navigate(AppState.currentPage);
  });
}

// ═══════════════════════════════════════════════════════════════
//  INITIAL DATA LOAD
// ═══════════════════════════════════════════════════════════════

async function _loadInitialData() {
  try {
    // Load employees and documents in parallel for faster startup
    const [employees, documents] = await Promise.all([
      API.getAllEmployees(),
      API.getDocumentCenterData(),
    ]);

    AppState.employees = employees ?? [];
    AppState.documents = documents ?? { summary: {}, documents: [] };

    // Build global search index
    SearchModule.buildIndex(AppState.employees);

    // Update dashboard last-updated timestamp
    const tsEl = document.getElementById('dashboardLastUpdated');
    if (tsEl) tsEl.textContent = `Last updated: ${new Date().toLocaleTimeString('en-GB')}`;

    return true;
  } catch (e) {
    console.error('[App] Initial data load failed:', e);
    Toast.show('Load Error', 'Failed to load employee data. Check your spreadsheet connection.', 'error', 8000);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
//  BOOTSTRAP
// ═══════════════════════════════════════════════════════════════

async function _boot() {
  _initSidebar();
  _initRefreshBtn();

  const loaded = await _loadInitialData();

  // Hide loading screen
  const loadingEl = document.getElementById('appLoading');
  if (loadingEl) {
    loadingEl.classList.add('app-loading--hidden');
    setTimeout(() => loadingEl.remove(), 500);
  }

  // Show app shell
  const shellEl = document.getElementById('appShell');
  if (shellEl) shellEl.setAttribute('aria-hidden', 'false');

  // Render initial page
  if (loaded) {
    await AppRouter.navigate('dashboard');
  }
}

// ── Entry Point ────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _boot);
} else {
  _boot();
}
