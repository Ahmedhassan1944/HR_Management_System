# HR Insights — Global Cross-Chart Interaction Prompt

You are working inside the existing Google Apps Script repository for the HR Management System.

Your task is to make the HR Insights dashboard fully interactive, similar to Power BI interaction behavior.

## Objective

Today, only a few charts support interaction filtering behavior. The goal is to extend that interaction model so that every chart on the HR Insights page can participate in cross-filtering and context-driven filtering.

## Current Situation

Currently, the charts that already have interaction support are only these three:

- `Employees by Project`
- `Employees by Job Title`
- `Employees by Department`

The requirement is to make all charts interactive, including the line chart.

## Required Behavior

### Global interaction model
When the user clicks any chart element in any chart:

1. The selected value becomes the active filter context.
2. The rest of the dashboard updates accordingly.
3. All charts, KPIs, and summary areas react to the selected filter.
4. The interaction behaves like Power BI cross-filtering, not just local click handling.

### Example behavior
If the user clicks a date point on the line chart:

- the whole page filters by that selected date
- all related charts respond to that selection
- all matching HR data changes accordingly

If the user clicks a bar, slice, or row in any other chart:

- the active filter should update globally
- every relevant chart in the page should be recalculated based on the selection

## Scope

This interaction must be applied to all relevant charts, not only the currently supported subset.

That includes:

- line chart
- bar charts
- donut charts
- any other chart rendered on the insights page

## Important Constraints

- Do not change the backend data model in any `.gs` file unless absolutely required.
- Preserve the current chart IDs and existing rendering flow.
- Keep the user experience consistent with the current HR Insights page.
- Do not break the current UI layout or filtering pipeline.
- The interaction must be implemented in a reusable way so it can be extended to future charts.

## Files Involved

Update the frontend files only:

- `Script.html`
- `Styles.html`
- `Index.html`

## Implementation Requirements

### 1. Centralize interaction state
Create or extend a single interaction state object that tracks:

- the selected chart type
- the selected field/value
- the active filter context
- the current dashboard state after filtering

### 2. Use a global filter event bus
When a chart element is clicked:

- broadcast the selection to the rest of the dashboard
- update the active filter context
- trigger re-rendering or data recalculation for all charts

### 3. Apply interaction to all charts
The solution should be generalized so that every chart type can use the same interaction flow.

For example:

- clicking a date in the line chart filters the dashboard by date
- clicking a job title in the job title chart filters the dashboard by title
- clicking a department in the department chart filters the dashboard by department
- clicking a project in the project chart filters the dashboard by project

### 4. Preserve dashboards and chart labels
The selected filter should update all dependent components without losing their current labels, titles, or chart identities.

### 5. Support clearing interaction state
The page should provide a clear way to reset the global interaction state and restore the full dashboard view.

## Validation Checklist

After implementation, verify that:

- [ ] All charts on the HR Insights page are interactive.
- [ ] Clicking any chart element filters the rest of the page.
- [ ] The line chart can also drive the global dashboard filter.
- [ ] The selected chart value updates the entire dashboard context.
- [ ] The `Reset Filters` behavior still works correctly.
- [ ] The existing charts remain stable and readable.

## Final Deliverable

Return the completed interactive dashboard implementation so that all charts behave like a single Power BI-style interaction model, where clicking one chart element updates the entire dashboard based on that context.
