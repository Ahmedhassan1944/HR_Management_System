/**
 * @file SettingsService.gs
 * @description Business logic layer for the Settings module.
 *              Reads and writes system configuration via SettingsRepository.
 */

const SettingsService = (() => {

  /**
   * Returns all settings as a flat key-value object.
   * @returns {Object} Response envelope
   */
  function getAllSettings() {
    return Response.wrap(() => {
      const settings = SettingsRepository.getAll();
      return Response.success(settings);
    });
  }

  /**
   * Updates a single setting key-value pair.
   * @param {string} key
   * @param {string} value
   * @returns {Object} Response envelope
   */
  function updateSetting(key, value) {
    return Response.wrap(() => {
      const { valid, errors } = Validation.validateSetting(key, value);
      if (!valid) return Response.error('Validation failed.', errors);

      SettingsRepository.upsert(key, value);
      return Response.success({ key, value }, 'Setting updated successfully.');
    });
  }

  /**
   * Bulk updates multiple settings at once.
   * @param {Object.<string, string>} settingsMap - { key: value }
   * @returns {Object} Response envelope
   */
  function bulkUpdateSettings(settingsMap) {
    return Response.wrap(() => {
      const allErrors = [];
      const updated   = [];

      for (const [key, value] of Object.entries(settingsMap)) {
        const { valid, errors } = Validation.validateSetting(key, value);
        if (!valid) {
          allErrors.push(...errors.map(e => `[${key}]: ${e}`));
          continue;
        }
        SettingsRepository.upsert(key, value);
        updated.push(key);
      }

      if (allErrors.length > 0 && updated.length === 0) {
        return Response.error('All settings failed validation.', allErrors);
      }

      return Response.success(
        { updatedKeys: updated, errors: allErrors },
        `${updated.length} setting(s) updated.`
      );
    });
  }

  /**
   * Saves a user filter preset by name.
   * Key format: `{userId}:filterPreset:{name}`
   * @param {string} userId
   * @param {string} name
   * @param {Object} filter
   * @returns {Object} Response envelope
   */
  function saveFilterPreset(userId, name, filter) {
    return Response.wrap(() => {
      if (!userId || !name) return Response.error('userId and name are required.');
      const key = `${userId}:filterPreset:${name}`;
      SettingsRepository.upsert(key, JSON.stringify(filter), `Filter preset: ${name}`);
      return Response.success({ key }, `Preset "${name}" saved.`);
    });
  }

  /**
   * Retrieves all filter presets for a user.
   * Returns a map of { presetName: filterJsonString }
   * @param {string} userId
   * @returns {Object} Response envelope
   */
  function getFilterPresets(userId) {
    return Response.wrap(() => {
      if (!userId) return Response.error('userId is required.');
      const prefix  = `${userId}:filterPreset:`;
      const raw     = SettingsRepository.listByPrefix(prefix);
      const presets = {};
      for (const [k, v] of Object.entries(raw)) {
        const presetName = k.replace(prefix, '');
        if (presetName) presets[presetName] = v;
      }
      return Response.success(presets);
    });
  }

  return {
    getAllSettings,
    updateSetting,
    bulkUpdateSettings,
    saveFilterPreset,
    getFilterPresets,
  };
})();
