/**
 * @file Code.gs
 * @description Application entry point & controller for the HR Management Platform.
 *
 *  Responsibilities:
 *  1. doGet() — serves the HTML web app.
 *  2. Public API functions — exposed to the client via google.script.run.
 *
 *  Naming Convention for public functions:
 *  - All functions callable by the client are prefixed accordingly.
 *  - They delegate immediately to the appropriate Service.
 *  - No business logic lives here.
 */

// ============================================================
//  WEB APP ENTRY POINT
// ============================================================

/**
 * Serves the main HTML application shell.
 * @returns {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet() {
  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('HR Management Platform')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/**
 * GAS HTML include helper — allows modular HTML/CSS/JS file includes.
 * Usage inside HTML: <?= include('Styles') ?>
 * @param {string} filename
 * @returns {string}
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================================
//  EMPLOYEE API
// ============================================================

/**
 * Returns all active employee records, enriched and sanitized.
 * Called by: employees.js, dashboard.js, insights.js (initial load)
 * @returns {Object} Response envelope
 */
function api_getAllEmployees() {
  return EmployeeService.getAllEmployees();
}

/**
 * Returns a full employee profile by Code.
 * Called by: employees.js (profile drawer)
 * @param {string} code
 * @returns {Object} Response envelope
 */
function api_getEmployeeByCode(code) {
  return EmployeeService.getEmployeeByCode(code);
}

/**
 * Returns lookup data for all filter dropdowns.
 * Called by: employees.js, documentCenter.js on initialization.
 * @returns {Object} Response envelope
 */
function api_getLookupData() {
  return EmployeeService.getLookupData();
}

// ============================================================
//  DOCUMENT CENTER API
// ============================================================

/**
 * Returns the Document Center data: summary counts + full document list.
 * Called by: documentCenter.js
 * @returns {Object} Response envelope
 */
function api_getDocumentCenterData() {
  return DocumentService.getDocumentCenterData();
}

// ============================================================
//  HR INSIGHTS API
// ============================================================

/**
 * Returns the complete HR Insights analytics payload.
 * Called by: insights.js
 * @returns {Object} Response envelope
 */
function api_getInsightsData() {
  return InsightsService.getInsightsData();
}

/**
 * Returns the HR Insights analytics payload for filtered employees.
 * Called by: FilterModule (client)
 * @param {Object} filters
 * @returns {Object} Response envelope
 */
function api_getFilteredInsights(filters) {
  return InsightsService.getFilteredInsights(filters);
}

// ============================================================
//  SETTINGS API
// ============================================================

/**
 * Returns all system settings as a key-value object.
 * Called by: app.js (initial load), settings.js
 * @returns {Object} Response envelope
 */
function api_getAllSettings() {
  return SettingsService.getAllSettings();
}

/**
 * Updates a single system setting.
 * Called by: settings.js
 * @param {string} key
 * @param {string} value
 * @returns {Object} Response envelope
 */
function api_updateSetting(key, value) {
  return SettingsService.updateSetting(key, value);
}

/**
 * Bulk updates multiple settings at once.
 * Called by: settings.js (Save All button)
 * @param {Object} settingsMap
 * @returns {Object} Response envelope
 */
function api_bulkUpdateSettings(settingsMap) {
  return SettingsService.bulkUpdateSettings(settingsMap);
}

// ============================================================
//  FILTER PANE API
// ============================================================

/**
 * Returns employees matching the given filter object.
 * Called by: FilterModule (client) — filter pane Apply button.
 * @param {Object} filters
 * @returns {Object} Response envelope
 */
function api_getFilteredEmployees(filters) {
  return EmployeeService.getFilteredEmployees(filters);
}

/**
 * Saves a named filter preset for a user.
 * Called by: FilterModule (client) — filter pane Save button.
 * @param {string} userId
 * @param {string} name
 * @param {Object} filter
 * @returns {Object} Response envelope
 */
function api_saveFilterPreset(userId, name, filter) {
  return SettingsService.saveFilterPreset(userId, name, filter);
}

/**
 * Returns all filter presets for a user.
 * Called by: FilterModule (client) — filter pane on init.
 * @param {string} userId
 * @returns {Object} Response envelope
 */
function api_getFilterPresets(userId) {
  return SettingsService.getFilterPresets(userId);
}
