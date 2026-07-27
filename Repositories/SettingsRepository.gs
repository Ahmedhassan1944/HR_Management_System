/**
 * @file SettingsRepository.gs
 * @description Data access layer for the Sys_Settings sheet.
 *              Settings are stored as key-value pairs with metadata.
 *
 *  Sheet structure (Sys_Settings):
 *  | A: Key | B: Value | C: Description | D: UpdatedAt |
 */

const SettingsRepository = (() => {

  /** @returns {GoogleAppsScript.Spreadsheet.Sheet} */
  function _getSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET.SETTINGS);

    // Auto-create the settings sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET.SETTINGS);
      sheet.getRange(1, 1, 1, 4).setValues([['Key', 'Value', 'Description', 'UpdatedAt']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      _seedDefaults(sheet);
    }

    return sheet;
  }

  /**
   * Seeds default settings when the sheet is first created.
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
   */
  function _seedDefaults(sheet) {
    const now = new Date().toISOString();
    const defaults = [
      [SETTING_KEY.EXPIRY_CRITICAL_DAYS, 30, 'Days before expiry to flag as Critical', now],
      [SETTING_KEY.EXPIRY_DUE_SOON_DAYS, 90, 'Days before expiry to flag as Due Soon', now],
      [SETTING_KEY.DEFAULT_PAGE_SIZE, 25, 'Default number of rows per page in tables', now],
      [SETTING_KEY.DEFAULT_SORT_FIELD, 'name', 'Default sort field for employee table', now],
      [SETTING_KEY.SYSTEM_TIMEZONE, 'Asia/Muscat', 'System timezone for date calculations', now],
    ];
    sheet.getRange(2, 1, defaults.length, 4).setValues(defaults);
  }

  // ────────────────────────────────────────────────────────────
  //  READ OPERATIONS
  // ────────────────────────────────────────────────────────────

  /**
   * Reads all settings and returns them as a plain key-value object.
   * @returns {Object.<string, string>}
   */
  function getAll() {
    const sheet = _getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return {};

    const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    const result = {};
    for (const [key, value] of data) {
      if (key) result[String(key).trim()] = String(value).trim();
    }
    return result;
  }

  /**
   * Reads a single setting value by key. Returns defaultValue if not found.
   * @param {string} key
   * @param {*} defaultValue
   * @returns {string}
   */
  function getValue(key, defaultValue = '') {
    const all = getAll();
    return all[key] !== undefined ? all[key] : defaultValue;
  }

  // ────────────────────────────────────────────────────────────
  //  WRITE OPERATIONS
  // ────────────────────────────────────────────────────────────

  /**
   * Updates an existing setting value by key, or creates it if missing.
   * @param {string} key
   * @param {string} value
   * @param {string} [description]
   */
  function upsert(key, value, description = '') {
    const sheet = _getSheet();
    const lastRow = sheet.getLastRow();
    const keys = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().map(r => r[0])
      : [];

    const rowIndex = keys.indexOf(key);
    const now = new Date().toISOString();

    if (rowIndex >= 0) {
      // Update existing row
      const sheetRow = rowIndex + 2;
      sheet.getRange(sheetRow, 2).setValue(value);
      sheet.getRange(sheetRow, 4).setValue(now);
    } else {
      // Append new row
      sheet.appendRow([key, value, description, now]);
    }
  }

  return {
    getAll,
    getValue,
    upsert,
  };
})();
