/**
 * @file api.js
 * @description Client-side API bridge for google.script.run calls.
 *              Provides: promise wrappers, caching layer, loading state management.
 *              All frontend modules must call GAS through this module only.
 */

'use strict';

const API = (() => {

  // ────────────────────────────────────────────────────────────
  //  CACHE STORE
  // ────────────────────────────────────────────────────────────
  const _cache = {};
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  function _cacheGet(key) {
    const entry = _cache[key];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      delete _cache[key];
      return null;
    }
    return entry.data;
  }

  function _cacheSet(key, data) {
    _cache[key] = { data, timestamp: Date.now() };
  }

  function invalidateCache(key) {
    if (key) delete _cache[key];
    else Object.keys(_cache).forEach(k => delete _cache[k]);
  }

  // ────────────────────────────────────────────────────────────
  //  GAS CALL WRAPPER
  // ────────────────────────────────────────────────────────────

  /**
   * Wraps a google.script.run call in a Promise.
   * Handles success/failure handlers and response envelope validation.
   * @param {string} fnName - GAS function name
   * @param {...*} args - Arguments to pass
   * @returns {Promise<*>} Resolves with response.data or rejects with Error
   */
  function _call(fnName, ...args) {
    return new Promise((resolve, reject) => {
      let runner = google.script.run
        .withSuccessHandler(response => {
          if (!response || response.status !== 'success') {
            reject(new Error(response?.message || `${fnName} returned an error.`));
            return;
          }
          resolve(response.data);
        })
        .withFailureHandler(err => {
          console.error(`[API] ${fnName} failed:`, err);
          reject(new Error(err.message || `${fnName} call failed.`));
        });

      runner[fnName](...args);
    });
  }

  // ────────────────────────────────────────────────────────────
  //  PUBLIC API METHODS
  // ────────────────────────────────────────────────────────────

  async function getAllEmployees(forceRefresh = false) {
    const CACHE_KEY = 'employees';
    if (!forceRefresh) {
      const cached = _cacheGet(CACHE_KEY);
      if (cached) return cached;
    }
    const data = await _call('api_getAllEmployees');
    _cacheSet(CACHE_KEY, data);
    return data;
  }

  async function getEmployeeByCode(code) {
    return _call('api_getEmployeeByCode', code);
  }

  async function getLookupData(forceRefresh = false) {
    const CACHE_KEY = 'lookups';
    if (!forceRefresh) {
      const cached = _cacheGet(CACHE_KEY);
      if (cached) return cached;
    }
    const data = await _call('api_getLookupData');
    _cacheSet(CACHE_KEY, data);
    return data;
  }

  async function getDocumentCenterData(forceRefresh = false) {
    const CACHE_KEY = 'documents';
    if (!forceRefresh) {
      const cached = _cacheGet(CACHE_KEY);
      if (cached) return cached;
    }
    const data = await _call('api_getDocumentCenterData');
    _cacheSet(CACHE_KEY, data);
    return data;
  }

  async function getInsightsData(forceRefresh = false) {
    const CACHE_KEY = 'insights';
    if (!forceRefresh) {
      const cached = _cacheGet(CACHE_KEY);
      if (cached) return cached;
    }
    const data = await _call('api_getInsightsData');
    _cacheSet(CACHE_KEY, data);
    return data;
  }

  async function getAllSettings(forceRefresh = false) {
    const CACHE_KEY = 'settings';
    if (!forceRefresh) {
      const cached = _cacheGet(CACHE_KEY);
      if (cached) return cached;
    }
    const data = await _call('api_getAllSettings');
    _cacheSet(CACHE_KEY, data);
    return data;
  }

  async function updateSetting(key, value) {
    const result = await _call('api_updateSetting', key, value);
    invalidateCache('settings');
    return result;
  }

  async function bulkUpdateSettings(settingsMap) {
    const result = await _call('api_bulkUpdateSettings', settingsMap);
    invalidateCache('settings');
    return result;
  }

  // ────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────

  return {
    getAllEmployees,
    getEmployeeByCode,
    getLookupData,
    getDocumentCenterData,
    getInsightsData,
    getAllSettings,
    updateSetting,
    bulkUpdateSettings,
    invalidateCache,
  };
})();
