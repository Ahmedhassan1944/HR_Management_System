/**
 * @file Response.gs
 * @description Standardized API response factory.
 *              All google.script.run handlers must return responses
 *              created by this factory to ensure consistent contracts.
 */

const Response = (() => {

  /**
   * Creates a success response envelope.
   * @param {*} data - The payload to return.
   * @param {string} [message] - Optional human-readable success message.
   * @returns {{ status: string, data: *, message: string }}
   */
  function success(data, message = 'OK') {
    return {
      status: RESPONSE_STATUS.SUCCESS,
      data,
      message,
    };
  }

  /**
   * Creates an error response envelope.
   * @param {string} message - Human-readable error description.
   * @param {string[]} [errors] - Optional array of field-level error strings.
   * @returns {{ status: string, data: null, message: string, errors: string[] }}
   */
  function error(message, errors = []) {
    return {
      status: RESPONSE_STATUS.ERROR,
      data: null,
      message,
      errors,
    };
  }

  /**
   * Wraps a function call in try/catch and always returns
   * a standardized response, logging failures to Stackdriver.
   * @param {Function} fn - The function to execute.
   * @returns {{ status: string, data: *, message: string }}
   */
  function wrap(fn) {
    try {
      const result = fn();
      // If the function already returned a Response envelope, pass it through.
      if (result && result.status) return result;
      return success(result);
    } catch (e) {
      console.error(`[Response.wrap] ${e.message}`, e.stack);
      return error(e.message || 'An unexpected server error occurred.');
    }
  }

  return { success, error, wrap };
})();
