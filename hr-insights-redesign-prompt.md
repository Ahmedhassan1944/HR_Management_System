# HR Insights Page — Layout Redesign Prompt

## Context

This is a **Google Apps Script Web App** project. The UI is a single-page app
built with vanilla HTML/CSS/JS spread across these files:

| File | Role |
|------|------|
| `Script.html` | All client-side JS modules (included via `<?= HtmlService ?>`) |
| `Styles.html` | All CSS (included via `<?= HtmlService ?>`) |
| `Index.html` | Shell HTML, page containers |
| `InsightsService.gs` | Server-side data aggregation |
| `Code.gs` | API endpoints (`api_getInsightsData`, `api_getFilteredInsights`) |

The HR Insights page is rendered entirely by **`InsightsModule`** inside
`Script.html` (lines ≈ 1416–1570). The module exposes one public function:
`InsightsModule.render(data)`, which writes directly into
`document.getElementById('insightsContent')`.

---

## Target Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  [Age Distribution]        [Employees by Project]                  │  Row 1 — 2 charts (2col grid)
├────────────────────────────────────────────────────────────────────┤
│  [Nationality]    [Gender]    [Classification]                     │  Row 2 — 3 Donuts (3col grid)
├────────────────────────────────────────────────────────────────────┤
│  [Civil ID Expiry]  [Passport Expiry]  [Contract Expiry]           │  Row 3 — 3 Expiry charts (3col grid)
├────────────────────────────────────────────────────────────────────┤
│  [                      Hiring Trend                         ]     │  Row 4 — Full width (1col grid)
├────────────────────────────────────────────────────────────────────┤
│  [KPI ×6]                         [Job Title]  [Department]        │  Row 5 — Bottom section
└────────────────────────────────────────────────────────────────────┘
```

---

## Current Layout (what exists now in the code)

```
[KPI ×6]                                          ← Top  (lines 1441–1448)
[Employees by Project]                            ← Row 1, charts-grid--2col, only 1 chart  (lines 1450–1453)
[Nationality]  [Gender]                           ← Row 2, charts-grid--2col  (lines 1455–1459)
[Employment Classification]                       ← Row 3, charts-grid (no modifier), 1 chart alone  (lines 1461–1464)
[Hiring Trend]  [Age Distribution]                ← Row 4, charts-grid--2col  (lines 1466–1470)
[Passport Expiry] [Civil ID Expiry] [Contract]   ← Row 5, charts-grid--3col  (lines 1472–1477)
Side Panel (insights-layout__side):               ← Right rail, width 760 px
    [Job Title]  [Department]                     ← two scrollable horizontal bar charts
```

---

## Required Changes

### 1 — `Script.html` → `InsightsModule.render()` HTML block (lines 1437–1510)

Replace the entire `container.innerHTML = \`...\`` template string with the
structure below. **Do not change anything else** in the function (chart
rendering calls on lines 1521–1531 stay exactly as-is).

#### New HTML structure

```html
<div class="insights-full-layout">

  <!-- Row 1: Age Distribution + Employees by Project -->
  <div class="charts-grid charts-grid--2col mb-6">
    ${_chartCard('chart-age',     'Age Distribution',      'Headcount by age group',   240)}
    ${_chartCard('chart-project', 'Employees by Project',  'Project / site allocation', 240)}
  </div>

  <!-- Row 2: Nationality + Gender + Classification (3 Donuts) -->
  <div class="charts-grid charts-grid--3col mb-6">
    ${_chartCard('chart-nationality', 'Employees by Nationality',  'Nationality distribution', 240)}
    ${_chartCard('chart-gender',      'Gender Breakdown',           'Male vs Female',           240)}
    ${_chartCard('chart-class',       'Employment Classification',  'Direct vs Indirect',       240)}
  </div>

  <!-- Row 3: Civil ID Expiry + Passport Expiry + Contract Expiry -->
  <div class="charts-grid charts-grid--3col mb-6">
    ${_chartCard('chart-civil-expiry',     'Civil ID Expiry Status',  'Current civil ID validity',  220)}
    ${_chartCard('chart-passport-expiry',  'Passport Expiry Status',  'Current passport validity',  220)}
    ${_chartCard('chart-contract-expiry',  'Contract Expiry Status',  'Current contract validity',  220)}
  </div>

  <!-- Row 4: Hiring Trend — full width -->
  <div class="charts-grid mb-6">
    ${_chartCard('chart-hiring', 'Hiring Trend', 'New hires by month', 260)}
  </div>

  <!-- Row 5: KPIs (left) + Job Title + Department (right) -->
  <div class="insights-bottom">

    <div class="insights-bottom__kpis">
      <div class="kpi-grid" role="list">
        ${_kpi('👥', 'Total Employees', data.kpis.totalEmployees,            'primary')}
        ${_kpi('📊', 'Average Age',     data.kpis.averageAge + ' yrs',       'info')}
        ${_kpi('👨', 'Male',           data.kpis.maleCount,                  'primary')}
        ${_kpi('👩', 'Female',         data.kpis.femaleCount,                'success')}
        ${_kpi('🔧', 'Direct',         data.kpis.directCount,                'warning')}
        ${_kpi('💼', 'Indirect',       data.kpis.indirectCount,              'info')}
      </div>
    </div>

    <div class="insights-bottom__charts">

      <div class="chart-card">
        <div class="chart-card__header">
          <div>
            <div class="chart-card__title">Employees by Job Title</div>
            <div class="chart-card__subtitle">Top job titles</div>
          </div>
        </div>
        <div class="chart-card__scroll-area">
          <div class="chart-canvas-wrapper" style="height:${titleHeight}px;">
            <canvas id="chart-title" aria-label="Employees by Job Title" role="img"></canvas>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card__header">
          <div>
            <div class="chart-card__title">Employees by Department</div>
            <div class="chart-card__subtitle">Department breakdown</div>
          </div>
        </div>
        <div class="chart-card__scroll-area">
          <div class="chart-canvas-wrapper" style="height:${deptHeight}px;">
            <canvas id="chart-dept" aria-label="Employees by Department" role="img"></canvas>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
```

