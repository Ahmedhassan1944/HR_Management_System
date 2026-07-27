/**
 * @file DocumentService.gs
 * @description Business logic layer for Document Center operations.
 *              Aggregates document expiry data across all employees
 *              and classifies them by timeframe buckets.
 */

const DocumentService = (() => {

  /**
   * Builds a unified list of expiring documents from all employees.
   * Each entry represents one document type for one employee.
   * @param {Object[]} employees - Raw enriched employee objects.
   * @returns {Object[]} Flat list of document expiry records.
   */
  function _buildDocumentList(employees) {
    const docs = [];

    const DOC_TYPES = [
      { key: 'passportExp',  label: 'Passport',        statusKey: 'passportStatus',  daysKey: 'passportDaysLeft' },
      { key: 'civilExp',     label: 'Civil / Resident ID', statusKey: 'civilStatus', daysKey: 'civilDaysLeft' },
      { key: 'contractExp',  label: 'Contract',         statusKey: 'contractStatus', daysKey: 'contractDaysLeft' },
    ];

    for (const emp of employees) {
      for (const docType of DOC_TYPES) {
        const expDate = emp[docType.key];
        const status  = emp[docType.statusKey];
        if (!expDate && status === EXPIRY_STATUS.MISSING) continue; // skip fully missing

        docs.push({
          employeeCode: emp.code,
          employeeName: emp.name,
          department:   emp.department,
          project:      emp.project,
          docType:      docType.label,
          expiryDate:   expDate || null,
          status,
          daysLeft:     emp[docType.daysKey],
        });
      }
    }

    // Sort: Expired first, then by days ascending
    return docs.sort((a, b) => {
      const aD = a.daysLeft ?? 9999;
      const bD = b.daysLeft ?? 9999;
      return aD - bD;
    });
  }

  /**
   * Returns summary counts for documents expiring in defined timeframes.
   * @param {Object[]} docs - Flat document list.
   * @returns {Object} Counts by timeframe key.
   */
  function _buildSummary(docs) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const summary = {
      expired:   0,
      today:     0,
      tomorrow:  0,
      thisWeek:  0,
      nextWeek:  0,
      thisMonth: 0,
      thisYear:  0,
      total:     docs.length,
    };

    for (const doc of docs) {
      const days = doc.daysLeft;
      if (days === null) continue;
      if (days < 0)   summary.expired++;
      if (days === 0) summary.today++;
      if (days === 1) summary.tomorrow++;
      if (days >= 0 && days <= 7)  summary.thisWeek++;
      if (days >= 8 && days <= 14) summary.nextWeek++;
      if (days >= 0 && days <= 30) summary.thisMonth++;
      if (days >= 0 && days <= 365) summary.thisYear++;
    }

    return summary;
  }

  // ────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────

  /**
   * Returns a complete Document Center payload:
   * - summary counts by timeframe
   * - full sorted document list
   * @returns {Object} Response envelope
   */
  function getDocumentCenterData() {
    return Response.wrap(() => {
      const employees = EmployeeRepository.getAll();
      // Enrich inline using EmployeeService helper (re-use expiry computation)
      const enriched = employees.map(emp => {
        const passportDate = Formatter.parseDate(emp.passportExp);
        const civilDate    = Formatter.parseDate(emp.civilExp);
        const contractDate = Formatter.parseDate(emp.contractExp);
        return {
          ...emp,
          passportStatus:   Formatter.getExpiryStatus(passportDate),
          civilStatus:      Formatter.getExpiryStatus(civilDate),
          contractStatus:   Formatter.getExpiryStatus(contractDate),
          passportDaysLeft: Formatter.daysFromToday(passportDate),
          civilDaysLeft:    Formatter.daysFromToday(civilDate),
          contractDaysLeft: Formatter.daysFromToday(contractDate),
        };
      });

      const docs    = _buildDocumentList(enriched);
      const summary = _buildSummary(docs);

      return Response.success({ summary, documents: docs });
    });
  }

  return {
    getDocumentCenterData,
  };
})();
