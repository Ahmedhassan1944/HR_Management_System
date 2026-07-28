/**
 * @file Validation.gs
 * @description Server-side input validation utilities.
 *              Never trust client-side data. All writes must pass through here.
 */

const Validation = (() => {

  /**
   * Validates that a value is not null, undefined, or empty string.
   * @param {*} value
   * @returns {boolean}
   */
  function isPresent(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  /**
   * Validates a date string in ISO format (YYYY-MM-DD).
   * @param {string} value
   * @returns {boolean}
   */
  function isValidISODate(value) {
    if (!isPresent(value)) return false;
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value).trim());
  }

  /**
   * Validates an email address format.
   * @param {string} value
   * @returns {boolean}
   */
  function isValidEmail(value) {
    if (!isPresent(value)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  /**
   * Validates that a value is a positive integer.
   * @param {*} value
   * @returns {boolean}
   */
  function isPositiveInteger(value) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0;
  }

  /**
   * Validates employee data object on create/update.
   * Returns an object with `valid` (boolean) and `errors` (array of strings).
   * @param {Object} data
   * @returns {{ valid: boolean, errors: string[] }}
   */
  function validateEmployeeData(data) {
    const errors = [];

    if (!isPresent(data?.code)) errors.push('Employee Code is required.');
    if (!isPresent(data?.name)) errors.push('Employee Name (English) is required.');
    if (!isPresent(data?.department)) errors.push('Department is required.');
    if (!isPresent(data?.project)) errors.push('Project / Site is required.');

    if (data?.email && !isValidEmail(data.email)) {
      errors.push('Email address format is invalid.');
    }

    if (data?.contractExp && !isValidISODate(data.contractExp)) {
      errors.push('Contract expiry date must be in YYYY-MM-DD format.');
    }
    if (data?.passportExp && !isValidISODate(data.passportExp)) {
      errors.push('Passport expiry date must be in YYYY-MM-DD format.');
    }
    if (data?.civilExp && !isValidISODate(data.civilExp)) {
      errors.push('Civil ID expiry date must be in YYYY-MM-DD format.');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validates a settings key-value pair before persisting.
   * @param {string} key
   * @param {*} value
   * @returns {{ valid: boolean, errors: string[] }}
   */
  function validateSetting(key, value) {
    const errors = [];
    if (!isPresent(key)) errors.push('Setting key is required.');
    if (!isPresent(value)) errors.push('Setting value is required.');
    return { valid: errors.length === 0, errors };
  }

  return {
    isPresent,
    isValidISODate,
    isValidEmail,
    isPositiveInteger,
    validateEmployeeData,
    validateSetting,
  };
})();
