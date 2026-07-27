# HR Management System - System Requirements & Technical Specification (V1)

## 📌 Project Overview
The **HR Management System** is a web application built on **Google Apps Script (GAS)**, using **Google Sheets** as a database. It is designed to streamline human resource workflows, track employee records, monitor document expiry timelines, and provide real-time dashboard analytics with an interactive user experience.

---

## 🛠️ Technology Stack & Architecture
* **Frontend:** HTML,JS
* **Backend Platform:** Google Apps Script (GAS)
* **Database:** Google Sheets
* **Hosting:** Google Apps Script Web App Deployment

---

## 📐 System Layout & Navigation
The application features a **Collapsible Sidebar Layout** containing three primary modules:

```
+-----------------------------------------------------------------------+
|  HR Management System                                                  |
+-------------------+---------------------------------------------------+
| 📊 Dashboard      |                                                   |
| 👥 Employees      |               Main Content Area                   |
| 📁 Doc Center     |                                                   |
+-------------------+---------------------------------------------------+
```

---

## 🚀 Module Details & Functional Requirements

### 1. 📊 Dashboard Module
Designed to deliver a **Power BI-like analytics experience** divided into four logical sections:

* **Section 1: General HR Statistics**
  * Key Performance Indicators (KPI cards): Total Active Employees, Onboarding Status, Department Breakdown, Attendance/Leave metrics.
* **Section 2: Document Expiration Overview**
  * 6 Status Cards tracking document expiry thresholds:
    * 📅 This Year
    * 🗓️ This Month
    * ⏳ Next Week
    * 📆 This Week
    * ☀️ Tomorrow
    * 🔥 Today
* **Section 3: Travel Expenses & Logistics Analytics**
  * **Interactive Line Chart:** Monthly expenditure on traveling tickets across different project locations (e.g., Egypt, Oman, and regional routes).
* **Section 4: Operational & Project Metrics**
  * Customizable panel displaying key project allocation numbers, contractor status, or upcoming HR actions.

---

### 2. 👥 Employees Module
* **Table View (Main Directory):**
  * Clean, paginated table listing all active employees.
  * Columns: ID, Name, Job Title, Department, Location, Status, Actions.
* **Interactive Profile Viewer:**
  * Each table row features a **"View"** action button.
  * Clicking "View" opens a **Premium Design Modal/Drawer** displaying complete employee details:
    * Personal Information & Contact Details
    * Job Role, Department & Reporting Line
    * Contract & Passport/Visa Expiry Details
    * Associated Travel History & Document Records

---

### 3. 📁 Document Center Module
Dedicated center for compliance and document validity tracking across all employees.
* **Count Summary Cards:**
  * Quick status metrics broken down by timeframe:
    1. **This Year**
    2. **This Month**
    3. **Next Week**
    4. **This Week**
    5. **Tomorrow**
    6. **Today**
* **Detailed Document Grid:**
  * Filterable list of expiring items (Passports, Visas, Work Permits, Contracts, Certifications).

---

## 📑 Proposed Google Sheets Database Structure



---

## 🔮 Future Enhancements & Roadmap (V2 & Beyond)
Given the cross-border logistical setup (Egypt ↔ Oman Coordination):
1. **Logistics & Movement Tracker:** Tracking flight tickets, visa issuance status, and work permit renewals specifically tailored for international cross-assignments.
2. **Advanced Role-Based Access Control (RBAC):** Admin, HR Manager, and Employee Self-Service portals.
3. **Automated Email Notifications:** Daily/weekly automated email alerts via Google Apps Script for expiring documents.
4. **Excel/PDF Exporting:** Standardized report exports directly from the frontend dashboard.
