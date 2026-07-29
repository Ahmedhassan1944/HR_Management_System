# HR Insights Filter Pane Fix Prompt

## Objective
Fix the existing HR Insights filter pane so it becomes fully interactive and updates the HR Insights page without a full reload.

## Context
This is a Google Apps Script project with a shared UI shell in `Index.html`, client-side logic in `Script.html`, and server-side services in `InsightsService.gs`, `EmployeeService.gs`, and settings files such as `SettingsRepository.gs` and `SettingsService.gs`.

## Task
1. Confirm the HR Insights page includes the shared filter pane HTML and that the pane is initialized when the HR Insights page becomes active.
2. Ensure the filter pane component is reusable and can target both Dashboard and HR Insights views.
3. Add or update client-side logic so `Apply` calls the HR Insights filter endpoint, for example:
   - `google.script.run.withSuccessHandler(renderInsights).getFilteredInsights(filters)`
4. Add a dedicated server-side function in `InsightsService.gs` if needed:
   - `function getFilteredInsights(filters)`
   - The function should filter the employees dataset by the requested fields and compute the same KPI and chart payload as `getInsightsData()`.
5. Populate dropdowns for the exact fields:
   - `Title`
   - `Department`
   - `Project`
   - `Gender`
   - `Nationality`
   - `Bank`
   - `Class`
   - `Direct/Indirect`
6. Ensure the filter pane is opaque, premium-looking, and does not rely on external frameworks.
7. Add a `Reset` flow that clears filters and reloads the HR Insights page with the unfiltered payload.
8. Add a clear failure state or toast message if the HR Insights filter action fails.

## Acceptance Criteria
- The filter pane appears on HR Insights and accepts user input.
- Clicking `Apply` updates the HR Insights charts/KPIs without reloading the page.
- The filter pane works on HR Insights using the same reusable component as Dashboard.
- If the pane fails, the user sees a proper error message.

## Notes
This prompt is intended to be used by an engineer or AI agent to fix the HR Insights filter pane implementation.
