class N {
  constructor({ inData: o = [], inColumns: t = [], inConfig: e = {}, inTopN: n } = {}) {
    const a = o, r = t, s = e, i = n;
    this.source = this._buildSource({
      inData: a,
      inColumns: r,
      inConfig: s,
      inTopN: i
    });
  }
  _buildSource({ inData: o = [], inColumns: t = [], inConfig: e = {}, inTopN: n } = {}) {
    const a = o, r = t, s = e, i = n;
    return {
      originalData: Array.isArray(a) ? typeof structuredClone == "function" ? structuredClone(a) : JSON.parse(JSON.stringify(a)) : [],
      columns: Array.isArray(r) ? r : [],
      config: s || {},
      topN: i
    };
  }
  _resolveActiveColumns({ inColumnsCatalog: o = [], inColumnKeys: t = [] } = {}) {
    const e = o, n = t;
    if (Array.isArray(n) && n.length > 0) {
      const a = new Map((Array.isArray(e) ? e : []).map((r) => [r.key, r]));
      return n.map((r) => a.get(r)).filter(Boolean);
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
const $ = ({ inData: d = [] } = {}) => {
  const o = d;
  return Array.isArray(o) ? typeof structuredClone == "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o)) : [];
}, O = ({ inColumns: d = [], inData: o = [], inConfig: t = {}, inLabel: e } = {}) => {
  var p, f;
  const n = d, a = o, r = t, s = e;
  if (!!!(r != null && r.serial || (p = r == null ? void 0 : r.table) != null && p.serial || (f = r == null ? void 0 : r.head) != null && f.serial))
    return {
      columns: n,
      data: a,
      isSerialEnabled: !1
    };
  const l = {
    key: "serial",
    label: s || typeof (r == null ? void 0 : r.serial) == "object" && r.serial.label || "#",
    align: "center",
    isSerial: !0
  }, m = (Array.isArray(n) ? n : []).some((C) => C.key === "serial") ? n : [l, ...Array.isArray(n) ? n : []], b = (Array.isArray(a) ? a : []).map((C, h) => ({
    serial: h + 1,
    ...C || {}
  }));
  return {
    columns: m,
    data: b,
    isSerialEnabled: !0
  };
}, B = ({ inData: d = [], inKey: o } = {}) => {
  const t = d, e = o;
  return !Array.isArray(t) || !e ? 0 : t.reduce((n, a) => {
    const r = Number(a == null ? void 0 : a[e]);
    return n + (isNaN(r) ? 0 : r);
  }, 0);
}, U = ({ inData: d = [] } = {}) => {
  const o = d;
  return Array.isArray(o) ? o.length : 0;
}, q = {
  sum: B,
  count: U
}, K = ({ inExpression: d = "", inScope: o = {} } = {}) => {
  const t = d, e = o;
  try {
    const n = Object.keys(e), a = Object.values(e);
    return new Function(...n, `return ${t};`)(...a);
  } catch (n) {
    return console.error(`Error evaluating expression "${t}":`, n), 0;
  }
}, _ = ({ inRowConfig: d = {}, inData: o = [], inScope: t = {} } = {}) => {
  const e = d, n = o, a = t, r = e.id || "", s = e.title || "", i = e.type || "aggregate", c = e.values || {}, l = {};
  return i === "aggregate" ? Object.entries(c).forEach(([u, m]) => {
    const b = q[m];
    typeof b == "function" && (l[u] = b({ inData: n, inKey: u }));
  }) : i === "eval" && Object.entries(c).forEach(([u, m]) => {
    typeof m == "string" && (l[u] = K({
      inExpression: m,
      inScope: a
    }));
  }), {
    id: r,
    title: s,
    values: l
  };
}, F = ({ inData: d = [], inFooterConfig: o = [] } = {}) => {
  const t = d, e = o;
  if (!Array.isArray(e)) return [];
  const n = {}, a = [];
  return e.forEach((r) => {
    const s = _({
      inRowConfig: r,
      inData: t,
      inScope: n
    });
    r.id && (n[r.id] = s.values), a.push(s);
  }), a;
}, M = ({ inSource: d = {}, inResolveColumns: o } = {}) => {
  var i, c, l;
  const t = d, e = o, n = typeof e == "function" ? e({
    inColumnsCatalog: t == null ? void 0 : t.columns,
    inColumnKeys: (c = (i = t == null ? void 0 : t.config) == null ? void 0 : i.head) == null ? void 0 : c.columns
  }) : (t == null ? void 0 : t.columns) || [], a = $({
    inData: t == null ? void 0 : t.originalData
  }), r = O({
    inColumns: n,
    inData: a,
    inConfig: t == null ? void 0 : t.config
  }), s = F({
    inData: r.data,
    inFooterConfig: (l = t == null ? void 0 : t.config) == null ? void 0 : l.foot
  });
  return {
    activeColumns: r.columns,
    stateData: r.data,
    computedFooter: s,
    isSerialEnabled: r.isSerialEnabled
  };
}, V = ({ inQuery: d = "", inActiveColumns: o = [] } = {}) => {
  const t = d, e = o, n = new Set(
    (Array.isArray(e) ? e : []).map((a) => typeof a == "object" && a !== null ? a.key : a).filter(Boolean)
  );
  if (typeof t == "object" && t !== null) {
    if (t.type === "string")
      return {
        type: "string",
        value: String(t.value ?? "").trim().toLowerCase()
      };
    const a = t.type === "object" && typeof t.value == "object" && t.value !== null ? t.value : t, r = {};
    for (const [s, i] of Object.entries(a))
      if (n.has(s) && i !== void 0 && i !== null) {
        const c = String(i).trim().toLowerCase();
        c !== "" && (r[s] = c);
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
}, J = ({ inData: d = [], inQueryObject: o = {}, inActiveColumns: t = [] } = {}) => {
  const e = d, n = o, a = t;
  if (!Array.isArray(e)) return [];
  const r = n == null ? void 0 : n.type, s = n == null ? void 0 : n.value, i = Array.isArray(a) && a.length > 0 ? a.map((l) => typeof l == "object" && l !== null ? l.key : l).filter(Boolean) : null;
  if (r === "object") {
    const u = Object.entries(typeof s == "object" && s !== null ? s : {});
    return u.length === 0 ? [...e] : e.filter((m) => !m || typeof m != "object" ? !1 : u.every(([b, p]) => {
      const f = m[b];
      return f == null ? !1 : String(f).toLowerCase().includes(p);
    }));
  }
  const c = typeof s == "string" ? s : String(n ?? "").trim().toLowerCase();
  return c ? e.filter((l) => !l || typeof l != "object" ? !1 : (i ? i.map((m) => l[m]) : Object.values(l)).some((m) => m == null ? !1 : String(m).toLowerCase().includes(c))) : [...e];
}, W = ({ inData: d = [], inIsEnabled: o = !1 } = {}) => {
  const t = d;
  return !o || !Array.isArray(t) ? t : t.map((n, a) => ({
    ...n,
    serial: a + 1
  }));
}, j = ({ inStore: d, inData: o = [], inQuery: t = "" } = {}) => {
  var b;
  const e = d, n = o, a = t, r = e.library.activeColumns, s = e.library.isSerialEnabled, i = (b = e.source.config) == null ? void 0 : b.foot, c = V({
    inQuery: a,
    inActiveColumns: r
  }), l = J({
    inData: n,
    inQueryObject: c,
    inActiveColumns: r
  }), u = W({
    inData: l,
    inIsEnabled: s
  }), m = F({
    inData: u,
    inFooterConfig: i
  });
  return e.library.stateData = u, e.library.computedFooter = m, {
    activeColumns: e.library.activeColumns,
    stateData: e.library.stateData,
    computedFooter: e.library.computedFooter
  };
};
class H extends N {
  constructor({ inData: o = [], inColumns: t = [], inConfig: e = {} } = {}) {
    const n = o, a = t, r = e;
    super({
      inData: n,
      inColumns: a,
      inConfig: r
    }), this.library = M({
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
  filterOriginalData({ inQuery: o = "" } = {}) {
    const t = o;
    return j({
      inStore: this,
      inData: this.source.originalData,
      inQuery: t
    });
  }
  filterStateData({ inQuery: o = "" } = {}) {
    const t = o;
    return j({
      inStore: this,
      inData: this.library.stateData,
      inQuery: t
    });
  }
  filter({ inQuery: o = "" } = {}) {
    const t = o;
    return this.filterOriginalData({ inQuery: t });
  }
}
const S = ({
  inCellTagName: d = "td",
  inCells: o = [],
  inRowClass: t = "",
  inCellClass: e = ""
} = {}) => {
  const n = d, a = o, r = t, s = e;
  return {
    tagName: "tr",
    attributes: r ? { class: r } : {},
    children: a.map((i) => {
      const c = String(typeof i == "object" ? i.textContent ?? "" : i ?? ""), l = typeof i == "object" && i.class !== void 0 ? i.class : s, u = typeof i == "object" ? i.align : "", b = [l, u === "right" ? "text-end" : u === "center" ? "text-center" : ""].filter(Boolean).join(" ").trim(), p = b ? { class: b } : {};
      return typeof i == "object" && i.id && (p.id = i.id), {
        tagName: n,
        textContent: c,
        attributes: p
      };
    })
  };
}, z = ({ inColumns: d = [], inClasses: o = {} } = {}) => {
  const t = d, e = o, n = t.map((s) => ({
    textContent: s.label,
    align: s.align,
    id: s.id
  })), a = S({
    inCellTagName: "th",
    inCells: n,
    inCellClass: (e == null ? void 0 : e.th) || "",
    inRowClass: (e == null ? void 0 : e.tr) || ""
  });
  return {
    tagName: "thead",
    attributes: e != null && e.thead ? { class: e.thead } : {},
    children: [a]
  };
}, R = ({ inColumns: d = [], inData: o = [], inRowConfig: t = {}, inClasses: e = {} } = {}) => {
  const n = d, a = o, r = e;
  if (!Array.isArray(a) || a.length === 0) {
    const c = {
      tagName: "tr",
      children: [{
        tagName: "td",
        textContent: "No matching records found",
        attributes: {
          colspan: String(n.length),
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
  const s = a.map((c) => {
    const l = n.map((u) => ({
      textContent: u.key === "amount" ? Number(c[u.key]).toFixed(2) : String(c[u.key] ?? ""),
      align: u.align
    }));
    return S({
      inCellTagName: "td",
      inCells: l,
      inRowClass: (r == null ? void 0 : r.tr) || "",
      inCellClass: (r == null ? void 0 : r.td) || ""
    });
  });
  return {
    tagName: "tbody",
    attributes: r != null && r.tbody ? { class: r.tbody } : {},
    children: s
  };
}, P = ({ inColumns: d = [], inComputedFooter: o = [], inClasses: t = {} } = {}) => {
  const e = d, n = o, a = t;
  if (!Array.isArray(n) || n.length === 0)
    return null;
  const r = n.map((i, c) => {
    const l = i.title || "", u = i.values || {}, m = c === n.length - 1, b = e.findIndex((f) => !f.isSerial), p = e.map((f, C) => {
      if (u[f.key] !== void 0) {
        const h = u[f.key];
        return {
          textContent: typeof h == "number" ? h.toFixed(2) : String(h),
          align: f.align || "right",
          class: m ? "fw-bold" : "fw-semibold"
        };
      }
      return C === b ? {
        textContent: l,
        class: m ? "fw-bold text-uppercase" : "fw-semibold text-uppercase"
      } : {
        textContent: "",
        class: ""
      };
    });
    return S({
      inCellTagName: "td",
      inCells: p,
      inRowClass: m ? "table-light" : (a == null ? void 0 : a.tr) || "",
      inCellClass: (a == null ? void 0 : a.td) || ""
    });
  });
  return {
    tagName: "tfoot",
    attributes: a != null && a.tfoot ? { class: a.tfoot } : {},
    children: r
  };
}, G = ({ inColumns: d = [], inData: o = [], inComputedFooter: t = [], inRowConfig: e = {}, inClasses: n = {} } = {}) => {
  const a = d, r = o, s = t, i = e, c = n, l = z({ inColumns: a, inClasses: c }), u = R({ inColumns: a, inData: r, inRowConfig: i, inClasses: c }), m = P({ inColumns: a, inComputedFooter: s, inClasses: c });
  return {
    tagName: "table",
    attributes: c != null && c.table ? { class: c.table } : {},
    children: [l, u, m].filter(Boolean)
  };
}, E = ({ inSpec: d } = {}) => {
  var i, c, l;
  const o = d;
  if (!o || typeof o != "object") return null;
  if (Array.isArray(o)) {
    const u = o.map((m) => E({ inSpec: m })).filter(Boolean);
    return u.length > 0 ? u : null;
  }
  const e = (Array.isArray(o.children) ? o.children : []).map((u) => E({ inSpec: u })).filter(Boolean), n = ((i = o.attributes) == null ? void 0 : i.id) || o.id, a = !!n, r = e.length > 0;
  if (!a && !r)
    return null;
  const s = {
    tagName: o.tagName
  };
  return n && (s.id = n), (c = o.attributes) != null && c.name && (s.name = o.attributes.name), (l = o.attributes) != null && l.type && (s.type = o.attributes.type), o.attributes && (s.attributes = o.attributes), e.length > 0 && (s.children = e), s;
}, L = ({ inTableElement: d, inColumns: o = [], inData: t = [], inRowConfig: e = {}, inClasses: n = {} } = {}) => {
  var p, f;
  const a = d, r = o, s = t, i = e, c = n;
  if (!a) return;
  const l = R({
    inColumns: r,
    inData: s,
    inRowConfig: i,
    inClasses: c
  }), u = (f = (p = window.ks) == null ? void 0 : p["json-to-dom"]) == null ? void 0 : f.buildSpecElement;
  if (typeof u != "function") return;
  const m = u({ inSpec: l }), b = a.querySelector("tbody");
  b && m && b.replaceWith(m);
}, Q = ({ inTableElement: d, inColumns: o = [], inComputedFooter: t = [], inClasses: e = {} } = {}) => {
  var m, b;
  const n = d, a = o, r = t, s = e;
  if (!n) return;
  const i = P({
    inColumns: a,
    inComputedFooter: r,
    inClasses: s
  }), c = (b = (m = window.ks) == null ? void 0 : m["json-to-dom"]) == null ? void 0 : b.buildSpecElement;
  if (typeof c != "function") return;
  const l = i ? c({ inSpec: i }) : null, u = n.querySelector("tfoot");
  u && l ? u.replaceWith(l) : u && !l ? u.remove() : !u && l && n.appendChild(l);
}, I = ({ inTableElement: d, inStore: o } = {}) => {
  var n;
  const t = d, e = o;
  !t || !e || (L({
    inTableElement: t,
    inColumns: e.activeColumns,
    inData: e.stateData,
    inRowConfig: (n = e.config) == null ? void 0 : n.row
  }), Q({
    inTableElement: t,
    inColumns: e.activeColumns,
    inComputedFooter: e.computedFooter
  }));
}, X = ({ inTable: d, inQuery: o = "" } = {}) => {
  const t = d, e = o;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterOriginalData({ inQuery: e }), I({
    inTableElement: t.tableElement,
    inStore: t.store
  }));
}, Y = ({ inTable: d, inQuery: o = "" } = {}) => {
  const t = d, e = o;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterStateData({ inQuery: e }), I({
    inTableElement: t.tableElement,
    inStore: t.store
  }));
}, Z = {
  table: "table table-hover table-striped table-sm align-middle",
  thead: "table-light",
  th: "text-uppercase fw-semibold text-secondary",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "table-group-divider fw-bold"
}, tt = {
  table: "table table-borderless table-hover table-sm align-middle",
  thead: "border-bottom",
  th: "text-muted small text-uppercase",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "border-top text-secondary fw-bold"
}, et = {
  table: "table table-dark table-hover table-striped table-sm align-middle",
  thead: "table-dark",
  th: "text-uppercase fw-semibold",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "table-group-divider fw-bold border-secondary"
}, nt = {
  table: "table table-dark table-striped-columns table-sm align-middle border-secondary",
  thead: "table-active",
  th: "text-uppercase fw-bold text-light",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "table-group-divider fw-bold border-top border-secondary"
}, T = {
  default: {
    table: "table table-hover table-striped table-sm align-middle",
    thead: "table-light",
    th: "text-uppercase fw-semibold",
    tbody: "",
    tr: "",
    td: "",
    tfoot: "table-group-divider fw-bold"
  },
  light: Z,
  extraLight: tt,
  dark: et,
  extraDark: nt
};
class ot {
  constructor({ data: o = [], columns: t = [], config: e = {}, theme: n = "default", classes: a = null, dataProvider: r = null, targetContainerId: s = "table-container", inData: i, inColumns: c, inConfig: l, inTheme: u, inClasses: m, inDataProvider: b, inTargetContainerId: p } = {}) {
    const f = o || i || [], C = t || c || [], h = e || l || {}, y = u || n || (h == null ? void 0 : h.theme) || "default", w = T[y] || T.default || T, g = a || m || {}, v = b || r || null, D = s || p || "table-container";
    this.containerId = D, this.theme = y, this.classes = { ...w, ...(h == null ? void 0 : h.classes) || {}, ...g }, this.dataProvider = v, this.tableElement = null, this.controlsTree = null, this.store = new H({
      inData: f,
      inColumns: C,
      inConfig: h
    });
  }
  setTheme({ theme: o = "default", inTheme: t } = {}) {
    var a;
    const e = t || o || "default";
    this.theme = e;
    const n = T[e] || T.default || T;
    if (this.classes = { ...n, ...((a = this.store.config) == null ? void 0 : a.classes) || {} }, this.tableElement)
      return this.render();
  }
  async load({ inQuery: o = {}, query: t = null } = {}) {
    const e = t || o;
    if (!this.dataProvider || typeof this.dataProvider.read != "function")
      return console.warn("Table.load called without a valid dataProvider.read implementation"), this.store.stateData;
    const n = await this.dataProvider.read({ inQuery: e }), a = Array.isArray(n) ? n : (n == null ? void 0 : n.data) || [];
    return this.store.updateData({ inData: a }), this.render(), a;
  }
  async createRecord({ inItem: o = {}, item: t = null } = {}) {
    const e = t || o;
    if (!this.dataProvider || typeof this.dataProvider.create != "function")
      throw new Error("Table.createRecord requires a valid dataProvider.create implementation");
    const n = await this.dataProvider.create({ inItem: e });
    return await this.load(), n;
  }
  async updateRecord({ inId: o, id: t = null, inItem: e = {}, item: n = null } = {}) {
    const a = t ?? o, r = n || e;
    if (!this.dataProvider || typeof this.dataProvider.update != "function")
      throw new Error("Table.updateRecord requires a valid dataProvider.update implementation");
    const s = await this.dataProvider.update({ inId: a, inItem: r });
    return await this.load(), s;
  }
  async deleteRecord({ inId: o, id: t = null } = {}) {
    const e = t ?? o;
    if (!this.dataProvider || typeof this.dataProvider.delete != "function")
      throw new Error("Table.deleteRecord requires a valid dataProvider.delete implementation");
    const n = await this.dataProvider.delete({ inId: e });
    return await this.load(), n;
  }
  render() {
    var a, r, s;
    const o = document.getElementById(this.containerId);
    if (!o) return null;
    const t = G({
      inColumns: this.store.activeColumns,
      inData: this.store.stateData,
      inComputedFooter: this.store.computedFooter,
      inRowConfig: (a = this.store.config) == null ? void 0 : a.row,
      inClasses: this.classes
    });
    this.controlsTree = E({ inSpec: t });
    const e = (s = (r = window.ks) == null ? void 0 : r["json-to-dom"]) == null ? void 0 : s.buildSpecElement;
    if (typeof e != "function")
      return console.error("json-to-dom buildSpecElement not found on window.ks"), this.controlsTree;
    const n = e({ inSpec: t });
    return this.tableElement = Array.isArray(n) ? n[0] : n, o.innerHTML = "", o.appendChild(this.tableElement), {
      treeWithIds: this.controlsTree,
      spec: t,
      element: this.tableElement
    };
  }
  getControlsTree() {
    return this.controlsTree;
  }
  repaintBody() {
    var o;
    this.tableElement && L({
      inTableElement: this.tableElement,
      inColumns: this.store.activeColumns,
      inData: this.store.stateData,
      inRowConfig: (o = this.store.config) == null ? void 0 : o.row,
      inClasses: this.classes
    });
  }
  repaintFoot() {
    this.tableElement && Q({
      inTableElement: this.tableElement,
      inColumns: this.store.activeColumns,
      inComputedFooter: this.store.computedFooter,
      inClasses: this.classes
    });
  }
  refreshTable() {
    this.tableElement && I({
      inTableElement: this.tableElement,
      inStore: this.store
    });
  }
  filterOriginalData({ query: o = "", inQuery: t = "" } = {}) {
    X({
      inTable: this,
      inQuery: o || t
    });
  }
  filterStateData({ query: o = "", inQuery: t = "" } = {}) {
    Y({
      inTable: this,
      inQuery: o || t
    });
  }
  filter({ query: o = "", inQuery: t = "" } = {}) {
    const e = o || t;
    this.filterOriginalData({ query: e });
  }
}
const at = ({ inHeadConfig: d = {} } = {}) => {
  const o = d, t = (o == null ? void 0 : o.title) || "", e = (o == null ? void 0 : o.subtitle) || "";
  if (!t && !e) return null;
  const n = [];
  return t && n.push({
    tagName: "label",
    textContent: t,
    attributes: {
      class: "block text-lg font-bold text-slate-900"
    }
  }), e && n.push({
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
    children: n
  };
}, rt = ({ inColumn: d = {}, inClasses: o = {} } = {}) => {
  const t = d, e = o, n = t.key || "", a = t.label || n, r = t.type === "number" ? "number" : "text", s = {
    tagName: "label",
    textContent: a,
    attributes: e != null && e.label ? { class: e.label } : {}
  }, i = t.datalist === !0 || t.datalist !== !1 && r !== "number", c = t.datalistId || `${n}-datalist`, l = {
    type: r,
    name: n,
    placeholder: `Enter ${a}...`
  };
  e != null && e.input && (l.class = e.input), i && (l.list = c);
  const u = {
    tagName: "input",
    attributes: l
  };
  t.id && (u.attributes.id = t.id, s.attributes.for = t.id);
  const m = {
    tagName: "button",
    textContent: "Search",
    attributes: {
      type: "button",
      id: t.searchId || `${n}-search`,
      name: `${n}-search`,
      "data-key": n,
      class: (e == null ? void 0 : e.button) || "btn btn-outline-secondary"
    }
  }, b = {
    tagName: "div",
    attributes: e != null && e.group ? { class: e.group } : {},
    children: [u, m]
  };
  return {
    tagName: "div",
    attributes: e != null && e.field ? { class: e.field } : {},
    children: [s, b]
  };
}, st = ({ inColumns: d = [], inClasses: o = {} } = {}) => {
  const t = d, e = o;
  if (!Array.isArray(t)) return { tagName: "div", children: [] };
  const n = t.map((r) => rt({ inColumn: r, inClasses: e }));
  return {
    tagName: "div",
    attributes: e != null && e.body ? { class: e.body } : {},
    children: n
  };
}, it = ({ inFootConfig: d = {} } = {}) => {
  const o = d, t = o == null ? void 0 : o.buttons;
  if (!Array.isArray(t) || t.length === 0) return null;
  const e = t.map((n) => {
    const r = n.variant === "primary" ? "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer" : "px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-150 ease-in-out cursor-pointer", s = {
      type: n.type || "button",
      name: n.name || "",
      class: r
    };
    return n.id && (s.id = n.id), {
      tagName: "button",
      textContent: n.label || n.name,
      attributes: s
    };
  });
  return {
    tagName: "div",
    attributes: {
      class: "flex items-center justify-end gap-3 pt-4 mt-2 border-t border-slate-200"
    },
    children: e
  };
}, lt = ({ inColumns: d = [], inConfig: o = {}, inClasses: t = {} } = {}) => {
  const e = d, n = o, a = t, r = at({ inHeadConfig: n == null ? void 0 : n.head }), s = st({ inColumns: e, inClasses: a }), i = it({ inFootConfig: n == null ? void 0 : n.foot });
  return {
    tagName: "div",
    attributes: a != null && a.form ? { class: a.form } : {},
    children: [r, s, i].filter(Boolean)
  };
};
class ct extends N {
  constructor({ inColumns: o = [], inConfig: t = {} } = {}) {
    const e = o, n = t;
    super({
      inColumns: e,
      inConfig: n
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: o } = {}) {
    var n, a;
    const t = o;
    return {
      activeColumns: this._resolveActiveColumns({
        inColumnsCatalog: t == null ? void 0 : t.columns,
        inColumnKeys: (a = (n = t == null ? void 0 : t.config) == null ? void 0 : n.body) == null ? void 0 : a.columns
      })
    };
  }
  get activeColumns() {
    return this.library.activeColumns;
  }
}
const dt = {
  form: "card p-3 shadow-sm mb-3 bg-light border-light-subtle",
  body: "row g-3 align-items-end",
  field: "col-md-4",
  label: "form-label form-label-sm fw-semibold text-secondary mb-1",
  group: "input-group input-group-sm",
  input: "form-control bg-white",
  button: "btn btn-outline-primary"
}, ut = {
  form: "p-2 mb-3 bg-transparent border-0 shadow-none",
  body: "row g-2 align-items-end",
  field: "col-md-4",
  label: "form-label form-label-sm text-muted mb-1",
  group: "input-group input-group-sm",
  input: "form-control border-secondary border-opacity-25",
  button: "btn btn-light border"
}, mt = {
  form: "card p-3 shadow-sm mb-3 bg-dark text-light border-secondary",
  body: "row g-3 align-items-end",
  field: "col-md-4",
  label: "form-label form-label-sm fw-semibold text-light mb-1",
  group: "input-group input-group-sm",
  input: "form-control bg-dark text-light border-secondary",
  button: "btn btn-outline-light"
}, bt = {
  form: "card p-3 shadow-sm mb-3 bg-black text-light border-secondary border-opacity-50",
  body: "row g-3 align-items-end",
  field: "col-md-4",
  label: "form-label form-label-sm fw-bold text-white mb-1",
  group: "input-group input-group-sm",
  input: "form-control bg-dark text-white border-secondary",
  button: "btn btn-primary"
}, x = {
  default: {
    form: "card p-3 shadow-sm mb-3",
    body: "row g-3 align-items-end",
    field: "col-md-4",
    label: "form-label form-label-sm fw-semibold mb-1",
    group: "input-group input-group-sm",
    input: "form-control",
    button: "btn btn-outline-secondary"
  },
  light: dt,
  extraLight: ut,
  dark: mt,
  extraDark: bt
};
class ft {
  constructor({ columns: o = [], config: t = {}, theme: e = "default", classes: n = null, targetContainerId: a = "form-container", inColumns: r, inConfig: s, inTheme: i, inClasses: c, inTargetContainerId: l } = {}) {
    const u = o || r || [], m = t || s || {}, b = i || e || (m == null ? void 0 : m.theme) || "default", p = x[b] || x.default || x, f = n || c || {}, C = a || l || "form-container";
    this.containerId = C, this.theme = b, this.classes = { ...p, ...(m == null ? void 0 : m.classes) || {}, ...f }, this.formElement = null, this.controlsTree = null, this.store = new ct({
      inColumns: u,
      inConfig: m
    });
  }
  setTheme({ theme: o = "default", inTheme: t } = {}) {
    var a;
    const e = t || o || "default";
    this.theme = e;
    const n = x[e] || x.default || x;
    if (this.classes = { ...n, ...((a = this.store.config) == null ? void 0 : a.classes) || {} }, this.formElement)
      return this.render();
  }
  get columns() {
    return this.store.activeColumns;
  }
  get config() {
    return this.store.config;
  }
  render() {
    var a, r;
    const o = document.getElementById(this.containerId);
    if (!o) return null;
    const t = lt({
      inColumns: this.store.activeColumns,
      inConfig: this.store.config,
      inClasses: this.classes
    });
    this.controlsTree = E({ inSpec: t });
    const e = (r = (a = window.ks) == null ? void 0 : a["json-to-dom"]) == null ? void 0 : r.buildSpecElement;
    if (typeof e != "function")
      return console.error("json-to-dom buildSpecElement not found on window.ks"), this.controlsTree;
    const n = e({ inSpec: t });
    return this.formElement = Array.isArray(n) ? n[0] : n, o.innerHTML = "", o.appendChild(this.formElement), {
      treeWithIds: this.controlsTree,
      spec: t,
      element: this.formElement
    };
  }
  getControlsTree() {
    return this.controlsTree;
  }
}
const k = ({ inData: d = [], inKey: o = "", inTopN: t = 100 } = {}) => {
  const e = d, n = o, a = t;
  if (!Array.isArray(e) || !n) return [];
  const r = /* @__PURE__ */ new Map();
  for (const c of e) {
    if (!c || typeof c != "object") continue;
    const l = c[n];
    if (l != null) {
      const u = String(l).trim();
      u !== "" && r.set(u, (r.get(u) || 0) + 1);
    }
  }
  const s = Array.from(r.entries()).map(([c, l]) => ({ value: c, count: l })).sort((c, l) => l.count - c.count);
  return (a > 0 && Number.isFinite(a) ? s.slice(0, a) : s).map(({ value: c, count: l }) => ({
    tagName: "option",
    attributes: {
      value: c,
      label: `${c} (${l})`
    },
    textContent: `${c} (${l})`
  }));
}, pt = ({ inData: d = [], inColumns: o = [], inTopN: t = 100 } = {}) => {
  const e = d, n = o, a = t;
  if (!Array.isArray(n) || n.length === 0)
    return {
      tagName: "div",
      attributes: { id: "ks-datalists-wrapper" },
      children: []
    };
  const r = n.map((s) => {
    const i = s.key || "", c = s.datalistId || `${i}-datalist`, l = k({
      inData: e,
      inKey: i,
      inTopN: a
    });
    return {
      tagName: "datalist",
      attributes: {
        id: c
      },
      children: l
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
class ht extends N {
  constructor({ inData: o = [], inColumns: t = [], inConfig: e = {}, inTopN: n = 100 } = {}) {
    const a = o, r = t, s = e, i = n;
    super({
      inData: a,
      inColumns: r,
      inConfig: s,
      inTopN: i
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: o } = {}) {
    var r, s, i, c, l;
    const t = o, e = this._resolveActiveColumns({
      inColumnsCatalog: t == null ? void 0 : t.columns,
      inColumnKeys: ((s = (r = t == null ? void 0 : t.config) == null ? void 0 : r.datalist) == null ? void 0 : s.columns) || ((i = t == null ? void 0 : t.config) == null ? void 0 : i.columns)
    }), n = $({
      inData: t == null ? void 0 : t.originalData
    }), a = ((l = (c = t == null ? void 0 : t.config) == null ? void 0 : c.datalist) == null ? void 0 : l.topN) ?? (t == null ? void 0 : t.topN) ?? 100;
    return {
      activeColumns: e,
      stateData: n,
      topN: a
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
  updateData({ inData: o = [] } = {}) {
    const t = o;
    return this.library.stateData = Array.isArray(t) ? t : [], this.library.stateData;
  }
}
const yt = {
  wrapper: "ks-datalists-wrapper ks-datalist-light",
  datalist: "",
  option: ""
}, gt = {
  wrapper: "ks-datalists-wrapper ks-datalist-extralight",
  datalist: "",
  option: ""
}, Ct = {
  wrapper: "ks-datalists-wrapper ks-datalist-dark",
  datalist: "",
  option: ""
}, wt = {
  wrapper: "ks-datalists-wrapper ks-datalist-extradark",
  datalist: "",
  option: ""
}, A = {
  default: {
    wrapper: "ks-datalists-wrapper",
    datalist: "",
    option: ""
  },
  light: yt,
  extraLight: gt,
  dark: Ct,
  extraDark: wt
};
class vt {
  constructor({ data: o = [], columns: t = [], config: e = {}, theme: n = "default", classes: a = null, dataProvider: r = null, targetContainerId: s = "datalist-container", inData: i, inColumns: c, inConfig: l, inTheme: u, inClasses: m, inDataProvider: b, inTargetContainerId: p } = {}) {
    const f = o || i || [], C = t || c || [], h = e || l || {}, y = u || n || (h == null ? void 0 : h.theme) || "default", w = A[y] || A.default || A, g = a || m || {}, v = b || r || null, D = s || p || "datalist-container";
    this.containerId = D, this.theme = y, this.classes = { ...w, ...(h == null ? void 0 : h.classes) || {}, ...g }, this.dataProvider = v, this.element = null, this.spec = null, this.store = new ht({
      inData: f,
      inColumns: C,
      inConfig: h
    });
  }
  setTheme({ theme: o = "default", inTheme: t } = {}) {
    var a;
    const e = t || o || "default";
    this.theme = e;
    const n = A[e] || A.default || A;
    if (this.classes = { ...n, ...((a = this.store.config) == null ? void 0 : a.classes) || {} }, this.element)
      return this.render();
  }
  async load({ inQuery: o = {}, query: t = null } = {}) {
    const e = t || o;
    if (!this.dataProvider || typeof this.dataProvider.read != "function")
      return console.warn("DataList.load called without a valid dataProvider.read implementation"), this.store.stateData;
    const n = await this.dataProvider.read({ inQuery: e }), a = Array.isArray(n) ? n : (n == null ? void 0 : n.data) || [];
    return this.store.updateData({ inData: a }), this.render(), a;
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
    var a, r;
    if (typeof document > "u") return null;
    let o = document.getElementById(this.containerId);
    o || (o = document.createElement("div"), o.id = this.containerId, document.body.appendChild(o));
    const t = pt({
      inData: this.store.stateData,
      inColumns: this.store.activeColumns,
      inTopN: this.store.topN
    });
    this.spec = t;
    const e = (r = (a = window.ks) == null ? void 0 : a["json-to-dom"]) == null ? void 0 : r.buildSpecElement;
    let n = null;
    if (typeof e != "function") {
      const s = document.createElement("div");
      s.id = "ks-datalists-wrapper";
      for (const i of this.store.activeColumns) {
        const c = i.key || "", l = i.datalistId || `${c}-datalist`, u = document.createElement("datalist");
        u.id = l;
        const m = k({
          inData: this.store.stateData,
          inKey: c,
          inTopN: this.store.topN
        });
        for (const b of m) {
          const p = document.createElement("option");
          p.value = b.attributes.value, p.label = b.attributes.label, p.textContent = b.textContent, u.appendChild(p);
        }
        s.appendChild(u);
      }
      n = s;
    } else {
      const s = e({ inSpec: t });
      if (n = Array.isArray(s) ? s[0] : s, !n || n.children.length === 0) {
        const i = document.createElement("div");
        i.id = "ks-datalists-wrapper";
        for (const c of this.store.activeColumns) {
          const l = c.key || "", u = c.datalistId || `${l}-datalist`, m = document.createElement("datalist");
          m.id = u;
          const b = k({
            inData: this.store.stateData,
            inKey: l,
            inTopN: this.store.topN
          });
          for (const p of b) {
            const f = document.createElement("option");
            f.value = p.attributes.value, f.label = p.attributes.label, f.textContent = p.textContent, m.appendChild(f);
          }
          i.appendChild(m);
        }
        n = i;
      }
    }
    return this.element = n, o.innerHTML = "", this.element && o.appendChild(this.element), {
      spec: this.spec,
      element: this.element
    };
  }
  update({ data: o = [], inData: t } = {}) {
    const e = o.length > 0 ? o : t || [];
    return this.store.updateData({ inData: e }), this.render();
  }
}
const Dt = ({
  inBaseUrl: d = "",
  inReadUrl: o = "",
  inCreateUrl: t = "",
  inUpdateUrl: e = "",
  inDeleteUrl: n = "",
  inHeaders: a = {},
  inFetchOptions: r = {},
  inCustom: s = {}
} = {}) => {
  const i = d, c = o || i, l = t || i, u = e || i, m = n || i, b = {
    "Content-Type": "application/json",
    ...a
  }, p = r, f = s;
  return {
    read: async ({ inQuery: C = {}, inUrl: h } = {}) => {
      const y = C;
      if (typeof f.read == "function")
        return await f.read({ inQuery: y });
      const w = h || c;
      if (!w) return [];
      let g = w;
      if (y && typeof y == "object" && Object.keys(y).length > 0) {
        const D = new URLSearchParams(y).toString();
        D && (g += (g.includes("?") ? "&" : "?") + D);
      }
      const v = await fetch(g, {
        method: "GET",
        headers: b,
        ...p
      });
      if (!v.ok)
        throw new Error(`DataProvider read failed: ${v.status} ${v.statusText}`);
      return await v.json();
    },
    create: async ({ inItem: C = {}, inUrl: h } = {}) => {
      const y = C;
      if (typeof f.create == "function")
        return await f.create({ inItem: y });
      const g = await fetch(h || l, {
        method: "POST",
        headers: b,
        body: JSON.stringify(y),
        ...p
      });
      if (!g.ok)
        throw new Error(`DataProvider create failed: ${g.status} ${g.statusText}`);
      return await g.json();
    },
    update: async ({ inId: C, inItem: h = {}, inUrl: y } = {}) => {
      const w = C, g = h;
      if (typeof f.update == "function")
        return await f.update({ inId: w, inItem: g });
      let v = y || u;
      w != null && (v.includes(":id") ? v = v.replace(":id", encodeURIComponent(w)) : v = `${v.replace(/\/$/, "")}/${encodeURIComponent(w)}`);
      const D = await fetch(v, {
        method: "PUT",
        headers: b,
        body: JSON.stringify(g),
        ...p
      });
      if (!D.ok)
        throw new Error(`DataProvider update failed: ${D.status} ${D.statusText}`);
      return await D.json();
    },
    delete: async ({ inId: C, inUrl: h } = {}) => {
      const y = C;
      if (typeof f.delete == "function")
        return await f.delete({ inId: y });
      let w = h || m;
      y != null && (w.includes(":id") ? w = w.replace(":id", encodeURIComponent(y)) : w = `${w.replace(/\/$/, "")}/${encodeURIComponent(y)}`);
      const g = await fetch(w, {
        method: "DELETE",
        headers: b,
        ...p
      });
      if (!g.ok)
        throw new Error(`DataProvider delete failed: ${g.status} ${g.statusText}`);
      return await g.json();
    }
  };
};
createDataProvider;
window.ks ?? (window.ks = {});
window.ks["json-to-dom-renderers"] = {
  Table: ot,
  Form: ft,
  DataList: vt,
  createDataProvider: Dt
};
export {
  vt as DataList,
  ft as Form,
  ot as Table,
  Dt as createDataProvider
};
