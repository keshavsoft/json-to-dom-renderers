# 🏛 Architecture & Design System: The Story of Two Worlds

> **"What exactly is `json-to-dom-renderers` doing?"**  
> If `json-to-dom` converts JSON to DOM, is `json-to-dom-renderers` just JSON-to-JSON?  
> **Yes, exactly!** `json-to-dom-renderers` is the **High-Level Business State & JSON-to-JSON Transformation Engine**, while `json-to-dom` is the **Low-Level Native DOM Compiler**. Together, they form a complete declarative UI ecosystem.

---

## 📖 The Story: Two Worlds, Two Libraries

Modern web applications constantly struggle with the boundary between application state (data, columns, business rules, API queries) and the physical browser DOM (nodes, layout, event listeners).

Most frameworks (like React or Vue) solve this by creating an in-memory Virtual DOM tree, running expensive diffing algorithms on every tick, and managing huge runtime runtimes.

KeshavSoft splits this problem cleanly into **Two Specialized Worlds** handled by **Two Dedicated Libraries**:

```
 ┌──────────────────────────────────────────────────────────────────────────────────┐
 │                                THE JSON WORLD                                    │
 │                     (Managed by json-to-dom-renderers)                           │
 │                                                                                  │
 │   Application Data ───►  State Stores  ───►  Calculations  ───►  JSON Element    │
 │   (columns, rows,         (TableStore,        (aggregates,        Specification  │
 │    configs, themes)        FormStore)          eval formulas)     Tree (inSpec)  │
 └────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
                        THE ARCHITECTURAL BOUNDARY
                                          │
                        window.ks["json-to-dom"].buildSpecElement({ inSpec })
                                          │
 ┌────────────────────────────────────────▼─────────────────────────────────────────┐
 │                                 THE DOM WORLD                                    │
 │                           (Managed by json-to-dom)                               │
 │                                                                                  │
 │   Recursive DOM Builder ───► Native DOM Elements ───► Surgical Repainters        │
 │   (pure DOM APIs:            (<table>, <form>,        (repaintBody, repaintFoot) │
 │    createElement, attrs)      <datalist>)                                        │
 └──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 The Two Libraries Explained

| Library | Role | Input | Output | What it Cares About |
| :--- | :--- | :--- | :--- | :--- |
| **`json-to-dom-renderers`**<br>*(High-Level Component Engine)* | **JSON-to-JSON Transformer & State Coordinator** | Business Data (`data.json`), Column Schemas (`columns.json`), Display Configs (`config.json`), Theme Catalogs (`classes.json`), REST Endpoints | Declarative Element Specification JSON (`inSpec`) | Tables, serial numbering, multi-tier footer aggregates (`sum`), formula evaluations (`amount * 0.18`), autocomplete frequency profiling, REST CRUD lifecycle. |
| **`json-to-dom`**<br>*(Low-Level Compiler)* | **JSON-to-DOM Compiler** | Declarative Element Specification JSON (`inSpec`) | Native Browser DOM Elements (`HTMLElement` / `DocumentFragment`) | HTML tag creation, class list assignments, DOM attributes, native event listeners. Zero knowledge of tables, columns, or business rules. |

> [!TIP]
> **Why this separation matters**:  
> Because `json-to-dom-renderers` works almost entirely in the **JSON World**, your tables, forms, and calculations can be tested in Node.js without JSDOM, serialized, cached, sent over WebSockets, or transformed by pipeline tasks before a single browser DOM node is ever created!

---

## 🔄 The Complete End-to-End Pipeline

Here is the exact step-by-step journey from raw data to pixels on screen:

```text
1. REST API / Local Array
       │
       ▼
2. DataProvider (v11/v12)
       │ Fetches JSON records via read() with auth headers & query params
       ▼
3. Component Store Layer
   ┌──────────────────────────────────────────────────────────────┐
   │ TableStore / FormStore / DataListStore                       │
   │  - Ingests inData, inColumns, inConfig                       │
   │  - Resolves active visible columns                           │
   │  - Computes multi-tier footers (aggregates + eval formulas)  │
   │  - Profiles datalist item frequencies & applies top-N caps   │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
