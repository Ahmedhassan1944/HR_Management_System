# HR Insights — Job Title Chart Full Label Visibility Prompt

You are working inside the existing Google Apps Script repository for the HR Management System.

Your task is to update the HR Insights page so that the `Employees by Job Title` chart displays all job titles clearly and fully, without hiding any part of the long labels on the Y-axis.

## Objective

Improve the `Employees by Job Title` horizontal bar chart so that:

1. Every job title label is fully visible.
2. Long job title names are not truncated or partially hidden.
3. The chart area supports vertical scrolling when there are many job titles.
4. The chart remains readable and stable even if future job titles become very long.

## Required Behavior

### Chart behavior
- The `Employees by Job Title` chart must render all row labels.
- Labels on the Y-axis must not be cut off or partially hidden due to limited card height.
- If the number of job titles increases, the chart container should allow scrolling.
- Long labels should remain visible in full, not clipped by the card boundary.

### Future-proofing
- If a new job title is added with a long name such as:
  `xxxxxxxxxxxxxxxxxxxxxxx`
- the full text must still be visible and not cut off by the chart container.

## Files Involved

Update the frontend files only:

- `Script.html`
- `Styles.html`

## Important Constraints

- Do not change the backend logic in any `.gs` file.
- Do not rename or remove the existing chart ID: `chart-title`.
- Do not change the existing `Charts.horizontalBar()` call for the Job Title chart.
- Preserve the existing data contract and chart rendering pipeline.
- The final implementation must remain compatible with Google Apps Script and the current HTML/CSS/JS render model.

## Implementation Requirements

### 1. In `Script.html`

Keep the existing Job Title chart rendering in place, but ensure the chart container is wrapped in a scrollable area that can grow with the number of labels.

The `Employees by Job Title` chart should be visually contained inside a scrollable card body so that:

- all labels remain accessible
- the panel height does not become too large unnecessarily
- the user can scroll vertically when the chart has many rows

### 2. In `Styles.html`

Adjust the CSS so that:

- the Job Title chart card has a scrollable content area
- the Y-axis labels can fully render without clipping
- long labels are not hidden by container overflow
- the scrolling area is vertical and works smoothly
- the chart remains readable even with dense lists of job titles

## Recommended Styling Direction

Use a layout where:

- the chart card has a defined scrollable region
- the canvas wrapper can grow to the needed height
- the scroll area allows long label listings without squeezing or hiding text

The goal is to preserve full label visibility, not compress the chart to fit a fixed low-height container.

## Validation Checklist

After implementation, verify that:

- [ ] All job titles are displayed
- [ ] No job title label is cut off on the Y-axis
- [ ] The chart container supports scroll for large datasets
- [ ] Long text labels remain visible in full
- [ ] `chart-title` still renders correctly
- [ ] No backend changes are needed

## Final Deliverable

Return the completed implementation and ensure it preserves full label visibility for all Job Title chart entries, including future long job titles.
