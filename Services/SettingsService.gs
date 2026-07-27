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

  return {
    getAllSettings,
    updateSetting,
    bulkUpdateSettings,
  };
})();
