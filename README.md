# json-to-dom-renderers

Modular, config-driven UI Renderers (**Table**, **Form**, **DataList**) built on top of [json-to-dom](https://github.com/keshavsoft/json-to-dom).

## Features
- **Pure DOM Generation**: Leverages the zero-dependency `json-to-dom` engine.
- **Config-Driven Styling**: 100% styled via Bootstrap 5 `classes.json` without hardcoded CSS.
- **Pure Orchestrators**: Concise, declarative state stores with Screaming Architecture.
- **HTML5 DataList**: Frequency-profiled autocomplete out-of-the-box.
- **Declarative Serials**: Built-in sequential numbering with footer alignment.

## Build
```bash
npm install
npm run build
```
Generates minified ESM bundles in `dist/`:
- `index.min.js` (all components)
- `table.min.js`
- `form.min.js`
- `datalist.min.js`
