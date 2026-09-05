class T {
  constructor({ inData: n = [], inColumns: t = [], inConfig: e = {}, inTopN: o } = {}) {
    const s = n, r = t, a = e, l = o;
    this.source = this._buildSource({
      inData: s,
      inColumns: r,
      inConfig: a,
      inTopN: l
    });
  }
  _buildSource({ inData: n = [], inColumns: t = [], inConfig: e = {}, inTopN: o } = {}) {
    const s = n, r = t, a = e, l = o;
    return {
      originalData: Array.isArray(s) ? typeof structuredClone == "function" ? structuredClone(s) : JSON.parse(JSON.stringify(s)) : [],
      columns: Array.isArray(r) ? r : [],
      config: a || {},
      topN: l
    };
  }
  _resolveActiveColumns({ inColumnsCatalog: n = [], inColumnKeys: t = [] } = {}) {
    const e = n, o = t;
    if (Array.isArray(o) && o.length > 0) {
      const s = new Map((Array.isArray(e) ? e : []).map((r) => [r.key, r]));
      return o.map((r) => s.get(r)).filter(Boolean);
    }
    return Array.isArray(e) ? e : [];
  }
  get rawData() {
    return this.source.originalData;
  }
  get config() {
    return this.source.config;
  }
}
const S = ({ inData: u = [] } = {}) => {
  const n = u;
  return Array.isArray(n) ? typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n)) : [];
}, $ = ({ inColumns: u = [], inData: n = [], inConfig: t = {}, inLabel: e } = {}) => {
  var p, b;
  const o = u, s = n, r = t, a = e;
  if (!!!(r != null && r.serial || (p = r == null ? void 0 : r.table) != null && p.serial || (b = r == null ? void 0 : r.head) != null && b.serial))
    return {
      columns: o,
      data: s,
      isSerialEnabled: !1
    };
  const i = {
    key: "serial",
    label: a || typeof (r == null ? void 0 : r.serial) == "object" && r.serial.label || "#",
    align: "center",
    isSerial: !0
  }, m = (Array.isArray(o) ? o : []).some((h) => h.key === "serial") ? o : [i, ...Array.isArray(o) ? o : []], f = (Array.isArray(s) ? s : []).map((h, y) => ({
    serial: y + 1,
    ...h || {}
  }));
  return {
    columns: m,
    data: f,
    isSerialEnabled: !0
  };
}, Q = ({ inData: u = [], inKey: n } = {}) => {
  const t = u, e = n;
  return !Array.isArray(t) || !e ? 0 : t.reduce((o, s) => {
    const r = Number(s == null ? void 0 : s[e]);
    return o + (isNaN(r) ? 0 : r);
  }, 0);
}, B = ({ inData: u = [] } = {}) => {
  const n = u;
  return Array.isArray(n) ? n.length : 0;
}, O = {
  sum: Q,
  count: B
}, K = ({ inExpression: u = "", inScope: n = {} } = {}) => {
  const t = u, e = n;
  try {
    const o = Object.keys(e), s = Object.values(e);
    return new Function(...o, `return ${t};`)(...s);
  } catch (o) {
    return console.error(`Error evaluating expression "${t}":`, o), 0;
  }
}, _ = ({ inRowConfig: u = {}, inData: n = [], inScope: t = {} } = {}) => {
  const e = u, o = n, s = t, r = e.id || "", a = e.title || "", l = e.type || "aggregate", c = e.values || {}, i = {};
  return l === "aggregate" ? Object.entries(c).forEach(([d, m]) => {
    const f = O[m];
    typeof f == "function" && (i[d] = f({ inData: o, inKey: d }));
  }) : l === "eval" && Object.entries(c).forEach(([d, m]) => {
    typeof m == "string" && (i[d] = K({
      inExpression: m,
      inScope: s
    }));
  }), {
    id: r,
    title: a,
    values: i
  };
}, F = ({ inData: u = [], inFooterConfig: n = [] } = {}) => {
  const t = u, e = n;
  if (!Array.isArray(e)) return [];
  const o = {}, s = [];
  return e.forEach((r) => {
    const a = _({
      inRowConfig: r,
      inData: t,
      inScope: o
    });
    r.id && (o[r.id] = a.values), s.push(a);
  }), s;
}, q = ({ inSource: u = {}, inResolveColumns: n } = {}) => {
  var l, c, i;
  const t = u, e = n, o = typeof e == "function" ? e({
    inColumnsCatalog: t == null ? void 0 : t.columns,
    inColumnKeys: (c = (l = t == null ? void 0 : t.config) == null ? void 0 : l.head) == null ? void 0 : c.columns
  }) : (t == null ? void 0 : t.columns) || [], s = S({
    inData: t == null ? void 0 : t.originalData
  }), r = $({
    inColumns: o,
    inData: s,
    inConfig: t == null ? void 0 : t.config
  }), a = F({
    inData: r.data,
    inFooterConfig: (i = t == null ? void 0 : t.config) == null ? void 0 : i.foot
  });
  return {
    activeColumns: r.columns,
    stateData: r.data,
    computedFooter: a,
    isSerialEnabled: r.isSerialEnabled
  };
}, M = ({ inQuery: u = "", inActiveColumns: n = [] } = {}) => {
  const t = u, e = n, o = new Set(
    (Array.isArray(e) ? e : []).map((s) => typeof s == "object" && s !== null ? s.key : s).filter(Boolean)
  );
  if (typeof t == "object" && t !== null) {
    if (t.type === "string")
      return {
        type: "string",
        value: String(t.value ?? "").trim().toLowerCase()
      };
    const s = t.type === "object" && typeof t.value == "object" && t.value !== null ? t.value : t, r = {};
    for (const [a, l] of Object.entries(s))
      if (o.has(a) && l !== void 0 && l !== null) {
        const c = String(l).trim().toLowerCase();
        c !== "" && (r[a] = c);
      }
    return {
      type: "object",
      value: r
    };
  }
  return {
    type: "string",
    value: String(t ?? "").trim().toLowerCase()
  };
}, V = ({ inData: u = [], inQueryObject: n = {}, inActiveColumns: t = [] } = {}) => {
  const e = u, o = n, s = t;
  if (!Array.isArray(e)) return [];
  const r = o == null ? void 0 : o.type, a = o == null ? void 0 : o.value, l = Array.isArray(s) && s.length > 0 ? s.map((i) => typeof i == "object" && i !== null ? i.key : i).filter(Boolean) : null;
  if (r === "object") {
    const d = Object.entries(typeof a == "object" && a !== null ? a : {});
    return d.length === 0 ? [...e] : e.filter((m) => !m || typeof m != "object" ? !1 : d.every(([f, p]) => {
      const b = m[f];
      return b == null ? !1 : String(b).toLowerCase().includes(p);
    }));
  }
  const c = typeof a == "string" ? a : String(o ?? "").trim().toLowerCase();
  return c ? e.filter((i) => !i || typeof i != "object" ? !1 : (l ? l.map((m) => i[m]) : Object.values(i)).some((m) => m == null ? !1 : String(m).toLowerCase().includes(c))) : [...e];
}, W = ({ inData: u = [], inIsEnabled: n = !1 } = {}) => {
  const t = u;
  return !n || !Array.isArray(t) ? t : t.map((o, s) => ({
    ...o,
    serial: s + 1
  }));
}, N = ({ inStore: u, inData: n = [], inQuery: t = "" } = {}) => {
  var f;
  const e = u, o = n, s = t, r = e.library.activeColumns, a = e.library.isSerialEnabled, l = (f = e.source.config) == null ? void 0 : f.foot, c = M({
    inQuery: s,
    inActiveColumns: r
  }), i = V({
    inData: o,
    inQueryObject: c,
    inActiveColumns: r
  }), d = W({
    inData: i,
    inIsEnabled: a
  }), m = F({
    inData: d,
    inFooterConfig: l
  });
  return e.library.stateData = d, e.library.computedFooter = m, {
    activeColumns: e.library.activeColumns,
    stateData: e.library.stateData,
    computedFooter: e.library.computedFooter
  };
};
class J extends T {
  constructor({ inData: n = [], inColumns: t = [], inConfig: e = {} } = {}) {
    const o = n, s = t, r = e;
    super({
      inData: o,
      inColumns: s,
      inConfig: r
    }), this.library = q({
      inSource: this.source,
      inResolveColumns: this._resolveActiveColumns.bind(this)
    });
  }
  get stateData() {
    return this.library.stateData;
  }
  get activeColumns() {
    return this.library.activeColumns;
  }
  get computedFooter() {
    return this.library.computedFooter;
  }
  filterOriginalData({ inQuery: n = "" } = {}) {
    const t = n;
    return N({
      inStore: this,
      inData: this.source.originalData,
      inQuery: t
    });
  }
  filterStateData({ inQuery: n = "" } = {}) {
    const t = n;
    return N({
      inStore: this,
      inData: this.library.stateData,
      inQuery: t
    });
  }
  filter({ inQuery: n = "" } = {}) {
    const t = n;
    return this.filterOriginalData({ inQuery: t });
  }
}
const E = ({
  inCellTagName: u = "td",
  inCells: n = [],
  inRowClass: t = "",
  inCellClass: e = ""
} = {}) => {
  const o = u, s = n, r = t, a = e;
  return {
    tagName: "tr",
    attributes: r ? { class: r } : {},
    children: s.map((l) => {
      const c = String(typeof l == "object" ? l.textContent ?? "" : l ?? ""), i = typeof l == "object" && l.class !== void 0 ? l.class : a, d = typeof l == "object" ? l.align : "", f = [i, d === "right" ? "text-end" : d === "center" ? "text-center" : ""].filter(Boolean).join(" ").trim(), p = f ? { class: f } : {};
      return typeof l == "object" && l.id && (p.id = l.id), {
        tagName: o,
        textContent: c,
        attributes: p
      };
    })
  };
}, H = ({ inColumns: u = [], inClasses: n = {} } = {}) => {
  const t = u, e = n, o = t.map((a) => ({
    textContent: a.label,
    align: a.align,
    id: a.id
  })), s = E({
    inCellTagName: "th",
    inCells: o,
    inCellClass: (e == null ? void 0 : e.th) || "",
    inRowClass: (e == null ? void 0 : e.tr) || ""
  });
  return {
    tagName: "thead",
    attributes: e != null && e.thead ? { class: e.thead } : {},
    children: [s]
  };
}, j = ({ inColumns: u = [], inData: n = [], inRowConfig: t = {}, inClasses: e = {} } = {}) => {
  const o = u, s = n, r = e;
  if (!Array.isArray(s) || s.length === 0) {
    const c = {
      tagName: "tr",
      children: [{
        tagName: "td",
        textContent: "No matching records found",
        attributes: {
          colspan: String(o.length),
          class: "text-center text-muted fst-italic py-4"
        }
      }]
    };
    return {
      tagName: "tbody",
      attributes: r != null && r.tbody ? { class: r.tbody } : {},
      children: [c]
    };
  }
  const a = s.map((c) => {
    const i = o.map((d) => ({
      textContent: d.key === "amount" ? Number(c[d.key]).toFixed(2) : String(c[d.key] ?? ""),
      align: d.align
    }));
    return E({
      inCellTagName: "td",
      inCells: i,
      inRowClass: (r == null ? void 0 : r.tr) || "",
      inCellClass: (r == null ? void 0 : r.td) || ""
    });
  });
  return {
    tagName: "tbody",
    attributes: r != null && r.tbody ? { class: r.tbody } : {},
    children: a
  };
}, I = ({ inColumns: u = [], inComputedFooter: n = [], inClasses: t = {} } = {}) => {
  const e = u, o = n, s = t;
  if (!Array.isArray(o) || o.length === 0)
    return null;
  const r = o.map((l, c) => {
    const i = l.title || "", d = l.values || {}, m = c === o.length - 1, f = e.findIndex((b) => !b.isSerial), p = e.map((b, h) => {
      if (d[b.key] !== void 0) {
        const y = d[b.key];
        return {
          textContent: typeof y == "number" ? y.toFixed(2) : String(y),
          align: b.align || "right",
          class: m ? "fw-bold" : "fw-semibold"
        };
      }
      return h === f ? {
        textContent: i,
        class: m ? "fw-bold text-uppercase" : "fw-semibold text-uppercase"
      } : {
        textContent: "",
        class: ""
      };
    });
    return E({
      inCellTagName: "td",
      inCells: p,
      inRowClass: m ? "table-light" : (s == null ? void 0 : s.tr) || "",
      inCellClass: (s == null ? void 0 : s.td) || ""
    });
  });
  return {
    tagName: "tfoot",
    attributes: s != null && s.tfoot ? { class: s.tfoot } : {},
    children: r
  };
}, z = ({ inColumns: u = [], inData: n = [], inComputedFooter: t = [], inRowConfig: e = {}, inClasses: o = {} } = {}) => {
  const s = u, r = n, a = t, l = e, c = o, i = H({ inColumns: s, inClasses: c }), d = j({ inColumns: s, inData: r, inRowConfig: l, inClasses: c }), m = I({ inColumns: s, inComputedFooter: a, inClasses: c });
  return {
    tagName: "table",
    attributes: c != null && c.table ? { class: c.table } : {},
    children: [i, d, m].filter(Boolean)
  };
}, v = ({ inSpec: u } = {}) => {
  var l, c, i;
  const n = u;
  if (!n || typeof n != "object") return null;
  if (Array.isArray(n)) {
    const d = n.map((m) => v({ inSpec: m })).filter(Boolean);
    return d.length > 0 ? d : null;
  }
  const e = (Array.isArray(n.children) ? n.children : []).map((d) => v({ inSpec: d })).filter(Boolean), o = ((l = n.attributes) == null ? void 0 : l.id) || n.id, s = !!o, r = e.length > 0;
  if (!s && !r)
    return null;
  const a = {
    tagName: n.tagName
  };
  return o && (a.id = o), (c = n.attributes) != null && c.name && (a.name = n.attributes.name), (i = n.attributes) != null && i.type && (a.type = n.attributes.type), n.attributes && (a.attributes = n.attributes), e.length > 0 && (a.children = e), a;
}, L = ({ inTableElement: u, inColumns: n = [], inData: t = [], inRowConfig: e = {}, inClasses: o = {} } = {}) => {
  var p, b;
  const s = u, r = n, a = t, l = e, c = o;
  if (!s) return;
  const i = j({
    inColumns: r,
    inData: a,
    inRowConfig: l,
    inClasses: c
  }), d = (b = (p = window.ks) == null ? void 0 : p["json-to-dom"]) == null ? void 0 : b.buildSpecElement;
  if (typeof d != "function") return;
  const m = d({ inSpec: i }), f = s.querySelector("tbody");
  f && m && f.replaceWith(m);
}, R = ({ inTableElement: u, inColumns: n = [], inComputedFooter: t = [], inClasses: e = {} } = {}) => {
  var m, f;
  const o = u, s = n, r = t, a = e;
  if (!o) return;
  const l = I({
    inColumns: s,
    inComputedFooter: r,
    inClasses: a
  }), c = (f = (m = window.ks) == null ? void 0 : m["json-to-dom"]) == null ? void 0 : f.buildSpecElement;
  if (typeof c != "function") return;
  const i = l ? c({ inSpec: l }) : null, d = o.querySelector("tfoot");
  d && i ? d.replaceWith(i) : d && !i ? d.remove() : !d && i && o.appendChild(i);
}, k = ({ inTableElement: u, inStore: n } = {}) => {
  var o;
  const t = u, e = n;
  !t || !e || (L({
    inTableElement: t,
    inColumns: e.activeColumns,
    inData: e.stateData,
    inRowConfig: (o = e.config) == null ? void 0 : o.row
  }), R({
    inTableElement: t,
    inColumns: e.activeColumns,
    inComputedFooter: e.computedFooter
  }));
}, P = ({ inTable: u, inQuery: n = "" } = {}) => {
  const t = u, e = n;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterOriginalData({ inQuery: e }), k({
    inTableElement: t.tableElement,
    inStore: t.store
  }));
}, G = ({ inTable: u, inQuery: n = "" } = {}) => {
  const t = u, e = n;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterStateData({ inQuery: e }), k({
    inTableElement: t.tableElement,
    inStore: t.store
  }));
}, U = {
  table: "table table-hover table-striped table-sm align-middle",
  thead: "table-light",
  th: "text-uppercase fw-semibold text-secondary",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "table-group-divider fw-bold"
}, X = {
  table: "table table-borderless table-hover table-sm align-middle",
  thead: "border-bottom",
  th: "text-muted small text-uppercase",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "border-top text-secondary fw-bold"
}, Y = {
  table: "table table-dark table-hover table-striped table-sm align-middle",
  thead: "table-dark",
  th: "text-uppercase fw-semibold",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "table-group-divider fw-bold border-secondary"
}, Z = {
  table: "table table-dark table-striped-columns table-sm align-middle border-secondary",
  thead: "table-active",
  th: "text-uppercase fw-bold text-light",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "table-group-divider fw-bold border-top border-secondary"
}, g = {
  default: {
    table: "table table-hover table-striped table-sm align-middle",
    thead: "table-light",
    th: "text-uppercase fw-semibold",
    tbody: "",
    tr: "",
    td: "",
    tfoot: "table-group-divider fw-bold"
  },
  light: U,
  extraLight: X,
  dark: Y,
  extraDark: Z
};
class tt {
  constructor({ data: n = [], columns: t = [], config: e = {}, theme: o = "default", classes: s = null, targetContainerId: r = "table-container", inData: a, inColumns: l, inConfig: c, inTheme: i, inClasses: d, inTargetContainerId: m } = {}) {
    const f = n || a || [], p = t || l || [], b = e || c || {}, h = i || o || (b == null ? void 0 : b.theme) || "default", y = g[h] || g.default || g, D = s || d || {}, x = r || m || "table-container";
    this.containerId = x, this.theme = h, this.classes = { ...y, ...(b == null ? void 0 : b.classes) || {}, ...D }, this.tableElement = null, this.controlsTree = null, this.store = new J({
      inData: f,
      inColumns: p,
      inConfig: b
    });
  }
  setTheme({ theme: n = "default", inTheme: t } = {}) {
    var s;
    const e = t || n || "default";
    this.theme = e;
    const o = g[e] || g.default || g;
    if (this.classes = { ...o, ...((s = this.store.config) == null ? void 0 : s.classes) || {} }, this.tableElement)
      return this.render();
  }
  render() {
    var s, r, a;
    const n = document.getElementById(this.containerId);
    if (!n) return null;
    const t = z({
      inColumns: this.store.activeColumns,
      inData: this.store.stateData,
      inComputedFooter: this.store.computedFooter,
      inRowConfig: (s = this.store.config) == null ? void 0 : s.row,
      inClasses: this.classes
    });
    this.controlsTree = v({ inSpec: t });
    const e = (a = (r = window.ks) == null ? void 0 : r["json-to-dom"]) == null ? void 0 : a.buildSpecElement;
    if (typeof e != "function")
      return console.error("json-to-dom buildSpecElement not found on window.ks"), this.controlsTree;
    const o = e({ inSpec: t });
    return this.tableElement = Array.isArray(o) ? o[0] : o, n.innerHTML = "", n.appendChild(this.tableElement), {
      treeWithIds: this.controlsTree,
      spec: t,
      element: this.tableElement
    };
  }
  getControlsTree() {
    return this.controlsTree;
  }
  repaintBody() {
    var n;
    this.tableElement && L({
      inTableElement: this.tableElement,
      inColumns: this.store.activeColumns,
      inData: this.store.stateData,
      inRowConfig: (n = this.store.config) == null ? void 0 : n.row,
      inClasses: this.classes
    });
  }
  repaintFoot() {
    this.tableElement && R({
      inTableElement: this.tableElement,
      inColumns: this.store.activeColumns,
      inComputedFooter: this.store.computedFooter,
      inClasses: this.classes
    });
  }
  refreshTable() {
    this.tableElement && k({
      inTableElement: this.tableElement,
      inStore: this.store
    });
  }
  filterOriginalData({ query: n = "", inQuery: t = "" } = {}) {
    P({
      inTable: this,
      inQuery: n || t
    });
  }
  filterStateData({ query: n = "", inQuery: t = "" } = {}) {
    G({
      inTable: this,
      inQuery: n || t
    });
  }
  filter({ query: n = "", inQuery: t = "" } = {}) {
    const e = n || t;
    this.filterOriginalData({ query: e });
  }
}
const et = ({ inHeadConfig: u = {} } = {}) => {
  const n = u, t = (n == null ? void 0 : n.title) || "", e = (n == null ? void 0 : n.subtitle) || "";
  if (!t && !e) return null;
  const o = [];
  return t && o.push({
    tagName: "label",
    textContent: t,
    attributes: {
      class: "block text-lg font-bold text-slate-900"
    }
  }), e && o.push({
    tagName: "label",
    textContent: e,
    attributes: {
      class: "block text-xs text-slate-500 mt-0.5"
    }
  }), {
    tagName: "div",
    attributes: {
      class: "border-b border-slate-200 pb-4 mb-2"
    },
    children: o
  };
}, nt = ({ inColumn: u = {}, inClasses: n = {} } = {}) => {
  const t = u, e = n, o = t.key || "", s = t.label || o, r = t.type === "number" ? "number" : "text", a = {
    tagName: "label",
    textContent: s,
    attributes: e != null && e.label ? { class: e.label } : {}
  }, l = t.datalist === !0 || t.datalist !== !1 && r !== "number", c = t.datalistId || `${o}-datalist`, i = {
    type: r,
    name: o,
    placeholder: `Enter ${s}...`
  };
  e != null && e.input && (i.class = e.input), l && (i.list = c);
  const d = {
    tagName: "input",
    attributes: i
  };
  t.id && (d.attributes.id = t.id, a.attributes.for = t.id);
  const m = {
    tagName: "button",
    textContent: "Search",
    attributes: {
      type: "button",
      id: t.searchId || `${o}-search`,
      name: `${o}-search`,
      "data-key": o,
      class: (e == null ? void 0 : e.button) || "btn btn-outline-secondary"
    }
  }, f = {
    tagName: "div",
    attributes: e != null && e.group ? { class: e.group } : {},
    children: [d, m]
  };
  return {
    tagName: "div",
    attributes: e != null && e.field ? { class: e.field } : {},
    children: [a, f]
  };
}, ot = ({ inColumns: u = [], inClasses: n = {} } = {}) => {
  const t = u, e = n;
  if (!Array.isArray(t)) return { tagName: "div", children: [] };
  const o = t.map((r) => nt({ inColumn: r, inClasses: e }));
  return {
    tagName: "div",
    attributes: e != null && e.body ? { class: e.body } : {},
    children: o
  };
}, st = ({ inFootConfig: u = {} } = {}) => {
  const n = u, t = n == null ? void 0 : n.buttons;
  if (!Array.isArray(t) || t.length === 0) return null;
  const e = t.map((o) => {
    const r = o.variant === "primary" ? "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer" : "px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-150 ease-in-out cursor-pointer", a = {
      type: o.type || "button",
      name: o.name || "",
      class: r
    };
    return o.id && (a.id = o.id), {
      tagName: "button",
      textContent: o.label || o.name,
      attributes: a
    };
  });
  return {
    tagName: "div",
    attributes: {
      class: "flex items-center justify-end gap-3 pt-4 mt-2 border-t border-slate-200"
    },
    children: e
  };
}, rt = ({ inColumns: u = [], inConfig: n = {}, inClasses: t = {} } = {}) => {
  const e = u, o = n, s = t, r = et({ inHeadConfig: o == null ? void 0 : o.head }), a = ot({ inColumns: e, inClasses: s }), l = st({ inFootConfig: o == null ? void 0 : o.foot });
  return {
    tagName: "div",
    attributes: s != null && s.form ? { class: s.form } : {},
    children: [r, a, l].filter(Boolean)
  };
};
class at extends T {
  constructor({ inColumns: n = [], inConfig: t = {} } = {}) {
    const e = n, o = t;
    super({
      inColumns: e,
      inConfig: o
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: n } = {}) {
    var o, s;
    const t = n;
    return {
      activeColumns: this._resolveActiveColumns({
        inColumnsCatalog: t == null ? void 0 : t.columns,
        inColumnKeys: (s = (o = t == null ? void 0 : t.config) == null ? void 0 : o.body) == null ? void 0 : s.columns
      })
    };
  }
  get activeColumns() {
    return this.library.activeColumns;
  }
}
const it = {
  form: "card p-3 shadow-sm mb-3 bg-light border-light-subtle",
  body: "row g-3 align-items-end",
  field: "col-md-4",
  label: "form-label form-label-sm fw-semibold text-secondary mb-1",
  group: "input-group input-group-sm",
  input: "form-control bg-white",
  button: "btn btn-outline-primary"
}, lt = {
  form: "p-2 mb-3 bg-transparent border-0 shadow-none",
  body: "row g-2 align-items-end",
  field: "col-md-4",
  label: "form-label form-label-sm text-muted mb-1",
  group: "input-group input-group-sm",
  input: "form-control border-secondary border-opacity-25",
  button: "btn btn-light border"
}, ct = {
  form: "card p-3 shadow-sm mb-3 bg-dark text-light border-secondary",
  body: "row g-3 align-items-end",
  field: "col-md-4",
  label: "form-label form-label-sm fw-semibold text-light mb-1",
  group: "input-group input-group-sm",
  input: "form-control bg-dark text-light border-secondary",
  button: "btn btn-outline-light"
}, ut = {
  form: "card p-3 shadow-sm mb-3 bg-black text-light border-secondary border-opacity-50",
  body: "row g-3 align-items-end",
  field: "col-md-4",
  label: "form-label form-label-sm fw-bold text-white mb-1",
  group: "input-group input-group-sm",
  input: "form-control bg-dark text-white border-secondary",
  button: "btn btn-primary"
}, C = {
  default: {
    form: "card p-3 shadow-sm mb-3",
    body: "row g-3 align-items-end",
    field: "col-md-4",
    label: "form-label form-label-sm fw-semibold mb-1",
    group: "input-group input-group-sm",
    input: "form-control",
    button: "btn btn-outline-secondary"
  },
  light: it,
  extraLight: lt,
  dark: ct,
  extraDark: ut
};
class dt {
  constructor({ columns: n = [], config: t = {}, theme: e = "default", classes: o = null, targetContainerId: s = "form-container", inColumns: r, inConfig: a, inTheme: l, inClasses: c, inTargetContainerId: i } = {}) {
    const d = n || r || [], m = t || a || {}, f = l || e || (m == null ? void 0 : m.theme) || "default", p = C[f] || C.default || C, b = o || c || {}, h = s || i || "form-container";
    this.containerId = h, this.theme = f, this.classes = { ...p, ...(m == null ? void 0 : m.classes) || {}, ...b }, this.formElement = null, this.controlsTree = null, this.store = new at({
      inColumns: d,
      inConfig: m
    });
  }
  setTheme({ theme: n = "default", inTheme: t } = {}) {
    var s;
    const e = t || n || "default";
    this.theme = e;
    const o = C[e] || C.default || C;
    if (this.classes = { ...o, ...((s = this.store.config) == null ? void 0 : s.classes) || {} }, this.formElement)
      return this.render();
  }
  get columns() {
    return this.store.activeColumns;
  }
  get config() {
    return this.store.config;
  }
  render() {
    var s, r;
    const n = document.getElementById(this.containerId);
    if (!n) return null;
    const t = rt({
      inColumns: this.store.activeColumns,
      inConfig: this.store.config,
      inClasses: this.classes
    });
    this.controlsTree = v({ inSpec: t });
    const e = (r = (s = window.ks) == null ? void 0 : s["json-to-dom"]) == null ? void 0 : r.buildSpecElement;
    if (typeof e != "function")
      return console.error("json-to-dom buildSpecElement not found on window.ks"), this.controlsTree;
    const o = e({ inSpec: t });
    return this.formElement = Array.isArray(o) ? o[0] : o, n.innerHTML = "", n.appendChild(this.formElement), {
      treeWithIds: this.controlsTree,
      spec: t,
      element: this.formElement
    };
  }
  getControlsTree() {
    return this.controlsTree;
  }
}
const A = ({ inData: u = [], inKey: n = "", inTopN: t = 100 } = {}) => {
  const e = u, o = n, s = t;
  if (!Array.isArray(e) || !o) return [];
  const r = /* @__PURE__ */ new Map();
  for (const c of e) {
    if (!c || typeof c != "object") continue;
    const i = c[o];
    if (i != null) {
      const d = String(i).trim();
      d !== "" && r.set(d, (r.get(d) || 0) + 1);
    }
  }
  const a = Array.from(r.entries()).map(([c, i]) => ({ value: c, count: i })).sort((c, i) => i.count - c.count);
  return (s > 0 && Number.isFinite(s) ? a.slice(0, s) : a).map(({ value: c, count: i }) => ({
    tagName: "option",
    attributes: {
      value: c,
      label: `${c} (${i})`
    },
    textContent: `${c} (${i})`
  }));
}, mt = ({ inData: u = [], inColumns: n = [], inTopN: t = 100 } = {}) => {
  const e = u, o = n, s = t;
  if (!Array.isArray(o) || o.length === 0)
    return {
      tagName: "div",
      attributes: { id: "ks-datalists-wrapper" },
      children: []
    };
  const r = o.map((a) => {
    const l = a.key || "", c = a.datalistId || `${l}-datalist`, i = A({
      inData: e,
      inKey: l,
      inTopN: s
    });
    return {
      tagName: "datalist",
      attributes: {
        id: c
      },
      children: i
    };
  });
  return {
    tagName: "div",
    attributes: {
      id: "ks-datalists-wrapper"
    },
    children: r
  };
};
class bt extends T {
  constructor({ inData: n = [], inColumns: t = [], inConfig: e = {}, inTopN: o = 100 } = {}) {
    const s = n, r = t, a = e, l = o;
    super({
      inData: s,
      inColumns: r,
      inConfig: a,
      inTopN: l
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: n } = {}) {
    var r, a, l, c, i;
    const t = n, e = this._resolveActiveColumns({
      inColumnsCatalog: t == null ? void 0 : t.columns,
      inColumnKeys: ((a = (r = t == null ? void 0 : t.config) == null ? void 0 : r.datalist) == null ? void 0 : a.columns) || ((l = t == null ? void 0 : t.config) == null ? void 0 : l.columns)
    }), o = S({
      inData: t == null ? void 0 : t.originalData
    }), s = ((i = (c = t == null ? void 0 : t.config) == null ? void 0 : c.datalist) == null ? void 0 : i.topN) ?? (t == null ? void 0 : t.topN) ?? 100;
    return {
      activeColumns: e,
      stateData: o,
      topN: s
    };
  }
  get stateData() {
    return this.library.stateData;
  }
  get activeColumns() {
    return this.library.activeColumns;
  }
  get topN() {
    return this.library.topN;
  }
  updateData({ inData: n = [] } = {}) {
    const t = n;
    return this.library.stateData = Array.isArray(t) ? t : [], this.library.stateData;
  }
}
const ft = {
  wrapper: "ks-datalists-wrapper ks-datalist-light",
  datalist: "",
  option: ""
}, pt = {
  wrapper: "ks-datalists-wrapper ks-datalist-extralight",
  datalist: "",
  option: ""
}, ht = {
  wrapper: "ks-datalists-wrapper ks-datalist-dark",
  datalist: "",
  option: ""
}, yt = {
  wrapper: "ks-datalists-wrapper ks-datalist-extradark",
  datalist: "",
  option: ""
}, w = {
  default: {
    wrapper: "ks-datalists-wrapper",
    datalist: "",
    option: ""
  },
  light: ft,
  extraLight: pt,
  dark: ht,
  extraDark: yt
};
class gt {
  constructor({ data: n = [], columns: t = [], config: e = {}, theme: o = "default", classes: s = null, targetContainerId: r = "datalist-container", inData: a, inColumns: l, inConfig: c, inTheme: i, inClasses: d, inTargetContainerId: m } = {}) {
    const f = n || a || [], p = t || l || [], b = e || c || {}, h = i || o || (b == null ? void 0 : b.theme) || "default", y = w[h] || w.default || w, D = s || d || {}, x = r || m || "datalist-container";
    this.containerId = x, this.theme = h, this.classes = { ...y, ...(b == null ? void 0 : b.classes) || {}, ...D }, this.element = null, this.spec = null, this.store = new bt({
      inData: f,
      inColumns: p,
      inConfig: b
    });
  }
  setTheme({ theme: n = "default", inTheme: t } = {}) {
    var s;
    const e = t || n || "default";
    this.theme = e;
    const o = w[e] || w.default || w;
    if (this.classes = { ...o, ...((s = this.store.config) == null ? void 0 : s.classes) || {} }, this.element)
      return this.render();
  }
  get data() {
    return this.store.stateData;
  }
  get columns() {
    return this.store.activeColumns;
  }
  get config() {
    return this.store.config;
  }
  render() {
    var s, r;
    if (typeof document > "u") return null;
    let n = document.getElementById(this.containerId);
    n || (n = document.createElement("div"), n.id = this.containerId, document.body.appendChild(n));
    const t = mt({
      inData: this.store.stateData,
      inColumns: this.store.activeColumns,
      inTopN: this.store.topN
    });
    this.spec = t;
    const e = (r = (s = window.ks) == null ? void 0 : s["json-to-dom"]) == null ? void 0 : r.buildSpecElement;
    let o = null;
    if (typeof e != "function") {
      const a = document.createElement("div");
      a.id = "ks-datalists-wrapper";
      for (const l of this.store.activeColumns) {
        const c = l.key || "", i = l.datalistId || `${c}-datalist`, d = document.createElement("datalist");
        d.id = i;
        const m = A({
          inData: this.store.stateData,
          inKey: c,
          inTopN: this.store.topN
        });
        for (const f of m) {
          const p = document.createElement("option");
          p.value = f.attributes.value, p.label = f.attributes.label, p.textContent = f.textContent, d.appendChild(p);
        }
        a.appendChild(d);
      }
      o = a;
    } else {
      const a = e({ inSpec: t });
      if (o = Array.isArray(a) ? a[0] : a, !o || o.children.length === 0) {
        const l = document.createElement("div");
        l.id = "ks-datalists-wrapper";
        for (const c of this.store.activeColumns) {
          const i = c.key || "", d = c.datalistId || `${i}-datalist`, m = document.createElement("datalist");
          m.id = d;
          const f = A({
            inData: this.store.stateData,
            inKey: i,
            inTopN: this.store.topN
          });
          for (const p of f) {
            const b = document.createElement("option");
            b.value = p.attributes.value, b.label = p.attributes.label, b.textContent = p.textContent, m.appendChild(b);
          }
          l.appendChild(m);
        }
        o = l;
      }
    }
    return this.element = o, n.innerHTML = "", this.element && n.appendChild(this.element), {
      spec: this.spec,
      element: this.element
    };
  }
  update({ data: n = [], inData: t } = {}) {
    const e = n.length > 0 ? n : t || [];
    return this.store.updateData({ inData: e }), this.render();
  }
}
window.ks ?? (window.ks = {});
window.ks["json-to-dom-renderers"] = {
  Table: tt,
  Form: dt,
  DataList: gt
};
export {
  gt as DataList,
  dt as Form,
  tt as Table
};
