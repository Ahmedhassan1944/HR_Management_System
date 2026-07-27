/**
 * @file settings.js
 * @description Settings module — renders system configuration UI
 *              and handles saving settings back to GAS via API.
 */

'use strict';

const SettingsModule = (() => {

  let _settings = {};

  async function render() {
    const container = document.getElementById('settingsContent');
    if (!container) return;

    try {
      _settings = await API.getAllSettings();
    } catch (e) {
      Toast.show('Error', 'Could not load settings.', 'error');
      return;
    }

    container.innerHTML = `
      <div class="settings-layout">

        <!-- Settings Navigation -->
        <nav class="settings-nav" aria-label="Settings sections">
          <div class="settings-nav__item settings-nav__item--active" data-section="expiry" tabindex="0">⏰ Expiry Rules</div>
          <div class="settings-nav__item" data-section="table" tabindex="0">📋 Table Preferences</div>
          <div class="settings-nav__item" data-section="system" tabindex="0">🖥️ System</div>
        </nav>

        <!-- Settings Panels -->
        <div class="settings-panel" id="settingsPanelContainer">

          <!-- Expiry Rules -->
          <section class="settings-section" id="settings-section-expiry" aria-labelledby="expiry-section-heading">
            <div class="settings-section__header">
              <div class="settings-section__title" id="expiry-section-heading">⏰ Document Expiry Rules</div>
              <div class="settings-section__desc">Define thresholds that control how document expiry statuses are classified.</div>
            </div>
            <div class="settings-section__body">
              ${_settingRow(
                'expiry.critical.days',
                'Critical Threshold (days)',
                'Documents expiring within this many days are marked as Critical.',
                _settings['expiry.critical.days'] ?? '30',
                'number'
              )}
              ${_settingRow(
                'expiry.dueSoon.days',
                'Due Soon Threshold (days)',
                'Documents expiring within this many days are marked as Due Soon.',
                _settings['expiry.dueSoon.days'] ?? '90',
                'number'
              )}
            </div>
          </section>

          <!-- Table Preferences -->
          <section class="settings-section" id="settings-section-table" aria-labelledby="table-section-heading">
            <div class="settings-section__header">
              <div class="settings-section__title" id="table-section-heading">📋 Table Preferences</div>
              <div class="settings-section__desc">Configure default behavior of data tables across the application.</div>
            </div>
            <div class="settings-section__body">
              ${_settingRow(
                'table.defaultPageSize',
                'Default Page Size',
                'Number of rows displayed per page in all tables.',
                _settings['table.defaultPageSize'] ?? '25',
                'number'
              )}
              ${_settingRow(
                'table.defaultSortField',
                'Default Sort Field',
                'Field used to sort the employee table on initial load.',
                _settings['table.defaultSortField'] ?? 'name',
                'text'
              )}
            </div>
          </section>

          <!-- System Settings -->
          <section class="settings-section" id="settings-section-system" aria-labelledby="system-section-heading">
            <div class="settings-section__header">
              <div class="settings-section__title" id="system-section-heading">🖥️ System</div>
              <div class="settings-section__desc">Core system configuration options.</div>
            </div>
            <div class="settings-section__body">
              ${_settingRow(
                'system.timezone',
                'System Timezone',
                'Timezone used for date calculations and reporting.',
                _settings['system.timezone'] ?? 'Asia/Muscat',
                'text'
              )}
            </div>
          </section>

          <!-- Save Button -->
          <div style="display:flex;justify-content:flex-end;gap:var(--space-3);padding:var(--space-4) 0;">
            <button class="btn btn--secondary" id="settingsResetBtn">Reset Defaults</button>
            <button class="btn btn--primary" id="settingsSaveBtn">💾 Save All Settings</button>
          </div>

        </div>
      </div>
    `;

    _bindEvents(container);
  }

  // ── Event Binding ──────────────────────────────────────────

  function _bindEvents(container) {
    // Section navigation
    container.querySelectorAll('.settings-nav__item').forEach(item => {
      item.addEventListener('click', () => {
        container.querySelectorAll('.settings-nav__item').forEach(i => i.classList.remove('settings-nav__item--active'));
        item.classList.add('settings-nav__item--active');
        const section = item.dataset.section;
        document.getElementById(`settings-section-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      item.addEventListener('keydown', e => { if (e.key === 'Enter') item.click(); });
    });

    // Save
    document.getElementById('settingsSaveBtn')?.addEventListener('click', _saveAll);

    // Reset
    document.getElementById('settingsResetBtn')?.addEventListener('click', _confirmReset);
  }

  // ── Save / Reset ───────────────────────────────────────────

  async function _saveAll() {
    const inputs = document.querySelectorAll('[data-setting-key]');
    const map = {};
    inputs.forEach(input => {
      map[input.dataset.settingKey] = input.value.trim();
    });

    const saveBtn = document.getElementById('settingsSaveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    try {
      await API.bulkUpdateSettings(map);
      Toast.show('Settings Saved', 'All settings have been saved successfully.', 'success');
    } catch (e) {
      Toast.show('Save Failed', e.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 Save All Settings';
    }
  }

  function _confirmReset() {
    if (!confirm('Reset all settings to defaults? This cannot be undone.')) return;
    const defaults = {
      'expiry.critical.days': '30',
      'expiry.dueSoon.days': '90',
      'table.defaultPageSize': '25',
      'table.defaultSortField': 'name',
      'system.timezone': 'Asia/Muscat',
    };
    document.querySelectorAll('[data-setting-key]').forEach(input => {
      const key = input.dataset.settingKey;
      if (defaults[key]) input.value = defaults[key];
    });
    Toast.show('Defaults Restored', 'Click Save to apply.', 'info');
  }

  // ── UI Builders ────────────────────────────────────────────

  function _settingRow(key, label, desc, currentValue, type = 'text') {
    return `
      <div class="setting-row">
        <div class="setting-row__info">
          <div class="setting-row__label">${_esc(label)}</div>
          <div class="setting-row__desc">${_esc(desc)}</div>
        </div>
        <div class="setting-row__control">
          <input
            type="${type}"
            class="form-input"
            style="width:140px;"
            value="${_esc(currentValue)}"
            data-setting-key="${_esc(key)}"
            id="setting-${_esc(key.replace(/\./g, '-'))}"
            aria-label="${_esc(label)}"
            ${type === 'number' ? 'min="1" max="3650"' : ''}
          >
        </div>
      </div>
    `;
  }

  function _esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return { render };
})();
