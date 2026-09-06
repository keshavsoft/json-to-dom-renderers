# json-to-dom-renderers (v13)

Modular UI Renderers (`Table`, `Form`, `DataList`) built on top of `json-to-dom`, with built-in runtime guards and diagnostic error reporting.

---

## What's New in v13 (Defensive Runtime Guards)

In previous versions, missing HTML containers or mismatched column configurations could cause silent failures or unhandled runtime exceptions (`TypeError: Cannot read properties of null (reading 'element')`).

`v13` introduces defensive guards across all core renderers:

### 1. DOM Target Container Guards (`Form` & `Table`)
- **Problem Prevented**: If `targetContainerId` (e.g. `#filter-container` or `#table-container`) was not present in the HTML, `render()` returned `null`, causing subsequent chained accesses like `fromForm.element` to crash with a fatal `TypeError`.
- **v13 Behavior**:
  - Emits a clear, actionable error in the browser console:
    ```
    [json-to-dom-renderers:Form] Target container "#filter-container" was not found in the DOM.
    ```
  - Returns a safe object `{ element: null, treeWithIds: null, spec: null, error: "..." }` instead of `null`, preventing code from crashing.

### 2. Auto-Recovery Container Guard (`DataList`)
- **Problem Prevented**: If `#datalist-container` is omitted in the HTML, autocomplete datalists could fail to mount.
- **v13 Behavior**:
  - Warns that the container was not found, automatically creates the `<div>` container, and appends it to `document.body` so datalist autocompletes continue working seamlessly.

### 3. Column Catalog vs Config Validation Guard (`SourceStore`)
- **Problem Prevented**: When configuration files (`table/config.json`, `search/config.json`, `datalist/config.json`) specify column keys that do not exist in `columns.json` (e.g., copied from another project), renderers silently produced empty columns or no inputs without explaining why.
- **v13 Behavior**:
  - `_resolveActiveColumns` checks all requested keys against the catalog.
  - If any key is missing, it logs:
    ```
    [json-to-dom-renderers] Warning: Config requested columns ["orderId", "CustomerMobile"] that do not exist in the columns catalog.
    ```

### 4. DataProvider Resiliency Guards (`Table.load` & `DataList.load`)
- **Problem Prevented**: Network errors or HTTP 404/500 responses from API endpoints caused unhandled promise rejections.
- **v13 Behavior**:
  - Wrapped in defensive `try/catch` blocks.
  - Logs a diagnostic error and safely falls back to existing store data without corrupting application state.

---

## Quick Usage

```javascript
import { Table, Form, DataList, createDataProvider } from "./src/v13/index.js";

const dataProvider = createDataProvider({
    inReadUrl: "/api/data",
    inCreateUrl: "/api/data"
});

const table = new Table({
    theme: "default",
    columns,
    config: tableConfig,
    dataProvider,
    targetContainerId: "table-container"
});

await table.load();
```
