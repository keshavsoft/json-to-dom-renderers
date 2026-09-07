# 📖 How-To Guide & Recipes

Practical, production-tested recipes for building reactive, high-performance UIs using `json-to-dom-renderers`.

> [!IMPORTANT]
> All code snippets strictly adhere to our **`in` / `local` parameter naming convention**:
> 1. Parameters are passed as a single object with `in`-prefixed keys.
> 2. Each `in*` argument is immediately mapped to a `local*` variable at the top of the function scope.
> 3. Only `local*` variables are referenced internally.

---

## 📑 Table of Contents
1. [Include Dependencies (CDN)](#1-include-dependencies-cdn)
2. [Recipe 1: Building a Table with Serials & Multi-Tier Footers](#recipe-1-building-a-table-with-serials--multi-tier-footers)
3. [Recipe 2: Generating a Filter Form](#recipe-2-generating-a-filter-form)
4. [Recipe 3: Creating HTML5 Autocomplete DataLists with Frequency Badges](#recipe-3-creating-html5-autocomplete-datalists-with-frequency-badges)
5. [Recipe 4: Decoupled REST CRUD with `createDataProvider`](#recipe-4-decoupled-rest-crud-with-createdataprovider)
6. [Recipe 5: Dynamic Theme Switching](#recipe-5-dynamic-theme-switching)
7. [Recipe 6: Hybrid Orchestration (Form + Table + DataList)](#recipe-6-hybrid-orchestration-form--table--datalist)
8. [Recipe 7: Targeted Surgical Repainting](#recipe-7-targeted-surgical-repainting)

---

## 1. Include Dependencies (CDN)

No bundlers or Node.js environment required. Load directly in your HTML:

```html
<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- json-to-dom Engine -->
<script type="module" src="https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom/docs/dist/v3/min.js"></script>

<!-- json-to-dom-renderers (v11) -->
<script type="module">
    import { Table, Form, DataList, createDataProvider } 
        from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";
</script>
```

---

## Recipe 1: Building a Table with Serials & Multi-Tier Footers

Create a responsive table with auto row numbering (`#`), aggregate calculations (`sum`), and evaluated formula rows (GST tax and Grand Total).

```javascript
import { Table } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";

// 1. Column Schemas
const columns = [
    { key: "item", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "amount", label: "Amount", type: "number", align: "right" }
];

// 2. Dataset
const data = [
    { item: "Laptop Pro", category: "Electronics", amount: 1200 },
    { item: "Ergonomic Chair", category: "Furniture", amount: 350 },
    { item: "Wireless Mouse", category: "Electronics", amount: 50 }
];

// 3. Table Configuration with Multi-tier Footers
const config = {
    serial: true, // Enables automatic serial column (#)
    head: {
        columns: ["item", "category", "amount"]
    },
    row: {
        striped: true,
        hover: true
    },
    foot: [
        {
            id: "subTotalRow",
            title: "Sub Total",
            type: "aggregate",
            values: { amount: "sum" }
        },
        {
            id: "taxRow",
            title: "Tax (18% GST)",
            type: "eval",
            values: { amount: "subTotalRow.amount * 0.18" }
        },
        {
            id: "grandTotalRow",
            title: "Grand Total",
            type: "eval",
            values: { amount: "subTotalRow.amount + taxRow.amount" }
        }
    ]
};

// 4. Instantiate and Render adhering to in/local convention
const table = new Table({
    inData: data,
    inColumns: columns,
    inConfig: config,
    inTargetContainerId: "table-container"
});

table.render();
```

---

## Recipe 2: Generating a Filter Form

Render a bootstrap input group form for specific fields defined in your column schema:

```javascript
import { Form } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";

const form = new Form({
    inColumns: columns,
    inConfig: {
        body: {
            columns: ["item", "category"] // Fields to generate in the form
        }
    },
    inTargetContainerId: "filter-container"
});

const { treeWithIds, spec, element } = form.render();

// Controls tree gives you indexed direct access to generated control IDs:
console.log("Interactive controls tree:", form.getControlsTree());
```

---

## Recipe 3: Creating HTML5 Autocomplete DataLists with Frequency Badges

Generate native `<datalist>` elements for input autocomplete. `DataList` automatically computes frequencies and displays badges (e.g. `Electronics (2)`).

```javascript
import { DataList } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";

const dataList = new DataList({
    inData: data,
    inColumns: columns,
    inConfig: {
        datalist: {
            columns: ["category", "item"]
        },
        topN: 10 // Only show the top 10 most frequent items
    },
    inTargetContainerId: "datalist-container"
});

dataList.render();

// When table data is filtered, reactively update the datalist counts:
export function onDataFiltered({ inFilteredData }) {
    const localFilteredData = inFilteredData;
    dataList.update({ inData: localFilteredData });
}
```

---

## Recipe 4: Decoupled REST CRUD with `createDataProvider`

Decouple your API endpoints, authentication tokens, and path parameters from your rendering components using the DataProvider adapter pattern.

```javascript
import { Table, createDataProvider } 
    from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";

// 1. Create the repository provider
const dataProvider = createDataProvider({
    inBaseUrl: "https://api.myerp.com/v1/inventory",
    inReadUrl: "https://api.myerp.com/v1/inventory/items",
    inCreateUrl: "https://api.myerp.com/v1/inventory/items",
    inUpdateUrl: "https://api.myerp.com/v1/inventory/items/:id",
    inDeleteUrl: "https://api.myerp.com/v1/inventory/items/:id",
    inHeaders: {
        "Authorization": "Bearer SECURE_JWT_TOKEN",
        "X-Tenant-Id": "tenant_102"
    }
});

// 2. Pass provider to Table
const table = new Table({
    inColumns: columns,
    inConfig: config,
    inDataProvider: dataProvider,
    inTargetContainerId: "table-container"
});

// 3. Asynchronous load and CRUD lifecycle
await table.load(); // Fetches from inReadUrl and renders table

// Create a new record and reload automatically:
await table.createRecord({ 
    inItem: { item: "Standing Desk", category: "Furniture", amount: 600 } 
});

// Update an existing record:
await table.updateRecord({ 
    inId: 101, 
    inItem: { amount: 650 } 
});

// Delete an existing record:
await table.deleteRecord({ inId: 101 });
```

---

## Recipe 5: Dynamic Theme Switching

Easily switch visual themes on the fly across all components (`default`, `light`, `extraLight`, `dark`, `extraDark`):

```javascript
export function applyAppTheme({ inThemeName, inTable, inForm, inDataList }) {
    const localThemeName = inThemeName;
    const localTable = inTable;
    const localForm = inForm;
    const localDataList = inDataList;

    // Dynamically apply and repaint
    localTable.setTheme({ inTheme: localThemeName });
    localForm.setTheme({ inTheme: localThemeName });
    localDataList.setTheme({ inTheme: localThemeName });
}

// Hook to theme selector dropdown
document.getElementById("theme-selector")?.addEventListener("change", (event) => {
    applyAppTheme({
        inThemeName: event.target.value,
        inTable: table,
        inForm: form,
        inDataList: dataList
    });
});
```

---

## Recipe 6: Hybrid Orchestration (Form + Table + DataList)

Harmoniously orchestrate Form filtering, Table state updates, and DataList count badges:

```javascript
// Function following the strict in/local convention
export function setupHybridSearch({ inFormResult, inTable, inDataList }) {
    const localFormResult = inFormResult;
    const localTable = inTable;
    const localDataList = inDataList;

    if (!localFormResult?.element) return;

    // Attach click listeners to all filter buttons in the form
    const filterButtons = localFormResult.element.querySelectorAll("button");

    filterButtons.forEach(button => {
        button.addEventListener("click", event => {
            const rowDiv = event.currentTarget.closest("div");
            const input = rowDiv?.querySelector("input");
            if (!input) return;

            const fieldName = input.getAttribute("name");
            const filterValue = input.value;

            // 1. Filter active table rows (updates body and recalculates footers)
            localTable.filterStateData({ inQuery: { [fieldName]: filterValue } });

            // 2. Synchronize DataList frequency counts with the active dataset
            localDataList.update({ inData: localTable.store.stateData });
        });
    });
}
```

---

## Recipe 7: Targeted Surgical Repainting

When working with real-time data streams or frequent UI tweaks, avoid full component rebuilds by using targeted repainters:

```javascript
// Only repaint tbody when row data changes:
table.repaintBody();

// Only recalculate and repaint tfoot:
table.repaintFoot();

// Synchronize both body and foot without rebuilding head:
table.refreshTable();
```