> **Key changes vs. current:**
> - Outer wrapper changed from `insights-layout` (flex row) → `insights-full-layout` (block/full-width)
> - KPIs moved from top → Row 5 bottom-left
> - `chart-age` moved from Row 4 → Row 1 (paired with `chart-project`)
> - `chart-class` moved from its own row → Row 2 (joined with Nationality + Gender)
> - Expiry order changed: Civil ID first, then Passport, then Contract
> - `chart-hiring` is now alone (full width) in Row 4
> - Job Title & Department moved from side rail → bottom-right alongside KPIs
> - `insights-layout__side` wrapper is **removed** entirely

---

### 2 — `Styles.html` — CSS additions / replacements

#### 2a — Remove (or leave unused) the old side-rail rules

The following rules become dead code but are harmless to leave:
```css
.insights-layout { … }
.insights-layout__main { … }
.insights-layout__side { … }
.insights-layout__side > .chart-card { … }
/* and their @media variants */
```

You may keep them or delete them — they won't be referenced any more.

#### 2b — Add new layout classes

Add these **after** the existing `.chart-card__scroll-area` block
(around line 2197 in Styles.html):

```css
/* ── Full-width insights wrapper ── */
.insights-full-layout {
  display: block;
  width: 100%;
}

/* ── Bottom section: KPIs left, Job Title + Department right ── */
.insights-bottom {
  display: flex;
  gap: var(--space-6);
  align-items: flex-start;
  margin-top: var(--space-6);
}

.insights-bottom__kpis {
  flex: 1 1 auto;
  min-width: 0;
}

.insights-bottom__kpis .kpi-grid {
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  margin-bottom: 0;
}

.insights-bottom__charts {
  display: flex;
  flex-direction: row;
  gap: var(--space-6);
  flex: 0 0 760px;
  width: 760px;
}

.insights-bottom__charts > .chart-card {
  flex: 1;
  width: 50%;
}

/* Responsive — narrow screens */
@media (max-width: 1400px) {
  .insights-bottom__charts {
    flex: 0 0 380px;
    width: 380px;
    flex-direction: column;
  }
  .insights-bottom__charts > .chart-card {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .insights-bottom {
    flex-direction: column;
  }
  .insights-bottom__charts {
    width: 100%;
    flex: none;
    flex-direction: row;
  }
}

@media (max-width: 640px) {
  .insights-bottom__charts {
    flex-direction: column;
  }
}
```

---

### 3 — Nothing else should change

| What | Action |
|------|--------|
| Chart rendering calls (`Charts.horizontalBar`, `Charts.donut`, etc.) | **No change** — all canvas IDs are preserved |
| `_kpi()` helper function | **No change** |
| `_chartCard()` helper function | **No change** |
| `_esc()` helper function | **No change** |
| `DragDrop` module | **No change** — it queries `.chart-card[data-chart-id]` which still exists |
| `crossFilter` logic | **No change** |
| `InsightsService.gs` / `Code.gs` | **No change** |
| `FilterModule` integration | **No change** |
| `insightsGeneratedAt` timestamp update | **No change** |

---

## Canvas IDs — Reference Table

These IDs must appear in the HTML exactly once, unchanged:

| Canvas ID | Chart type | Data field |
|-----------|-----------|------------|
| `chart-age` | `Charts.verticalBar` | `data.ageDistribution` |
| `chart-project` | `Charts.horizontalBar` | `data.byProject` |
| `chart-nationality` | `Charts.donut` | `data.byNationality` |
| `chart-gender` | `Charts.donut` | `data.byGender` |
| `chart-class` | `Charts.donut` | `data.byClass` |
| `chart-civil-expiry` | `Charts.expiryStatus` | `data.civilExpiryStats` |
| `chart-passport-expiry` | `Charts.expiryStatus` | `data.passportExpiryStats` |
| `chart-contract-expiry` | `Charts.expiryStatus` | `data.contractExpiryStats` |
| `chart-hiring` | `Charts.line` | `data.hiringTrend` |
| `chart-title` | `Charts.horizontalBar` | `data.byTitle` |
| `chart-dept` | `Charts.horizontalBar` | `data.byDepartment` |

---

## Validation Checklist

After applying the changes, verify:

- [ ] All 11 canvas IDs appear in the rendered HTML exactly once
- [ ] Row 1 contains `chart-age` and `chart-project` side by side
- [ ] Row 2 contains `chart-nationality`, `chart-gender`, `chart-class` (3 donuts)
- [ ] Row 3 contains `chart-civil-expiry`, `chart-passport-expiry`, `chart-contract-expiry` (in this order)
- [ ] Row 4 contains only `chart-hiring` (spans full width)
- [ ] Bottom-left: 6 KPI cards
- [ ] Bottom-right: `chart-title` and `chart-dept` side by side in scroll areas
- [ ] No reference to `insights-layout__side` or `insights-layout__main` in the new HTML
- [ ] `DragDrop` module still finds `.chart-card[data-chart-id]` elements (rows 1–4 only; Job Title & Dept don't carry `data-chart-id`)
- [ ] Page loads without JS console errors
- [ ] Responsive breakpoints: below 1024 px the bottom section stacks vertically
