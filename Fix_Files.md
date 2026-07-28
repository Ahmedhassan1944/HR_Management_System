# Google Apps Script Compatibility & Build Rules

This project targets **Google Apps Script (HtmlService)** as the final deployment platform.

Although you may internally organize the frontend using a modern modular architecture during development, **the final generated project must strictly follow Google Apps Script limitations**.

## Frontend Development Rules

You may logically separate the frontend into modules such as:

* app.js
* api.js
* dashboard.js
* employees.js
* insights.js
* settings.js
* search.js
* drawer.js
* datatable.js
* toast.js
* charts.js

and CSS modules such as:

* main.css
* layout.css
* components.css
* tables.css
* forms.css
* drawer.css
* responsive.css

These modules are **virtual development modules only**.

**Do NOT generate them as standalone files in the final project.**

---

# Final Output Structure

The final Google Apps Script project must contain only the following frontend files:

```
Index.html
Styles.html
Script.html
```

No standalone `.js` files.

No standalone `.css` files.

---

# JavaScript Build Rules

Merge every JavaScript module into **Script.html**.

Requirements:

* Wrap everything inside one `<script>` block.
* Preserve the original module boundaries using clear comment separators.
* Keep the same execution order as a modular project.
* Avoid duplicate variables or function names.
* Do not remove comments that identify the original module.

Example:

```javascript
/****************************************************************
app.js
****************************************************************/

...

/****************************************************************
api.js
****************************************************************/

...

/****************************************************************
dashboard.js
****************************************************************/

...

/****************************************************************
employees.js
****************************************************************/

...
```

---

# CSS Build Rules

Merge every CSS module into **Styles.html**.

Requirements:

* Wrap everything inside one `<style>` block.
* Preserve section separators for each original CSS module.

Example:

```css
/*==================================================
main.css
==================================================*/

...

/*==================================================
layout.css
==================================================*/

...

/*==================================================
components.css
==================================================*/

...
```

---

# Index.html Rules

Index.html must contain only:

* HTML structure
* Page layout
* HtmlService include statements

Example:

```html
<?!= include('Styles'); ?>

<body>

...

</body>

<?!= include('Script'); ?>
```

Do not embed JavaScript or CSS directly inside Index.html.

---

# Backend Rules

Backend files must remain separated as individual `.gs` files.

Use a modular architecture such as:

```
Code.gs

Utils/
Constants.gs
Formatter.gs
Validation.gs

Repositories/
EmployeeRepository.gs
SettingsRepository.gs

Services/
EmployeeService.gs
DashboardService.gs
InsightsService.gs
DocumentService.gs
SettingsService.gs

Helpers/
CacheHelper.gs
ResponseHelper.gs
```

Never merge backend files into one file.

---

# Maintainability Rules

Even though the final project contains only:

* Index.html
* Styles.html
* Script.html

the generated code must still follow modular software engineering principles.

Every original module should remain clearly identifiable through comment blocks.

The merged files must be readable, maintainable, and easy to split back into modules if needed.

---

# Google Apps Script Compliance

The final output must be **100% compatible with Google Apps Script HtmlService**.

Do not generate:

* Vite
* Webpack
* npm
* ES Modules
* import/export statements
* package.json
* node_modules
* build scripts
* TypeScript
* React
* Vue
* Angular

Generate only pure:

* HTML
* CSS (merged into Styles.html)
* Vanilla JavaScript (merged into Script.html)
* Google Apps Script (.gs)

Assume the project will be copied directly into the Google Apps Script editor without any external build process.