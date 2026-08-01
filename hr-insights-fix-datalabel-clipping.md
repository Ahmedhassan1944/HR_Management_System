# Fix Data Label Clipping & Axis Scaling on All Charts

## Problem

Two related issues seen in the HR Insights charts after adding `chartjs-plugin-datalabels`:

### 1 — Labels get cut off at canvas boundary
The data label on the longest bar / tallest column is clipped because Chart.js,
by default, clips everything to the canvas rectangle. Example: "Ibri" bar shows
`1` instead of `1X` because the label renders outside the plot area and is cut.

### 2 — Axes don't leave room for labels above/beside bars
When all bars are drawn to the axis max, the label sits on the very edge of the
plot area and either overlaps the axis line or disappears. If data later grows
past the current max, bars compress and labels vanish.

---

## Root cause

Chart.js 4 has **two separate clipping controls** that both need to be addressed:

| Setting | What it controls | Fix |
|---------|-----------------|-----|
| `options.clip` | Whether chart elements (including plugin overlays) are clipped to the canvas | Set to `false` |
| `options.layout.padding` | White-space added outside the plot area inside the canvas | Add right/top padding |
| `scales.y.grace` / `scales.x.grace` | Extra headroom added to the axis max beyond the data max | Set to `'15%'` |

Setting only `clip: false` is **not enough** — the plugin still won't render a
label that sits outside the plot area unless the axis itself is extended via
`grace` and the canvas has room via `layout.padding`.

---

## File to change — `Script.html` only

All 4 chart factory functions inside the `Charts` IIFE need updating.
No changes needed in `Index.html`, `Styles.html`, or any `.gs` file.

---

## Change 1 — `horizontalBar()` — label cut at right edge

**Find** the full `options` block inside `horizontalBar()`:

```js
options: {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#f0f2f5' }, ticks: { precision: 0 } },
    y: { grid: { display: false } },
  },
  onClick: (e, elements, chart) => {
    if (onClickHandler && elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];
      if (label) onClickHandler(label);
    }
  },
},
```

**Replace** with:

```js
options: {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  clip: false,                            // allow labels outside plot area
  layout: { padding: { right: 36 } },    // canvas room for end-of-bar labels
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { color: '#f0f2f5' },
      ticks: { precision: 0 },
      grace: '15%',                       // extend X axis 15% beyond data max
    },
    y: { grid: { display: false } },
  },
  onClick: (e, elements, chart) => {
    if (onClickHandler && elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];
      if (label) onClickHandler(label);
    }
  },
},
```

---

## Change 2 — `verticalBar()` — label cut at top edge

**Find** the full `options` block inside `verticalBar()`:

```js
options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: '#f0f2f5' }, ticks: { precision: 0 } },
    x: { grid: { display: false } },
  },
  onClick: (e, elements, chart) => {
    if (onClickHandler && elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];
      if (label) onClickHandler(label);
    }
  },
},
```

**Replace** with:

```js
options: {
  responsive: true,
  maintainAspectRatio: false,
  clip: false,                            // allow labels outside plot area
  layout: { padding: { top: 24 } },      // canvas room for above-bar labels
  plugins: { legend: { display: false } },
  scales: {
    y: {
      grid: { color: '#f0f2f5' },
      ticks: { precision: 0 },
      grace: '15%',                       // extend Y axis 15% beyond data max
    },
    x: { grid: { display: false } },
  },
  onClick: (e, elements, chart) => {
    if (onClickHandler && elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];
      if (label) onClickHandler(label);
    }
  },
},
```

---

## Change 3 — `line()` — label cut at top edge

**Find** the full `options` block inside `line()`:

```js
options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: '#f0f2f5' }, ticks: { precision: 0 } },
    x: { grid: { display: false } },
  },
  onClick: (e, elements, chart) => {
    if (onClickHandler && elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];
      if (label) onClickHandler(label);
    }
  },
},
```

**Replace** with:

```js
options: {
  responsive: true,
  maintainAspectRatio: false,
  clip: false,                            // allow labels outside plot area
  layout: { padding: { top: 24 } },      // canvas room for above-point labels
  plugins: { legend: { display: false } },
  scales: {
    y: {
      grid: { color: '#f0f2f5' },
      ticks: { precision: 0 },
      grace: '15%',                       // extend Y axis 15% beyond data max
    },
    x: { grid: { display: false } },
  },
  onClick: (e, elements, chart) => {
    if (onClickHandler && elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];
      if (label) onClickHandler(label);
    }
  },
},
```

---

## Change 4 — `expiryStatus()` — label cut at top edge

**Find** the full `options` block inside `expiryStatus()`:

```js
options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: '#f0f2f5' }, ticks: { precision: 0 } },
    x: { grid: { display: false } },
  },
},
```

**Replace** with:

```js
options: {
  responsive: true,
  maintainAspectRatio: false,
  clip: false,                            // allow labels outside plot area
  layout: { padding: { top: 24 } },      // canvas room for above-bar labels
  plugins: { legend: { display: false } },
  scales: {
    y: {
      grid: { color: '#f0f2f5' },
      ticks: { precision: 0 },
      grace: '15%',                       // extend Y axis 15% beyond data max
    },
    x: { grid: { display: false } },
  },
},
```

---

## Summary

| Chart function | `clip: false` | `layout.padding` | `grace: '15%'` on |
|---------------|:---:|:---:|:---:|
| `horizontalBar()` | ✅ | `right: 36` | X axis |
| `verticalBar()` | ✅ | `top: 24` | Y axis |
| `line()` | ✅ | `top: 24` | Y axis |
| `expiryStatus()` | ✅ | `top: 24` | Y axis |
| `donut()` | — not needed | — | — |

**`donut()` is unchanged** — donuts don't have axes and labels render inside
the slice area, so clipping is not an issue.

---

## Why `grace: '15%'` solves the data-growth problem

`grace` tells Chart.js to extend the axis max by 15% beyond the largest data
point. So:

- Data max = 50 → axis max ≈ 58 → bars don't fill to the edge → label fits
- Data grows to 70 → axis max ≈ 81 → bars rescale, label still fits
- The 15% buffer is always relative to the current data, so it works at any scale

---

## Nothing else changes

| What | Action |
|------|--------|
| `datalabels` plugin config in each function | **No change** — same config from the previous prompt |
| `donut()` | **No change** |
| `Index.html` | **No change** |
| `Styles.html` | **No change** |
| All `.gs` files | **No change** |

---

## Validation Checklist

- [ ] "Ibri" bar (longest bar) shows its full number — not truncated
- [ ] Age Distribution: label above the tallest column (`24`) is fully visible
- [ ] Expiry charts: label above the tallest bar is fully visible
- [ ] Hiring Trend: label above the highest point is fully visible
- [ ] Increase data to a higher value and confirm bars rescale without labels disappearing
- [ ] No console errors
- [ ] Tooltips and cross-filter click still work
