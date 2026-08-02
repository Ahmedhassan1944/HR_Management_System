# HR Insights — Dynamic Y-Axis Width for Long Bar Labels

You are working inside the existing Google Apps Script repository for the HR Management System.

Your task is to update the HR Insights bar charts so the Y-axis label area expands dynamically to fit the longest label value, instead of using a fixed or cramped width.

## Objective

Improve all horizontal bar charts that render many Y-axis labels so that:

1. The Y-axis label area grows automatically when a label is very long.
2. The longest label in the dataset determines the required left-side space.
3. The chart remains readable for both short and long values.
4. The same behavior applies to any bar chart that contains many Y-axis entries.

## Problem

When the Y-axis contains labels such as:

`Technical offer team leader engineer`

the text may be too long for the default chart layout. In that case:

- the label may be clipped
- the chart may squeeze the text
- the chart may look broken or unreadable
- the Y-axis area remains too narrow for future long labels

## Desired Behavior

For any horizontal bar chart:

- if the longest Y-axis label is short, the chart should use a compact label area
- if the longest Y-axis label is long, the chart should expand the available Y-axis width automatically
- the Y-axis value area should be sized based on the maximum label width in the dataset
- the same logic must remain valid for all bar charts with many values on the Y-axis

## Implementation Principle

The solution should not be a hardcoded width.

Instead, the chart should:

1. read the full list of Y-axis labels
2. find the longest label text
3. estimate the required width based on label length and font size
4. reserve enough left margin / side space for the Y-axis labels
5. render the chart inside a scrollable panel when the list becomes large

## Files Involved

Update the frontend files only:

- `Script.html`
- `Styles.html`

## Important Constraints

- Do not change backend logic in any `.gs` file.
- Do not rename or remove the existing chart IDs.
- Keep the existing chart rendering pipeline intact.
- Keep the solution general so it works for any bar chart using many Y labels.
- Preserve compatibility with Google Apps Script and the existing HTML/CSS/JS rendering model.

## Recommended Approach

### 1. In `Script.html`

Add logic that measures the longest Y label before the chart renders.

Use one or more of these strategies:

- compute the longest string length from `labels`
- estimate chart padding based on the character count
- set extra left padding / inner margin on the chart container when needed
- attach the chart inside a scrollable container so large label lists stay accessible

### 2. In `Styles.html`

Use CSS that supports dynamic spacing:

- a scrollable chart area for long lists
- a left-side label region that can expand without clipping the text
- a wrapper that allows the chart to retain readable spacing
- stable layout even when new labels are much longer than before

## Suggested Behavior for the Job Title Chart

For the `Employees by Job Title` chart, the label area should be scaled to the longest job title value in the dataset.

Example:

- Short labels → smaller Y-axis width
- Long labels like `Technical offer team leader engineer` → wider Y-axis width

That means the Y-axis lane should be flexible and should not be locked to a single small width.

## Validation Checklist

After implementation, verify that:

- [ ] The Y-axis label area expands when the longest label is longer.
- [ ] Short labels do not waste too much space.
- [ ] Long labels remain fully visible.
- [ ] The chart remains usable when there are many values on the Y-axis.
- [ ] The behavior works for all bar charts, not only one chart.
- [ ] No backend changes are required.

## Final Deliverable

Return the completed UI implementation so that the Y-axis width becomes dynamic and automatically adapts to the longest label in the dataset for all relevant bar charts.
