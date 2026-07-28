/**
 * @file Formatter.gs
 * @description Utility functions for data formatting, date parsing,
 *              normalization, and text masking of sensitive fields.
 */

const Formatter = (() => {

  // ────────────────────────────────────────────────────────────
  //  DATE UTILITIES
  // ────────────────────────────────────────────────────────────

  /**
   * Parses any date value (Excel serial, JS Date object, or string)
   * and returns a JavaScript Date or null.
   * @param {*} value
   * @returns {Date|null}
   */
  function parseDate(value) {
    if (!value || value === '-') return null;

    // GAS / Excel serial number
    if (typeof value === 'number') {
      const msFromEpoch = (value - 25569) * 86400 * 1000;
      return new Date(msFromEpoch);
    }

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    // String parsing — handles DD/MM/YYYY and YYYY-MM-DD
    const str = String(value).trim();
    if (!str || str === '-') return null;

    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) return new Date(str);

    const dmyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    }

    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  /**
   * Formats a Date object to ISO string YYYY-MM-DD.
   * @param {Date|null} date
   * @returns {string}
   */
  function toISODate(date) {
    if (!date || !(date instanceof Date)) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Formats a Date to a human-readable string DD MMM YYYY.
   * @param {Date|null} date
   * @returns {string}
   */
  function toDisplayDate(date) {
    if (!date || !(date instanceof Date)) return '—';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  /**
   * Calculates the number of days between today and the given date.
   * Negative value = already expired.
   * @param {Date|null} date
   * @returns {number|null}
   */
  function daysFromToday(date) {
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - today) / (1000 * 60 * 60 * 24));
  }

  // ────────────────────────────────────────────────────────────
  //  EXPIRY CLASSIFICATION
  // ────────────────────────────────────────────────────────────

  /**
   * Returns the expiry status label for a given date.
   * Reads thresholds from EXPIRY_THRESHOLD constants.
   * @param {Date|null} date
   * @returns {string} EXPIRY_STATUS value
   */
  function getExpiryStatus(date) {
    if (!date) return EXPIRY_STATUS.MISSING;
    const days = daysFromToday(date);
    if (days === null) return EXPIRY_STATUS.MISSING;
    if (days < 0) return EXPIRY_STATUS.EXPIRED;
    if (days <= EXPIRY_THRESHOLD.CRITICAL) return EXPIRY_STATUS.CRITICAL;
    if (days <= EXPIRY_THRESHOLD.DUE_SOON) return EXPIRY_STATUS.DUE_SOON;
    return EXPIRY_STATUS.VALID;
  }

  // ────────────────────────────────────────────────────────────
  //  TEXT & DATA NORMALIZATION
  // ────────────────────────────────────────────────────────────

  /**
   * Trims whitespace and normalizes empty / dash values to empty string.
   * @param {*} value
   * @returns {string}
   */
  function normalizeText(value) {
    if (value === null || value === undefined) return '';
    const str = String(value).trim();
    return str === '-' ? '' : str;
  }

  /**
   * Normalizes gender values to 'Male' | 'Female' | ''.
   * @param {string} value
   * @returns {string}
   */
  function normalizeGender(value) {
    const g = normalizeText(value).toLowerCase();
    if (g === 'male') return 'Male';
    if (g === 'female') return 'Female';
    return '';
  }

  /**
   * Normalizes phone numbers. Strips spaces and non-digit characters.
   * Does NOT assume a country code.
   * @param {string} value
   * @returns {string}
   */
  function normalizePhone(value) {
    const str = normalizeText(value);
    return str.replace(/\s+/g, '');
  }

  // ────────────────────────────────────────────────────────────
  //  SENSITIVE DATA MASKING
  // ────────────────────────────────────────────────────────────

  /**
   * Masks sensitive strings, showing only last 4 characters.
   * e.g. "A12345678" → "****5678"
   * @param {string} value
   * @returns {string}
   */
  function maskSensitive(value) {
    const str = normalizeText(value);
    if (!str || str.length <= 4) return '****';
    return '****' + str.slice(-4);
  }

  // ────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────

  return {
    parseDate,
    toISODate,
    toDisplayDate,
    daysFromToday,
    getExpiryStatus,
    normalizeText,
    normalizeGender,
    normalizePhone,
    maskSensitive,
  };
})();
