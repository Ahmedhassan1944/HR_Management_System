/**
 * @file EmployeeRepository.gs
 * @description Data access layer for the Emp_Data sheet.
 *              All direct spreadsheet reads/writes must go through this file.
 *              Business logic is NOT allowed here.
 */

const EmployeeRepository = (() => {

  // ────────────────────────────────────────────────────────────
  //  PRIVATE HELPERS
  // ────────────────────────────────────────────────────────────

  /**
   * Returns the Emp_Data sheet reference.
   * @returns {GoogleAppsScript.Spreadsheet.Sheet}
   */
  function _getSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET.EMPLOYEE);
    if (!sheet) throw new Error(`Sheet "${SHEET.EMPLOYEE}" not found. Verify the sheet name.`);
    return sheet;
  }

  /**
   * Converts a raw data row (array) into an Employee plain object.
   * Applies Formatter normalization to all fields.
   * @param {Array} row
   * @returns {Object}
   */
  function _rowToEmployee(row) {
    return {
      sr:           row[EMP_COL.SR],
      code:         Formatter.normalizeText(row[EMP_COL.CODE]),
      name:         Formatter.normalizeText(row[EMP_COL.NAME]),
      nameAr:       Formatter.normalizeText(row[EMP_COL.NAME_AR]),
      title:        Formatter.normalizeText(row[EMP_COL.TITLE]),
      department:   Formatter.normalizeText(row[EMP_COL.DEPARTMENT]),
      section:      Formatter.normalizeText(row[EMP_COL.SECTION]),
      project:      Formatter.normalizeText(row[EMP_COL.PROJECT]),
      gender:       Formatter.normalizeGender(row[EMP_COL.GENDER]),
      birthDate:    Formatter.toISODate(Formatter.parseDate(row[EMP_COL.BIRTH_DATE])),
      age:          row[EMP_COL.AGE] ? Number(row[EMP_COL.AGE]).toFixed(1) : null,
      hireDate:     Formatter.toISODate(Formatter.parseDate(row[EMP_COL.HIRE_DATE])),
      nationality:  Formatter.normalizeText(row[EMP_COL.NATIONALITY]),
      passportNo:   Formatter.normalizeText(row[EMP_COL.PASSPORT_NO]),   // sensitive
      civilNo:      Formatter.normalizeText(row[EMP_COL.CIVIL_NO]),      // sensitive
      email:        Formatter.normalizeText(row[EMP_COL.EMAIL]),
      telephone:    Formatter.normalizePhone(row[EMP_COL.TELEPHONE]),    // sensitive
      package:      Formatter.normalizeText(row[EMP_COL.PACKAGE]),
      bankAcc:      Formatter.normalizeText(row[EMP_COL.BANK_ACC]),      // sensitive
      civilExp:     Formatter.toISODate(Formatter.parseDate(row[EMP_COL.CIVIL_EXP])),
      passportExp:  Formatter.toISODate(Formatter.parseDate(row[EMP_COL.PASSPORT_EXP])),
      bank:         Formatter.normalizeText(row[EMP_COL.BANK]),
      swift:        Formatter.normalizeText(row[EMP_COL.SWIFT]),
      gradYear:     Formatter.normalizeText(row[EMP_COL.GRAD_YEAR]),
      localExpat:   Formatter.normalizeText(row[EMP_COL.LOCAL_EXPAT]),
      emergency1:   Formatter.normalizePhone(row[EMP_COL.EMERGENCY_1]),
      relation1:    Formatter.normalizeText(row[EMP_COL.RELATION_1]),
      emergency2:   Formatter.normalizePhone(row[EMP_COL.EMERGENCY_2]),
      contractExp:  Formatter.toISODate(Formatter.parseDate(row[EMP_COL.CONTRACT_EXP])),
      relation2:    Formatter.normalizeText(row[EMP_COL.RELATION_2]),
      remarks:      Formatter.normalizeText(row[EMP_COL.REMARKS]),
      actingAs:     Formatter.normalizeText(row[EMP_COL.ACTING_AS]),
      direct:       Formatter.normalizeText(row[EMP_COL.DIRECT]),
      class:        Formatter.normalizeText(row[EMP_COL.CLASS]),
    };
  }

  // ────────────────────────────────────────────────────────────
  //  READ OPERATIONS
  // ────────────────────────────────────────────────────────────

  /**
   * Fetches all valid employee records from Emp_Data.
   * A valid record is one that has both a Code and a Name.
   * @returns {Object[]} Array of employee plain objects.
   */
  function getAll() {
    const sheet = _getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];

    const data = sheet.getRange(2, 1, lastRow - 1, 34).getValues();

    return data
      .map(_rowToEmployee)
      .filter(emp => emp.code && emp.name); // Only complete records
  }

  /**
   * Finds a single employee by their unique Code.
   * @param {string} code
   * @returns {Object|null}
   */
  function findByCode(code) {
    const all = getAll();
    return all.find(emp => emp.code === String(code).trim()) ?? null;
  }

  /**
   * Returns an array of unique values for a given field name.
   * Used to build filter dropdowns and lookup tables.
   * @param {string} fieldName - e.g. 'department', 'project'
   * @returns {string[]}
   */
  function getDistinctValues(fieldName) {
    const all = getAll();
    const seen = new Set();
    const result = [];
    for (const emp of all) {
      const val = emp[fieldName];
      if (val && !seen.has(val)) {
        seen.add(val);
        result.push(val);
      }
    }
    return result.sort();
  }

  // ────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────

  /**
   * Returns employees matching the given filter object.
   * All array-based filters use OR logic within the field (multi-select).
   * @param {Object} filters
   * @returns {Object[]}
   */
  function queryWithFilters(filters) {
    let results = getAll();
    if (!filters) return results;

    // ── Text search (name or code) ──
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      results = results.filter(emp =>
        (emp.name  && emp.name.toLowerCase().includes(q)) ||
        (emp.code  && emp.code.toLowerCase().includes(q))
      );
    }

    // ── Array / multi-select filters ──
    const arrayFilters = [
      { key: 'departments',   field: 'department' },
      { key: 'titles',        field: 'title' },
      { key: 'projects',      field: 'project' },
      { key: 'genders',       field: 'gender' },
      { key: 'nationalities', field: 'nationality' },
      { key: 'banks',         field: 'bank' },
      { key: 'classes',       field: 'class' },
      { key: 'directs',       field: 'direct' },
    ];

    arrayFilters.forEach(({ key, field }) => {
      const vals = filters[key];
      if (vals && vals.length > 0) {
        results = results.filter(emp => vals.includes(emp[field]));
      }
    });

    // ── Hire date range ──
    if (filters.dateStart) {
      const ds = new Date(filters.dateStart);
      results = results.filter(emp => emp.hireDate && new Date(emp.hireDate) >= ds);
    }
    if (filters.dateEnd) {
      const de = new Date(filters.dateEnd);
      results = results.filter(emp => emp.hireDate && new Date(emp.hireDate) <= de);
    }

    // ── Salary range (stored in `package` field) ──
    if (filters.salaryMin !== null && filters.salaryMin !== undefined) {
      results = results.filter(emp => (parseFloat(emp.package) || 0) >= filters.salaryMin);
    }
    if (filters.salaryMax !== null && filters.salaryMax !== undefined) {
      results = results.filter(emp => (parseFloat(emp.package) || 0) <= filters.salaryMax);
    }

    // ── Boolean: active only (exclude resigned / terminated) ──
    if (filters.activeOnly) {
      results = results.filter(emp => {
        const cls = (emp.class || '').toLowerCase();
        return !cls.includes('resigned') && !cls.includes('terminated') && !cls.includes('inactive');
      });
    }

    return results;
  }

  return {
    getAll,
    findByCode,
    getDistinctValues,
    queryWithFilters,
  };
})();
