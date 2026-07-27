/**
 * @file dashboard.js
 * @description Dashboard module — renders KPI cards and document expiry sections.
 *              Data is provided from the shared app state (AppState.employees + AppState.documents).
 */

'use strict';

const DashboardModule = (() => {

  function render(employees, docData) {
    const container = document.getElementById('dashboardContent');
    if (!container) return;

    const { summary, documents } = docData;

    // ── KPI Cards ────────────────────────────────────────────
    const totalEmp  = employees.length;
    const activeProjects = new Set(employees.map(e => e.project).filter(Boolean)).size;
    const expiredDocs    = summary.expired;
    const criticalDocs   = documents.filter(d => d.status === 'Critical').length;

    const kpiHtml = `
      <div class="kpi-grid" role="list">
        ${_kpiCard('Total Employees', totalEmp, '👥', 'primary', 'All active employees')}
        ${_kpiCard('Active Projects', activeProjects, '🏗️', 'info', 'Distinct project sites')}
        ${_kpiCard('Expired Documents', expiredDocs, '🔴', 'danger', 'Documents already expired')}
        ${_kpiCard('Critical (≤30 days)', criticalDocs, '⚠️', 'warning', 'Expiring within 30 days')}
        ${_kpiCard('Expiring This Month', summary.thisMonth, '📅', 'warning', 'Expiring within 30 days')}
        ${_kpiCard('Expiring This Week', summary.thisWeek, '⏳', 'danger', 'Expiring within 7 days')}
      </div>
    `;

    // ── Document Expiry Summary Cards ────────────────────────
    const expiryHtml = `
      <div class="card mb-6">
        <div class="card__header">
          <div class="card__title"><span class="card__title-icon">📁</span> Document Expiry Alerts</div>
        </div>
        <div class="expiry-summary-grid">
          ${_expiryCard('🔴', 'Expired', summary.expired, 'expiry-card--expired')}
          ${_expiryCard('🔥', 'Today', summary.today, 'expiry-card--today')}
          ${_expiryCard('☀️', 'Tomorrow', summary.tomorrow, 'expiry-card--tomorrow')}
          ${_expiryCard('📆', 'This Week', summary.thisWeek, 'expiry-card--week')}
          ${_expiryCard('🗓️', 'Next Week', summary.nextWeek, 'expiry-card--week')}
          ${_expiryCard('🗒️', 'This Month', summary.thisMonth, 'expiry-card--month')}
          ${_expiryCard('📅', 'This Year', summary.thisYear, 'expiry-card--year')}
        </div>
      </div>
    `;

    // ── Recent Critical Documents Table ──────────────────────
    const critical = documents
      .filter(d => ['Critical', 'Expired'].includes(d.status))
      .slice(0, 10);

    const criticalRows = critical.map(doc => `
      <tr>
        <td><span class="font-bold">${_esc(doc.employeeCode)}</span></td>
        <td>${_esc(doc.employeeName)}</td>
        <td>${_esc(doc.docType)}</td>
        <td>${_esc(doc.department)}</td>
        <td>${_esc(doc.project)}</td>
        <td>${_esc(doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '—')}</td>
        <td><span class="badge badge--${_statusClass(doc.status)}">${_esc(doc.status)}</span></td>
      </tr>
    `).join('');

    const criticalTableHtml = `
      <div class="card">
        <div class="card__header">
          <div class="card__title"><span class="card__title-icon">🚨</span> Critical & Expired Documents</div>
          <button class="btn btn--ghost btn--sm" onclick="AppRouter.navigate('documents')">View All →</button>
        </div>
        ${critical.length === 0
          ? `<div class="empty-state"><div class="empty-state__icon">✅</div><div class="empty-state__title">All clear!</div><div class="empty-state__message">No critical or expired documents.</div></div>`
          : `<div style="overflow-x:auto;"><table class="data-table">
              <thead><tr>
                <th>Code</th><th>Name</th><th>Document</th><th>Department</th><th>Project</th><th>Expiry Date</th><th>Status</th>
              </tr></thead>
              <tbody>${criticalRows}</tbody>
            </table></div>`
        }
      </div>
    `;

    container.innerHTML = kpiHtml + expiryHtml + criticalTableHtml;
  }

  // ── Private Helpers ────────────────────────────────────────

  function _kpiCard(label, value, icon, variant, footer) {
    return `
      <div class="kpi-card kpi-card--${variant}" role="listitem" tabindex="0">
        <div class="kpi-card__header">
          <span class="kpi-card__label">${_esc(label)}</span>
          <div class="kpi-card__icon" aria-hidden="true">${icon}</div>
        </div>
        <div class="kpi-card__value">${value}</div>
        <div class="kpi-card__footer">${_esc(footer)}</div>
      </div>
    `;
  }

  function _expiryCard(icon, label, count, cssClass) {
    return `
      <div class="expiry-card ${cssClass}" tabindex="0" role="button" aria-label="${_esc(label)}: ${count} documents">
        <div class="expiry-card__icon" aria-hidden="true">${icon}</div>
        <div class="expiry-card__count">${count}</div>
        <div class="expiry-card__label">${_esc(label)}</div>
      </div>
    `;
  }

  function _statusClass(status) {
    const map = { 'Valid':'valid', 'Due Soon':'due-soon', 'Critical':'critical', 'Expired':'expired', 'Missing':'missing' };
    return map[status] ?? 'neutral';
  }

  function _esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return { render };
})();
