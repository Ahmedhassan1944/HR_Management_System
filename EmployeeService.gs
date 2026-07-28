/**
 * @file EmployeeService.gs
 * @description Business logic layer for Employee operations.
 *              Uses EmployeeRepository for data access.
 *              All public methods return standardized Response envelopes.
 */

const EmployeeService = (() => {

  // ────────────────────────────────────────────────────────────
  //  PRIVATE HELPERS
  // ────────────────────────────────────────────────────────────

  /**
   * Enriches an employee record with computed fields (expiry statuses, tenure).
   * @param {Object} emp
   * @returns {Object}
   */
  function _enrich(emp) {
    const passportDate = Formatter.parseDate(emp.passportExp);
    const civilDate    = Formatter.parseDate(emp.civilExp);
    const contractDate = Formatter.parseDate(emp.contractExp);
    const hireDate     = Formatter.parseDate(emp.hireDate);

    const today = new Date();
    const tenureMs = hireDate ? today - hireDate : null;
    const tenureYears = tenureMs ? (tenureMs / (1000 * 60 * 60 * 24 * 365.25)) : null;

    return {
      ...emp,
      passportStatus:  Formatter.getExpiryStatus(passportDate),
      civilStatus:     Formatter.getExpiryStatus(civilDate),
      contractStatus:  Formatter.getExpiryStatus(contractDate),
      tenureYears:     tenureYears ? Number(tenureYears.toFixed(1)) : null,
      passportDaysLeft: Formatter.daysFromToday(passportDate),
      civilDaysLeft:    Formatter.daysFromToday(civilDate),
      contractDaysLeft: Formatter.daysFromToday(contractDate),
    };
  }

  /**
   * Strips highly sensitive fields from the employee object
   * before sending to the client.
   * @param {Object} emp
   * @returns {Object}
   */
  function _sanitizeForClient(emp) {
    return {
      ...emp,
      passportNo: Formatter.maskSensitive(emp.passportNo),
      civilNo:    Formatter.maskSensitive(emp.civilNo),
      bankAcc:    Formatter.maskSensitive(emp.bankAcc),
      telephone:  emp.telephone, // phone kept for contact purposes
      emergency1: emp.emergency1,
      emergency2: emp.emergency2,
    };
  }

  // ────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────

  /**
   * Returns all employees enriched with computed fields.
   * Sensitive fields are masked for client delivery.
   * @returns {Object} Response envelope
   */
  function getAllEmployees() {
    return Response.wrap(() => {
      const employees = EmployeeRepository.getAll();
      const enriched  = employees.map(emp => _sanitizeForClient(_enrich(emp)));
      return Response.success(enriched, `${enriched.length} employee(s) loaded.`);
    });
  }

  /**
   * Returns a single employee profile by code (full detail, still masked).
   * @param {string} code
   * @returns {Object} Response envelope
   */
  function getEmployeeByCode(code) {
    return Response.wrap(() => {
      if (!Validation.isPresent(code)) {
        return Response.error('Employee code is required.');
      }
      const emp = EmployeeRepository.findByCode(code);
      if (!emp) {
        return Response.error(`Employee with code "${code}" not found.`);
      }
      return Response.success(_sanitizeForClient(_enrich(emp)));
    });
  }

  /**
   * Returns lookup/reference data needed to populate filter dropdowns.
   * @returns {Object} Response envelope with { departments, sections, projects, titles, nationalities }
   */
  function getLookupData() {
    return Response.wrap(() => {
      return Response.success({
        departments:  EmployeeRepository.getDistinctValues('department'),
        sections:     EmployeeRepository.getDistinctValues('section'),
        projects:     EmployeeRepository.getDistinctValues('project'),
        titles:       EmployeeRepository.getDistinctValues('title'),
        nationalities:EmployeeRepository.getDistinctValues('nationality'),
        classes:      EmployeeRepository.getDistinctValues('class'),
        direct:       EmployeeRepository.getDistinctValues('direct'),
      });
    });
  }

  return {
    getAllEmployees,
    getEmployeeByCode,
    getLookupData,
  };
})();
