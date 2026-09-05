# json-to-dom-renderers

Modular, high-performance, config-driven UI Renderers (**Table**, **Form**, and **DataList**) built on top of [json-to-dom](https://github.com/keshavsoft/json-to-dom).

[![Live Docs & Demo](https://img.shields.io/badge/Live-Showcase%20%26%20Docs-blue?style=flat-square&logo=github)](https://keshavsoft.github.io/json-to-dom-renderers/)
[![jsDelivr CDN](https://img.shields.io/badge/CDN-jsDelivr-orange?style=flat-square)](https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js)
[![License: ISC](https://img.shields.io/badge/License-ISC-green?style=flat-square)](LICENSE)
[![Version: v11.0.0](https://img.shields.io/badge/Version-v11.0.0-indigo?style=flat-square)](src/v11)

---

## 🌟 Highlights

- **Pure DOM Generation**: Zero Virtual DOM overhead. Transforms declarative JSON specifications directly into native DOM elements via `json-to-dom`.
- **🌐 DataProvider & Dynamic Fetch (New in v11)**: Decoupled CRUD repository adapter pattern via `createDataProvider`. Fetch from any REST URL dynamically (`await table.load()`), perform asynchronous CRUD (`createRecord`, `updateRecord`, `deleteRecord`), with zero auth/header coupling in UI components.
- **🎨 Multi-Theme System**: Dynamic theme switching (`default`, `light`, `extraLight`, `dark`, `extraDark`) across **Table**, **Form**, and **DataList** via nested `classes.json` catalogs and `.setTheme({ inTheme })`.
- **100% Config-Driven Styling**: Fully styled via Bootstrap 5 and JSON configuration objects (`columns.json`, `config.json`, `classes.json`) without hardcoded CSS.
- **Screaming Architecture**: Strict separation of concerns between State Stores, Builder Specifications, and DOM Repainters.
- **Hybrid Orchestration**: Reactive Form filtering, stateful Table updates, and frequency-profiled HTML5 DataList autocomplete working synchronously.
- **Declarative Footers & Serials**: Automatic row serial numbering (`#`), multi-tier footer aggregates (`sum`, `count`, `avg`), and evaluated formula rows (e.g. `summaryRow.amount * 0.18`).
- **Strict Parameter Convention**: Universal adoption of `in`-prefixed arguments and `local`-prefixed variables for clean, immutable data pipelines.

---

## 🚀 Quick Start (CDN)

No bundler, build step, or Node.js environment required. Load directly in any browser:

### 1. Include Dependencies

```html
<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- json-to-dom engine -->
<script type="module" src="https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom/docs/dist/v3/min.js"></script>
```

### 2. Import Renderers & DataProvider via ESM

```javascript
import { Table, Form, DataList, createDataProvider } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";
```

### 3. Complete Minimal Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quickstart | json-to-dom-renderers</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script type="module" src="https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom/docs/dist/v3/min.js"></script>
</head>
<body class="p-4 bg-light">
    <div class="container">
        <div id="filter-container" class="mb-3"></div>
        <div id="table-container" class="table-responsive bg-white rounded shadow-sm p-3 mb-3"></div>
        <div id="datalist-container"></div>
    </div>

    <script type="module">
        import { Table, Form, DataList } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v9/min.js";

        const columns = [
            { key: "item", label: "Product Name" },
            { key: "category", label: "Category" },
            { key: "amount", label: "Amount", type: "number", align: "right" }
        ];

        const data = [
            { item: "Laptop", category: "Electronics", amount: 1200 },
            { item: "Desk Chair", category: "Furniture", amount: 250 },
            { item: "Headphones", category: "Electronics", amount: 150 }
        ];

        // 1. Table
        const table = new Table({
            inData: data,
            inColumns: columns,
            inTargetContainerId: "table-container",
            inConfig: {
                serial: true,
                row: { striped: true, hover: true },
                foot: [
                    { id: "totalRow", title: "Total", type: "aggregate", values: { amount: "sum" } }
                ]
            }
        });
        table.render();

        // 2. Form Filter
        const form = new Form({
            inColumns: columns,
            inTargetContainerId: "filter-container",
            inConfig: { body: { columns: ["item", "category"] } }
        });
        form.render();

        // 3. Autocomplete DataList
        const dataList = new DataList({
            inData: data,
            inColumns: columns,
            inTargetContainerId: "datalist-container"
        });
        dataList.render();
    </script>
</body>
</html>
```

---

## 🏛 Architecture & Design Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                       Data & Config                         │
│       columns.json  │  data.json  │  config.json            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        Stores Layer                         │
│      TableStore   │    FormStore    │    DataListStore      │
│  - Active Columns │ - Active Fields │ - Frequency Profiling │
│  - State Data     │                 │ - Top-N Limits        │
│  - Footers / Eval │                 │                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        Builders Layer                       │
│      buildTable   │    buildForm    │    buildDataList      │
│            Pure JSON element specification tree             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    json-to-dom Engine                       │
│              buildSpecElement({ inSpec })                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         Native DOM                          │
│   Fast repaints: repaintBody() │ repaintFoot() │ refresh()  │
└─────────────────────────────────────────────────────────────┘
```

### Parameter Naming Convention: `in` and `local`
All constructors and methods adhere strictly to the `in` and `local` parameter pattern:
1. Arguments are destructured from a single configuration object with `in`-prefixed keys.
2. The function immediately maps each `in*` argument to a `local*` variable at the top of the scope.
3. Only `local*` variables are referenced throughout internal execution.

---

## 📦 Component API Reference

### 1. `Table`
Orchestrates rendering, state storage, dynamic footer calculations, and targeted repainting for data tables.

```javascript
import { Table } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v9/min.js";

const table = new Table({
    inData: [],               // Array of row objects
    inColumns: [],            // Master column schema definitions
    inConfig: {},             // Table display and calculation configurations
    inClasses: {},            // Optional Bootstrap class overrides
    inTargetContainerId: "table-container" // Target DOM element ID
});
```

#### Table Configuration Schema (`config.json`)
```json
{
    "serial": true,
    "head": {
        "columns": ["vchtype", "vouchernumber", "stockitemname", "amount"]
    },
    "row": {
        "striped": true,
        "hover": true
    },
    "foot": [
        {
            "id": "summaryRow",
            "title": "Total",
            "type": "aggregate",
            "values": { "amount": "sum" }
        },
        {
            "id": "taxRow",
            "title": "GST (18%)",
            "type": "eval",
            "values": { "amount": "summaryRow.amount * 0.18" }
        },
        {
            "id": "balanceRow",
            "title": "Grand Total",
            "type": "eval",
            "values": { "amount": "summaryRow.amount + taxRow.amount" }
        }
    ]
}
```

#### Table Methods
- `table.render()`: Builds and mounts the table to the target container.
- `table.filterStateData({ query })`: Filters active rows by key/value query and repaints body and footers.
- `table.filterOriginalData({ query })`: Filters the original baseline dataset.
- `table.repaintBody()`: Fast-path re-render of `<tbody>` only.
- `table.repaintFoot()`: Fast-path recalculation and re-render of `<tfoot>` only.
- `table.refreshTable()`: Full refresh of table body and footer.

---

### 2. `Form`
Generates config-driven filter and entry forms matching column schemas with automatic datalist bindings and control-tree tracking.

```javascript
import { Form } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v9/min.js";

const form = new Form({
    inColumns: [],            // Column definitions
    inConfig: {
        body: {
            columns: ["stockitemname", "batchname", "amount"]
        }
    },
    inTargetContainerId: "filter-container"
});

const { treeWithIds, spec, element } = form.render();
```

#### Form Methods
- `form.render()`: Builds and inserts form DOM nodes, returning `{ treeWithIds, spec, element }`.
- `form.getControlsTree()`: Retrieves pruned interactive element tree containing assigned control IDs.

---

### 3. `DataList`
Analyzes dataset columns, profiles item frequencies (e.g. `ROPE (3)`), and generates native HTML5 `<datalist>` elements for autocomplete inputs.

```javascript
import { DataList } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v9/min.js";

const dataList = new DataList({
    inData: [],               // Row records to profile
    inColumns: [],            // Column schema
    inConfig: {
        datalist: {
            columns: ["stockitemname", "batchname"]
        },
        topN: 10              // Optional top-N frequency limit
    },
    inTargetContainerId: "datalist-container"
});

dataList.render();

// Reactively update datalists when table filters change:
dataList.update({ data: table.store.stateData });
```

---

### 4. `createDataProvider` (New in v11)
Creates a decoupled CRUD repository adapter that handles dynamic fetching, REST queries, and asynchronous lifecycle operations with zero auth coupling in the UI layer.

```javascript
import { createDataProvider, Table } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";

// 1. Configure provider from outside
const dataProvider = createDataProvider({
    inReadUrl: "https://api.example.com/vouchers",
    inCreateUrl: "https://api.example.com/vouchers",
    inUpdateUrl: "https://api.example.com/vouchers/:id",
    inDeleteUrl: "https://api.example.com/vouchers/:id",
    inHeaders: {
        "Authorization": "Bearer YOUR_TOKEN"
    }
});

// 2. Supply to Table
const table = new Table({
    inColumns: columns,
    inConfig: tableConfig,
    inDataProvider: dataProvider,
    inTargetContainerId: "table-container"
});

// 3. Dynamic async lifecycle
await table.load();

// 4. Asynchronous CRUD operations
await table.createRecord({ inItem: { stockitemname: "Widget", amount: 500 } });
await table.updateRecord({ inId: 1, inItem: { amount: 650 } });
await table.deleteRecord({ inId: 1 });
```

---

## 🔗 Hybrid Workflow (Form + DataList + Table)

In full applications (like `samples/hybrid/v2`), all three renderers operate in unison:

```javascript
// 1. Mount all 3 renderers
const table = new Table({ data, columns, config: tableConfig, targetContainerId: "table-box" });
table.render();

const form = new Form({ columns, config: searchConfig, targetContainerId: "filter-box" });
const fromForm = form.render();

const dataList = new DataList({ data, columns, config: datalistConfig, targetContainerId: "datalist-box" });
dataList.render();

// 2. Connect Form filter events to Table & DataList
fromForm.element.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", event => {
        const row = event.currentTarget.closest("div");
        const input = row.querySelector("input");
        const name = input.getAttribute("name");
        const value = input.value;

        // Filter Table state
        table.filterStateData({ query: { [name]: value } });

        // Synchronize DataList counts with filtered dataset
        dataList.update({ data: table.store.stateData });
    });
});
```

---

## 🛠 Project Structure

```
json-to-dom-renderers/
├── docs/                     # GitHub Pages publication directory
│   ├── dist/v9/min.js        # Minified production ESM bundle
│   ├── index.html            # Interactive Documentation & Live Demo
│   └── sampleData.js         # Showcase sample dataset and configs
├── samples/
│   └── hybrid/v2/            # Standalone hybrid sample loading from CDN
│       ├── index.html
│       ├── index.js
│       ├── columns.json
│       ├── data.json
│       └── ...
├── src/v9/                   # Source architecture
│   ├── common/               # Utility functions (pruneTreeWithIds, etc.)
│   ├── datalist/             # DataList component (Store, Builder, Options)
│   ├── form/                 # Form component (Store, Builder, Classes)
│   ├── table/                # Table component (Store, Builder, Repaints, Filters)
│   └── index.js              # Main library entry point
├── package.json
└── vite.config.js
```

---

## 🏗 Development & Build

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle to docs/dist/v9/min.js
npm run build
```

---

## 📄 License

This project is licensed under the **ISC License**. Developed by [KeshavSoft](https://github.com/keshavsoft).
