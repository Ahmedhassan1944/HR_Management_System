# HR Insights Layout Enhancement – Relocate "Employees by Job Title" Chart

## Objective

Improve the HR Insights page layout by moving the **Employees by Job Title** chart into the large empty area on the right side of the dashboard.

The purpose is to give this visualization significantly more space because it contains many job titles and is currently compressed, making it difficult to read.

---

## Current Layout

The dashboard currently has:

- KPI cards at the top.
- Multiple charts arranged in two columns.
- A large unused area on the right side of the page.
- "Employees by Job Title" displayed as a small chart within the left chart grid.

Because there are many job titles, the current chart is too small and labels overlap.

---

## Required Changes

### 1. Move the Chart

Remove the **Employees by Job Title** chart from its current position inside the chart grid.

Place it inside the large empty panel on the right side of the page.

Do NOT duplicate the chart.

There must only be one Employees by Job Title chart.

---

### 2. Create a Dedicated Analytics Panel

Transform the empty right-side area into a dedicated analytics panel.

The panel should:

- Match the dashboard design.
- Use the same card styling.
- Have rounded corners.
- Use the same shadow and border radius as existing cards.
- Include the title:

Employees by Job Title

with the existing subtitle style.

---

### 3. Increase Chart Size

Increase both width and height.

The chart should occupy most of the right panel.

The goal is to make all job titles readable without crowding.

---

### 4. Improve Readability

If there are many job titles:

- Increase chart height dynamically.
- Allow vertical scrolling inside the card if needed.
- Prevent labels from overlapping.
- Keep bars evenly spaced.

---

### 5. Responsive Layout

Keep the current desktop layout.

Desktop:

Left side:
- KPI cards
- Remaining charts

Right side:
- Large Employees by Job Title chart

Mobile / narrow screens:

Move the right panel below the main dashboard automatically.

---

### 6. Preserve Existing Functionality

Do NOT modify:

- Chart data
- Filtering logic
- Server-side functions
- InsightsService
- KPI calculations

Only change the layout and rendering location.

---

### 7. Reuse Existing Chart

Reuse the existing rendering logic.

Do not create another implementation.

Simply render the existing chart inside the new container.

---

### 8. Styling

The new panel should visually match every dashboard card.

Maintain:

- spacing
- typography
- colors
- shadows
- border radius
- padding

---

## Acceptance Criteria

- Employees by Job Title no longer appears inside the left chart grid.
- The chart appears only in the new right-side analytics panel.
- The chart is much larger.
- Job title labels are clearly readable.
- Long lists can scroll vertically if necessary.
- Existing filters continue to update the chart correctly.
- Dashboard responsiveness is preserved.
- No existing charts or KPIs are broken.
- Only layout changes are introduced; business logic remains unchanged.