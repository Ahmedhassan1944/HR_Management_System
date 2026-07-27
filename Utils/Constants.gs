/**
 * @file Constants.gs
 * @description Global constants, configuration keys, and enumerations.
 *              Single source of truth for all magic values in the system.
 */

// ============================================================
//  SHEET NAMES
// ============================================================
const SHEET = {
  EMPLOYEE: 'Emp_Data',
  SETTINGS: 'Sys_Settings',
  AUDIT_LOGS: 'Sys_AuditLogs',
};

// ============================================================
//  EMPLOYEE COLUMN MAP  (0-indexed for array access)
// ============================================================
const EMP_COL = {
  SR: 0,           // A - Serial number
  CODE: 1,         // B - Primary Key
  NAME: 2,         // C - English name
  NAME_AR: 3,      // D - Arabic name
  TITLE: 4,        // E - Job title
  DEPARTMENT: 5,   // F - Department
  SECTION: 6,      // G - Section
  PROJECT: 7,      // H - Project / Site
  GENDER: 8,       // I - Gender
  BIRTH_DATE: 9,   // J - Date of birth
  AGE: 10,         // K - Calculated age (formula)
  HIRE_DATE: 11,   // L - Hiring date
  NATIONALITY: 12, // M - Nationality
  PASSPORT_NO: 13, // N - Passport number (sensitive)
  CIVIL_NO: 14,    // O - Civil / Resident ID (sensitive)
  EMAIL: 15,       // P - Email
  TELEPHONE: 16,   // Q - Telephone (sensitive)
  PACKAGE: 17,     // R - الباقه
  BANK_ACC: 18,    // S - Bank account (sensitive)
  CIVIL_EXP: 19,   // T - Civil ID expiry date
  PASSPORT_EXP: 20,// U - Passport expiry date
  BANK: 21,        // V - Bank name
  SWIFT: 22,       // W - SWIFT code
  GRAD_YEAR: 23,   // X - Graduation year
  LOCAL_EXPAT: 24, // Y - Local / Expat
  EMERGENCY_1: 25, // Z - Emergency contact 1
  RELATION_1: 26,  // AA - Relationship 1
  EMERGENCY_2: 27, // AB - Emergency contact 2
  CONTRACT_EXP: 28,// AC - Contract expiry date
  RELATION_2: 29,  // AD - Relationship 2
  REMARKS: 30,     // AE - Remarks
  ACTING_AS: 31,   // AF - Acting as
  DIRECT: 32,      // AG - Direct / Indirect
  CLASS: 33,       // AH - Classification
};

// ============================================================
//  DOCUMENT EXPIRY THRESHOLDS (days)
// ============================================================
const EXPIRY_THRESHOLD = {
  CRITICAL: 30,    // ≤ 30 days  → Critical
  DUE_SOON: 90,    // 31–90 days → Due Soon
};

// ============================================================
//  EXPIRY STATUS LABELS
// ============================================================
const EXPIRY_STATUS = {
  EXPIRED: 'Expired',
  CRITICAL: 'Critical',
  DUE_SOON: 'Due Soon',
  VALID: 'Valid',
  MISSING: 'Missing',
};

// ============================================================
//  SETTINGS KEYS  (stored in Sys_Settings sheet)
// ============================================================
const SETTING_KEY = {
  EXPIRY_CRITICAL_DAYS: 'expiry.critical.days',
  EXPIRY_DUE_SOON_DAYS: 'expiry.dueSoon.days',
  DEFAULT_PAGE_SIZE: 'table.defaultPageSize',
  DEFAULT_SORT_FIELD: 'table.defaultSortField',
  SYSTEM_TIMEZONE: 'system.timezone',
};

// ============================================================
//  RESPONSE STATUS
// ============================================================
const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};
