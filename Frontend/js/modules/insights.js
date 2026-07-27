/**
 * @file insights.js
 * @description HR Insights module — executive analytics dashboard
 *              with Chart.js visualizations.
 */

'use strict';

const InsightsModule = (() => {

  function render(data) {
    const container = document.getElementById('insightsContent');
    if (!container) return;

    // Update generated timestamp
    const tsEl = document.getElementById('insightsGeneratedAt');
    if (tsEl && data.generatedAt) {
      tsEl.textContent = `Generated: ${new Date(data.generatedAt).toLocaleString('en-GB')}`;
    }

    container.innerHTML = `

      <!-- Top KPIs -->
      <div class="kpi-grid mb-6" role="list">
        ${_kpi('👥', 'Total Employees',  data.kpis.totalEmployees, 'primary')}
        ${_kpi('📊', 'Average Age',      data.kpis.averageAge + ' yrs', 'info')}
        ${_kpi('👨', 'Male',            data.kpis.maleCount, 'primary')}
        ${_kpi('👩', 'Female',          data.kpis.femaleCount, 'success')}
        ${_kpi('🔧', 'Direct',          data.kpis.directCount, 'warning')}
        ${_kpi('💼', 'Indirect',        data.kpis.indirectCount, 'info')}
      </div>

      <!-- Row 1: Department & Project Distribution -->
      <div class="charts-grid charts-grid--2col mb-6">
        ${_chartCard('chart-dept',    'Employees by Department', 'Department breakdown', 220)}
        ${_chartCard('chart-project', 'Employees by Project',    'Project / site allocation', 220)}
      </div>

      <!-- Row 2: Nationality & Gender -->
      <div class="charts-grid charts-grid--2col mb-6">
        ${_chartCard('chart-nationality', 'Employees by Nationality', 'Nationality distribution', 240)}
        ${_chartCard('chart-gender',      'Gender Breakdown',          'Male vs Female', 240)}
      </div>

      <!-- Row 3: Job Title & Classification -->
      <div class="charts-grid charts-grid--2col mb-6">
        ${_chartCard('chart-title', 'Employees by Job Title', 'Top job titles', 260)}
        ${_chartCard('chart-class', 'Employment Classification', 'Engineering vs Other', 260)}
      </div>

      <!-- Row 4: Hiring Trend & Age Distribution -->
      <div class="charts-grid charts-grid--2col mb-6">
        ${_chartCard('chart-hiring', 'Hiring Trend', 'Hires by month', 240)}
        ${_chartCard('chart-age',    'Age Distribution', 'Headcount by age group', 240)}
      </div>

      <!-- Row 5: Expiry Status -->
      <div class="charts-grid charts-grid--3col mb-6">
        ${_chartCard('chart-passport-expiry',  'Passport Expiry Status',  'Current passport validity', 220)}
        ${_chartCard('chart-civil-expiry',     'Civil ID Expiry Status',  'Current civil ID validity', 220)}
        ${_chartCard('chart-contract-expiry',  'Contract Expiry Status',  'Current contract validity', 220)}
      </div>

    `;

    // ── Render Charts ──────────────────────────────────────
    Charts.horizontalBar('chart-dept',    data.byDepartment);
    Charts.horizontalBar('chart-project', data.byProject);
    Charts.donut('chart-nationality', data.byNationality);
    Charts.donut('chart-gender',      data.byGender);
    Charts.horizontalBar('chart-title', data.byTitle);
    Charts.donut('chart-class',       data.byClass);
    Charts.line('chart-hiring',       data.hiringTrend, 'New Hires');
    Charts.verticalBar('chart-age',   data.ageDistribution.map(d => ({ label: d.range, count: d.count })));
    Charts.expiryStatus('chart-passport-expiry',  data.passportExpiryStats);
    Charts.expiryStatus('chart-civil-expiry',     data.civilExpiryStats);
    Charts.expiryStatus('chart-contract-expiry',  data.contractExpiryStats);
  }

  // ── Helpers ────────────────────────────────────────────────

  function _kpi(icon, label, value, variant) {
    return `
      <div class="kpi-card kpi-card--${variant}" role="listitem">
        <div class="kpi-card__header">
          <span class="kpi-card__label">${_esc(label)}</span>
          <div class="kpi-card__icon" aria-hidden="true">${icon}</div>
        </div>
        <div class="kpi-card__value">${value}</div>
      </div>
    `;
  }

  function _chartCard(canvasId, title, subtitle, height) {
    return `
      <div class="chart-card">
        <div class="chart-card__header">
          <div>
            <div class="chart-card__title">${_esc(title)}</div>
            <div class="chart-card__subtitle">${_esc(subtitle)}</div>
          </div>
        </div>
        <div class="chart-canvas-wrapper" style="height:${height}px;">
          <canvas id="${canvasId}" aria-label="${_esc(title)}" role="img"></canvas>
        </div>
      </div>
    `;
  }

  function _esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return { render };
})();
