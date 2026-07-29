# تنفيذ فلتر شامل (مثل Power BI) لصفحتي Dashboard و HR Insights

## الهدف
إنشاء "Filter Pane" تفاعلي وشامل شبيه بـ Power BI يُضاف إلى صفحتي Dashboard و HR Insights في المشروع، مع واجهة مستخدم قابلة لإعادة الاستخدام، فلترة على الخادم، وحفظ إعدادات المستخدم.

## الخلفية
المشروع مبني على Google Apps Script مع ملفات واجهة في `Index.html`, `Script.html`, `Styles.html`، وخدمات السيرفر في ملفات `.gs` مثل `InsightsService.gs`, `EmployeeService.gs`, وملفات إعدادات في `SettingsRepository.gs`, `SettingsService.gs`.

## متطلبات الميزة (High level)
- إضافة لوحة فلترة جانبية قابلة للطي على Dashboard و HR Insights.
- مرشحات متعددة: نص، اختيار متعدد، نطاق تواريخ، نطاق أرقام، ومحددات boolean.
- عرض عدد النتائج الحالية وتحديث الرسوم/الجداول ديناميكياً بعد تطبيق الفلتر.
- إمكانية حفظ وتحميل إعدادات الفلتر للمستخدم.
- واجهة قابلة لإعادة الاستخدام بحيث تُستورد في صفحات أخرى بسهولة.

## معايير القبول
- تُعرض لوحة الفلترة في كلتا الصفحتين وتعمل دون إعادة تحميل الصفحة.
- تطبيق الفلاتر يؤدي لاستدعاء سيرفر (مثلاً `google.script.run`) وتحصل على بيانات مُفلترة.
- التخزين المؤقت لإعدادات الفلتر في `SettingsRepository` ويمكن للمستخدم استرجاع إعداد سابق.
- لا تكسر الأنماط الحالية: استخدم `Styles.html` للأنماط أو أرفق باسم مساحة خاصة (e.g., `.filter-pane`).

## ملف المطلوب (Prompt for implementer / AI agent)

استخدم النص التالي كـ prompt لتنفيذ الميزة تلقائياً. نفّذ كل خطوة وارجع تعديلات الملفات المطلوبة في PR واحد.

---

## Prompt (for implementer / AI)

You are given a Google Apps Script project (repository root contains `Index.html`, `Script.html`, `Styles.html`, `InsightsService.gs`, `EmployeeService.gs`, `SettingsRepository.gs`, `SettingsService.gs`). Implement a Power-BI-like Filter Pane and wire it into Dashboard and HR Insights.

Requirements:
1. Add a reusable component `filter-pane` implemented as an HTML include and a client-side JS module.
2. UI must include: search box (text), multi-select dropdown, date range picker, numeric range slider, boolean toggles, "Apply" and "Reset" buttons, and a saved-filter selector.
3. Add styles for `.filter-pane` in `Styles.html` (responsive, collapsible).
4. Implement client-side behavior in `Script.html`: open/close pane, collect filter values, call server via `google.script.run.withSuccessHandler(...)` to fetch filtered data, and render a loading state.
5. Server-side: add functions in `InsightsService.gs` and `EmployeeService.gs` to accept a filter object and return filtered rows. Follow existing repository patterns for data access. If there is a `SettingsRepository`/`SettingsService`, add methods to save/load user filter presets.
6. Persist filter presets per-user in `SettingsRepository.gs` and expose them through `SettingsService.gs` (add `saveFilterPreset(userId, name, filter)` and `getFilterPresets(userId)`).
7. Add unit/manual tests: provide a QA checklist that verifies UI, server calls, saved presets, and no visual regressions.
8. Update the project README or add a short `CHANGELOG` entry describing the new feature and how to use it.

Implementation details and examples:
- Reusable HTML include file (create `_filter-pane.html` or append a new `<div id="filter-pane">` section in `Index.html` and make it importable):

