class x {
  constructor({ inData: e = [], inColumns: t = [], inConfig: o = {}, inTopN: n } = {}) {
    const s = e, a = t, r = o, i = n;
    this.source = this._buildSource({
      inData: s,
      inColumns: a,
      inConfig: r,
      inTopN: i
    });
  }
  _buildSource({ inData: e = [], inColumns: t = [], inConfig: o = {}, inTopN: n } = {}) {
    const s = e, a = t, r = o, i = n;
    return {
      originalData: Array.isArray(s) ? typeof structuredClone == "function" ? structuredClone(s) : JSON.parse(JSON.stringify(s)) : [],
      columns: Array.isArray(a) ? a : [],
      config: r || {},
      topN: i
    };
  }
  _resolveActiveColumns({ inColumnsCatalog: e = [], inColumnKeys: t = [] } = {}) {
    const o = e, n = t;
    if (Array.isArray(n) && n.length > 0) {
      const s = new Map((Array.isArray(o) ? o : []).map((a) => [a.key, a]));
      return n.map((a) => s.get(a)).filter(Boolean);
    }
    return Array.isArray(o) ? o : [];
  }
  get rawData() {
    return this.source.originalData;
  }
  get config() {
    return this.source.config;
  }
}
const P = ({ inData: l = [] } = {}) => {
  const e = l;
  return Array.isArray(e) ? typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e)) : [];
}, _ = ({ inColumns: l = [], inData: e = [], inConfig: t = {}, inLabel: o } = {}) => {
  var f, p;
  const n = l, s = e, a = t, r = o;
  if (!!!(a != null && a.serial || (f = a == null ? void 0 : a.table) != null && f.serial || (p = a == null ? void 0 : a.head) != null && p.serial))
    return {
      columns: n,
      data: s,
      isSerialEnabled: !1
    };
  const u = {
    key: "serial",
    label: r || typeof (a == null ? void 0 : a.serial) == "object" && a.serial.label || "#",
    align: "center",
    isSerial: !0
  }, m = (Array.isArray(n) ? n : []).some((g) => g.key === "serial") ? n : [u, ...Array.isArray(n) ? n : []], b = (Array.isArray(s) ? s : []).map((g, y) => ({
    serial: y + 1,
    ...g || {}
  }));
  return {
    columns: m,
    data: b,
    isSerialEnabled: !0
  };
}, M = ({ inData: l = [], inKey: e } = {}) => {
  const t = l, o = e;
  return !Array.isArray(t) || !o ? 0 : t.reduce((n, s) => {
    const a = Number(s == null ? void 0 : s[o]);
    return n + (isNaN(a) ? 0 : a);
  }, 0);
}, V = ({ inData: l = [] } = {}) => {
  const e = l;
  return Array.isArray(e) ? e.length : 0;
}, J = {
  sum: M,
  count: V
}, z = ({ inExpression: l = "", inScope: e = {} } = {}) => {
  const t = l, o = e;
  try {
    const n = Object.keys(o), s = Object.values(o);
    return new Function(...n, `return ${t};`)(...s);
  } catch (n) {
    return console.error(`Error evaluating expression "${t}":`, n), 0;
  }
}, H = ({ inRowConfig: l = {}, inData: e = [], inScope: t = {} } = {}) => {
  const o = l, n = e, s = t, a = o.id || "", r = o.title || "", i = o.type || "aggregate", c = o.values || {}, u = {};
  return i === "aggregate" ? Object.entries(c).forEach(([d, m]) => {
    const b = J[m];
    typeof b == "function" && (u[d] = b({ inData: n, inKey: d }));
  }) : i === "eval" && Object.entries(c).forEach(([d, m]) => {
    typeof m == "string" && (u[d] = z({
      inExpression: m,
      inScope: s
    }));
  }), {
    id: a,
    title: r,
    values: u
  };
}, B = ({ inData: l = [], inFooterConfig: e = [] } = {}) => {
  const t = l, o = e;
  if (!Array.isArray(o)) return [];
  const n = {}, s = [];
  return o.forEach((a) => {
    const r = H({
      inRowConfig: a,
      inData: t,
      inScope: n
    });
    a.id && (n[a.id] = r.values), s.push(r);
  }), s;
}, F = ({ inSource: l = {}, inResolveColumns: e } = {}) => {
  var i, c, u;
  const t = l, o = e, n = typeof o == "function" ? o({
    inColumnsCatalog: t == null ? void 0 : t.columns,
    inColumnKeys: (c = (i = t == null ? void 0 : t.config) == null ? void 0 : i.head) == null ? void 0 : c.columns
  }) : (t == null ? void 0 : t.columns) || [], s = P({
    inData: t == null ? void 0 : t.originalData
  }), a = _({
    inColumns: n,
    inData: s,
    inConfig: t == null ? void 0 : t.config
  }), r = B({
    inData: a.data,
    inFooterConfig: (u = t == null ? void 0 : t.config) == null ? void 0 : u.foot
  });
  return {
    activeColumns: a.columns,
    stateData: a.data,
    computedFooter: r,
    isSerialEnabled: a.isSerialEnabled
  };
}, G = ({ inQuery: l = "", inActiveColumns: e = [] } = {}) => {
  const t = l, o = e, n = new Set(
    (Array.isArray(o) ? o : []).map((s) => typeof s == "object" && s !== null ? s.key : s).filter(Boolean)
  );
  if (typeof t == "object" && t !== null) {
    if (t.type === "string")
      return {
        type: "string",
        value: String(t.value ?? "").trim().toLowerCase()
      };
    const s = t.type === "object" && typeof t.value == "object" && t.value !== null ? t.value : t, a = {};
    for (const [r, i] of Object.entries(s))
      if (n.has(r) && i !== void 0 && i !== null) {
        const c = String(i).trim().toLowerCase();
        c !== "" && (a[r] = c);
      }
    return {
      type: "object",
      value: a
    };
  }
  return {
    type: "string",
    value: String(t ?? "").trim().toLowerCase()
  };
}, X = ({ inData: l = [], inQueryObject: e = {}, inActiveColumns: t = [] } = {}) => {
  const o = l, n = e, s = t;
  if (!Array.isArray(o)) return [];
  const a = n == null ? void 0 : n.type, r = n == null ? void 0 : n.value, i = Array.isArray(s) && s.length > 0 ? s.map((u) => typeof u == "object" && u !== null ? u.key : u).filter(Boolean) : null;
  if (a === "object") {
    const d = Object.entries(typeof r == "object" && r !== null ? r : {});
    return d.length === 0 ? [...o] : o.filter((m) => !m || typeof m != "object" ? !1 : d.every(([b, f]) => {
      const p = m[b];
      return p == null ? !1 : String(p).toLowerCase().includes(f);
    }));
  }
  const c = typeof r == "string" ? r : String(n ?? "").trim().toLowerCase();
  return c ? o.filter((u) => !u || typeof u != "object" ? !1 : (i ? i.map((m) => u[m]) : Object.values(u)).some((m) => m == null ? !1 : String(m).toLowerCase().includes(c))) : [...o];
}, Y = ({ inData: l = [], inIsEnabled: e = !1 } = {}) => {
  const t = l;
  return !e || !Array.isArray(t) ? t : t.map((n, s) => ({
    ...n,
    serial: s + 1
  }));
}, R = ({ inStore: l, inData: e = [], inQuery: t = "" } = {}) => {
  var b;
  const o = l, n = e, s = t, a = o.library.activeColumns, r = o.library.isSerialEnabled, i = (b = o.source.config) == null ? void 0 : b.foot, c = G({
    inQuery: s,
    inActiveColumns: a
  }), u = X({
    inData: n,
    inQueryObject: c,
    inActiveColumns: a
  }), d = Y({
    inData: u,
    inIsEnabled: r
  }), m = B({
    inData: d,
    inFooterConfig: i
  });
  return o.library.stateData = d, o.library.computedFooter = m, {
    activeColumns: o.library.activeColumns,
    stateData: o.library.stateData,
    computedFooter: o.library.computedFooter
  };
};
class Z extends x {
  constructor({ inData: e = [], inColumns: t = [], inConfig: o = {} } = {}) {
    const n = e, s = t, a = o;
    super({
      inData: n,
      inColumns: s,
      inConfig: a
    }), this.library = F({
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
  updateData({ inData: e = [] } = {}) {
    const t = e;
    return this.source.originalData = Array.isArray(t) ? t : [], this.library = F({
      inSource: this.source,
      inResolveColumns: this._resolveActiveColumns.bind(this)
    }), this.library.stateData;
  }
  filterOriginalData({ inQuery: e = "" } = {}) {
    const t = e;
    return R({
      inStore: this,
      inData: this.source.originalData,
      inQuery: t
    });
  }
  filterStateData({ inQuery: e = "" } = {}) {
    const t = e;
    return R({
      inStore: this,
      inData: this.library.stateData,
      inQuery: t
    });
  }
  filter({ inQuery: e = "" } = {}) {
    const t = e;
    return this.filterOriginalData({ inQuery: t });
  }
}
const k = ({
  inCellTagName: l = "td",
  inCells: e = [],
  inRowClass: t = "",
  inCellClass: o = ""
} = {}) => {
  const n = l, s = e, a = t, r = o;
  return {
    tagName: "tr",
    attributes: a ? { class: a } : {},
    children: s.map((i) => {
      const c = String(typeof i == "object" ? i.textContent ?? "" : i ?? ""), u = typeof i == "object" && i.class !== void 0 ? i.class : r, d = typeof i == "object" ? i.align : "", b = [u, d === "right" ? "text-end" : d === "center" ? "text-center" : ""].filter(Boolean).join(" ").trim(), f = b ? { class: b } : {};
      return typeof i == "object" && i.id && (f.id = i.id), {
        tagName: n,
        textContent: c,
        attributes: f
      };
    })
  };
}, tt = ({ inColumns: l = [], inClasses: e = {} } = {}) => {
  const t = l, o = e, n = t.map((r) => ({
    textContent: r.label,
    align: r.align,
    id: r.id
  })), s = k({
    inCellTagName: "th",
    inCells: n,
    inCellClass: (o == null ? void 0 : o.th) || "",
    inRowClass: (o == null ? void 0 : o.tr) || ""
  });
  return {
    tagName: "thead",
    attributes: o != null && o.thead ? { class: o.thead } : {},
    children: [s]
  };
}, Q = ({ inColumns: l = [], inData: e = [], inRowConfig: t = {}, inClasses: o = {} } = {}) => {
  const n = l, s = e, a = o;
  if (!Array.isArray(s) || s.length === 0) {
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
      attributes: a != null && a.tbody ? { class: a.tbody } : {},
      children: [c]
    };
  }
  const r = s.map((c) => {
    const u = n.map((d) => ({
      textContent: d.key === "amount" ? Number(c[d.key]).toFixed(2) : String(c[d.key] ?? ""),
      align: d.align
    }));
    return k({
      inCellTagName: "td",
      inCells: u,
      inRowClass: (a == null ? void 0 : a.tr) || "",
      inCellClass: (a == null ? void 0 : a.td) || ""
    });
  });
  return {
    tagName: "tbody",
    attributes: a != null && a.tbody ? { class: a.tbody } : {},
    children: r
  };
}, W = ({ inColumns: l = [], inComputedFooter: e = [], inClasses: t = {} } = {}) => {
  const o = l, n = e, s = t;
  if (!Array.isArray(n) || n.length === 0)
    return null;
  const a = n.map((i, c) => {
    const u = i.title || "", d = i.values || {}, m = c === n.length - 1, b = o.findIndex((p) => !p.isSerial), f = o.map((p, g) => {
      if (d[p.key] !== void 0) {
        const y = d[p.key];
        return {
          textContent: typeof y == "number" ? y.toFixed(2) : String(y),
          align: p.align || "right",
          class: m ? "fw-bold" : "fw-semibold"
        };
      }
      return g === b ? {
        textContent: u,
        class: m ? "fw-bold text-uppercase" : "fw-semibold text-uppercase"
      } : {
        textContent: "",
        class: ""
      };
    });
    return k({
      inCellTagName: "td",
      inCells: f,
      inRowClass: m ? "table-light" : (s == null ? void 0 : s.tr) || "",
      inCellClass: (s == null ? void 0 : s.td) || ""
    });
  });
  return {
    tagName: "tfoot",
    attributes: s != null && s.tfoot ? { class: s.tfoot } : {},
    children: a
  };
}, et = ({ inColumns: l = [], inData: e = [], inComputedFooter: t = [], inRowConfig: o = {}, inClasses: n = {} } = {}) => {
  const s = l, a = e, r = t, i = o, c = n, u = tt({ inColumns: s, inClasses: c }), d = Q({ inColumns: s, inData: a, inRowConfig: i, inClasses: c }), m = W({ inColumns: s, inComputedFooter: r, inClasses: c });
  return {
    tagName: "table",
    attributes: c != null && c.table ? { class: c.table } : {},
    children: [u, d, m].filter(Boolean)
  };
}, T = ({ inSpec: l } = {}) => {
  var i, c, u;
  const e = l;
  if (!e || typeof e != "object") return null;
  if (Array.isArray(e)) {
    const d = e.map((m) => T({ inSpec: m })).filter(Boolean);
    return d.length > 0 ? d : null;
  }
  const o = (Array.isArray(e.children) ? e.children : []).map((d) => T({ inSpec: d })).filter(Boolean), n = ((i = e.attributes) == null ? void 0 : i.id) || e.id, s = !!n, a = o.length > 0;
  if (!s && !a)
    return null;
  const r = {
    tagName: e.tagName
  };
  return n && (r.id = n), (c = e.attributes) != null && c.name && (r.name = e.attributes.name), (u = e.attributes) != null && u.type && (r.type = e.attributes.type), e.attributes && (r.attributes = e.attributes), o.length > 0 && (r.children = o), r;
}, ot = ({ inTable: l } = {}) => {
  var i, c, u;
  const e = l;
  if (!e) return null;
  const t = document.getElementById(e.containerId);
  if (!t) return null;
  const o = et({
    inColumns: e.store.activeColumns,
    inData: e.store.stateData,
    inComputedFooter: e.store.computedFooter,
    inRowConfig: (i = e.store.config) == null ? void 0 : i.row,
    inClasses: e.classes
  }), n = T({ inSpec: o }), s = (u = (c = window.ks) == null ? void 0 : c["json-to-dom"]) == null ? void 0 : u.buildSpecElement;
  if (typeof s != "function")
    return console.error("json-to-dom buildSpecElement not found on window.ks"), {
      treeWithIds: n,
      spec: o,
      element: null
    };
  const a = s({ inSpec: o }), r = Array.isArray(a) ? a[0] : a;
  return t.innerHTML = "", t.appendChild(r), {
    treeWithIds: n,
    spec: o,
    element: r
  };
}, nt = {
  table: "table table-sm align-middle",
  thead: "",
  th: "text-uppercase fw-semibold small",
  tbody: "",
  tr: "",
  td: "py-1",
  tfoot: "table-group-divider fw-bold small"
}, st = {
  table: "table table-bordered table-sm align-middle",
  thead: "",
  th: "text-uppercase fw-semibold",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "table-group-divider fw-bold"
}, at = {
  table: "table table-borderless table-sm align-middle",
  thead: "border-bottom",
  th: "text-uppercase fw-semibold",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "border-top fw-bold"
}, A = {
  default: {
    table: "table align-middle",
    thead: "",
    th: "text-uppercase fw-semibold",
    tbody: "",
    tr: "",
    td: "",
    tfoot: "table-group-divider fw-bold"
  },
  compact: nt,
  bordered: st,
  borderless: at
}, rt = {
  table: "table-hover table-striped",
  thead: "table-light",
  th: "text-secondary",
  tbody: "",
  tr: "",
  td: "",
  tfoot: ""
}, it = {
  table: "table-hover",
  thead: "",
  th: "text-muted",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "text-secondary"
}, lt = {
  table: "table-dark table-hover table-striped",
  thead: "table-dark",
  th: "",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "border-secondary"
}, ct = {
  table: "table-dark table-striped-columns border-secondary",
  thead: "table-active",
  th: "text-light",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "border-secondary"
}, E = {
  default: {
    table: "table-hover table-striped",
    thead: "table-light",
    th: "",
    tbody: "",
    tr: "",
    td: "",
    tfoot: ""
  },
  light: rt,
  extraLight: it,
  dark: lt,
  extraDark: ct
}, ut = ({ inTable: l, inTheme: e = "default" } = {}) => {
  var n, s;
  const t = l, o = e || "default";
  if (t && (t.theme = o, t.classes = S({
    inLayout: t.layout,
    inTheme: t.theme,
    inConfigClasses: (s = (n = t.store) == null ? void 0 : n.config) == null ? void 0 : s.classes,
    inCustomClasses: t.customClasses
  }), t.tableElement))
    return t.render();
}, S = ({
  inLayout: l = "compact",
  inTheme: e = "default",
  inConfigClasses: t = {},
  inCustomClasses: o = {}
} = {}) => {
  const n = l || "compact", s = e || "default", a = t || {}, r = o || {}, i = A[n] || A.compact || {}, c = E[s] || E.default || {}, u = /* @__PURE__ */ new Set([
    ...Object.keys(i),
    ...Object.keys(c),
    ...Object.keys(a),
    ...Object.keys(r)
  ]), d = {};
  for (const m of u) {
    const b = [
      i[m],
      c[m],
      a[m],
      r[m]
    ].filter(Boolean).join(" ").split(/\s+/).filter(Boolean);
    d[m] = Array.from(new Set(b)).join(" ");
  }
  return d;
}, dt = ({ inTable: l, inLayout: e = "compact" } = {}) => {
  var n, s;
  const t = l, o = e || "compact";
  if (t && (t.layout = o, t.classes = S({
    inLayout: t.layout,
    inTheme: t.theme,
    inConfigClasses: (s = (n = t.store) == null ? void 0 : n.config) == null ? void 0 : s.classes,
    inCustomClasses: t.customClasses
  }), t.tableElement))
    return t.render();
}, U = ({ inTableElement: l, inColumns: e = [], inData: t = [], inRowConfig: o = {}, inClasses: n = {} } = {}) => {
  var f, p;
  const s = l, a = e, r = t, i = o, c = n;
  if (!s) return;
  const u = Q({
    inColumns: a,
    inData: r,
    inRowConfig: i,
    inClasses: c
  }), d = (p = (f = window.ks) == null ? void 0 : f["json-to-dom"]) == null ? void 0 : p.buildSpecElement;
  if (typeof d != "function") return;
  const m = d({ inSpec: u }), b = s.querySelector("tbody");
  b && m && b.replaceWith(m);
}, K = ({ inTableElement: l, inColumns: e = [], inComputedFooter: t = [], inClasses: o = {} } = {}) => {
  var m, b;
  const n = l, s = e, a = t, r = o;
  if (!n) return;
  const i = W({
    inColumns: s,
    inComputedFooter: a,
    inClasses: r
  }), c = (b = (m = window.ks) == null ? void 0 : m["json-to-dom"]) == null ? void 0 : b.buildSpecElement;
  if (typeof c != "function") return;
  const u = i ? c({ inSpec: i }) : null, d = n.querySelector("tfoot");
  d && u ? d.replaceWith(u) : d && !u ? d.remove() : !d && u && n.appendChild(u);
}, N = ({ inTableElement: l, inStore: e, inClasses: t = {} } = {}) => {
  var a;
  const o = l, n = e, s = t;
  !o || !n || (U({
    inTableElement: o,
    inColumns: n.activeColumns,
    inData: n.stateData,
    inRowConfig: (a = n.config) == null ? void 0 : a.row,
    inClasses: s
  }), K({
    inTableElement: o,
    inColumns: n.activeColumns,
    inComputedFooter: n.computedFooter,
    inClasses: s
  }));
}, mt = ({ inTable: l, inQuery: e = "" } = {}) => {
  const t = l, o = e;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterOriginalData({ inQuery: o }), N({
    inTableElement: t.tableElement,
    inStore: t.store,
    inClasses: t.classes
  }));
}, bt = ({ inTable: l, inQuery: e = "" } = {}) => {
  const t = l, o = e;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterStateData({ inQuery: o }), N({
    inTableElement: t.tableElement,
    inStore: t.store,
    inClasses: t.classes
  }));
};
class j {
  constructor({
    data: e = [],
    columns: t = [],
    config: o = {},
    layout: n,
    theme: s,
    classes: a = {},
    dataProvider: r = null,
    targetContainerId: i = "table-container"
  } = {}) {
    const c = e, u = t, d = o, m = n || (d == null ? void 0 : d.layout) || "compact", b = s || (d == null ? void 0 : d.theme) || "default", f = a, p = r, g = i;
    this.containerId = g, this.layout = m, this.theme = b, this.customClasses = f, this.classes = S({
      inLayout: this.layout,
      inTheme: this.theme,
      inConfigClasses: d == null ? void 0 : d.classes,
      inCustomClasses: this.customClasses
    }), this.dataProvider = p, this.tableElement = null, this.controlsTree = null, this.store = new Z({
      inData: c,
      inColumns: u,
      inConfig: d
    });
  }
  setLayout({ layout: e = "compact" } = {}) {
    return dt({ inTable: this, inLayout: e || "compact" });
  }
  setTheme({ theme: e = "default" } = {}) {
    return ut({ inTable: this, inTheme: e || "default" });
  }
  async load({ query: e = {} } = {}) {
    const t = e;
    if (!this.dataProvider || typeof this.dataProvider.read != "function")
      return console.warn("Table.load called without a valid dataProvider.read implementation"), this.store.stateData;
    const o = await this.dataProvider.read({ inQuery: t }), n = Array.isArray(o) ? o : (o == null ? void 0 : o.data) || [];
    return this.store.updateData({ inData: n }), this.render(), n;
  }
  update({ data: e = [] } = {}) {
    const t = e;
    return this.store.updateData({ inData: t }), this.render();
  }
  async createRecord({ item: e = {} } = {}) {
    const t = e;
    if (!this.dataProvider || typeof this.dataProvider.create != "function")
      throw new Error("Table.createRecord requires a valid dataProvider.create implementation");
    const o = await this.dataProvider.create({ inItem: t });
    return await this.load(), o;
  }
  async updateRecord({ id: e = null, item: t = {} } = {}) {
    const o = e, n = t;
    if (!this.dataProvider || typeof this.dataProvider.update != "function")
      throw new Error("Table.updateRecord requires a valid dataProvider.update implementation");
    const s = await this.dataProvider.update({ inId: o, inItem: n });
    return await this.load(), s;
  }
  async deleteRecord({ id: e = null } = {}) {
    const t = e;
    if (!this.dataProvider || typeof this.dataProvider.delete != "function")
      throw new Error("Table.deleteRecord requires a valid dataProvider.delete implementation");
    const o = await this.dataProvider.delete({ inId: t });
    return await this.load(), o;
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
    const e = ot({ inTable: this });
    return e && (this.tableElement = e.element, this.controlsTree = e.treeWithIds), e;
  }
  getControlsTree() {
    return this.controlsTree;
  }
  repaintBody() {
    var e;
    this.tableElement && U({
      inTableElement: this.tableElement,
      inColumns: this.store.activeColumns,
      inData: this.store.stateData,
      inRowConfig: (e = this.store.config) == null ? void 0 : e.row,
      inClasses: this.classes
    });
  }
  repaintFoot() {
    this.tableElement && K({
      inTableElement: this.tableElement,
      inColumns: this.store.activeColumns,
      inComputedFooter: this.store.computedFooter,
      inClasses: this.classes
    });
  }
  refreshTable() {
    this.tableElement && N({
      inTableElement: this.tableElement,
      inStore: this.store,
      inClasses: this.classes
    });
  }
  filterOriginalData({ query: e = "" } = {}) {
    mt({
      inTable: this,
      inQuery: e
    });
  }
  filterStateData({ query: e = "" } = {}) {
    bt({
      inTable: this,
      inQuery: e
    });
  }
  filter({ query: e = "" } = {}) {
    const t = e;
    this.filterOriginalData({ query: t });
  }
}
j.layouts = Object.keys(A);
j.themes = Object.keys(E);
class ft extends x {
  constructor({ inColumns: e = [], inConfig: t = {} } = {}) {
    const o = e, n = t;
    super({
      inColumns: o,
      inConfig: n
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: e } = {}) {
    var n, s;
    const t = e;
    return {
      activeColumns: this._resolveActiveColumns({
        inColumnsCatalog: t == null ? void 0 : t.columns,
        inColumnKeys: (s = (n = t == null ? void 0 : t.config) == null ? void 0 : n.body) == null ? void 0 : s.columns
      })
    };
  }
  get activeColumns() {
    return this.library.activeColumns;
  }
}
const pt = ({ inHeadConfig: l = {}, inClasses: e = {} } = {}) => {
  const t = l, o = e, n = (t == null ? void 0 : t.title) || "", s = (t == null ? void 0 : t.subtitle) || "";
  if (!n && !s) return null;
  const a = [];
  return n && a.push({
    tagName: "div",
    textContent: n,
    attributes: {
      class: (o == null ? void 0 : o.headTitle) || "h5 fw-bold mb-1"
    }
  }), s && a.push({
    tagName: "div",
    textContent: s,
    attributes: {
      class: (o == null ? void 0 : o.headSubtitle) || "text-muted small"
    }
  }), {
    tagName: "div",
    attributes: {
      class: (o == null ? void 0 : o.head) || (t == null ? void 0 : t.class) || "pb-2 mb-3 border-bottom"
    },
    children: a
  };
}, yt = ({ inColumn: l = {}, inClasses: e = {}, inConfig: t = {} } = {}) => {
  const o = l, n = e, s = t, a = o.key || "", r = o.label || a, i = o.type === "number" ? "number" : "text", c = {
    tagName: "label",
    textContent: r,
    attributes: n != null && n.label ? { class: n.label } : {}
  }, u = o.datalist === !0 || o.datalist !== !1 && i !== "number", d = o.datalistId || `${a}-datalist`, m = {
    type: i,
    name: a,
    placeholder: `Enter ${r}...`
  };
  n != null && n.input && (m.class = n.input), u && (m.list = d);
  const b = {
    tagName: "input",
    attributes: m
  };
  o.id && (b.attributes.id = o.id, c.attributes.for = o.id);
  const f = (s == null ? void 0 : s.searchButtons) === !1 || o.searchButton === !1 || o.search === !1, p = o.searchButton === !0 || o.search === !0 || (s == null ? void 0 : s.searchButtons) === !0, g = !f && (p || !!o.searchId);
  let y;
  if (g) {
    const h = {
      tagName: "button",
      textContent: "Search",
      attributes: {
        type: "button",
        id: o.searchId || `${a}-search`,
        name: `${a}-search`,
        "data-key": a,
        class: (n == null ? void 0 : n.button) || "btn btn-outline-secondary"
      }
    };
    y = {
      tagName: "div",
      attributes: n != null && n.group ? { class: n.group } : {},
      children: [b, h]
    };
  } else
    y = b;
  return n != null && n.controlWrapper && (y = {
    tagName: "div",
    attributes: { class: n.controlWrapper },
    children: [y]
  }), {
    tagName: "div",
    attributes: n != null && n.field ? { class: n.field } : {},
    children: [c, y]
  };
}, ht = ({ inColumns: l = [], inConfig: e = {}, inClasses: t = {} } = {}) => {
  const o = l, n = e, s = t;
  if (!Array.isArray(o)) return { tagName: "div", children: [] };
  const a = o.map((i) => yt({ inColumn: i, inClasses: s, inConfig: n }));
  return {
    tagName: "div",
    attributes: s != null && s.body ? { class: s.body } : {},
    children: a
  };
}, gt = ({ inFootConfig: l = {}, inClasses: e = {} } = {}) => {
  const t = l, o = e, n = t == null ? void 0 : t.buttons;
  if (!Array.isArray(n) || n.length === 0) return null;
  const s = n.map((r) => {
    const c = r.variant === "primary" ? "btn btn-primary" : (o == null ? void 0 : o.button) || "btn btn-outline-secondary", u = r.class || c, d = {
      type: r.type || "button",
      name: r.name || "",
      class: u
    };
    return r.id && (d.id = r.id), {
      tagName: "button",
      textContent: r.label || r.name,
      attributes: d
    };
  });
  return {
    tagName: "div",
    attributes: {
      class: (o == null ? void 0 : o.foot) || (t == null ? void 0 : t.class) || "d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top"
    },
    children: s
  };
}, Ct = ({ inColumns: l = [], inConfig: e = {}, inClasses: t = {} } = {}) => {
  const o = l, n = e, s = t, a = pt({ inHeadConfig: n == null ? void 0 : n.head, inClasses: s }), r = ht({ inColumns: o, inConfig: n, inClasses: s }), i = gt({ inFootConfig: n == null ? void 0 : n.foot, inClasses: s });
  return {
    tagName: "div",
    attributes: s != null && s.form ? { class: s.form } : {},
    children: [a, r, i].filter(Boolean)
  };
}, wt = ({ inForm: l } = {}) => {
  var i, c;
  const e = l;
  if (!e) return null;
  const t = document.getElementById(e.containerId);
  if (!t) return null;
  const o = Ct({
    inColumns: e.store.activeColumns,
    inConfig: e.store.config,
    inClasses: e.classes
  }), n = T({ inSpec: o }), s = (c = (i = window.ks) == null ? void 0 : i["json-to-dom"]) == null ? void 0 : c.buildSpecElement;
  if (typeof s != "function")
    return console.error("json-to-dom buildSpecElement not found on window.ks"), {
      treeWithIds: n,
      spec: o,
      element: null
    };
  const a = s({ inSpec: o }), r = Array.isArray(a) ? a[0] : a;
  return t.innerHTML = "", t.appendChild(r), {
    treeWithIds: n,
    spec: o,
    element: r
  };
}, vt = {
  form: "",
  body: "d-flex flex-column gap-3",
  field: "col-12",
  label: "form-label mb-1",
  controlWrapper: "",
  group: "input-group input-group-sm w-100",
  input: "form-control",
  button: "btn",
  foot: "d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top"
}, Dt = {
  form: "",
  body: "d-flex flex-column gap-3",
  field: "row align-items-center g-2",
  label: "col-sm-4 col-form-label text-sm-end mb-0",
  controlWrapper: "col-sm-8",
  group: "input-group input-group-sm w-100",
  input: "form-control",
  button: "btn",
  foot: "d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top"
}, Tt = {
  form: "mb-3",
  body: "row g-3 align-items-center",
  field: "col-auto d-flex align-items-center gap-2 mb-2",
  label: "col-form-label col-form-label-sm text-nowrap mb-0",
  controlWrapper: "",
  group: "input-group input-group-sm w-auto",
  input: "form-control",
  button: "btn",
  foot: "col-auto d-flex align-items-center gap-2 mt-2"
}, O = {
  stacked: vt,
  horizontal: Dt,
  inline: Tt
}, At = {
  form: "bg-light p-3 rounded shadow-sm border",
  body: "",
  field: "",
  label: "fw-semibold text-secondary small",
  controlWrapper: "",
  group: "",
  input: "bg-white border-secondary border-opacity-25",
  button: "btn-outline-primary",
  foot: "border-secondary border-opacity-25"
}, Et = {
  form: "bg-transparent border-0 shadow-none",
  body: "",
  field: "",
  label: "text-muted small",
  controlWrapper: "",
  group: "",
  input: "bg-light border-light-subtle",
  button: "btn-light border",
  foot: "border-light-subtle"
}, xt = {
  form: "card p-3 shadow-sm bg-dark text-light border-secondary",
  body: "",
  field: "",
  label: "fw-semibold text-light small",
  controlWrapper: "",
  group: "",
  input: "bg-dark text-light border-secondary",
  button: "btn-outline-light",
  foot: "border-secondary"
}, kt = {
  form: "card p-3 shadow-sm bg-black text-light border-secondary border-opacity-50",
  body: "",
  field: "",
  label: "fw-bold text-white small",
  controlWrapper: "",
  group: "",
  input: "bg-dark text-white border-secondary",
  button: "btn-primary",
  foot: "border-secondary border-opacity-50"
}, $ = {
  default: {
    form: "",
    body: "",
    field: "",
    label: "fw-semibold text-secondary small",
    controlWrapper: "",
    group: "",
    input: "",
    button: "btn-outline-secondary",
    foot: ""
  },
  light: At,
  extraLight: Et,
  dark: xt,
  extraDark: kt
}, St = ({ inForm: l, inTheme: e = "default" } = {}) => {
  var n, s;
  const t = l, o = e || "default";
  if (t && (t.theme = o, t.classes = I({
    inLayout: t.layout,
    inTheme: t.theme,
    inConfigClasses: (s = (n = t.store) == null ? void 0 : n.config) == null ? void 0 : s.classes,
    inCustomClasses: t.customClasses
  }), t.formElement))
    return t.render();
}, I = ({
  inLayout: l = "stacked",
  inTheme: e = "default",
  inConfigClasses: t = {},
  inCustomClasses: o = {}
} = {}) => {
  const n = l || "stacked", s = e || "default", a = t || {}, r = o || {}, i = O[n] || O.stacked || {}, c = $[s] || $.default || {}, u = /* @__PURE__ */ new Set([
    ...Object.keys(i),
    ...Object.keys(c),
    ...Object.keys(a),
    ...Object.keys(r)
  ]), d = {};
  for (const m of u) {
    const b = [
      i[m],
      c[m],
      a[m],
      r[m]
    ].filter(Boolean).join(" ").split(/\s+/).filter(Boolean);
    d[m] = Array.from(new Set(b)).join(" ");
  }
  return d;
}, Nt = ({ inForm: l, inLayout: e = "stacked" } = {}) => {
  var n, s;
  const t = l, o = e || "stacked";
  if (t && (t.layout = o, t.classes = I({
    inLayout: t.layout,
    inTheme: t.theme,
    inConfigClasses: (s = (n = t.store) == null ? void 0 : n.config) == null ? void 0 : s.classes,
    inCustomClasses: t.customClasses
  }), t.formElement))
    return t.render();
};
class jt {
  constructor({
    columns: e = [],
    config: t = {},
    layout: o,
    theme: n,
    classes: s = {},
    targetContainerId: a = "form-container",
    inColumns: r,
    inConfig: i,
    inLayout: c,
    inTheme: u,
    inClasses: d,
    inTargetContainerId: m
  } = {}) {
    const b = r || e, f = i || t, p = c || o || (f == null ? void 0 : f.layout) || "stacked", g = u || n || (f == null ? void 0 : f.theme) || "default", y = d || s, h = m || a;
    this.containerId = h, this.layout = p, this.theme = g, this.customClasses = y, this.classes = I({
      inLayout: this.layout,
      inTheme: this.theme,
      inConfigClasses: f == null ? void 0 : f.classes,
      inCustomClasses: this.customClasses
    }), this.formElement = null, this.controlsTree = null, this.store = new ft({
      inColumns: b,
      inConfig: f
    });
  }
  setLayout({ inLayout: e, layout: t = "stacked" } = {}) {
    return Nt({ inForm: this, inLayout: e || t || "stacked" });
  }
  setTheme({ inTheme: e, theme: t = "default" } = {}) {
    return St({ inForm: this, inTheme: e || t || "default" });
  }
  get columns() {
    return this.store.activeColumns;
  }
  get config() {
    return this.store.config;
  }
  render() {
    const e = wt({ inForm: this });
    return e && (this.formElement = e.element, this.controlsTree = e.treeWithIds), e;
  }
  getControlsTree() {
    return this.controlsTree;
  }
}
class It extends x {
  constructor({ inData: e = [], inColumns: t = [], inConfig: o = {}, inTopN: n = 100 } = {}) {
    const s = e, a = t, r = o, i = n;
    super({
      inData: s,
      inColumns: a,
      inConfig: r,
      inTopN: i
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: e } = {}) {
    var a, r, i, c, u;
    const t = e, o = this._resolveActiveColumns({
      inColumnsCatalog: t == null ? void 0 : t.columns,
      inColumnKeys: ((r = (a = t == null ? void 0 : t.config) == null ? void 0 : a.datalist) == null ? void 0 : r.columns) || ((i = t == null ? void 0 : t.config) == null ? void 0 : i.columns)
    }), n = P({
      inData: t == null ? void 0 : t.originalData
    }), s = ((u = (c = t == null ? void 0 : t.config) == null ? void 0 : c.datalist) == null ? void 0 : u.topN) ?? (t == null ? void 0 : t.topN) ?? 100;
    return {
      activeColumns: o,
      stateData: n,
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
  updateData({ inData: e = [] } = {}) {
    const t = e;
    return this.library.stateData = Array.isArray(t) ? t : [], this.library.stateData;
  }
}
const q = ({ inData: l = [], inKey: e = "", inTopN: t = 100 } = {}) => {
  const o = l, n = e, s = t;
  if (!Array.isArray(o) || !n) return [];
  const a = /* @__PURE__ */ new Map();
  for (const c of o) {
    if (!c || typeof c != "object") continue;
    const u = c[n];
    if (u != null) {
      const d = String(u).trim();
      d !== "" && a.set(d, (a.get(d) || 0) + 1);
    }
  }
  const r = Array.from(a.entries()).map(([c, u]) => ({ value: c, count: u })).sort((c, u) => u.count - c.count);
  return (s > 0 && Number.isFinite(s) ? r.slice(0, s) : r).map(({ value: c, count: u }) => ({
    tagName: "option",
    attributes: {
      value: c,
      label: `${c} (${u})`
    },
    textContent: `${c} (${u})`
  }));
}, Lt = ({ inData: l = [], inColumns: e = [], inTopN: t = 100 } = {}) => {
  const o = l, n = e, s = t;
  if (!Array.isArray(n) || n.length === 0)
    return {
      tagName: "div",
      attributes: { id: "ks-datalists-wrapper" },
      children: []
    };
  const a = n.map((r) => {
    const i = r.key || "", c = r.datalistId || `${i}-datalist`, u = q({
      inData: o,
      inKey: i,
      inTopN: s
    });
    return {
      tagName: "datalist",
      attributes: {
        id: c
      },
      children: u
    };
  });
  return {
    tagName: "div",
    attributes: {
      id: "ks-datalists-wrapper"
    },
    children: a
  };
}, Ft = ({ inDataList: l } = {}) => {
  var a, r;
  const e = l;
  if (!e || typeof document > "u") return null;
  let t = document.getElementById(e.containerId);
  t || (t = document.createElement("div"), t.id = e.containerId, document.body.appendChild(t));
  const o = Lt({
    inData: e.store.stateData,
    inColumns: e.store.activeColumns,
    inTopN: e.store.topN
  });
  e.spec = o;
  const n = (r = (a = window.ks) == null ? void 0 : a["json-to-dom"]) == null ? void 0 : r.buildSpecElement;
  let s = null;
  if (typeof n == "function") {
    const i = n({ inSpec: o });
    s = Array.isArray(i) ? i[0] : i;
  }
  if (!s || s.children.length === 0) {
    const i = document.createElement("div");
    i.id = "ks-datalists-wrapper";
    for (const c of e.store.activeColumns) {
      const u = c.key || "", d = c.datalistId || `${u}-datalist`, m = document.createElement("datalist");
      m.id = d;
      const b = q({
        inData: e.store.stateData,
        inKey: u,
        inTopN: e.store.topN
      });
      for (const f of b) {
        const p = document.createElement("option");
        p.value = f.attributes.value, p.label = f.attributes.label, p.textContent = f.textContent, m.appendChild(p);
      }
      i.appendChild(m);
    }
    s = i;
  }
  return e.element = s, t.innerHTML = "", e.element && t.appendChild(e.element), {
    spec: e.spec,
    element: e.element
  };
};
class L {
  constructor({
    data: e = [],
    columns: t = [],
    config: o = {},
    dataProvider: n = null,
    targetContainerId: s = "datalist-container"
  } = {}) {
    const a = e, r = t, i = o, c = n, u = s;
    this.containerId = u, this.dataProvider = c, this.element = null, this.spec = null, this.store = new It({
      inData: a,
      inColumns: r,
      inConfig: i
    });
  }
  async load({ query: e = {} } = {}) {
    const t = e;
    if (!this.dataProvider || typeof this.dataProvider.read != "function")
      return console.warn("DataList.load called without a valid dataProvider.read implementation"), this.store.stateData;
    const o = await this.dataProvider.read({ inQuery: t }), n = Array.isArray(o) ? o : (o == null ? void 0 : o.data) || [];
    return this.store.updateData({ inData: n }), this.render(), n;
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
    return Ft({ inDataList: this });
  }
  update({ data: e = [] } = {}) {
    const t = e;
    return this.store.updateData({ inData: t }), this.render();
  }
}
L.layouts = [];
L.themes = [];
const Rt = ({
  inBaseUrl: l = "",
  inReadUrl: e = "",
  inCreateUrl: t = "",
  inUpdateUrl: o = "",
  inDeleteUrl: n = "",
  inHeaders: s = {},
  inFetchOptions: a = {},
  inCustom: r = {}
} = {}) => {
  const i = l, c = e || i, u = t || i, d = o || i, m = n || i, b = {
    "Content-Type": "application/json",
    ...s
  }, f = a, p = r;
  return {
    read: async ({ inQuery: g = {}, inUrl: y } = {}) => {
      const h = g;
      if (typeof p.read == "function")
        return await p.read({ inQuery: h });
      const C = y || c;
      if (!C) return [];
      let w = C;
      if (h && typeof h == "object" && Object.keys(h).length > 0) {
        const D = new URLSearchParams(h).toString();
        D && (w += (w.includes("?") ? "&" : "?") + D);
      }
      const v = await fetch(w, {
        method: "GET",
        headers: b,
        ...f
      });
      if (!v.ok)
        throw new Error(`DataProvider read failed: ${v.status} ${v.statusText}`);
      return await v.json();
    },
    create: async ({ inItem: g = {}, inUrl: y } = {}) => {
      const h = g;
      if (typeof p.create == "function")
        return await p.create({ inItem: h });
      const w = await fetch(y || u, {
        method: "POST",
        headers: b,
        body: JSON.stringify(h),
        ...f
      });
      if (!w.ok)
        throw new Error(`DataProvider create failed: ${w.status} ${w.statusText}`);
      return await w.json();
    },
    update: async ({ inId: g, inItem: y = {}, inUrl: h } = {}) => {
      const C = g, w = y;
      if (typeof p.update == "function")
        return await p.update({ inId: C, inItem: w });
      let v = h || d;
      C != null && (v.includes(":id") ? v = v.replace(":id", encodeURIComponent(C)) : v = `${v.replace(/\/$/, "")}/${encodeURIComponent(C)}`);
      const D = await fetch(v, {
        method: "PUT",
        headers: b,
        body: JSON.stringify(w),
        ...f
      });
      if (!D.ok)
        throw new Error(`DataProvider update failed: ${D.status} ${D.statusText}`);
      return await D.json();
    },
    delete: async ({ inId: g, inUrl: y } = {}) => {
      const h = g;
      if (typeof p.delete == "function")
        return await p.delete({ inId: h });
      let C = y || m;
      h != null && (C.includes(":id") ? C = C.replace(":id", encodeURIComponent(h)) : C = `${C.replace(/\/$/, "")}/${encodeURIComponent(h)}`);
      const w = await fetch(C, {
        method: "DELETE",
        headers: b,
        ...f
      });
      if (!w.ok)
        throw new Error(`DataProvider delete failed: ${w.status} ${w.statusText}`);
      return await w.json();
    }
  };
};
window.ks ?? (window.ks = {});
window.ks["json-to-dom-renderers"] = {
  Table: j,
  Form: jt,
  DataList: L,
  createDataProvider: Rt
};
export {
  L as DataList,
  jt as Form,
  j as Table,
  Rt as createDataProvider
};
