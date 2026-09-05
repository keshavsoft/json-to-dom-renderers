# 🏛 Architecture & Design System

`json-to-dom-renderers` is designed around a **Screaming Architecture** and a strictly unidirectional, declarative data flow. It bridges high-level JSON data and configurations to the low-level native DOM with zero Virtual DOM overhead, achieving near-instant repaints and predictable state management.

---

## 📐 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      1. Configuration & Data Layer                      │
│      columns.json  │  data.json  │  config.json  │  classes.json        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       2. State Stores Layer                             │
│       TableStore        │       FormStore       │     DataListStore     │
│   - originalData / state │   - activeColumns     │   - frequency map     │
│   - activeColumns        │   - field controls    │   - topN limiting     │
│   - footer aggregates    │                       │                       │
│   - formula evaluations  │                       │                       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         3. Builders Layer                               │
│       buildTable        │       buildForm       │     buildDataList     │
│            Pure declarative JSON element specification tree             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      4. json-to-dom Engine                              │
│              window.ks["json-to-dom"].buildSpecElement                  │
│                     (Compiles JSON Spec -> Real DOM)                     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      5. Native DOM & Repainters                         │
│   Fast-path updates: repaintBody() │ repaintFoot() │ refreshTable()     │
│             Interactive Controls Tree: pruneTreeWithIds()               │
└─────────────────────────────────────────────────────────────────────────┘
                                     ▲
                                     │
┌────────────────────────────────────┴────────────────────────────────────┐
│                  6. DataProvider Adapter Layer (v11)                    │
│   Decoupled async REST CRUD: read() │ create() │ update() │ delete()   │
│              (Zero authentication/fetch coupling in UI)                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🧱 The Core Layers Explained

### 1. Configuration & Data Layer
Everything in `json-to-dom-renderers` is driven by declarative schemas:
- **`columns.json`**: The single source of truth for fields. Defines data keys, human labels, data types (`number`, `string`, `date`), alignments (`left`, `center`, `right`), formatters, and metadata.
- **`config.json`**: Controls presentation and behavior. Specifies which columns appear in the table head, which fields appear in filter forms, whether serial row numbering is enabled, and complex footer calculations.
- **`classes.json`**: Standardized Bootstrap 5 utility classes cataloged by theme (`default`, `light`, `extraLight`, `dark`, `extraDark`).
- **`data.json`**: Array of plain JavaScript record objects.

---

### 2. State Stores Layer
Components do not store raw state in DOM attributes. Instead, each renderer is backed by an isolated Store:
- **`TableStore`**:
  - Maintains `originalData` (immutable baseline) and `stateData` (actively filtered/sorted working set).
  - Resolves `activeColumns` based on `config.head.columns`.
  - Computes multi-tiered footer summaries:
    - **Aggregate Rows**: Calculates `"sum"`, `"count"`, or `"avg"` across active rows.
    - **Evaluated Formula Rows**: Dynamically evaluates mathematical expressions referencing other footer rows (e.g. `summaryRow.amount * 0.18`).
- **`FormStore`**:
  - Validates and stores the active field inputs defined in `config.body.columns`.
  - Resolves placeholder labels and control attributes from the column definitions.
- **`DataListStore`**:
  - Computes frequency distributions across dataset values.
  - Automatically appends count badges (e.g. `ROPE (3)`).
  - Enforces `topN` caps to prevent DOM bloating with massive datasets.

---

### 3. Builders Layer
Builders are pure functional transformers. They take store state and return a structured JSON specification tree (`inSpec`).
- Builders **never** touch `document.createElement`, `innerHTML`, or DOM APIs.
- They generate declarative node specifications:
  ```javascript
  {
      tagName: "table",
      classList: ["table", "table-hover", "table-striped"],
      children: [
          { tagName: "thead", children: [...] },
          { tagName: "tbody", children: [...] },
          { tagName: "tfoot", children: [...] }
      ]
  }
  ```
- This ensures 100% testability, easy serialization, and full environment independence.

---

### 4. `json-to-dom` Engine Layer
The engine receives the specification tree from the Builder and instantiates native browser DOM elements in a single high-efficiency pass.
- Eliminates the memory and diffing overhead of virtual DOM libraries (like React or Vue).
- Returns either a single root `HTMLElement` or a `DocumentFragment`.

---

### 5. Surgical Repainters & Controls Tree
Instead of re-parsing and re-rendering the entire component when data changes:
- **`repaintBody`**: Selectively updates only the `<tbody>` DOM elements using cached column configurations and active records.
- **`repaintFoot`**: Recalculates aggregates/formulas and replaces only `<tfoot>` rows in place.
- **`refreshTable`**: Synchronizes both body and footer without recreating header structures.
- **`pruneTreeWithIds`**: Traverses the specification tree to extract an indexed lookup table of all interactive elements with IDs, making event-listener wiring frictionless.

---

### 6. DataProvider Adapter Layer (v11)
The `createDataProvider` factory abstracts REST networking away from the rendering logic:
- Encapsulates endpoint URLs (`readUrl`, `createUrl`, `updateUrl`, `deleteUrl`), HTTP headers (e.g. `Authorization: Bearer ...`), query serialization, and `:id` path param substitution.
- Allows renderers to perform asynchronous data operations via simple semantic methods:
  ```javascript
  await table.load();
  await table.createRecord({ inItem: newRecord });
  await table.updateRecord({ inId: 42, inItem: updatedRecord });
  await table.deleteRecord({ inId: 42 });
  ```
- Keeps UI renderers pure, portable, and completely agnostic of backend endpoints and authentication mechanics.

---

## 🎨 Cascading Theming Architecture

Themes are configured via nested JSON class maps (`classes.json`):

```json
{
  "default": {
    "table": "table table-striped table-hover align-middle",
    "thead": "table-light border-bottom",
    "tfoot": "table-light border-top fw-bold"
  },
  "dark": {
    "table": "table table-dark table-striped table-hover align-middle",
    "thead": "table-dark border-secondary",
    "tfoot": "table-dark border-secondary fw-bold"
  }
}
```

Components expose a dynamic `.setTheme({ inTheme })` method:
1. Looks up the requested theme key in the component's `classes.json`.
2. Merges with instance-level overrides passed in `inClasses`.
3. Performs a seamless repaint, applying new theme classes instantly without losing component state.

---

## 🛡 Parameter Naming Convention: `in` and `local`

All functions, constructors, and methods across `json-to-dom-renderers` follow a strict parameter naming rule:
1. **Object Destructuring for Inputs:** Functions accept a single object with `in`-prefixed keys (e.g., `{ inData, inColumns, inConfig }`).
2. **Immediate Assignment to `local` Variables:** At the very top of the function body, each `in*` property is mapped to a `local*` variable (e.g., `const localData = inData;`).
3. **Execution Exclusively with `local`:** Only `local*` variables are referenced throughout the remaining logic.

This guarantees clear boundaries, protects against accidental mutation of inputs, and makes variable origin instantly recognizable.