```html
<!-- _filter-pane.html -->
<div id="filter-pane" class="filter-pane closed">
  <header class="fp-header">
    <h3>Filters</h3>
    <button id="fp-toggle">▸</button>
  </header>
  <div class="fp-body">
    <label>Search: <input id="fp-search" type="search" /></label>
    <label>Department: <select id="fp-dept" multiple></select></label>
    <label>Date range: <input id="fp-date-start" type="date"/> to <input id="fp-date-end" type="date"/></label>
    <label>Salary range: <input id="fp-salary-min" type="number"/> - <input id="fp-salary-max" type="number"/></label>
    <label><input id="fp-active" type="checkbox"/> Active only</label>
    <div class="fp-actions">
      <select id="fp-saved"></select>
      <button id="fp-save">Save</button>
      <button id="fp-apply">Apply</button>
      <button id="fp-reset">Reset</button>
    </div>
  </div>
</div>
```

- Client-side JS (append to `Script.html`):

```js
function initFilterPane() {
  const pane = document.getElementById('filter-pane');
  document.getElementById('fp-toggle').addEventListener('click', () => pane.classList.toggle('closed'));
  document.getElementById('fp-apply').addEventListener('click', applyFilters);
  document.getElementById('fp-reset').addEventListener('click', resetFilters);
  document.getElementById('fp-save').addEventListener('click', savePreset);
}

function collectFilterValues() {
  return {
    search: document.getElementById('fp-search').value || null,
    departments: Array.from(document.getElementById('fp-dept').selectedOptions).map(o=>o.value),
    dateStart: document.getElementById('fp-date-start').value || null,
    dateEnd: document.getElementById('fp-date-end').value || null,
    salaryMin: parseFloat(document.getElementById('fp-salary-min').value) || null,
    salaryMax: parseFloat(document.getElementById('fp-salary-max').value) || null,
    activeOnly: document.getElementById('fp-active').checked || false,
  };
}

function applyFilters() {
  const filters = collectFilterValues();
  showLoading(true);
  google.script.run.withSuccessHandler(renderFilteredData).getFilteredEmployees(filters);
}
```

- Server-side example (to add in `EmployeeService.gs`):

```js
function getFilteredEmployees(filters) {
  // Example: call into repository to query data applying filters
  // Use existing functions in EmployeeRepository.gs
  return EmployeeRepository.queryWithFilters(filters);
}
```

- Settings persistence example (add to `SettingsService.gs`):

```js
function saveFilterPreset(userId, name, filter) {
  return SettingsRepository.save(userId, 'filterPreset:' + name, JSON.stringify(filter));
}

function getFilterPresets(userId) {
  return SettingsRepository.listByPrefix(userId, 'filterPreset:');
}
```

QA checklist (manual):
- Open Dashboard: filter pane toggles open/closed.
- Select filters and click `Apply` → dashboard charts/tables update.
- Save a preset and reload page → preset is available and can be applied.
- Reset returns UI to defaults and updates view.

Commit & PR guidance:
- Commit message: `feat(filter-pane): add reusable filter pane for Dashboard and HR Insights`
- PR description: summarize files changed, endpoints added, and usage instructions.

---

احفظ الملف كـ `filter-pane-prompt.md` في جذر المشروع وأرسله معي عندما تريدني أن أنفذ التعديلات تلقائياً.

## ملاحظات ختامية
- إذا تحب، أقدر أبدأ تنفيذ أول خطوتين: (1) استكشاف مكان قوالب Dashboard و HR Insights، و(2) إنشاء الملف `_filter-pane.html` وتهيئة `Script.html` لاحتواء الدوال الأساسية.
- أخبرني تختارني أطبق التعديلات فعلياً أو تسلم هذا الـ prompt لأي AI/مطور آخر لتنفيذه.

## Professional Prompt (English)

Use the text below as a single, professional implementation prompt for an engineer or an AI agent. It includes the additional requirements: an opaque (non-transparent) premium UI, and dropdown lists for specific columns.

