# Prompt: Fix HR Insights Layout From Root (commit 3f49932)

## Context

Google Apps Script HR Management System.
Frontend: `Script.html` — CSS: `Styles.html`.
**Do NOT touch any `.gs` file.**

The current code (commit 3f49932) does not match the live app.
This prompt fixes everything from the root.

---

## Target Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  [Age Distribution]              [Employees by Project]            │  Row 1 — 2 charts
├────────────────────────────────────────────────────────────────────┤
│  [Nationality]    [Gender]    [Classification]                     │  Row 2 — 3 Donuts
├────────────────────────────────────────────────────────────────────┤
│  [Civil ID Expiry]  [Passport Expiry]  [Contract Expiry]           │  Row 3 — 3 Column/Expiry charts
├────────────────────────────────────────────────────────────────────┤
│  [                        Hiring Trend                        ]    │  Row 4 — full width
├────────────────────────────────────────────────────────────────────┤
│  [KPI ×6]                         [Job Title]  [Department]        │  Bottom
└────────────────────────────────────────────────────────────────────┘
```

---

## Problems in the Current Code

| # | Problem | Current | Target |
|---|---|---|---|
| 1 | KPI position | **Top** of page | **Bottom** next to bar charts |
| 2 | Row 1 | 1 chart (Project only) | **2 charts** (Age + Project) |
| 3 | Donuts | Split across 2 divs (2col + alone) | **1 div, 3col** |
| 4 | Age Distribution | Row 4 with Hiring | **Row 1** with Project |
| 5 | Hiring Trend | Row 4 with Age (--2col) | **Full width, alone** |
| 6 | Expiry order | Passport → Civil → Contract | **Civil → Passport → Contract** |
| 7 | Bar charts | Right sidebar 760px fixed | **Bottom right** next to KPIs |
| 8 | Layout container | `insights-layout` (flex-row) | `insights-page` (block) |
| 9 | `--4col` CSS class | Missing | Add (needed for future 4th donut) |

---

## CHANGE 1 — `Styles.html`: Replace insights layout CSS

**Find this entire block:**

```css
/* ── Insights Layout ── */
.insights-layout {
  display: flex;
  gap: var(--space-6);
  align-items: flex-start;
}

.insights-layout__main {
  flex: 1;
  min-width: 0;
}

.insights-layout__side {
  width: 760px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  gap: var(--space-6);
}

.insights-layout__side > .chart-card {
  flex: 1;
  width: 50%;
}

.chart-card__scroll-area {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) transparent;
}

@media (max-width: 1400px) {
  .insights-layout__side {
    width: 380px;
    flex-direction: column;
  }
  .insights-layout__side > .chart-card {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .insights-layout {
    flex-direction: column;
  }
  .insights-layout__side {
    width: 100%;
  }
  .chart-card__scroll-area {
    max-height: 500px;
  }
}
```

**Replace with:**

```css
/* ── Insights Layout ── */
.insights-page {
  display: block;
}

.chart-card__scroll-area {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) transparent;
}

/* ── Insights Bottom Section (KPIs + Bar Charts) ── */
.insights-bottom {
  display: flex;
  gap: var(--space-6);
  align-items: flex-start;
  margin-top: var(--space-2);
}

.insights-bottom__kpis {
  flex: 1;
  min-width: 0;
}

.insights-bottom__bars {
  display: flex;
  gap: var(--space-6);
  flex-shrink: 0;
  width: 760px;
}

.insights-bottom__bars .chart-card {
  flex: 1;
  min-width: 0;
}

@media (max-width: 1400px) {
  .insights-bottom__bars {
    width: 400px;
    flex-direction: column;
  }
}

