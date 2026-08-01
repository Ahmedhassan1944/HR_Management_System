# HR Insights — Add Direct / Indirect Donut (4th Donut in Row 2)

## Context

Google Apps Script Web App. All UI lives in two files:

| File | Role |
|------|------|
| `Script.html` | Client-side JS — `InsightsModule` renders the page |
| `Styles.html` | All CSS |

The relevant section is **`InsightsModule.render(data)`** inside `Script.html`
(around lines 1437–1515 after the last commit).

---

## What to do

Add a **4th Donut chart** — **Direct / Indirect** — to Row 2 of the HR Insights
page, so Row 2 becomes a full-width row of **4 equal donut charts**.

The data and the cross-filter field for this chart already exist:

| Item | Value |
|------|-------|
| Data field | `data.byDirect` (already returned by `api_getInsightsData`) |
| Chart call | `Charts.donut('chart-direct', data.byDirect, crossFilter('fp-direct'))` |
| Filter field | `'fp-direct'` (already wired in `FilterModule`) |
| Canvas ID | `chart-direct` (new — does not exist yet) |

---

## Change 1 — `Script.html` → Row 2 inside `InsightsModule.render()`

**Find** the Row 2 block (currently 3 donuts):

```js
<!-- Row 2: Nationality + Gender + Classification (3 Donuts) -->
<div class="charts-grid charts-grid--3col mb-6">
  ${_chartCard('chart-nationality', 'Employees by Nationality',  'Nationality distribution', 240)}
  ${_chartCard('chart-gender',      'Gender Breakdown',           'Male vs Female',           240)}
  ${_chartCard('chart-class',       'Employment Classification',  'Direct vs Indirect',       240)}
</div>
```

**Replace** with (4 donuts, new CSS class `charts-grid--4col`):

```js
<!-- Row 2: Nationality + Gender + Classification + Direct/Indirect (4 Donuts) -->
<div class="charts-grid charts-grid--4col mb-6">
  ${_chartCard('chart-nationality', 'Employees by Nationality',  'Nationality distribution',   240)}
  ${_chartCard('chart-gender',      'Gender Breakdown',           'Male vs Female',             240)}
  ${_chartCard('chart-class',       'Employment Classification',  'Engineering vs Other',       240)}
  ${_chartCard('chart-direct',      'Direct / Indirect',          'Workforce type breakdown',   240)}
</div>
```

---

## Change 2 — `Script.html` → add chart rendering call

**Find** the block of `Charts.donut` calls (around line 1523–1526):

```js
Charts.donut('chart-nationality',     data.byNationality, crossFilter('fp-nationality'));
Charts.donut('chart-gender',          data.byGender,      crossFilter('fp-gender'));
Charts.horizontalBar('chart-title',   data.byTitle,       crossFilter('fp-title'));
Charts.donut('chart-class',           data.byClass,       crossFilter('fp-class'));
```

**Add one line** immediately after `Charts.donut('chart-class', …)`:

```js
Charts.donut('chart-direct',          data.byDirect,      crossFilter('fp-direct'));
```

Result (the four donut calls together):

```js
Charts.donut('chart-nationality',     data.byNationality, crossFilter('fp-nationality'));
Charts.donut('chart-gender',          data.byGender,      crossFilter('fp-gender'));
Charts.donut('chart-class',           data.byClass,       crossFilter('fp-class'));
Charts.donut('chart-direct',          data.byDirect,      crossFilter('fp-direct'));
```

---

## Change 3 — `Styles.html` → add `charts-grid--4col`

**Find** the existing grid modifier lines:

```css
.charts-grid--2col { grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); }
.charts-grid--3col { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
```

**Add one line immediately after:**

```css
.charts-grid--4col { grid-template-columns: repeat(4, 1fr); }
```

Then add responsive rules **inside the existing `@media (max-width: 1024px)`
block** (or create a new one right after the `--4col` line):

```css
@media (max-width: 1200px) {
  .charts-grid--4col { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .charts-grid--4col { grid-template-columns: 1fr; }
}
```

> **Why `repeat(4, 1fr)` not `auto-fill`?**  
> `repeat(4, 1fr)` forces exactly 4 equal columns that always fill the full
> container width — no extra empty columns, no overflow. Below 1200 px the
> row wraps to 2×2, and below 600 px to a single column.

---

## Nothing else should change

| What | Action |
|------|--------|
| All other rows (1, 3, 4, 5) | **No change** |
| `_chartCard()` helper | **No change** |
| `_kpi()` helper | **No change** |
| `InsightsService.gs` / `Code.gs` | **No change** — `data.byDirect` already exists |
| `FilterModule` / `FilterPane.html` | **No change** — `fp-direct` already wired |
| `DragDrop` module | **No change** — it reads `data-chart-id` from `.chart-card` |

---

## Validation Checklist

- [ ] Row 2 renders exactly **4** donut charts side by side
- [ ] All 4 donuts fill the full page width with equal columns
- [ ] `chart-direct` canvas exists in the DOM after `render()`
- [ ] Clicking a slice on the Direct/Indirect donut applies the `fp-direct` filter
- [ ] Below 1200 px: 4 donuts collapse to a 2×2 grid
- [ ] Below 600 px: 4 donuts stack in a single column
- [ ] No JS console errors
- [ ] All other rows (1, 3, 4, 5) are unchanged
