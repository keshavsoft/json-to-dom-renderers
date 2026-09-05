# 🚫 How-Not-To: Anti-Patterns & Common Pitfalls

A guide to architectural best practices, anti-patterns, and critical mistakes to avoid when using or extending `json-to-dom-renderers`.

---

## 📑 Table of Pitfalls
1. [Anti-Pattern 1: Violating the `in` / `local` Parameter Naming Convention](#1-violating-the-in--local-parameter-naming-convention)
2. [Anti-Pattern 2: Mutating Component State or Input Arrays Directly](#2-mutating-component-state-or-input-arrays-directly)
3. [Anti-Pattern 3: Full DOM Re-renders on Data Changes](#3-full-dom-re-renders-on-data-changes)
4. [Anti-Pattern 4: Hardcoding CSS Classes and Inline Styles](#4-hardcoding-css-classes-and-inline-styles)
5. [Anti-Pattern 5: Coupling REST APIs & Authentication into UI Components](#5-coupling-rest-apis--authentication-into-ui-components)
6. [Anti-Pattern 6: Bypassing `json-to-dom` with Manual DOM Manipulation](#6-bypassing-json-to-dom-with-manual-dom-manipulation)
7. [Anti-Pattern 7: Mutating Original Dataset During Filtering](#7-mutating-original-dataset-during-filtering)

---

## 1. Violating the `in` / `local` Parameter Naming Convention

### ❌ DON'T: Use Positional Parameters or Raw Input Identifiers
```javascript
// BAD: Positional arguments make call sites brittle
export function filterProducts(records, filterKey, filterVal) {
    // BAD: Mutating or directly referring to un-prefixed inputs makes origin ambiguous
    return records.filter(item => item[filterKey] === filterVal);
}

// BAD: Calling without named object properties
const results = filterProducts(products, "category", "Electronics");
```

### ✅ DO: Use Single Destructured Object with `in` & `local` Mapping
```javascript
// GOOD: Accepts single object with in-prefixed properties
export function filterProducts({ inRecords = [], inFilterKey = "", inFilterVal = "" } = {}) {
    // 1. Immediately assign to local-prefixed variables at the top of the function
    const localRecords = inRecords;
    const localFilterKey = inFilterKey;
    const localFilterVal = inFilterVal;

    // 2. Only reference local-prefixed variables throughout the function body
    return localRecords.filter(item => item[localFilterKey] === localFilterVal);
}

// GOOD: Crystal-clear, self-documenting call site
const results = filterProducts({
    inRecords: products,
    inFilterKey: "category",
    inFilterVal: "Electronics"
});
```

---

## 2. Mutating Component State or Input Arrays Directly

### ❌ DON'T: Push or Mutate `store.stateData` or `store.originalData` Directly
```javascript
// BAD: Directly pushing into the internal state bypasses footer re-evaluations and triggers no repaints
table.store.stateData.push({ item: "New Item", amount: 100 });
// Footers now show outdated totals!
```

### ✅ DO: Use Component Lifecycle Methods
```javascript
// GOOD: Updates the store and triggers dynamic repaints
table.update({ 
    inData: [...table.store.stateData, { item: "New Item", amount: 100 }] 
});

// Or use DataProvider asynchronous CRUD:
await table.createRecord({ 
    inItem: { item: "New Item", amount: 100 } 
});
```

---

## 3. Full DOM Re-renders on Data Changes

### ❌ DON'T: Call `table.render()` on Every Filter or Row Update
```javascript
// BAD: Destroys the table, DOM events, and recreation of <table>, <thead>, <tbody>, <tfoot>
button.addEventListener("click", () => {
    table.store.stateData = filteredRows;
    table.render(); // Heavy, causes screen flashes and loses input focus!
});
```

### ✅ DO: Use Surgical Fast-Path Repainters
```javascript
// GOOD: Selectively replaces only <tbody> and updates <tfoot> in place
button.addEventListener("click", () => {
    table.filterStateData({ inQuery: { category: "Electronics" } });
    // table.filterStateData automatically uses repaintBody() and repaintFoot() under the hood!
});
```

---

## 4. Hardcoding CSS Classes and Inline Styles

### ❌ DON'T: Inject Inline Styles or Hardcode Colors in JS
```javascript
// BAD: Breaks theming, responsive design, and CSS separation
const badSpec = {
    tagName: "tr",
    attributes: { style: "background-color: #222; color: #fff;" }
};
```

### ✅ DO: Rely on `classes.json` and the Theme System
```javascript
// GOOD: Let the multi-theme catalog handle styling
table.setTheme({ inTheme: "dark" });

// Or supply semantic class overrides via inClasses
const table = new Table({
    inData: data,
    inColumns: columns,
    inClasses: {
        table: "table table-sm table-striped border-primary"
    }
});
```

---

## 5. Coupling REST APIs & Authentication into UI Components

### ❌ DON'T: Scatter `fetch()` Calls and Auth Headers Across UI Event Listeners
```javascript
// BAD: API endpoints, tokens, and error handling tightly coupled to UI code
async function onRowDelete(rowId) {
    await fetch(`https://api.myerp.com/items/${rowId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer secret_jwt" }
    });
    // Now manual refetch and manual reload...
}
```

### ✅ DO: Use `createDataProvider` to Decouple Network Concerns
```javascript
// GOOD: Configure provider once at the infrastructure boundary
const dataProvider = createDataProvider({
    inReadUrl: "https://api.myerp.com/items",
    inDeleteUrl: "https://api.myerp.com/items/:id",
    inHeaders: { "Authorization": `Bearer ${userToken}` }
});

const table = new Table({
    inColumns: columns,
    inConfig: tableConfig,
    inDataProvider: dataProvider
});

// Clean, declarative UI usage:
await table.deleteRecord({ inId: rowId });
```

---

## 6. Bypassing `json-to-dom` with Manual DOM Manipulation

### ❌ DON'T: Manually Build HTML Strings or Call `document.createElement`
```javascript
// BAD: Bypasses the declarative pipeline, creates XSS risks, hard to test
function badRenderHead(columns) {
    let html = "<tr>";
    columns.forEach(col => { html += `<th>${col.label}</th>`; });
    html += "</tr>";
    document.querySelector("thead").innerHTML = html;
}
```

### ✅ DO: Build Declarative JSON Specs for the Engine
```javascript
// GOOD: Pure spec builder that compiles cleanly via json-to-dom
export function buildTableHead({ inColumns = [] } = {}) {
    const localColumns = inColumns;
    return {
        tagName: "thead",
        children: [{
            tagName: "tr",
            children: localColumns.map(col => ({
                tagName: "th",
                textContent: col.label
            }))
        }]
    };
}
```

---

## 7. Mutating Original Dataset During Filtering

### ❌ DON'T: Overwrite the Baseline Dataset When Filtering
```javascript
// BAD: Original baseline is lost forever; clearing the filter cannot restore the data!
table.store.originalData = table.store.originalData.filter(row => row.active);
```

### ✅ DO: Filter `stateData` or Use `filterStateData`
```javascript
// GOOD: Filters the active view while keeping original baseline intact for resetting
table.filterStateData({ inQuery: { status: "Active" } });

// Resetting is seamless:
table.filterStateData({ inQuery: "" }); // Restores all original records!
```
