# Add Data Labels to All Charts

## Goal

Show data labels directly on every chart in the HR Insights page:

| Chart type | Label shown | Position |
|-----------|------------|----------|
| **Donut** | Percentage `45%` (hidden if slice < 5%) | Inside the slice, white bold text |
| **Horizontal Bar** | Count `42` | End of bar, right side |
| **Vertical Bar** (Age, Expiry) | Count `18` (hidden if 0) | Above bar |
| **Line** (Hiring Trend) | Count `7` | Above each data point |

KPI cards are **not affected** — they are plain HTML divs, not Chart.js charts.

---

## Approach — `chartjs-plugin-datalabels`

Chart.js 4.x has no built-in data labels. The official plugin is
[chartjs-plugin-datalabels](https://chartjs-plugin-datalabels.netlify.app/).

Strategy:
1. Load the plugin from CDN in `Index.html`
2. Register it globally in the `Charts` module, with `display: false` as the
   global default so existing charts are not broken
3. Enable and configure it explicitly in each chart factory function

---

## Change 1 — `Index.html` — add plugin CDN

**Find** the Chart.js CDN line (line ~14):

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

**Add immediately after:**

```html
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
```

> Must come **after** Chart.js — the plugin registers itself on the global
> `Chart` object when loaded.

---

## Change 2 — `Script.html` — register plugin + set global default

**Find** the global defaults block inside `Charts` (lines ~581–589):

```js
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = '#5c5c7a';
  Chart.defaults.plugins.legend.position = 'bottom';
  Chart.defaults.plugins.legend.labels.boxWidth = 12;
  Chart.defaults.plugins.legend.labels.padding  = 16;
  Chart.defaults.animation.duration = 600;
}
```

**Replace** with:

```js
if (typeof Chart !== 'undefined') {
  // Register datalabels plugin globally (loaded via CDN after Chart.js)
  if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
  }

  Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = '#5c5c7a';
  Chart.defaults.plugins.legend.position = 'bottom';
  Chart.defaults.plugins.legend.labels.boxWidth = 12;
  Chart.defaults.plugins.legend.labels.padding  = 16;
  Chart.defaults.animation.duration = 600;

  // Disable datalabels globally — each chart opts in explicitly
  Chart.defaults.plugins.datalabels = { display: false };
}
```

---

## Change 3 — `donut()` function — percentage labels inside slices

**Find** the `options` block inside `donut()` (lines ~629–645):

```js
options: {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '65%',
  plugins: {
    tooltip: { callbacks: {
      label: ctx => ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed / ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0) * 100)}%)`
    }},
  },
  onClick: ...
},
```

**Replace** the `plugins` section inside options with:

```js
options: {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '65%',
  plugins: {
    tooltip: { callbacks: {
      label: ctx => ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed / ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0) * 100)}%)`
    }},
    datalabels: {
      display: true,
      color: '#ffffff',
      font: { weight: 'bold', size: 11 },
      formatter: (value, ctx) => {
        const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        if (!total) return '';
        const pct = Math.round(value / total * 100);
        return pct >= 5 ? `${pct}%` : '';   // hide labels on tiny slices
      },
    },
  },
  onClick: ...
},
```

> Only the `plugins` object changes. `onClick`, `responsive`, `cutout` are untouched.

---

## Change 4 — `horizontalBar()` function — count at bar end

**Find** the `plugins` line inside `horizontalBar()` (line ~675):

```js
plugins: { legend: { display: false } },
```

**Replace** with:

```js
plugins: {
  legend: { display: false },
  datalabels: {
    display: true,
    anchor: 'end',
    align: 'right',
    clamp: true,
    color: '#5c5c7a',
    font: { size: 11 },
    formatter: value => value,
  },
},
```

---

## Change 5 — `verticalBar()` function — count above bar

**Find** the `plugins` line inside `verticalBar()` (line ~715):

```js
plugins: { legend: { display: false } },
```

**Replace** with:

```js
plugins: {
  legend: { display: false },
  datalabels: {
    display: context => context.dataset.data[context.dataIndex] > 0,
    anchor: 'end',
    align: 'top',
    color: '#5c5c7a',
    font: { size: 11 },
    formatter: value => value,
  },
},
```

---

## Change 6 — `line()` function — count above each point

**Find** the `plugins` line inside `line()` (line ~762):

```js
plugins: { legend: { display: false } },
```

**Replace** with:

```js
plugins: {
  legend: { display: false },
  datalabels: {
    display: true,
    anchor: 'end',
    align: 'top',
    offset: 4,
    color: '#5c5c7a',
    font: { size: 10 },
    formatter: value => value,
  },
},
```

---

## Change 7 — `expiryStatus()` function — count above bar, skip zeros

**Find** the `plugins` line inside `expiryStatus()` (line ~801):

```js
plugins: { legend: { display: false } },
```

**Replace** with:

```js
plugins: {
  legend: { display: false },
  datalabels: {
    display: context => context.dataset.data[context.dataIndex] > 0,
    anchor: 'end',
    align: 'top',
    color: '#5c5c7a',
    font: { size: 11 },
    formatter: value => value,
  },
},
```

---

## Summary of all changes

| # | File | What changes |
|---|------|-------------|
| 1 | `Index.html` | Add `chartjs-plugin-datalabels` CDN `<script>` after Chart.js |
| 2 | `Script.html` | Register plugin + set global `display: false` default |
| 3 | `Script.html` — `donut()` | Add `datalabels` block showing `%` inside slices |
| 4 | `Script.html` — `horizontalBar()` | Add `datalabels` block showing count at bar end |
| 5 | `Script.html` — `verticalBar()` | Add `datalabels` block showing count above bar |
| 6 | `Script.html` — `line()` | Add `datalabels` block showing count above point |
| 7 | `Script.html` — `expiryStatus()` | Add `datalabels` block showing count above bar |

**Nothing else changes** — data, filters, cross-filtering, DragDrop, KPI cards, CSS are all untouched.

---

## Visual result

```
Donut:           Horizontal Bar:     Vertical Bar:    Line:
  ┌───────┐        Egypt  ████ 42      18             •7
  │  45%  │        India  ██ 18        ██            • •
  │       │        KSA    █ 9           8            5
  │  30%  │                            ██
  └───────┘                             5
                                       ██
```

---

## Validation Checklist

- [ ] Donut charts (Nationality, Gender, Classification, Direct/Indirect) show `%` inside slices
- [ ] Slices smaller than 5% show no label (not cluttered)
- [ ] Horizontal bar charts (Job Title, Department, Project) show count at bar end
- [ ] Vertical bar charts (Age Distribution, Expiry Status ×3) show count above each bar
- [ ] Expiry bars with value `0` show no label
- [ ] Line chart (Hiring Trend) shows count above each data point
- [ ] KPI cards are unchanged
- [ ] No JS console errors (`ChartDataLabels is not defined`, etc.)
- [ ] Tooltips still work on all charts
- [ ] Cross-filter click still works on all charts
