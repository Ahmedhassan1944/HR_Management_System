/**
 * @file InsightsService.gs
 * @description Business logic layer for the HR Insights analytics module.
 *              Aggregates and computes all chart/KPI data for the Insights page.
 *              All aggregations run server-side to minimize data transfer.
 */

const InsightsService = (() => {

  // ────────────────────────────────────────────────────────────
  //  PRIVATE AGGREGATION HELPERS
  // ────────────────────────────────────────────────────────────

  /**
   * Groups employees by a string field and counts them.
   * @param {Object[]} employees
   * @param {string} field
   * @returns {Object[]} [{ label, count }] sorted by count desc
   */
  function _groupAndCount(employees, field) {
    const counts = {};
    for (const emp of employees) {
      const key = emp[field] || 'Unknown';
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Computes age distribution buckets.
   * @param {Object[]} employees
   * @returns {Object[]} [{ range, count }]
   */
  function _ageDistribution(employees) {
    const buckets = {
      '< 25':   0,
      '25–34':  0,
      '35–44':  0,
      '45–54':  0,
      '55+':    0,
      'Unknown': 0,
    };
    for (const emp of employees) {
      const age = parseFloat(emp.age);
      if (isNaN(age))       buckets['Unknown']++;
      else if (age < 25)    buckets['< 25']++;
      else if (age < 35)    buckets['25–34']++;
      else if (age < 45)    buckets['35–44']++;
      else if (age < 55)    buckets['45–54']++;
      else                  buckets['55+']++;
    }
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }

  /**
   * Computes hiring trend grouped by Year-Month.
   * @param {Object[]} employees
   * @returns {Object[]} [{ period, count }] sorted chronologically
   */
  function _hiringTrend(employees) {
    const counts = {};
    for (const emp of employees) {
      const d = Formatter.parseDate(emp.hireDate);
      if (!d) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, count]) => ({ period, count }));
  }

  /**
   * Computes expiry status summary for a given expiry field.
   * @param {Object[]} employees
   * @param {string} expField - e.g. 'passportExp'
   * @returns {Object[]} [{ status, count }]
   */
  function _expiryStatusSummary(employees, expField) {
    const counts = {
      [EXPIRY_STATUS.EXPIRED]:  0,
      [EXPIRY_STATUS.CRITICAL]: 0,
      [EXPIRY_STATUS.DUE_SOON]: 0,
      [EXPIRY_STATUS.VALID]:    0,
      [EXPIRY_STATUS.MISSING]:  0,
    };
    for (const emp of employees) {
      const date   = Formatter.parseDate(emp[expField]);
      const status = Formatter.getExpiryStatus(date);
      counts[status]++;
    }
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }

  // ────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────

  /**
   * Computes the insights payload for a given set of employees.
   * @param {Object[]} employees
   * @returns {Object} Payload object for charts and KPIs
   */
  function _computeInsightsPayload(employees) {
    const total = employees.length;

    // KPI - Top Level
    const avgAge = employees.reduce((sum, e) => {
      const age = parseFloat(e.age);
      return isNaN(age) ? sum : sum + age;
    }, 0) / (employees.filter(e => e.age).length || 1);

    const kpis = {
      totalEmployees: total,
      averageAge:     Number(avgAge.toFixed(1)),
      maleCount:      employees.filter(e => e.gender === 'Male').length,
      femaleCount:    employees.filter(e => e.gender === 'Female').length,
      directCount:    employees.filter(e => e.direct === 'Direct').length,
      indirectCount:  employees.filter(e => e.direct === 'Indirect').length,
    };

    // Distribution Charts
    const byDepartment  = _groupAndCount(employees, 'department');
    const bySection     = _groupAndCount(employees, 'section');
    const byProject     = _groupAndCount(employees, 'project');
    const byNationality = _groupAndCount(employees, 'nationality');
    const byGender      = _groupAndCount(employees, 'gender');
    const byTitle       = _groupAndCount(employees, 'title');
    const byClass       = _groupAndCount(employees, 'class');
    const byDirect      = _groupAndCount(employees, 'direct');

    // Trends & Demographics
    const ageDistribution  = _ageDistribution(employees);
    const hiringTrend      = _hiringTrend(employees);

    // Document Expiry Status Charts
    const passportExpiryStats = _expiryStatusSummary(employees, 'passportExp');
    const civilExpiryStats    = _expiryStatusSummary(employees, 'civilExp');
    const contractExpiryStats = _expiryStatusSummary(employees, 'contractExp');

    return {
      kpis,
      byDepartment,
      bySection,
      byProject,
      byNationality,
      byGender,
      byTitle,
      byClass,
      byDirect,
      ageDistribution,
      hiringTrend,
      passportExpiryStats,
      civilExpiryStats,
      contractExpiryStats,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Returns the complete HR Insights payload for all charts (Unfiltered).
   * @returns {Object} Response envelope
   */
  function getInsightsData() {
    return Response.wrap(() => {
      const employees = EmployeeRepository.getAll();
      return Response.success(_computeInsightsPayload(employees));
    });
  }

  /**
   * Returns the HR Insights payload for filtered employees.
   * @param {Object} filters
   * @returns {Object} Response envelope
   */
  function getFilteredInsights(filters) {
    return Response.wrap(() => {
      const employees = EmployeeRepository.queryWithFilters(filters);
      return Response.success(_computeInsightsPayload(employees), `${employees.length} employee(s) analyzed.`);
    });
  }

  return {
    getInsightsData,
    getFilteredInsights,
  };
})();
