# 📚 API Reference

Exhaustive API documentation for `json-to-dom-renderers` (v11.0.0).

> [!NOTE]
> All constructors and methods accept a single configuration object with `in`-prefixed keys and support clean destructuring.

---

## 📑 Contents
1. [`Table`](#1-table)
2. [`Form`](#2-form)
3. [`DataList`](#3-datalist)
4. [`createDataProvider`](#4-createdataprovider)
5. [Configuration & Schema Specifications](#5-configuration--schema-specifications)

---

## 1. `Table`

Orchestrates rendering, state storage, dynamic footer calculations, and surgical repainting for tabular datasets.

### Import
```javascript
import { Table } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";
```

### Constructor Options
```javascript
const table = new Table({
    inData: [],               // Array of row record objects (default: [])
    inColumns: [],            // Array of column schema objects (default: [])
    inConfig: {},             // Table display and calculation configuration (default: {})
    inTheme: "default",       // "default" | "light" | "extraLight" | "dark" | "extraDark"
    inClasses: {},            // Optional Bootstrap class overrides
    inDataProvider: null,     // Optional DataProvider instance created via createDataProvider()
    inTargetContainerId: "table-container" // Target DOM element ID
});
```

### Public Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `render()` | None | `{ treeWithIds, spec, element }` | Compiles JSON spec and mounts `<table>` into target container. |
| `repaintBody()` | None | `void` | Fast-path surgical replacement of `<tbody>` rows only. |
| `repaintFoot()` | None | `void` | Fast-path recalculation and replacement of `<tfoot>` rows only. |
| `refreshTable()` | None | `void` | Synchronizes both body and footers without rebuilding `<thead>`. |
| `setTheme({ inTheme })` | `inTheme`: string | `object` | Switches theme (`default`, `light`, `dark`, etc.) and re-renders. |
| `filterStateData({ inQuery })` | `inQuery`: string \| object | `void` | Filters active working set by key-value query and updates body/footers. |
| `filterOriginalData({ inQuery })` | `inQuery`: string \| object | `void` | Filters against original baseline dataset. |
| `update({ inData })` | `inData`: Array | `object` | Updates store data and executes full re-render. |
| `load({ inQuery })` | `inQuery`: object (optional) | `Promise<Array>` | Loads records via `dataProvider.read()`, updates store, and renders. |
| `createRecord({ inItem })` | `inItem`: object | `Promise<any>` | Creates record via `dataProvider.create()`, reloads data, and renders. |
| `updateRecord({ inId, inItem })` | `inId`: any, `inItem`: object | `Promise<any>` | Updates record via `dataProvider.update()`, reloads data, and renders. |
| `deleteRecord({ inId })` | `inId`: any | `Promise<any>` | Deletes record via `dataProvider.delete()`, reloads data, and renders. |
| `getControlsTree()` | None | `object` | Returns indexed tree of interactive elements having assigned IDs. |

### Properties
- `table.store`: Direct access to `TableStore` instance (`table.store.stateData`, `table.store.originalData`, `table.store.activeColumns`, `table.store.computedFooter`).
- `table.tableElement`: Reference to the mounted `HTMLTableElement`.
- `table.theme`: Currently active theme string.

---

## 2. `Form`

Generates config-driven filter and entry forms matching column schemas with automatic datalist bindings and control-tree tracking.

### Import
```javascript
import { Form } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";
```

### Constructor Options
```javascript
const form = new Form({
    inColumns: [],            // Array of column schema objects (default: [])
    inConfig: {},             // Form layout configuration (body.columns)
    inTheme: "default",       // "default" | "light" | "extraLight" | "dark" | "extraDark"
    inClasses: {},            // Optional Bootstrap class overrides
    inTargetContainerId: "form-container" // Target DOM element ID
});
```

### Public Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `render()` | None | `{ treeWithIds, spec, element }` | Compiles JSON spec and mounts form into target container. |
| `setTheme({ inTheme })` | `inTheme`: string | `object` | Updates active theme and re-renders form. |
| `getControlsTree()` | None | `object` | Returns indexed tree of form inputs, buttons, and datalist references. |

---

## 3. `DataList`

Analyzes dataset columns, profiles item frequencies (e.g. `ROPE (3)`), and generates native HTML5 `<datalist>` elements for autocomplete inputs.

### Import
```javascript
import { DataList } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";
```

### Constructor Options
```javascript
const dataList = new DataList({
    inData: [],               // Dataset records to profile
    inColumns: [],            // Array of column schema objects
    inConfig: {},             // { datalist: { columns: [] }, topN: 10 }
    inTheme: "default",       // "default" | "light" | "extraLight" | "dark" | "extraDark"
    inClasses: {},            // Optional class overrides
    inDataProvider: null,     // Optional DataProvider instance
    inTargetContainerId: "datalist-container" // Target DOM element ID
});
```

### Public Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `render()` | None | `{ treeWithIds, spec, element }` | Compiles and mounts `<datalist>` tags into container. |
| `update({ inData })` | `inData`: Array | `object` | Recalculates frequency counts with new data and updates options. |
| `setTheme({ inTheme })` | `inTheme`: string | `object` | Updates active theme and re-renders datalist elements. |
| `load({ inQuery })` | `inQuery`: object (optional) | `Promise<Array>` | Loads records via `dataProvider.read()` and updates options. |

---

## 4. `createDataProvider`

Decoupled REST CRUD repository adapter that manages endpoint URLs, headers, path params, and async serialization.

### Import
```javascript
import { createDataProvider } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";
```

### Factory Parameters
```javascript
const dataProvider = createDataProvider({
    inBaseUrl: "",            // Fallback base URL for all operations
    inReadUrl: "",            // GET endpoint for reading records
    inCreateUrl: "",          // POST endpoint for creating a record
    inUpdateUrl: "",          // PUT endpoint (supports :id parameter)
    inDeleteUrl: "",          // DELETE endpoint (supports :id parameter)
    inHeaders: {},            // Default headers (e.g. Authorization, X-API-Key)
    inFetchOptions: {},       // Additional fetch options (e.g. mode, credentials)
    inCustom: {               // Optional custom async function overrides
        read: async ({ inQuery }) => { ... },
        create: async ({ inItem }) => { ... },
        update: async ({ inId, inItem }) => { ... },
        delete: async ({ inId }) => { ... }
    }
});
```

### Provider Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `read({ inQuery, inUrl })` | `inQuery`: object, `inUrl`: string | `Promise<Array>` | Executes `GET` request with query parameters. |
| `create({ inItem, inUrl })` | `inItem`: object, `inUrl`: string | `Promise<any>` | Executes `POST` request with serialized JSON body. |
| `update({ inId, inItem, inUrl })` | `inId`: any, `inItem`: object, `inUrl`: string | `Promise<any>` | Executes `PUT` replacing `:id` in URL with encoded ID. |
| `delete({ inId, inUrl })` | `inId`: any, `inUrl`: string | `Promise<any>` | Executes `DELETE` replacing `:id` in URL with encoded ID. |

---

## 5. Configuration & Schema Specifications

### `columns.json` Schema
```json
[
  {
    "key": "stockitemname",
    "label": "Stock Item Name",
    "type": "string",
    "align": "left"
  },
  {
    "key": "amount",
    "label": "Amount",
    "type": "number",
    "align": "right"
  }
]
```

### `config.json` for `Table`
```json
{
  "serial": true,
  "head": {
    "columns": ["stockitemname", "amount"]
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

### `config.json` for `Form`
```json
{
  "body": {
    "columns": ["stockitemname", "batchname"]
  }
}
```

### `config.json` for `DataList`
```json
{
  "datalist": {
    "columns": ["stockitemname", "batchname"]
  },
  "topN": 10
}
```
