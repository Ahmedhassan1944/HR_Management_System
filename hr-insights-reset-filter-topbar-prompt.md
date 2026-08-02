# HR Insights — Move Reset Filters Button to Top Bar

You are working inside the existing Google Apps Script repository for the HR Management System.

Your task is to update the HR Insights page so that the `Reset Filters` button is moved from its current position near the page heading into the top-right action area of the page header bar.

## Objective

Improve the placement and behavior of the `Reset Filters` button so that:

1. The button appears beside the header icons in the top bar.
2. It remains usable from anywhere on the current page position.
3. It can be triggered even while the user scrolls up and down the page.
4. The layout stays clean and consistent with the current design.

## Required Behavior

### Button placement
- Move the `Reset Filters` button to the top navigation/header action area.
- Keep it visually aligned with the existing icon buttons in the top bar.
- It should be easy to reach without needing to scroll back to the section heading.

### Scroll behavior
- The button must remain accessible while the user scrolls vertically through the page.
- The user should be able to click `Reset Filters` from the current page position without being forced to return to the earlier heading region.
- The element should behave like a persistent top-level action control.

## Important Constraints

- Do not change the backend logic in any `.gs` file.
- Preserve the existing filter reset behavior and action logic.
- Do not break the current page structure or existing top bar layout.
- Keep the UI consistent with the current HR Insights design language.

## Files Involved

Update the frontend files only:

- `Index.html`
- `Styles.html`
- `Script.html`

## Implementation Notes

### In `Index.html`
- Ensure the header action area contains the reset button next to the existing icon controls.
- Keep the button accessible through the page header region.

### In `Styles.html`
- Adjust the top bar/header layout so the reset control sits beside the existing icons.
- Make sure the top bar remains visually stable and responsive.
- Use layout styling that supports a persistent action area.

### In `Script.html`
- Keep the reset button wired to the same filter-reset event flow.
- Do not modify the filtering logic itself unless absolutely necessary.
- Ensure the button remains part of the top-level page actions and can be used at any scroll position.

## Validation Checklist

After implementation, verify that:

- [ ] The `Reset Filters` button is placed beside the header icons.
- [ ] The button is visible from the current page position while scrolling.
- [ ] The button still resets all filters correctly.
- [ ] The page layout remains clean and aligned.
- [ ] No backend changes are required.

## Final Deliverable

Return the completed implementation so that the `Reset Filters` button is available in the top header action area and can be used at any page scroll position.
