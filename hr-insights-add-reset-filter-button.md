# Add Reset Filters Button — HR Insights Page Header

## Goal

Add a **Reset Filters** button to the top of the HR Insights page that:
- Appears **only when at least one filter is active** (hidden otherwise)
- Calls `FilterModule.reset()` when clicked
- Sits in the existing `page-header__actions` area, next to the timestamp

---

## Context

| File | Relevant lines | Notes |
|------|---------------|-------|
| `Index.html` | 168–176 | HR Insights page header — `page-header__actions` is the target |
| `Script.html` | 2204–2230 | `FilterModule.init()` — where button listeners are wired |
| `Script.html` | 2458–2467 | `_updateActiveIndicator()` — runs every time filter state changes |
| `Script.html` | 2935 | `return { init, reset }` — `reset` is already public |

`_updateActiveIndicator()` already knows whether any filter is active via
`_hasActiveFilters(collectFilterValues())`. It currently only toggles a CSS
class on `filterToggleBtn`. We extend it to also show/hide the reset button.

---

## Change 1 — `Index.html` — add the button

**Find** the Insights page header actions div (lines ~173–175):

```html
<div class="page-header__actions">
  <span id="insightsGeneratedAt" class="text-muted" style="font-size:var(--font-size-xs);"></span>
</div>
```

**Replace** with:

```html
<div class="page-header__actions">
  <button
    id="insightsResetFiltersBtn"
    class="btn btn--ghost btn--sm"
    hidden
    aria-label="Reset all filters"
    title="Reset Filters"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
         style="margin-right:5px; vertical-align:-2px;">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
    Reset Filters
  </button>
  <span id="insightsGeneratedAt" class="text-muted" style="font-size:var(--font-size-xs);"></span>
</div>
```

> The `hidden` attribute makes it invisible by default.
> The SVG is a "rotate-left / undo" arrow — universally recognised as reset.

---

## Change 2 — `Script.html` — wire click in `FilterModule.init()`

**Find** this block inside `init()` (around line 2218–2219):

```js
document.getElementById('fp-apply')?.addEventListener('click', () => applyFilters());
document.getElementById('fp-reset')?.addEventListener('click', reset);
```

**Add one line immediately after:**

```js
document.getElementById('fp-apply')?.addEventListener('click', () => applyFilters());
document.getElementById('fp-reset')?.addEventListener('click', reset);
document.getElementById('insightsResetFiltersBtn')?.addEventListener('click', reset);
```

---

## Change 3 — `Script.html` — show/hide in `_updateActiveIndicator()`

**Find** the full function (lines ~2458–2467):

```js
function _updateActiveIndicator() {
  const filters = collectFilterValues();
  const btn = document.getElementById('filterToggleBtn');
  if (!btn) return;
  if (_hasActiveFilters(filters)) {
    btn.classList.add('fp-open-btn--active');
  } else {
    btn.classList.remove('fp-open-btn--active');
  }
}
```

**Replace** with:

```js
function _updateActiveIndicator() {
  const filters = collectFilterValues();
  const btn = document.getElementById('filterToggleBtn');
  if (!btn) return;

  const hasActive = _hasActiveFilters(filters);

  // Toggle dot on the filter icon button
  if (hasActive) {
    btn.classList.add('fp-open-btn--active');
  } else {
    btn.classList.remove('fp-open-btn--active');
  }

  // Show / hide the Reset Filters button in the page header
  const resetBtn = document.getElementById('insightsResetFiltersBtn');
  if (resetBtn) {
    if (hasActive) {
      resetBtn.removeAttribute('hidden');
    } else {
      resetBtn.setAttribute('hidden', '');
    }
  }
}
```

---

## Nothing else changes

| What | Action |
|------|--------|
| `FilterModule.reset()` logic | **No change** — already clears all filters and refreshes the view |
| Filter pane's own Reset button (`fp-reset`) | **No change** — still works as before |
| All other pages (Dashboard, Employees, Documents) | **No change** — `insightsResetFiltersBtn` only exists on the Insights page |
| `Styles.html` | **No change** — `btn btn--ghost btn--sm` classes already defined |

---

## How it behaves

```
No filters active:
  [HR Insights]  Executive workforce analytics       ← no reset button visible

Filters active:
  [HR Insights]  Executive workforce analytics   [↺ Reset Filters]   Generated: …
```

1. User applies a filter from the Filter Pane → button appears automatically
2. User clicks **Reset Filters** → all filters cleared, charts refresh, button hides
3. User clears filters manually via Filter Pane → button hides automatically

---

## Validation Checklist

- [ ] Button is **not visible** when the page loads with no filters applied
- [ ] Button **appears** as soon as any filter becomes active
- [ ] Clicking the button clears all filters and refreshes the Insights charts
- [ ] Button **hides** again after reset
- [ ] The filter pane's own Reset button still works independently
- [ ] Button appears on the Insights page header only (not Dashboard / Employees / Documents)
- [ ] No JS console errors
