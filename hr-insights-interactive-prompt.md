# HR Insights Interactive Page Prompt

## Objective
Turn the HR Insights page into an interactive analytics view, similar in concept to Power BI, where users can filter and explore the analytics directly from the page.

## Feasibility
Yes, this is achievable in Google Apps Script, but with some caveats:
- Google Sheets is not a full BI engine. Complex filtering and aggregation can be implemented, but large datasets will increase response time.
- The interactive view should run filter logic on the server side using `google.script.run`, not in the browser, to avoid excessive client-side processing.
- For a smoother experience, use cached option lists and limit the query range. Avoid querying the entire sheet for every tiny interaction.
- If your dataset is moderate in size, a well-designed server-side filter flow will be responsive enough. If the data grows very large, the feature will be slower and more complex.

## Implementation Prompt
Use this file as the single prompt for an engineer or AI agent.

### Project context
A Google Apps Script application with:
- `Index.html` as the main shell
- `Script.html` for client-side page logic
- `Styles.html` for global styling
- `InsightsService.gs` for HR Insights business logic
- `EmployeeService.gs`, `SettingsRepository.gs`, `SettingsService.gs` for data access and persistence

### Goal
Create a polished, interactive HR Insights page that:
- displays dashboards and KPIs
- includes an opaque premium filter pane
- updates charts and metrics immediately when filters are applied
- supports dropdown filters for the exact fields: `Title`, `Department`, `Project`, `Gender`, `Nationality`, `Bank`, `Class`, `Direct/Indirect`

### Requirements
1. UI
   - Implement a reusable filter pane with an opaque background and premium styling.
   - Add dropdown/multi-select controls for all required fields.
   - Show visible "Apply", "Reset", and optional "Save preset" actions.
   - Embed the pane in the HR Insights page layout.

2. Client behavior
   - Initialize the filter pane when HR Insights loads.
   - Collect filter values and call the server with `google.script.run.withSuccessHandler(...)`.
   - Render a loading state while server processing runs.
   - Update the HR Insights charts and KPI section without a full page reload.

3. Server-side
   - Add or update `InsightsService.getFilteredInsights(filters)`.
   - Filter the employee dataset based on selected fields, then compute the same insights payload as `getInsightsData()`.
   - Prefer server-side aggregation over client-side looping for large datasets.

4. Data performance
   - Load filter option values from the dataset once per page load or when filters change.
   - Keep filtering functions efficient and avoid repeated sheet scans for every UI interaction.
   - If data size becomes large, add pagination or batch mode for results.

5. User experience
   - Ensure the HR Insights filter pane is interactive and responsive.
   - Add error handling and toast messages for failed filter actions.
   - Keep the Dashboard filter and HR Insights filter behavior consistent.

### Acceptance Criteria
- The HR Insights page shows the filter pane and accepts user selections.
- Clicking `Apply` updates the insights charts/KPIs dynamically.
- The page remains a single view; no full reloads are required.
- Filter fields include exactly: `Title`, `Department`, `Project`, `Gender`, `Nationality`, `Bank`, `Class`, `Direct/Indirect`.
- The implementation is completed using vanilla Apps Script, HTML, CSS, and the project’s existing service structure.

### Notes on complexity
- If the dataset is small to moderate, this can be delivered with only modest impact to query complexity.
- If the dataset is large, expect slower behavior and additional work to optimize Sheets queries.
- The best approach is to compute filters on the server and return a compact payload for the HR Insights view.

---

This file is the standalone prompt you can use to implement the interactive HR Insights experience.