@media (max-width: 1024px) {
  .insights-bottom {
    flex-direction: column;
  }
  .insights-bottom__bars {
    width: 100%;
  }
  .chart-card__scroll-area {
    max-height: 500px;
  }
}
```

---

## CHANGE 2 — `Styles.html`: Add `--4col` grid class

**Find this exact line:**

```css
.charts-grid--3col { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
```

**Replace with:**

```css
.charts-grid--3col { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.charts-grid--4col { grid-template-columns: repeat(4, 1fr); }
```

---

## CHANGE 3 — `Script.html`: Replace the entire `container.innerHTML` block

**Find this entire block** (starts with `container.innerHTML = \`` on the line after `const deptHeight`):

```javascript
    container.innerHTML = `
      <div class="insights-layout">
        <div class="insights-layout__main">
          <!-- Top KPIs -->
          <div class="kpi-grid mb-6" role="list">
            ${_kpi('👥', 'Total Employees',  data.kpis.totalEmployees, 'primary')}
            ${_kpi('📊', 'Average Age',      data.kpis.averageAge + ' yrs', 'info')}
            ${_kpi('👨', 'Male',            data.kpis.maleCount, 'primary')}
            ${_kpi('👩', 'Female',          data.kpis.femaleCount, 'success')}
            ${_kpi('🔧', 'Direct',          data.kpis.directCount, 'warning')}
            ${_kpi('💼', 'Indirect',        data.kpis.indirectCount, 'info')}
          </div>

          <!-- Row 1: Project Distribution -->
          <div class="charts-grid charts-grid--2col mb-6">
            ${_chartCard('chart-project', 'Employees by Project',    'Project / site allocation', 220)}
          </div>

          <!-- Row 2: Nationality & Gender -->
          <div class="charts-grid charts-grid--2col mb-6">
            ${_chartCard('chart-nationality', 'Employees by Nationality', 'Nationality distribution', 240)}
            ${_chartCard('chart-gender',      'Gender Breakdown',          'Male vs Female', 240)}
          </div>

          <!-- Row 3: Classification -->
          <div class="charts-grid mb-6">
            ${_chartCard('chart-class', 'Employment Classification', 'Engineering vs Other', 260)}
          </div>

          <!-- Row 4: Hiring Trend & Age Distribution -->
          <div class="charts-grid charts-grid--2col mb-6">
            ${_chartCard('chart-hiring', 'Hiring Trend', 'Hires by month', 240)}
            ${_chartCard('chart-age',    'Age Distribution', 'Headcount by age group', 240)}
          </div>

          <!-- Row 5: Expiry Status -->
          <div class="charts-grid charts-grid--3col mb-6">
            ${_chartCard('chart-passport-expiry',  'Passport Expiry Status',  'Current passport validity', 220)}
            ${_chartCard('chart-civil-expiry',     'Civil ID Expiry Status',  'Current civil ID validity', 220)}
            ${_chartCard('chart-contract-expiry',  'Contract Expiry Status',  'Current contract validity', 220)}
          </div>
        </div>

        <div class="insights-layout__side">
          <div class="chart-card h-100">
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

          <div class="chart-card h-100">
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
    `;
```

**Replace with:**

```javascript
    container.innerHTML = `
      <div class="insights-page">

        <!-- Row 1: Age Distribution + Project -->
        <div class="charts-grid charts-grid--2col mb-6">
          ${_chartCard('chart-age',     'Age Distribution',      'Headcount by age group',    240)}
          ${_chartCard('chart-project', 'Employees by Project',  'Project / site allocation', 240)}
        </div>

        <!-- Row 2: Donut Charts — Nationality, Gender, Classification -->
        <div class="charts-grid charts-grid--3col mb-6">
          ${_chartCard('chart-nationality', 'Employees by Nationality',  'Nationality distribution',  240)}
          ${_chartCard('chart-gender',      'Gender Breakdown',           'Male vs Female',            240)}
          ${_chartCard('chart-class',       'Employment Classification',  'Engineering vs Other',      240)}
        </div>

        <!-- Row 3: Document Expiry Status — Civil first -->
        <div class="charts-grid charts-grid--3col mb-6">
          ${_chartCard('chart-civil-expiry',    'Civil ID Expiry Status',  'Current civil ID validity',  220)}
          ${_chartCard('chart-passport-expiry', 'Passport Expiry Status',  'Current passport validity',  220)}
          ${_chartCard('chart-contract-expiry', 'Contract Expiry Status',  'Current contract validity',  220)}
        </div>

        <!-- Row 4: Hiring Trend — full width -->
        <div class="charts-grid mb-6">
          ${_chartCard('chart-hiring', 'Hiring Trend', 'New hires by month', 260)}
        </div>

        <!-- Bottom: KPI Cards + Bar Charts -->
        <div class="insights-bottom">
          <div class="insights-bottom__kpis">
            <div class="kpi-grid" role="list">
              ${_kpi('👥', 'Total Employees', data.kpis.totalEmployees, 'primary')}
              ${_kpi('📊', 'Average Age',     data.kpis.averageAge + ' yrs', 'info')}
              ${_kpi('👨', 'Male',           data.kpis.maleCount, 'primary')}
              ${_kpi('👩', 'Female',         data.kpis.femaleCount, 'success')}
              ${_kpi('🔧', 'Direct',         data.kpis.directCount, 'warning')}
              ${_kpi('💼', 'Indirect',       data.kpis.indirectCount, 'info')}
            </div>
          </div>
          <div class="insights-bottom__bars">
            <div class="chart-card" draggable="true" data-chart-id="chart-title" role="region" aria-label="Employees by Job Title">
              <div class="chart-card__header">
                <div>
                  <div class="chart-card__title">Employees by Job Title</div>
                  <div class="chart-card__subtitle">Top job titles</div>
                </div>
                <div class="chart-card__drag-handle" aria-hidden="true" title="Drag to reorder">⠿</div>
              </div>
              <div class="chart-card__scroll-area">
                <div class="chart-canvas-wrapper" style="height:${titleHeight}px;">
                  <canvas id="chart-title" aria-label="Employees by Job Title" role="img"></canvas>
                </div>
              </div>
            </div>
            <div class="chart-card" draggable="true" data-chart-id="chart-dept" role="region" aria-label="Employees by Department">
              <div class="chart-card__header">
                <div>
                  <div class="chart-card__title">Employees by Department</div>
                  <div class="chart-card__subtitle">Department breakdown</div>
                </div>
                <div class="chart-card__drag-handle" aria-hidden="true" title="Drag to reorder">⠿</div>
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
    `;
```

---

## CHANGE 4 — `Script.html`: Replace chart render calls

**Find this exact block:**

```javascript
    Charts.horizontalBar('chart-dept',    data.byDepartment, crossFilter('fp-dept'));
    Charts.horizontalBar('chart-project', data.byProject,    crossFilter('fp-project'));
    Charts.donut('chart-nationality',     data.byNationality, crossFilter('fp-nationality'));
    Charts.donut('chart-gender',          data.byGender,      crossFilter('fp-gender'));
    Charts.horizontalBar('chart-title',   data.byTitle,       crossFilter('fp-title'));
    Charts.donut('chart-class',           data.byClass,       crossFilter('fp-class'));
    Charts.line('chart-hiring',           data.hiringTrend, 'New Hires');
    Charts.verticalBar('chart-age',       data.ageDistribution.map(d => ({ label: d.range, count: d.count })));
    Charts.expiryStatus('chart-passport-expiry',  data.passportExpiryStats);
    Charts.expiryStatus('chart-civil-expiry',     data.civilExpiryStats);
    Charts.expiryStatus('chart-contract-expiry',  data.contractExpiryStats);
```

**Replace with:**

```javascript
    // Row 1 — Age + Project
    Charts.verticalBar('chart-age',       data.ageDistribution.map(d => ({ label: d.range, count: d.count })));
    Charts.horizontalBar('chart-project', data.byProject,      crossFilter('fp-project'));
    // Row 2 — Donuts
    Charts.donut('chart-nationality',     data.byNationality,  crossFilter('fp-nationality'));
    Charts.donut('chart-gender',          data.byGender,       crossFilter('fp-gender'));
    Charts.donut('chart-class',           data.byClass,        crossFilter('fp-class'));
    // Row 3 — Expiry (Civil first)
    Charts.expiryStatus('chart-civil-expiry',     data.civilExpiryStats);
    Charts.expiryStatus('chart-passport-expiry',  data.passportExpiryStats);
    Charts.expiryStatus('chart-contract-expiry',  data.contractExpiryStats);
    // Row 4 — Hiring Trend
    Charts.line('chart-hiring',           data.hiringTrend, 'New Hires');
    // Bottom — Bar Charts
    Charts.horizontalBar('chart-title',   data.byTitle,        crossFilter('fp-title'));
    Charts.horizontalBar('chart-dept',    data.byDepartment,   crossFilter('fp-dept'));
```

---

## Verification Checklist

After applying all 4 changes, verify:

- [ ] `Styles.html` has `.insights-page { display: block; }` — no `.insights-layout` or `.insights-layout__side` anymore
- [ ] `Styles.html` has `.insights-bottom`, `.insights-bottom__kpis`, `.insights-bottom__bars`
- [ ] `Styles.html` has `.charts-grid--4col { grid-template-columns: repeat(4, 1fr); }`
- [ ] **Row 1**: `chart-age` then `chart-project` — uses `charts-grid--2col`
- [ ] **Row 2**: `chart-nationality`, `chart-gender`, `chart-class` — uses `charts-grid--3col` (ONE div, not two)
- [ ] **Row 3**: `chart-civil-expiry` FIRST, then passport, then contract — uses `charts-grid--3col`
- [ ] **Row 4**: `chart-hiring` alone — **no `--2col`**, no other chart beside it
- [ ] **KPI cards** are inside `.insights-bottom__kpis` at the **bottom** — not at the top
- [ ] **Bar charts** (`chart-title`, `chart-dept`) are inside `.insights-bottom__bars` at the **bottom**
- [ ] Render calls order: verticalBar(age) → horizontalBar(project) → 3×donut → 3×expiryStatus → line(hiring) → 2×horizontalBar
- [ ] No old `.insights-layout__main` div anywhere in the HTML
- [ ] No `.gs` files were changed
- [ ] No `Charts.*` function was modified
- [ ] No `_kpi()` or `_chartCard()` helper was modified

---

## What NOT to Change

- Do NOT touch `InsightsService.gs`, `Code.gs`, or any other `.gs` file
- Do NOT modify `Charts.donut()`, `Charts.horizontalBar()`, `Charts.verticalBar()`, `Charts.line()`, or `Charts.expiryStatus()`
- Do NOT modify `_kpi()` or `_chartCard()` helper functions
- Do NOT change the Filter Pane or any other page module
- Do NOT add new columns to the Google Sheet