4. JSON-to-JSON Builders Layer (Pure Spec Generation)
   ┌──────────────────────────────────────────────────────────────┐
   │ buildTable / buildForm / buildDataList                       │
   │  - Generates the "God Spec" / Element Spec tree              │
   │  - Maps theme classes from classes.json                      │
   │  - Attaches unique element IDs for interactive controls      │
   │  - NO document.createElement. NO innerHTML. 100% Pure JSON!  │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
                     [CROSSING THE BOUNDARY]
          window.ks["json-to-dom"].buildSpecElement({ inSpec })
                                  │
                                  ▼
5. json-to-dom Engine (The Compiler)
   ┌──────────────────────────────────────────────────────────────┐
   │ Recursively compiles JSON spec into physical DOM tree        │
   │ Produces native <table>, <thead>, <tbody>, <tfoot> elements  │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
6. Controls Tree & Event Wiring
   ┌──────────────────────────────────────────────────────────────┐
   │ pruneTreeWithIds({ inSpec })                                 │
   │ Extracts indexed lookup table of input IDs and button IDs    │
   │ Allows friction-free event listener binding                  │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
7. Surgical Repainting Loop
   ┌──────────────────────────────────────────────────────────────┐
   │ User types in Form Filter or DataProvider updates:           │
   │  - TableStore updates stateData in-memory                    │
   │  - repaintBody() transforms ONLY row JSON -> compiles tbody  │
   │  - repaintFoot() recalculates totals JSON -> compiles tfoot  │
   │  - Existing table, headers, and inputs remain UNTOUCHED!     │
   └──────────────────────────────────────────────────────────────┘
```

---

## 🔍 Peek Behind the Curtain: What the JSON Spec Looks Like

To see that `json-to-dom-renderers` is truly a **JSON-to-JSON** transformer, look at what `buildTable()` produces before `json-to-dom` compiles it:

```json
{
  "tagName": "table",
  "classList": ["table", "table-striped", "table-hover"],
  "children": [
    {
      "tagName": "thead",
      "children": [
        {
          "tagName": "tr",
          "children": [
            { "tagName": "th", "textContent": "#" },
            { "tagName": "th", "textContent": "Stock Item Name" },
            { "tagName": "th", "textContent": "Amount", "classList": ["text-end"] }
          ]
        }
      ]
    },
    {
      "tagName": "tbody",
      "children": [
        {
          "tagName": "tr",
          "children": [
            { "tagName": "td", "textContent": "1" },
            { "tagName": "td", "textContent": "ROPE 10MM" },
            { "tagName": "td", "textContent": "1,500.00", "classList": ["text-end"] }
          ]
        }
      ]
    },
    {
      "tagName": "tfoot",
      "children": [
        {
          "tagName": "tr",
          "classList": ["table-light", "fw-bold"],
          "children": [
            { "tagName": "td", "textContent": "Total", "attributes": { "colspan": "2" } },
            { "tagName": "td", "textContent": "1,500.00", "classList": ["text-end"] }
          ]
        }
      ]
    }
  ]
}
```

`json-to-dom` takes this exact JSON specification and turns it into native browser DOM elements in microseconds!

---

## 🎨 Cascading Theming: Spec Transformation, Not CSS Injection

Theming in `json-to-dom-renderers` is also a pure JSON transformation:
1. `classes.json` holds theme dictionaries (`default`, `light`, `extraLight`, `dark`, `extraDark`).
2. When `.setTheme({ inTheme })` is called:
   - The renderer merges the theme class dictionary into the specification tree.
   - It re-invokes `json-to-dom` for the target container.
   - The DOM receives updated Bootstrap classes without inline CSS or runtime stylesheet injection.

---

## 🛡 Parameter Naming Convention: `in` and `local`

All functions across both libraries follow KeshavSoft's parameter naming convention:
1. **Inputs:** Single configuration object with `in`-prefixed keys (`{ inData, inColumns, inConfig }`).
2. **Local Mapping:** Immediate assignment to `local`-prefixed variables at the top of the function (`const localData = inData;`).
3. **Execution:** Strictly using `local*` variables for all business logic.

This guarantees immutability boundaries, ensures input arguments are never accidentally mutated, and clarifies variable origins at a glance.

---

## 📚 External References

- [json-to-dom Repository](https://github.com/keshavsoft/json-to-dom)
- [json-to-dom Architecture & Pipeline Guide](https://keshavsoft.github.io/json-to-dom/architecture-and-pipeline.html)
- [json-to-dom Spec Schema Guide](https://keshavsoft.github.io/json-to-dom/spec-schema-and-guide.html)
- [json-to-dom Engine Standalone CDN](https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom/docs/dist/v3/min.js)
