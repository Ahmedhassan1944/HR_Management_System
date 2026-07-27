# Prompt – Improve the HR Management System Architecture

You are a Senior Software Architect and Senior UX/UI Designer specializing in Google Apps Script applications.

Your task is to redesign and enhance my **HR Management System** before implementation.

This project is built using:

* Google Apps Script (Backend)
* HTML / CSS / JavaScript (Frontend)
* Google Sheets (Database)
* Google Apps Script Web App Deployment

The attached specification and Google Sheets data structure are the main source of truth.

---

# Objective

I do NOT want to simply build a CRUD application.

I want to build a **modern HR Management Platform** that provides an excellent user experience, high performance, and dashboard-driven decision making similar to Power BI, while remaining lightweight and easy to maintain.

The architecture should be scalable so future modules can be added without major code changes.

---

# Existing Modules

Currently the system contains:

* Dashboard
* Employees
* Document Center

Keep these modules, but improve them wherever necessary.

---

# Add New Module

## 📊 HR Insights

Add a completely new module called **HR Insights**.

This page should focus on visual analytics rather than operational tasks.

It should contain professional dashboards and charts such as:

* Workforce Distribution
* Employees by Department
* Employees by Section
* Employees by Project
* Employees by Nationality
* Employees by Gender
* Employees by Job Title
* Employee Growth
* Hiring Trend
* Age Distribution
* Average Age
* Contract Status
* Passport Expiry Statistics
* Civil ID Expiry Statistics
* Employment Classification
* Direct vs Indirect Employees

The page should look like an executive analytics dashboard.

---

# Add Global Search

Design a powerful **Global Search** feature.

The search should be capable of searching simultaneously across:

* Employee Code
* Employee Name
* Arabic Name
* Email
* Phone Number
* Passport Number
* Civil ID
* Department
* Section
* Project
* Job Title

The search must be extremely fast and should instantly navigate to the employee profile.

---

# Add Settings Module

Create a dedicated **Settings** page.

The purpose of this page is to move as much business logic as possible out of the source code.

Examples:

* Expiry thresholds
* Dashboard behavior
* Default sorting
* Default filters
* Table preferences
* Notification rules (future use)
* UI preferences
* Developer options
* System rules

The administrator should be able to modify these settings without editing the source code.

---

# Improve Existing Modules

Review all existing modules and suggest improvements for:

Dashboard

Employees

Document Center

Navigation

Sidebar

Cards

Tables

Filters

Performance

Responsive behavior

User Experience

Do not remove existing functionality.

Instead, improve it.

---

# Database Review

Review the Google Sheets database structure.

Suggest:

* Better normalization
* Additional helper sheets
* Lookup tables
* Configuration tables
* Audit tables
* Future scalability improvements

Do not unnecessarily complicate the database.

Keep it simple and suitable for Google Sheets.

---

# UX/UI Requirements

The interface should feel modern and premium.

Use ideas similar to:

* Power BI
* Microsoft 365
* Google Workspace
* Notion

Requirements:

* Clean spacing
* Professional cards
* Modern typography
* Smooth animations
* Responsive layout
* Collapsible sidebar
* Interactive KPI cards
* Modern employee profile drawer
* Elegant charts
* Fast loading experience

---

# Performance Requirements

The system must prioritize:

* Fast loading
* Minimal Google Apps Script calls
* Client-side rendering where appropriate
* Efficient caching
* Reusable components
* Modular architecture
* Easy maintenance

---

# Important Rules

Do NOT generate source code yet.

Instead:

1. Review the entire architecture.
2. Suggest missing modules.
3. Suggest UX improvements.
4. Suggest better navigation.
5. Suggest database improvements.
6. Suggest dashboard improvements.
7. Suggest HR Insights layout.
8. Suggest reusable components.
9. Suggest future-ready architecture.

The final output should be a comprehensive software architecture proposal that will serve as the blueprint before implementation.
