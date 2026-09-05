class A {
  constructor({ inData: n = [], inColumns: t = [], inConfig: e = {}, inTopN: o } = {}) {
    const r = n, s = t, i = e, l = o;
    this.source = this._buildSource({
      inData: r,
      inColumns: s,
      inConfig: i,
      inTopN: l
    });
  }
  _buildSource({ inData: n = [], inColumns: t = [], inConfig: e = {}, inTopN: o } = {}) {
    const r = n, s = t, i = e, l = o;
    return {
      originalData: Array.isArray(r) ? typeof structuredClone == "function" ? structuredClone(r) : JSON.parse(JSON.stringify(r)) : [],
      columns: Array.isArray(s) ? s : [],
      config: i || {},
      topN: l
    };
  }
  _resolveActiveColumns({ inColumnsCatalog: n = [], inColumnKeys: t = [] } = {}) {
    const e = n, o = t;
    if (Array.isArray(o) && o.length > 0) {
      const r = new Map((Array.isArray(e) ? e : []).map((s) => [s.key, s]));
      return o.map((s) => r.get(s)).filter(Boolean);
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
const T = ({ inData: u = [] } = {}) => {
  const n = u;
  return Array.isArray(n) ? typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n)) : [];
}, I = ({ inColumns: u = [], inData: n = [], inConfig: t = {}, inLabel: e } = {}) => {
  var f, p;
  const o = u, r = n, s = t, i = e;
  if (!!!(s != null && s.serial || (f = s == null ? void 0 : s.table) != null && f.serial || (p = s == null ? void 0 : s.head) != null && p.serial))
    return {
      columns: o,
      data: r,
      isSerialEnabled: !1
    };
  const a = {
    key: "serial",
    label: i || typeof (s == null ? void 0 : s.serial) == "object" && s.serial.label || "#",
    align: "center",
    isSerial: !0
  }, m = (Array.isArray(o) ? o : []).some((y) => y.key === "serial") ? o : [a, ...Array.isArray(o) ? o : []], b = (Array.isArray(r) ? r : []).map((y, h) => ({
    serial: h + 1,
    ...y || {}
  }));
  return {
    columns: m,
    data: b,
    isSerialEnabled: !0
  };
}, R = ({ inData: u = [], inKey: n } = {}) => {
  const t = u, e = n;
  return !Array.isArray(t) || !e ? 0 : t.reduce((o, r) => {
    const s = Number(r == null ? void 0 : r[e]);
    return o + (isNaN(s) ? 0 : s);
  }, 0);
}, L = ({ inData: u = [] } = {}) => {
  const n = u;
  return Array.isArray(n) ? n.length : 0;
}, Q = {
  sum: R,
  count: L
}, B = ({ inExpression: u = "", inScope: n = {} } = {}) => {
  const t = u, e = n;
  try {
    const o = Object.keys(e), r = Object.values(e);
    return new Function(...o, `return ${t};`)(...r);
  } catch (o) {
    return console.error(`Error evaluating expression "${t}":`, o), 0;
  }
}, O = ({ inRowConfig: u = {}, inData: n = [], inScope: t = {} } = {}) => {
  const e = u, o = n, r = t, s = e.id || "", i = e.title || "", l = e.type || "aggregate", c = e.values || {}, a = {};
  return l === "aggregate" ? Object.entries(c).forEach(([d, m]) => {
    const b = Q[m];
    typeof b == "function" && (a[d] = b({ inData: o, inKey: d }));
  }) : l === "eval" && Object.entries(c).forEach(([d, m]) => {
    typeof m == "string" && (a[d] = B({
      inExpression: m,
      inScope: r
    }));
  }), {
    id: s,
    title: i,
    values: a
  };
}, S = ({ inData: u = [], inFooterConfig: n = [] } = {}) => {
  const t = u, e = n;
  if (!Array.isArray(e)) return [];
  const o = {}, r = [];
  return e.forEach((s) => {
    const i = O({
      inRowConfig: s,
      inData: t,
      inScope: o
    });
    s.id && (o[s.id] = i.values), r.push(i);
  }), r;
}, $ = ({ inSource: u = {}, inResolveColumns: n } = {}) => {
  var l, c, a;
  const t = u, e = n, o = typeof e == "function" ? e({
    inColumnsCatalog: t == null ? void 0 : t.columns,
    inColumnKeys: (c = (l = t == null ? void 0 : t.config) == null ? void 0 : l.head) == null ? void 0 : c.columns
  }) : (t == null ? void 0 : t.columns) || [], r = T({
    inData: t == null ? void 0 : t.originalData
  }), s = I({
    inColumns: o,
    inData: r,
    inConfig: t == null ? void 0 : t.config
  }), i = S({
    inData: s.data,
    inFooterConfig: (a = t == null ? void 0 : t.config) == null ? void 0 : a.foot
  });
  return {
    activeColumns: s.columns,
    stateData: s.data,
    computedFooter: i,
    isSerialEnabled: s.isSerialEnabled
  };
}, K = ({ inQuery: u = "", inActiveColumns: n = [] } = {}) => {
  const t = u, e = n, o = new Set(
    (Array.isArray(e) ? e : []).map((r) => typeof r == "object" && r !== null ? r.key : r).filter(Boolean)
  );
  if (typeof t == "object" && t !== null) {
    if (t.type === "string")
      return {
        type: "string",
        value: String(t.value ?? "").trim().toLowerCase()
      };
    const r = t.type === "object" && typeof t.value == "object" && t.value !== null ? t.value : t, s = {};
    for (const [i, l] of Object.entries(r))
      if (o.has(i) && l !== void 0 && l !== null) {
        const c = String(l).trim().toLowerCase();
        c !== "" && (s[i] = c);
      }
    return {
      type: "object",
      value: s
    };
  }
  return {
    type: "string",
    value: String(t ?? "").trim().toLowerCase()
  };
}, _ = ({ inData: u = [], inQueryObject: n = {}, inActiveColumns: t = [] } = {}) => {
  const e = u, o = n, r = t;
  if (!Array.isArray(e)) return [];
  const s = o == null ? void 0 : o.type, i = o == null ? void 0 : o.value, l = Array.isArray(r) && r.length > 0 ? r.map((a) => typeof a == "object" && a !== null ? a.key : a).filter(Boolean) : null;
  if (s === "object") {
    const d = Object.entries(typeof i == "object" && i !== null ? i : {});
    return d.length === 0 ? [...e] : e.filter((m) => !m || typeof m != "object" ? !1 : d.every(([b, f]) => {
      const p = m[b];
      return p == null ? !1 : String(p).toLowerCase().includes(f);
    }));
  }
  const c = typeof i == "string" ? i : String(o ?? "").trim().toLowerCase();
  return c ? e.filter((a) => !a || typeof a != "object" ? !1 : (l ? l.map((m) => a[m]) : Object.values(a)).some((m) => m == null ? !1 : String(m).toLowerCase().includes(c))) : [...e];
}, q = ({ inData: u = [], inIsEnabled: n = !1 } = {}) => {
  const t = u;
  return !n || !Array.isArray(t) ? t : t.map((o, r) => ({
    ...o,
    serial: r + 1
  }));
}, N = ({ inStore: u, inData: n = [], inQuery: t = "" } = {}) => {
  var b;
  const e = u, o = n, r = t, s = e.library.activeColumns, i = e.library.isSerialEnabled, l = (b = e.source.config) == null ? void 0 : b.foot, c = K({
    inQuery: r,
    inActiveColumns: s
  }), a = _({
    inData: o,
    inQueryObject: c,
    inActiveColumns: s
  }), d = q({
    inData: a,
    inIsEnabled: i
  }), m = S({
    inData: d,
    inFooterConfig: l
  });
  return e.library.stateData = d, e.library.computedFooter = m, {
    activeColumns: e.library.activeColumns,
    stateData: e.library.stateData,
    computedFooter: e.library.computedFooter
  };
};
class M extends A {
  constructor({ inData: n = [], inColumns: t = [], inConfig: e = {} } = {}) {
    const o = n, r = t, s = e;
    super({
      inData: o,
      inColumns: r,
      inConfig: s
    }), this.library = $({
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
const w = ({
  inCellTagName: u = "td",
  inCells: n = [],
  inRowClass: t = "",
  inCellClass: e = ""
} = {}) => {
  const o = u, r = n, s = t, i = e;
  return {
    tagName: "tr",
    attributes: s ? { class: s } : {},
    children: r.map((l) => {
      const c = String(typeof l == "object" ? l.textContent ?? "" : l ?? ""), a = typeof l == "object" && l.class !== void 0 ? l.class : i, d = typeof l == "object" ? l.align : "", b = [a, d === "right" ? "text-end" : d === "center" ? "text-center" : ""].filter(Boolean).join(" ").trim(), f = b ? { class: b } : {};
      return typeof l == "object" && l.id && (f.id = l.id), {
        tagName: o,
        textContent: c,
        attributes: f
      };
    })
  };
}, V = ({ inColumns: u = [], inClasses: n = {} } = {}) => {
  const t = u, e = n, o = t.map((i) => ({
    textContent: i.label,
    align: i.align,
    id: i.id
  })), r = w({
    inCellTagName: "th",
    inCells: o,
    inCellClass: (e == null ? void 0 : e.th) || "",
    inRowClass: (e == null ? void 0 : e.tr) || ""
  });
  return {
    tagName: "thead",
    attributes: e != null && e.thead ? { class: e.thead } : {},
    children: [r]
  };
}, x = ({ inColumns: u = [], inData: n = [], inRowConfig: t = {}, inClasses: e = {} } = {}) => {
  const o = u, r = n, s = e;
  if (!Array.isArray(r) || r.length === 0) {
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
      attributes: s != null && s.tbody ? { class: s.tbody } : {},
      children: [c]
    };
  }
  const i = r.map((c) => {
    const a = o.map((d) => ({
      textContent: d.key === "amount" ? Number(c[d.key]).toFixed(2) : String(c[d.key] ?? ""),
      align: d.align
    }));
    return w({
      inCellTagName: "td",
      inCells: a,
      inRowClass: (s == null ? void 0 : s.tr) || "",
      inCellClass: (s == null ? void 0 : s.td) || ""
    });
  });
  return {
    tagName: "tbody",
    attributes: s != null && s.tbody ? { class: s.tbody } : {},
    children: i
  };
}, k = ({ inColumns: u = [], inComputedFooter: n = [], inClasses: t = {} } = {}) => {
  const e = u, o = n, r = t;
  if (!Array.isArray(o) || o.length === 0)
    return null;
  const s = o.map((l, c) => {
    const a = l.title || "", d = l.values || {}, m = c === o.length - 1, b = e.findIndex((p) => !p.isSerial), f = e.map((p, y) => {
      if (d[p.key] !== void 0) {
        const h = d[p.key];
        return {
          textContent: typeof h == "number" ? h.toFixed(2) : String(h),
          align: p.align || "right",
          class: m ? "fw-bold" : "fw-semibold"
        };
      }
      return y === b ? {
        textContent: a,
        class: m ? "fw-bold text-uppercase" : "fw-semibold text-uppercase"
      } : {
        textContent: "",
        class: ""
      };
    });
    return w({
      inCellTagName: "td",
      inCells: f,
      inRowClass: m ? "table-light" : (r == null ? void 0 : r.tr) || "",
      inCellClass: (r == null ? void 0 : r.td) || ""
    });
  });
  return {
    tagName: "tfoot",
    attributes: r != null && r.tfoot ? { class: r.tfoot } : {},
    children: s
  };
}, W = ({ inColumns: u = [], inData: n = [], inComputedFooter: t = [], inRowConfig: e = {}, inClasses: o = {} } = {}) => {
  const r = u, s = n, i = t, l = e, c = o, a = V({ inColumns: r, inClasses: c }), d = x({ inColumns: r, inData: s, inRowConfig: l, inClasses: c }), m = k({ inColumns: r, inComputedFooter: i, inClasses: c });
  return {
    tagName: "table",
    attributes: c != null && c.table ? { class: c.table } : {},
    children: [a, d, m].filter(Boolean)
  };
}, g = ({ inSpec: u } = {}) => {
  var l, c, a;
  const n = u;
  if (!n || typeof n != "object") return null;
  if (Array.isArray(n)) {
    const d = n.map((m) => g({ inSpec: m })).filter(Boolean);
    return d.length > 0 ? d : null;
  }
  const e = (Array.isArray(n.children) ? n.children : []).map((d) => g({ inSpec: d })).filter(Boolean), o = ((l = n.attributes) == null ? void 0 : l.id) || n.id, r = !!o, s = e.length > 0;
  if (!r && !s)
    return null;
  const i = {
    tagName: n.tagName
  };
  return o && (i.id = o), (c = n.attributes) != null && c.name && (i.name = n.attributes.name), (a = n.attributes) != null && a.type && (i.type = n.attributes.type), n.attributes && (i.attributes = n.attributes), e.length > 0 && (i.children = e), i;
}, F = ({ inTableElement: u, inColumns: n = [], inData: t = [], inRowConfig: e = {}, inClasses: o = {} } = {}) => {
  var f, p;
  const r = u, s = n, i = t, l = e, c = o;
  if (!r) return;
  const a = x({
    inColumns: s,
    inData: i,
    inRowConfig: l,
    inClasses: c
  }), d = (p = (f = window.ks) == null ? void 0 : f["json-to-dom"]) == null ? void 0 : p.buildSpecElement;
  if (typeof d != "function") return;
  const m = d({ inSpec: a }), b = r.querySelector("tbody");
  b && m && b.replaceWith(m);
}, j = ({ inTableElement: u, inColumns: n = [], inComputedFooter: t = [], inClasses: e = {} } = {}) => {
  var m, b;
  const o = u, r = n, s = t, i = e;
  if (!o) return;
  const l = k({
    inColumns: r,
    inComputedFooter: s,
    inClasses: i
  }), c = (b = (m = window.ks) == null ? void 0 : m["json-to-dom"]) == null ? void 0 : b.buildSpecElement;
  if (typeof c != "function") return;
  const a = l ? c({ inSpec: l }) : null, d = o.querySelector("tfoot");
  d && a ? d.replaceWith(a) : d && !a ? d.remove() : !d && a && o.appendChild(a);
}, E = ({ inTableElement: u, inStore: n } = {}) => {
  var o;
  const t = u, e = n;
  !t || !e || (F({
    inTableElement: t,
    inColumns: e.activeColumns,
    inData: e.stateData,
    inRowConfig: (o = e.config) == null ? void 0 : o.row
  }), j({
    inTableElement: t,
    inColumns: e.activeColumns,
    inComputedFooter: e.computedFooter
  }));
}, J = ({ inTable: u, inQuery: n = "" } = {}) => {
  const t = u, e = n;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterOriginalData({ inQuery: e }), E({
    inTableElement: t.tableElement,
    inStore: t.store
  }));
}, H = ({ inTable: u, inQuery: n = "" } = {}) => {
  const t = u, e = n;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterStateData({ inQuery: e }), E({
    inTableElement: t.tableElement,
    inStore: t.store
  }));
}, z = "table table-hover table-striped table-sm align-middle", P = "table-light", G = "text-uppercase fw-semibold", U = "", X = "", Y = "", Z = "table-group-divider fw-bold", C = {
  table: z,
  thead: P,
  th: G,
  tbody: U,
  tr: X,
  td: Y,
  tfoot: Z
};
class tt {
  constructor({ data: n = [], columns: t = [], config: e = {}, classes: o = C, targetContainerId: r = "table-container", inData: s, inColumns: i, inConfig: l, inClasses: c, inTargetContainerId: a } = {}) {
    const d = n || s || [], m = t || i || [], b = e || l || {}, f = o || c || C, p = r || a || "table-container";
    this.containerId = p, this.classes = { ...C, ...(b == null ? void 0 : b.classes) || {}, ...f }, this.tableElement = null, this.controlsTree = null, this.store = new M({
      inData: d,
      inColumns: m,
      inConfig: b
    });
  }
  render() {
    var r, s, i;
    const n = document.getElementById(this.containerId);
    if (!n) return null;
    const t = W({
      inColumns: this.store.activeColumns,
      inData: this.store.stateData,
      inComputedFooter: this.store.computedFooter,
      inRowConfig: (r = this.store.config) == null ? void 0 : r.row,
      inClasses: this.classes
    });
    this.controlsTree = g({ inSpec: t });
    const e = (i = (s = window.ks) == null ? void 0 : s["json-to-dom"]) == null ? void 0 : i.buildSpecElement;
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
    this.tableElement && F({
      inTableElement: this.tableElement,
      inColumns: this.store.activeColumns,
      inData: this.store.stateData,
      inRowConfig: (n = this.store.config) == null ? void 0 : n.row,
      inClasses: this.classes
    });
  }
  repaintFoot() {
    this.tableElement && j({
      inTableElement: this.tableElement,
      inColumns: this.store.activeColumns,
      inComputedFooter: this.store.computedFooter,
      inClasses: this.classes
    });
  }
  refreshTable() {
    this.tableElement && E({
      inTableElement: this.tableElement,
      inStore: this.store
    });
  }
  filterOriginalData({ query: n = "", inQuery: t = "" } = {}) {
    J({
      inTable: this,
      inQuery: n || t
    });
  }
  filterStateData({ query: n = "", inQuery: t = "" } = {}) {
    H({
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
  const t = u, e = n, o = t.key || "", r = t.label || o, s = t.type === "number" ? "number" : "text", i = {
    tagName: "label",
    textContent: r,
    attributes: e != null && e.label ? { class: e.label } : {}
  }, l = t.datalist === !0 || t.datalist !== !1 && s !== "number", c = t.datalistId || `${o}-datalist`, a = {
    type: s,
    name: o,
    placeholder: `Enter ${r}...`
  };
  e != null && e.input && (a.class = e.input), l && (a.list = c);
  const d = {
    tagName: "input",
    attributes: a
  };
  t.id && (d.attributes.id = t.id, i.attributes.for = t.id);
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
  }, b = {
    tagName: "div",
    attributes: e != null && e.group ? { class: e.group } : {},
    children: [d, m]
  };
  return {
    tagName: "div",
    attributes: e != null && e.field ? { class: e.field } : {},
    children: [i, b]
  };
}, ot = ({ inColumns: u = [], inClasses: n = {} } = {}) => {
  const t = u, e = n;
  if (!Array.isArray(t)) return { tagName: "div", children: [] };
  const o = t.map((s) => nt({ inColumn: s, inClasses: e }));
  return {
    tagName: "div",
    attributes: e != null && e.body ? { class: e.body } : {},
    children: o
  };
}, st = ({ inFootConfig: u = {} } = {}) => {
  const n = u, t = n == null ? void 0 : n.buttons;
  if (!Array.isArray(t) || t.length === 0) return null;
  const e = t.map((o) => {
    const s = o.variant === "primary" ? "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer" : "px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-150 ease-in-out cursor-pointer", i = {
      type: o.type || "button",
      name: o.name || "",
      class: s
    };
    return o.id && (i.id = o.id), {
      tagName: "button",
      textContent: o.label || o.name,
      attributes: i
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
  const e = u, o = n, r = t, s = et({ inHeadConfig: o == null ? void 0 : o.head }), i = ot({ inColumns: e, inClasses: r }), l = st({ inFootConfig: o == null ? void 0 : o.foot });
  return {
    tagName: "div",
    attributes: r != null && r.form ? { class: r.form } : {},
    children: [s, i, l].filter(Boolean)
  };
};
class it extends A {
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
    var o, r;
    const t = n;
    return {
      activeColumns: this._resolveActiveColumns({
        inColumnsCatalog: t == null ? void 0 : t.columns,
        inColumnKeys: (r = (o = t == null ? void 0 : t.config) == null ? void 0 : o.body) == null ? void 0 : r.columns
      })
    };
  }
  get activeColumns() {
    return this.library.activeColumns;
  }
}
const at = "card p-3 shadow-sm mb-3", lt = "row g-3 align-items-end", ct = "col-md-4", ut = "form-label form-label-sm fw-semibold mb-1", dt = "input-group input-group-sm", mt = "form-control", bt = "btn btn-outline-secondary", D = {
  form: at,
  body: lt,
  field: ct,
  label: ut,
  group: dt,
  input: mt,
  button: bt
};
class ft {
  constructor({ columns: n = [], config: t = {}, classes: e = D, targetContainerId: o = "form-container", inColumns: r, inConfig: s, inClasses: i, inTargetContainerId: l } = {}) {
    const c = n || r || [], a = t || s || {}, d = e || i || D, m = o || l || "form-container";
    this.containerId = m, this.classes = { ...D, ...(a == null ? void 0 : a.classes) || {}, ...d }, this.formElement = null, this.controlsTree = null, this.store = new it({
      inColumns: c,
      inConfig: a
    });
  }
  get columns() {
    return this.store.activeColumns;
  }
  get config() {
    return this.store.config;
  }
  render() {
    var r, s;
    const n = document.getElementById(this.containerId);
    if (!n) return null;
    const t = rt({
      inColumns: this.store.activeColumns,
      inConfig: this.store.config,
      inClasses: this.classes
    });
    this.controlsTree = g({ inSpec: t });
    const e = (s = (r = window.ks) == null ? void 0 : r["json-to-dom"]) == null ? void 0 : s.buildSpecElement;
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
const v = ({ inData: u = [], inKey: n = "", inTopN: t = 100 } = {}) => {
  const e = u, o = n, r = t;
  if (!Array.isArray(e) || !o) return [];
  const s = /* @__PURE__ */ new Map();
  for (const c of e) {
    if (!c || typeof c != "object") continue;
    const a = c[o];
    if (a != null) {
      const d = String(a).trim();
      d !== "" && s.set(d, (s.get(d) || 0) + 1);
    }
  }
  const i = Array.from(s.entries()).map(([c, a]) => ({ value: c, count: a })).sort((c, a) => a.count - c.count);
  return (r > 0 && Number.isFinite(r) ? i.slice(0, r) : i).map(({ value: c, count: a }) => ({
    tagName: "option",
    attributes: {
      value: c,
      label: `${c} (${a})`
    },
    textContent: `${c} (${a})`
  }));
}, pt = ({ inData: u = [], inColumns: n = [], inTopN: t = 100 } = {}) => {
  const e = u, o = n, r = t;
  if (!Array.isArray(o) || o.length === 0)
    return {
      tagName: "div",
      attributes: { id: "ks-datalists-wrapper" },
      children: []
    };
  const s = o.map((i) => {
    const l = i.key || "", c = i.datalistId || `${l}-datalist`, a = v({
      inData: e,
      inKey: l,
      inTopN: r
    });
    return {
      tagName: "datalist",
      attributes: {
        id: c
      },
      children: a
    };
  });
  return {
    tagName: "div",
    attributes: {
      id: "ks-datalists-wrapper"
    },
    children: s
  };
};
class yt extends A {
  constructor({ inData: n = [], inColumns: t = [], inConfig: e = {}, inTopN: o = 100 } = {}) {
    const r = n, s = t, i = e, l = o;
    super({
      inData: r,
      inColumns: s,
      inConfig: i,
      inTopN: l
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: n } = {}) {
    var s, i, l, c, a;
    const t = n, e = this._resolveActiveColumns({
      inColumnsCatalog: t == null ? void 0 : t.columns,
      inColumnKeys: ((i = (s = t == null ? void 0 : t.config) == null ? void 0 : s.datalist) == null ? void 0 : i.columns) || ((l = t == null ? void 0 : t.config) == null ? void 0 : l.columns)
    }), o = T({
      inData: t == null ? void 0 : t.originalData
    }), r = ((a = (c = t == null ? void 0 : t.config) == null ? void 0 : c.datalist) == null ? void 0 : a.topN) ?? (t == null ? void 0 : t.topN) ?? 100;
    return {
      activeColumns: e,
      stateData: o,
      topN: r
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
class ht {
  constructor({ data: n = [], columns: t = [], config: e = {}, targetContainerId: o = "datalist-container", inData: r, inColumns: s, inConfig: i, inTargetContainerId: l } = {}) {
    const c = n || r || [], a = t || s || [], d = e || i || {}, m = o || l || "datalist-container";
    this.containerId = m, this.element = null, this.spec = null, this.store = new yt({
      inData: c,
      inColumns: a,
      inConfig: d
    });
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
    var r, s;
    if (typeof document > "u") return null;
    let n = document.getElementById(this.containerId);
    n || (n = document.createElement("div"), n.id = this.containerId, document.body.appendChild(n));
    const t = pt({
      inData: this.store.stateData,
      inColumns: this.store.activeColumns,
      inTopN: this.store.topN
    });
    this.spec = t;
    const e = (s = (r = window.ks) == null ? void 0 : r["json-to-dom"]) == null ? void 0 : s.buildSpecElement;
    let o = null;
    if (typeof e != "function") {
      const i = document.createElement("div");
      i.id = "ks-datalists-wrapper";
      for (const l of this.store.activeColumns) {
        const c = l.key || "", a = l.datalistId || `${c}-datalist`, d = document.createElement("datalist");
        d.id = a;
        const m = v({
          inData: this.store.stateData,
          inKey: c,
          inTopN: this.store.topN
        });
        for (const b of m) {
          const f = document.createElement("option");
          f.value = b.attributes.value, f.label = b.attributes.label, f.textContent = b.textContent, d.appendChild(f);
        }
        i.appendChild(d);
      }
      o = i;
    } else {
      const i = e({ inSpec: t });
      if (o = Array.isArray(i) ? i[0] : i, !o || o.children.length === 0) {
        const l = document.createElement("div");
        l.id = "ks-datalists-wrapper";
        for (const c of this.store.activeColumns) {
          const a = c.key || "", d = c.datalistId || `${a}-datalist`, m = document.createElement("datalist");
          m.id = d;
          const b = v({
            inData: this.store.stateData,
            inKey: a,
            inTopN: this.store.topN
          });
          for (const f of b) {
            const p = document.createElement("option");
            p.value = f.attributes.value, p.label = f.attributes.label, p.textContent = f.textContent, m.appendChild(p);
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
  Form: ft,
  DataList: ht
};
export {
  ht as DataList,
  ft as Form,
  tt as Table
};
