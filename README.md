# json-to-dom-renderers

Modular, high-performance, config-driven UI Renderers (**Table**, **Form**, and **DataList**) built on top of [json-to-dom](https://github.com/keshavsoft/json-to-dom).

[![Live Docs & Demo](https://img.shields.io/badge/Live-Showcase%20%26%20Docs-blue?style=flat-square&logo=github)](https://keshavsoft.github.io/json-to-dom-renderers/)
[![jsDelivr CDN](https://img.shields.io/badge/CDN-jsDelivr-orange?style=flat-square)](https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js)
[![License: ISC](https://img.shields.io/badge/License-ISC-green?style=flat-square)](LICENSE)
[![Version: v11.0.0](https://img.shields.io/badge/Version-v11.0.0-indigo?style=flat-square)](src/v11)

---

## 📚 Complete Documentation

| Document | Description |
| :--- | :--- |
| 🏛 [**Architecture & Design System**](docs/architecture.md) | Screaming architecture, data flow, stores, builders, engine, repainters & DataProvider. |
| 📖 [**How-To Guide & Recipes**](docs/how-to.md) | Copy-pasteable recipes for Tables, Forms, DataLists, REST CRUD, Theming & Hybrid sync. |
| 🚫 [**How-Not-To: Anti-Patterns**](docs/how-not-to.md) | Common mistakes, DO vs DON'T comparisons, and parameter convention traps. |
| 📚 [**Complete API Reference**](docs/api-reference.md) | Exhaustive parameter specifications, method returns, and configuration schemas. |
| 🌐 [**Interactive Docs & Live Demo**](https://keshavsoft.github.io/json-to-dom-renderers/) | Live showcase with real-time theming, interactive filtering, and code inspectors. |

---

## 🌟 Highlights

- **Pure DOM Generation**: Zero Virtual DOM overhead. Transforms declarative JSON specifications directly into native DOM elements via `json-to-dom`.
- **🌐 DataProvider & Dynamic Fetch (v11)**: Decoupled CRUD repository adapter pattern via `createDataProvider`. Fetch from any REST URL dynamically (`await table.load()`), perform asynchronous CRUD (`createRecord`, `updateRecord`, `deleteRecord`), with zero auth/header coupling in UI components.
- **🎨 Multi-Theme System**: Dynamic theme switching (`default`, `light`, `extraLight`, `dark`, `extraDark`) across **Table**, **Form**, and **DataList** via nested `classes.json` catalogs and `.setTheme({ inTheme })`.
- **100% Config-Driven Styling**: Fully styled via Bootstrap 5 and JSON configuration objects (`columns.json`, `config.json`, `classes.json`) without hardcoded CSS.
- **Screaming Architecture**: Strict separation of concerns between State Stores, Builder Specifications, and DOM Repainters.
- **Hybrid Orchestration**: Reactive Form filtering, stateful Table updates, and frequency-profiled HTML5 DataList autocomplete working synchronously.
- **Declarative Footers & Serials**: Automatic row serial numbering (`#`), multi-tier footer aggregates (`sum`, `count`, `avg`), and evaluated formula rows (e.g. `summaryRow.amount * 0.18`).
- **Strict Parameter Convention**: Universal adoption of `in`-prefixed arguments and `local`-prefixed variables for clean, immutable data pipelines.

---

## 🛡 Parameter Naming Convention: `in` and `local`

All constructors, methods, and functions strictly enforce the following parameter pattern:
1. **Object Destructuring for Inputs:** Functions accept a single configuration object with `in`-prefixed keys (e.g., `{ inData, inColumns, inConfig }`).
2. **Immediate Assignment to `local` Variables:** At the top of the function body, each `in*` argument is assigned to a `local*` variable (e.g., `const localData = inData;`).
3. **Internal Execution Using `local`:** Only `local*` variables are referenced throughout the function body.

```javascript
// Example following the convention
export function calculateTotals({ inRecords = [], inTaxRate = 0.18 } = {}) {
    // 1. Assign to local variables
    const localRecords = inRecords;
    const localTaxRate = inTaxRate;

    // 2. Use local variables for all logic
    const subTotal = localRecords.reduce((acc, row) => acc + (row.amount || 0), 0);
    const tax = subTotal * localTaxRate;

    return { subTotal, tax, total: subTotal + tax };
}
```

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

### 2. Import Renderers via ESM (v11)

```javascript
import { Table, Form, DataList, createDataProvider } 
    from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";
```

### 3. Complete Minimal Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        import { Table, Form, DataList } 
            from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";

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

        // 1. Table with auto serials and aggregate footer
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

## 🏛 Screaming Architecture

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

See [docs/architecture.md](docs/architecture.md) for full details.

---

## 💡 Quick How-To & How-Not-To

### ✅ HOW-TO: Surgical Repainting
```javascript
// DO use surgical repainters when filtering or mutating data
table.filterStateData({ inQuery: { category: "Electronics" } });
// Under the hood, this executes repaintBody() and repaintFoot() without full DOM re-parsing!
```

### ❌ HOW-NOT-TO: Avoid Full Component Re-renders
```javascript
// DON'T rebuild the whole table DOM on every filter keypress
table.store.stateData = filteredData;
table.render(); // BAD: destroys existing table, resets input focus, causes screen flicker
```

### ✅ HOW-TO: Decoupled REST CRUD with `createDataProvider`
```javascript
const dataProvider = createDataProvider({
    inReadUrl: "https://api.example.com/items",
    inCreateUrl: "https://api.example.com/items",
    inUpdateUrl: "https://api.example.com/items/:id",
    inDeleteUrl: "https://api.example.com/items/:id",
    inHeaders: { "Authorization": "Bearer TOKEN" }
});

const table = new Table({
    inColumns: columns,
    inDataProvider: dataProvider,
    inTargetContainerId: "table-container"
});

await table.load();
await table.createRecord({ inItem: { item: "New Item", amount: 100 } });
```

### ❌ HOW-NOT-TO: Avoid Hardcoded Fetch in UI Events
```javascript
// DON'T hardcode endpoint URLs and auth headers directly inside DOM click handlers!
// Use createDataProvider to cleanly separate network operations from presentation.
```

See [docs/how-to.md](docs/how-to.md) and [docs/how-not-to.md](docs/how-not-to.md) for comprehensive deep-dives.

---

## 📦 Component Summary

| Component | Purpose | Key Methods |
| :--- | :--- | :--- |
| **`Table`** | High-performance data tables with auto serials, aggregate summaries, formula rows, and surgical repainting. | `.render()`, `.repaintBody()`, `.repaintFoot()`, `.refreshTable()`, `.setTheme()`, `.load()`, `.createRecord()` |
| **`Form`** | Schema-driven filter and entry form generation with control-tree tracking. | `.render()`, `.getControlsTree()`, `.setTheme()` |
| **`DataList`** | Profiles column values, computes frequency counts, and renders HTML5 `<datalist>` elements. | `.render()`, `.update({ inData })`, `.setTheme()`, `.load()` |
| **`createDataProvider`** | REST CRUD repository adapter pattern decoupling endpoints, auth headers, and path params from UI. | `.read()`, `.create()`, `.update()`, `.delete()` |

Full method signatures and configurations are available in [docs/api-reference.md](docs/api-reference.md).

---

## 🛠 Project Structure

```
json-to-dom-renderers/
├── docs/                             # GitHub Pages publication & Documentation
│   ├── dist/                         # Minified production ESM bundles
│   │   ├── v9/min.js
│   │   ├── v10/min.js
│   │   └── v11/min.js
│   ├── architecture.md               # Screaming architecture deep-dive
│   ├── how-to.md                     # Step-by-step recipes and guides
│   ├── how-not-to.md                 # Anti-patterns and common pitfalls
│   ├── api-reference.md              # Exhaustive API reference
│   ├── index.html                    # Interactive Documentation & Live Demo
│   └── sampleData.js                 # Sample datasets and schemas
├── samples/
│   └── hybrid/v2/                    # Standalone hybrid sample
├── src/v11/                          # Current active source architecture
│   ├── common/                       # Utilities (pruneTreeWithIds, etc.)
│   ├── datalist/                     # DataList component
│   ├── form/                         # Form component
│   ├── provider/                     # DataProvider factory (v11)
│   ├── table/                        # Table component
│   └── index.js                      # Main ESM entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🏗 Development & Build

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle to docs/dist/v11/min.js
npm run build
```

---

## 📄 License

This project is licensed under the **ISC License**. Developed by [KeshavSoft](https://github.com/keshavsoft).
