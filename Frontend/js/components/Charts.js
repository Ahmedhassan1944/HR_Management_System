/**
 * @file Charts.js
 * @description Chart factory using Chart.js.
 *              Provides standardized chart creation with consistent theming.
 *              All charts use the design system color palette.
 */

'use strict';

const Charts = (() => {

  // ── Design System Palette ──────────────────────────────────
  const PALETTE = [
    '#0078d4', '#0091ff', '#00b4d8', '#00c49a',
    '#107c10', '#d97706', '#e74c3c', '#8b5cf6',
    '#ec4899', '#64748b', '#0e7490', '#65a30d',
  ];

  const EXPIRY_PALETTE = {
    'Valid':    '#107c10',
    'Due Soon': '#d97706',
    'Critical': '#e74c3c',
    'Expired':  '#8b0000',
    'Missing':  '#9b9bb4',
  };

  // Global Chart.js defaults
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
    Chart.defaults.font.size   = 12;
    Chart.defaults.color       = '#5c5c7a';
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.plugins.legend.labels.padding  = 16;
    Chart.defaults.animation.duration = 600;
  }

  // ── Registry — tracks chart instances to allow re-render ──
  const _instances = {};

  function _destroy(canvasId) {
    if (_instances[canvasId]) {
      _instances[canvasId].destroy();
      delete _instances[canvasId];
    }
  }

  // ────────────────────────────────────────────────────────────
  //  CHART FACTORIES
  // ────────────────────────────────────────────────────────────

  /**
   * Renders a donut chart.
   * @param {string} canvasId
   * @param {Object[]} data - [{ label, count }]
   * @param {string} [title]
   */
  function donut(canvasId, data, title = '') {
    _destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    _instances[canvasId] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: PALETTE.slice(0, data.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          tooltip: { callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed / ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0) * 100)}%)`
          }},
        },
      },
    });
  }

  /**
   * Renders a horizontal bar chart.
   * @param {string} canvasId
   * @param {Object[]} data - [{ label, count }]
   */
  function horizontalBar(canvasId, data) {
    _destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    _instances[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: PALETTE[0],
          borderRadius: 4,
          hoverBackgroundColor: PALETTE[1],
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#f0f2f5' }, ticks: { precision: 0 } },
          y: { grid: { display: false } },
        },
      },
    });
  }

  /**
   * Renders a vertical bar / column chart.
   * @param {string} canvasId
   * @param {Object[]} data - [{ label, count }]
   */
  function verticalBar(canvasId, data) {
    _destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    _instances[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: PALETTE.slice(0, data.length),
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#f0f2f5' }, ticks: { precision: 0 } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  /**
   * Renders a line / area chart for trend data.
   * @param {string} canvasId
   * @param {Object[]} data - [{ period, count }]
   * @param {string} [label]
   */
  function line(canvasId, data, label = 'Hires') {
    _destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    _instances[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.map(d => d.period),
        datasets: [{
          label,
          data: data.map(d => d.count),
          borderColor: PALETTE[0],
          backgroundColor: 'rgba(0,120,212,0.08)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: PALETTE[0],
          fill: true,
          tension: 0.35,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#f0f2f5' }, ticks: { precision: 0 } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  /**
   * Renders a stacked bar chart for expiry status summaries.
   * @param {string} canvasId
   * @param {Object[]} data - [{ status, count }]
   */
  function expiryStatus(canvasId, data) {
    _destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    _instances[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map(d => d.status),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: data.map(d => EXPIRY_PALETTE[d.status] ?? PALETTE[10]),
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#f0f2f5' }, ticks: { precision: 0 } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  return { donut, horizontalBar, verticalBar, line, expiryStatus };
})();
