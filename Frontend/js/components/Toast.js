/**
 * @file Toast.js
 * @description Reusable toast notification component.
 *              Usage: Toast.show('Title', 'Message', 'success'|'error'|'warning'|'info')
 */

'use strict';

const Toast = (() => {

  const ICONS = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };

  /**
   * Shows a toast notification.
   * @param {string} title
   * @param {string} message
   * @param {'success'|'error'|'warning'|'info'} [type='info']
   * @param {number} [duration=4000] Auto-dismiss after ms
   */
  function show(title, message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
      <span class="toast__icon" aria-hidden="true">${ICONS[type] ?? ICONS.info}</span>
      <div class="toast__content">
        <div class="toast__title">${_escape(title)}</div>
        ${message ? `<div class="toast__message">${_escape(message)}</div>` : ''}
      </div>
    `;

    container.appendChild(toast);

    // Auto-dismiss
    setTimeout(() => _dismiss(toast), duration);
  }

  function _dismiss(toast) {
    toast.classList.add('toast--hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 500); // Fallback
  }

  function _escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return { show };
})();
