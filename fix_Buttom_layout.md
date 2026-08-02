# HR Insights Bottom Layout Modification Prompt

You are working inside the existing Google Apps Script repository for the HR Management System.

Your task is to update the HR Insights page layout exactly as described below, without changing the business logic or breaking the chart rendering flow.

## Objective

Modify the bottom section of the HR Insights dashboard so that:

1. The KPI cards at the bottom are removed completely.
2. The two bottom charts remain visible:
   - Employees by Job Title
   - Employees by Department
3. These two charts are displayed side by side with a width split of:
   - 70% for Employees by Job Title
   - 30% for Employees by Department

## Required Final Layout

The bottom row should contain only these two charts:

- Left: Employees by Job Title
- Right: Employees by Department

The chart containers must be arranged in a 70/30 horizontal layout.

## Technical Constraints

Please preserve the following:

- Do not modify backend logic in any `.gs` file
- Do not remove or rename the chart IDs:
  - `chart-title`
  - `chart-dept`
- Do not change the existing `Charts.horizontalBar()` rendering calls
- Keep the existing HR Insights payload structure intact
- Ensure the page remains compatible with Google Apps Script HTML rendering

## Files to Update

Only update the frontend structure and styling files:

- `Script.html`
- `Styles.html`

## Exact Implementation Requirements

### 1. Update `Script.html`

Remove the KPI container block from the bottom section of the HR Insights layout.

The current bottom structure contains:

- an `insights-bottom` wrapper
- a KPI area (`insights-bottom__kpis`)
- a chart wrapper (`insights-bottom__charts`)

Rewrite the bottom section so it becomes a simple two-column layout containing only the two horizontal bar charts.

### 2. Update `Styles.html`

Remove all styles related to:

- KPI cards in the bottom area
- KPI grid display
- the old bottom layout that reserves left space for KPI cards

Add or update CSS so that:

- `.insights-bottom` becomes a two-column layout
- the first chart container takes 70% of the row width
- the second chart container takes 30% of the row width
- the charts align horizontally on desktop
- the layout stacks vertically on smaller screens

## Recommended Responsive Behavior

- Desktop: 70/30 split
- Tablet/mobile: stack the two charts vertically

## Validation Checklist

After implementation, verify that:

- [ ] Bottom KPI cards are completely removed
- [ ] `chart-title` is still rendered
- [ ] `chart-dept` is still rendered
- [ ] The bottom layout uses a 70/30 split
- [ ] The page does not break on mobile
- [ ] No backend or JavaScript service changes are required

## Final Deliverable

Return only the completed implementation for the requested layout change, with clean, maintainable code and no unnecessary changes.
