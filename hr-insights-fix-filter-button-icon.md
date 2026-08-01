# Fix — Filter Button Icon Invisible in Header

## Problem

The filter toggle button in the app header is invisible (appears blank/faint).

**Root cause:** The button in `Index.html` (line 136–138) contains only a
Unicode **Variation Selector-16 (U+FE0F)** character — an invisible formatting
character that was left behind after the base emoji was accidentally deleted.

```html
<!-- BROKEN — invisible content -->
<button class="header__icon-btn fp-open-btn" id="filterToggleBtn" ...>
  ️
</button>
```

---

## Fix — `Index.html`

**Find** the filter toggle button (lines ~136–138):

```html
<button class="header__icon-btn fp-open-btn" id="filterToggleBtn" aria-label="Toggle filter pane" title="Filters" aria-expanded="false" aria-controls="filter-pane">
  ️
</button>
```

**Replace** with:

```html
<button class="header__icon-btn fp-open-btn" id="filterToggleBtn" aria-label="Toggle filter pane" title="Filters" aria-expanded="false" aria-controls="filter-pane">
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
</button>
```

---

## Why SVG and not emoji?

- `stroke="currentColor"` — inherits color from the button's CSS automatically
- Normal state: `color: var(--color-text-secondary)` → `#5c5c7a` (visible gray)
- Hover state: `color: var(--color-primary)` → primary blue (already defined in `.header__icon-btn:hover`)
- Active filter state: `.fp-open-btn--active::after` dot indicator still works unchanged

---

## Nothing else changes

| What | Action |
|------|--------|
| `Styles.html` | **No change** — existing `.header__icon-btn` styles apply perfectly |
| `Script.html` | **No change** — `filterToggleBtn` JS logic unchanged |
| `FilterPane.html` | **No change** |
| Refresh button (`🔄`) | **No change** |

---

## Validation

- [ ] Filter button shows a visible funnel icon in the header
- [ ] Icon color matches other header icons (gray, not black or white)
- [ ] Hovering the button turns the icon to the primary color
- [ ] Clicking the button opens/closes the filter pane as before
- [ ] The blue dot indicator appears when a filter is active