Project context: Google Apps Script project containing `Index.html`, `Script.html`, `Styles.html`, and server files like `InsightsService.gs`, `EmployeeService.gs`, `SettingsRepository.gs`, `SettingsService.gs`.

Objective: Implement a reusable, premium, Power BI–style Filter Pane and integrate it into both Dashboard and HR Insights.

Requirements (concise & prioritized):
1. Visual & UX
  - The filter pane must be opaque (non-transparent) with a premium look: subtle elevation, rounded corners, consistent spacing, smooth transitions, and accessible color contrast.
  - Use a dedicated CSS namespace `.filter-pane` added to `Styles.html`. Keep styles modular and responsive; include a compact collapsed mode for narrow screens.
  - Provide high-quality controls: multi-select dropdowns with search, date-range picker, numeric range inputs/sliders, boolean toggles, and clear action buttons. Aim for a Material-like but dependency-free implementation (vanilla CSS/JS).

2. Fields (exact dropdowns required)
  - Add dropdown/multi-select controls for: `Title`, `Department`, `Project`, `Gender`, `Nationality`, `Bank`, `Class`, `Direct/Indirect`.
  - Populate options dynamically from the current dataset via server calls; include an option to show counts per option (optional enhancement).

3. Reusability & Integration
  - Implement the component as an HTML include `_filter-pane.html` and a JS initializer in `Script.html` (`initFilterPane()`), so it can be embedded on `Index.html` or any other page.
  - Add a minimal public API: `filterPane.apply(filters)`, `filterPane.reset()`, `filterPane.loadPresets()`.

4. Client behavior
  - On `Apply`: collect values and call server via `google.script.run.withSuccessHandler(...)` to fetch filtered results for the current view (Dashboard or HR Insights). Show a loading state and disable inputs while running.
  - On `Reset`: clear filters and refresh the view.
  - Support saving/loading presets via a saved-filter dropdown and `Save` button.

5. Server-side
  - Add `getFilteredEmployees(filters)` to `EmployeeService.gs` and `getFilteredInsights(filters)` to `InsightsService.gs` following existing repository patterns. They should accept a filter object and return filtered rows.
  - Add settings persistence functions in `SettingsService.gs` and `SettingsRepository.gs`: `saveFilterPreset(userId, name, filter)` and `getFilterPresets(userId)`.

6. Accessibility & Performance
  - Ensure keyboard navigation for dropdowns and buttons.
  - Debounce server calls where appropriate and paginate or batch results if large.

7. Tests & QA
  - Add a QA checklist and simple manual tests covering: UI display, Apply/Reset actions, server calls, preset save/load, and responsive layout.

Acceptance criteria (must pass):
- The opaque `.filter-pane` UI appears on both Dashboard and HR Insights and does not rely on external JS frameworks.
- Dropdowns exist for the exact columns listed and populate from server data.
- Applying filters updates the view without a full page reload.
- Presets persist and can be reloaded.

Developer instructions & commit message:
- Files to create/modify: `_filter-pane.html`, update `Index.html` (include), `Script.html` (init + handlers), `Styles.html` (styles), `EmployeeService.gs`, `InsightsService.gs`, `SettingsService.gs`, `SettingsRepository.gs`, and `CHANGELOG.md` or README.
- Commit message: `feat(filter-pane): add premium opaque filter pane with dropdowns for key columns`
- PR description: reference UI screenshots (if available), list endpoints added, and usage instructions for embedding the component.

---

## ملاحظة قصيرة بالعربية
أضفت طلب احترافي يشرح أنّ اللوحة يجب أن تكون غير شفافة وبتصميم مميز، ويطلب القوائم المنسدلة للحقول: Title, Department, Project, Gender, Nationality, Bank, Class, Direct/Indirect. لو عايز أطبق التعديلات فعلياً، موافق؟
