const E = ({ inData: l = [], inColumns: e = [], inConfig: t = {}, inTopN: n } = {}) => {
  const o = l, r = e, a = t, s = n;
  return {
    originalData: Array.isArray(o) ? typeof structuredClone == "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o)) : [],
    columns: Array.isArray(r) ? r : [],
    config: a || {},
    topN: s
  };
}, k = ({ inColumnsCatalog: l = [], inColumnKeys: e = [] } = {}) => {
  const t = l, n = e;
  if (Array.isArray(n) && n.length > 0) {
    const o = new Map((Array.isArray(t) ? t : []).map((s) => [s.key, s])), r = [], a = [];
    for (const s of n) {
      const i = o.get(s);
      i ? a.push(i) : r.push(s);
    }
    return r.length > 0 && console.warn(
      `[json-to-dom-renderers] Warning: Config requested columns [${r.map((s) => `"${s}"`).join(", ")}] that do not exist in the columns catalog.`
    ), a;
  }
  return Array.isArray(t) ? t : [];
};
class U {
  constructor({ inData: e = [], inColumns: t = [], inConfig: n = {}, inTopN: o } = {}) {
    const r = e, a = t, s = n, i = o;
    this.source = E({
      inData: r,
      inColumns: a,
      inConfig: s,
      inTopN: i
    });
  }
  _buildSource(e) {
    return E(e);
  }
  _resolveActiveColumns(e) {
    return k(e);
  }
  get rawData() {
    return this.source.originalData;
  }
  get config() {
    return this.source.config;
  }
}
const K = ({ inData: l = [] } = {}) => {
  const e = l;
  return Array.isArray(e) ? typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e)) : [];
}, X = ({ inColumns: l = [], inData: e = [], inConfig: t = {}, inLabel: n } = {}) => {
  var b, p;
  const o = l, r = e, a = t, s = n;
  if (!!!(a != null && a.serial || (b = a == null ? void 0 : a.table) != null && b.serial || (p = a == null ? void 0 : a.head) != null && p.serial))
    return {
      columns: o,
      data: r,
      isSerialEnabled: !1
    };
  const u = {
    key: "serial",
    label: s || typeof (a == null ? void 0 : a.serial) == "object" && a.serial.label || "#",
    align: "center",
    isSerial: !0
  }, m = (Array.isArray(o) ? o : []).some((y) => y.key === "serial") ? o : [u, ...Array.isArray(o) ? o : []], f = (Array.isArray(r) ? r : []).map((y, h) => ({
    serial: h + 1,
    ...y || {}
  }));
  return {
    columns: m,
    data: f,
    isSerialEnabled: !0
  };
}, Y = {
  id: "",
  title: "",
  type: "aggregate",
  values: {}
}, Z = {
  aggregate: {
    supportedFunctions: [
      "sum",
      "count",
      "avg",
      "min",
      "max"
    ]
  }
}, O = {
  rowKeys: Y,
  types: Z
}, tt = ({ inData: l = [], inKey: e } = {}) => {
  const t = l, n = e;
  return !Array.isArray(t) || !n ? 0 : t.reduce((o, r) => {
    const a = Number(r == null ? void 0 : r[n]);
    return o + (isNaN(a) ? 0 : a);
  }, 0);
}, et = ({ inData: l = [] } = {}) => {
  const e = l;
  return Array.isArray(e) ? e.length : 0;
}, nt = ({ inData: l = [], inKey: e } = {}) => {
  const t = l, n = e;
  if (!Array.isArray(t) || t.length === 0 || !n) return 0;
  let o = 0;
  const r = t.reduce((a, s) => {
    const i = Number(s == null ? void 0 : s[n]);
    return isNaN(i) ? a : (o++, a + i);
  }, 0);
  return o > 0 ? r / o : 0;
}, ot = ({ inData: l = [], inKey: e } = {}) => {
  const t = l, n = e;
  if (!Array.isArray(t) || t.length === 0 || !n) return 0;
  let o = !1, r = 1 / 0;
  return t.forEach((a) => {
    const s = Number(a == null ? void 0 : a[n]);
    isNaN(s) || (o = !0, s < r && (r = s));
  }), o ? r : 0;
}, rt = ({ inData: l = [], inKey: e } = {}) => {
  const t = l, n = e;
  if (!Array.isArray(t) || t.length === 0 || !n) return 0;
  let o = !1, r = -1 / 0;
  return t.forEach((a) => {
    const s = Number(a == null ? void 0 : a[n]);
    isNaN(s) || (o = !0, s > r && (r = s));
  }), o ? r : 0;
}, at = {
  sum: tt,
  count: et,
  avg: nt,
  min: ot,
  max: rt
}, st = ({ inExpression: l = "", inScope: e = {} } = {}) => {
  const t = l, n = e;
  try {
    const o = Object.keys(n), r = Object.values(n);
    return new Function(...o, `return ${t};`)(...r);
  } catch (o) {
    return console.error(`Error evaluating expression "${t}":`, o), 0;
  }
}, lt = ({ inRowConfig: l = {}, inData: e = [], inScope: t = {} } = {}) => {
  var m, f;
  const n = l, o = e, r = t, a = O.rowKeys || {}, s = n.id ?? a.id, i = n.title ?? a.title, d = n.type ?? a.type, u = n.values ?? a.values, c = {};
  if (d === "aggregate") {
    const b = ((f = (m = O.types) == null ? void 0 : m.aggregate) == null ? void 0 : f.supportedFunctions) || [];
    Object.entries(u).forEach(([p, y]) => {
      if (!b.includes(y)) {
        console.warn(
          `[json-to-dom-renderers] Warning: Unknown aggregate function "${y}" for column "${p}". Supported: [${b.join(", ")}]`
        );
        return;
      }
      const h = at[y];
      typeof h == "function" && (c[p] = h({ inData: o, inKey: p }));
    });
  } else d === "eval" && Object.entries(u).forEach(([b, p]) => {
    typeof p == "string" && (c[b] = st({
      inExpression: p,
      inScope: r
    }));
  });
  return {
    id: s,
    title: i,
    values: c
  };
}, q = ({ inData: l = [], inFooterConfig: e = [] } = {}) => {
  const t = l, n = e;
  if (!Array.isArray(n)) return [];
  const o = {}, r = [];
  return n.forEach((a) => {
    const s = lt({
      inRowConfig: a,
      inData: t,
      inScope: o
    });
    a.id && (o[a.id] = s.values), r.push(s);
  }), r;
}, Q = ({ inSource: l = {}, inResolveColumns: e } = {}) => {
  var i, d, u;
  const t = l, n = e, o = typeof n == "function" ? n({
    inColumnsCatalog: t == null ? void 0 : t.columns,
    inColumnKeys: (d = (i = t == null ? void 0 : t.config) == null ? void 0 : i.head) == null ? void 0 : d.columns
  }) : (t == null ? void 0 : t.columns) || [], r = K({
    inData: t == null ? void 0 : t.originalData
  }), a = X({
    inColumns: o,
    inData: r,
    inConfig: t == null ? void 0 : t.config
  }), s = q({
    inData: a.data,
    inFooterConfig: (u = t == null ? void 0 : t.config) == null ? void 0 : u.foot
  });
  return {
    activeColumns: a.columns,
    stateData: a.data,
    computedFooter: s,
    isSerialEnabled: a.isSerialEnabled
  };
}, it = ({ inQuery: l = "", inActiveColumns: e = [] } = {}) => {
  const t = l, n = e, o = new Set(
    (Array.isArray(n) ? n : []).map((r) => typeof r == "object" && r !== null ? r.key : r).filter(Boolean)
  );
  if (typeof t == "object" && t !== null) {
    if (t.type === "string")
      return {
        type: "string",
        value: String(t.value ?? "").trim().toLowerCase()
      };
    const r = t.type === "object" && typeof t.value == "object" && t.value !== null ? t.value : t, a = {};
    for (const [s, i] of Object.entries(r))
      if (o.has(s) && i !== void 0 && i !== null) {
        const d = String(i).trim().toLowerCase();
        d !== "" && (a[s] = d);
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
}, ct = ({ inData: l = [], inQueryObject: e = {}, inActiveColumns: t = [] } = {}) => {
  const n = l, o = e, r = t;
  if (!Array.isArray(n)) return [];
  const a = o == null ? void 0 : o.type, s = o == null ? void 0 : o.value, i = Array.isArray(r) && r.length > 0 ? r.map((u) => typeof u == "object" && u !== null ? u.key : u).filter(Boolean) : null;
  if (a === "object") {
    const c = Object.entries(typeof s == "object" && s !== null ? s : {});
    return c.length === 0 ? [...n] : n.filter((m) => !m || typeof m != "object" ? !1 : c.every(([f, b]) => {
      const p = m[f];
      return p == null ? !1 : String(p).toLowerCase().includes(b);
    }));
  }
  const d = typeof s == "string" ? s : String(o ?? "").trim().toLowerCase();
  return d ? n.filter((u) => !u || typeof u != "object" ? !1 : (i ? i.map((m) => u[m]) : Object.values(u)).some((m) => m == null ? !1 : String(m).toLowerCase().includes(d))) : [...n];
}, ut = ({ inData: l = [], inIsEnabled: e = !1 } = {}) => {
  const t = l;
  return !e || !Array.isArray(t) ? t : t.map((o, r) => ({
    ...o,
    serial: r + 1
  }));
}, P = ({ inStore: l, inData: e = [], inQuery: t = "" } = {}) => {
  var f;
  const n = l, o = e, r = t, a = n.library.activeColumns, s = n.library.isSerialEnabled, i = (f = n.source.config) == null ? void 0 : f.foot, d = it({
    inQuery: r,
    inActiveColumns: a
  }), u = ct({
    inData: o,
    inQueryObject: d,
    inActiveColumns: a
  }), c = ut({
    inData: u,
    inIsEnabled: s
  }), m = q({
    inData: c,
    inFooterConfig: i
  });
  return n.library.stateData = c, n.library.computedFooter = m, {
    activeColumns: n.library.activeColumns,
    stateData: n.library.stateData,
    computedFooter: n.library.computedFooter
  };
};
class dt {
  constructor({ inData: e = [], inColumns: t = [], inConfig: n = {} } = {}) {
    const o = e, r = t, a = n;
    this.source = E({
      inData: o,
      inColumns: r,
      inConfig: a
    }), this.library = Q({
      inSource: this.source,
      inResolveColumns: k
    });
  }
  get rawData() {
    return this.source.originalData;
  }
  get config() {
    return this.source.config;
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
    return this.source.originalData = Array.isArray(t) ? t : [], this.library = Q({
      inSource: this.source,
      inResolveColumns: k
    }), this.library.stateData;
  }
  filterOriginalData({ inQuery: e = "" } = {}) {
    const t = e;
    return P({
      inStore: this,
      inData: this.source.originalData,
      inQuery: t
    });
  }
  filterStateData({ inQuery: e = "" } = {}) {
    const t = e;
    return P({
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
const mt = {
  table: "table table-sm align-middle",
  thead: "",
  th: "text-uppercase fw-semibold small",
  tbody: "",
  tr: "",
  td: "py-1",
  tfoot: "table-group-divider fw-bold small"
}, ft = {
  table: "table table-bordered table-sm align-middle",
  thead: "",
  th: "text-uppercase fw-semibold",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "table-group-divider fw-bold"
}, bt = {
  table: "table table-borderless table-sm align-middle",
  thead: "border-bottom",
  th: "text-uppercase fw-semibold",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "border-top fw-bold"
}, x = {
  default: {
    table: "table align-middle",
    thead: "",
    th: "text-uppercase fw-semibold",
    tbody: "",
    tr: "",
    td: "",
    tfoot: "table-group-divider fw-bold"
  },
  compact: mt,
  bordered: ft,
  borderless: bt
}, pt = {
  table: "table-hover table-striped",
  thead: "table-light",
  th: "text-secondary",
  tbody: "",
  tr: "",
  td: "",
  tfoot: ""
}, yt = {
  table: "table-hover",
  thead: "",
  th: "text-muted",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "text-secondary"
}, ht = {
  table: "table-dark table-hover table-striped",
  thead: "table-dark",
  th: "",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "border-secondary"
}, gt = {
  table: "table-dark table-striped-columns border-secondary",
  thead: "table-active",
  th: "text-light",
  tbody: "",
  tr: "",
  td: "",
  tfoot: "border-secondary"
}, N = {
  default: {
    table: "table-hover table-striped",
    thead: "table-light",
    th: "",
    tbody: "",
    tr: "",
    td: "",
    tfoot: ""
  },
  light: pt,
  extraLight: yt,
  dark: ht,
  extraDark: gt
}, Ct = ({ inTable: l, inTheme: e = "default" } = {}) => {
  var o, r;
  const t = l, n = e || "default";
  if (t && (t.theme = n, t.classes = j({
    inLayout: t.layout,
    inTheme: t.theme,
    inConfigClasses: (r = (o = t.store) == null ? void 0 : o.config) == null ? void 0 : r.classes,
    inCustomClasses: t.customClasses
  }), t.tableElement))
    return t.render();
}, j = ({
  inLayout: l = "compact",
  inTheme: e = "default",
  inConfigClasses: t = {},
  inCustomClasses: n = {}
} = {}) => {
  const o = l || "compact", r = e || "default", a = t || {}, s = n || {}, i = x[o] || x.compact || {}, d = N[r] || N.default || {}, u = /* @__PURE__ */ new Set([
    ...Object.keys(i),
    ...Object.keys(d),
    ...Object.keys(a),
    ...Object.keys(s)
  ]), c = {};
  for (const m of u) {
    const f = [
      i[m],
      d[m],
      a[m],
      s[m]
    ].filter(Boolean).join(" ").split(/\s+/).filter(Boolean);
    c[m] = Array.from(new Set(f)).join(" ");
  }
  return c;
}, vt = ({ inTable: l, inLayout: e = "compact" } = {}) => {
  var o, r;
  const t = l, n = e || "compact";
  if (t && (t.layout = n, t.classes = j({
    inLayout: t.layout,
    inTheme: t.theme,
    inConfigClasses: (r = (o = t.store) == null ? void 0 : o.config) == null ? void 0 : r.classes,
    inCustomClasses: t.customClasses
  }), t.tableElement))
    return t.render();
}, wt = ({ inAlign: l = "" } = {}) => {
  const e = l;
  return e === "right" ? "text-end" : e === "center" ? "text-center" : "";
}, Dt = ({ inCell: l } = {}) => {
  const e = l;
  return String(typeof e == "object" && e !== null ? e.textContent ?? "" : e ?? "");
}, Tt = ({ inCell: l, inDefaultClass: e = "" } = {}) => {
  const t = l, n = e, o = typeof t == "object" && t !== null, r = o && t.class !== void 0 ? t.class : n, a = o ? t.align : "", s = wt({ inAlign: a }), i = [r, s].filter(Boolean).join(" ").trim(), d = i ? { class: i } : {}, c = { ...o && t.inAttributes ? t.inAttributes : {} };
  for (const [m, f] of Object.entries(d))
    c[m] = c[m] ? `${c[m]} ${f}`.trim() : f;
  return c;
}, At = ({ inCell: l, inCellTagName: e = "td", inDefaultClass: t = "" } = {}) => {
  const n = l, o = e, r = t, a = Dt({ inCell: n }), s = Tt({ inCell: n, inDefaultClass: r });
  return {
    tagName: o,
    textContent: a,
    attributes: s
  };
}, F = ({
  inCellTagName: l = "td",
  inCells: e = [],
  inRowClass: t = "",
  inCellClass: n = "",
  inColumnsConfig: o
} = {}) => {
  const r = l, a = e, s = t, i = n, d = s ? { class: s } : {}, u = a.map((c) => At({
    inCell: c,
    inCellTagName: r,
    inDefaultClass: i
  }));
  return {
    tagName: "tr",
    attributes: d,
    children: u
  };
}, St = ({ inColumns: l = [], inClasses: e = {} } = {}) => {
  const t = l, n = e, o = t.map((s) => ({
    textContent: s.label,
    align: s.align,
    id: s.id
  })), r = F({
    inCellTagName: "th",
    inCells: o,
    inCellClass: (n == null ? void 0 : n.th) || "",
    inRowClass: (n == null ? void 0 : n.tr) || ""
  });
  return {
    tagName: "thead",
    attributes: n != null && n.thead ? { class: n.thead } : {},
    children: [r]
  };
}, M = ({
  inColumns: l = [],
  inData: e = [],
  inRowConfig: t = {},
  inClasses: n = {},
  inColumnsConfig: o = []
} = {}) => {
  const r = l, a = e, s = n, i = Array.isArray(o) ? o : [];
  if (!Array.isArray(a) || a.length === 0) {
    const c = {
      tagName: "tr",
      children: [{
        tagName: "td",
        textContent: "No matching records found",
        attributes: {
          colspan: String(r.length),
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
  const d = a.map((c) => {
    const m = r.map((f) => {
      var y, h, g, C, v;
      const b = Array.isArray(i) ? i.find((w) => w.key === f.key) : void 0, p = ((h = (y = b == null ? void 0 : b.tbody) == null ? void 0 : y.td) == null ? void 0 : h.attributes) || ((C = (g = b == null ? void 0 : b.tbody) == null ? void 0 : g.th) == null ? void 0 : C.attributes);
      return {
        textContent: f.key === "amount" ? Number(c[f.key]).toFixed(2) : String(c[f.key] ?? ""),
        align: f.align,
        inAttributes: p,
        style: (v = b == null ? void 0 : b.th) == null ? void 0 : v.style
      };
    });
    return F({
      inCellTagName: "td",
      inCells: m,
      inRowClass: (s == null ? void 0 : s.tr) || "",
      inCellClass: (s == null ? void 0 : s.td) || ""
    });
  });
  return {
    tagName: "tbody",
    attributes: s != null && s.tbody ? { class: s.tbody } : {},
    children: d
  };
}, V = ({ inColumns: l = [], inComputedFooter: e = [], inClasses: t = {} } = {}) => {
  const n = l, o = e, r = t;
  if (!Array.isArray(o) || o.length === 0)
    return null;
  const a = o.map((i, d) => {
    const u = i.title || "", c = i.values || {}, m = d === o.length - 1, f = n.findIndex((p) => !p.isSerial), b = n.map((p, y) => {
      if (c[p.key] !== void 0) {
        const h = c[p.key];
        return {
          textContent: typeof h == "number" ? h.toFixed(2) : String(h),
          align: p.align || "right",
          class: m ? "fw-bold" : "fw-semibold"
        };
      }
      return y === f ? {
        textContent: u,
        class: m ? "fw-bold text-uppercase" : "fw-semibold text-uppercase"
      } : {
        textContent: "",
        class: ""
      };
    });
    return F({
      inCellTagName: "td",
      inCells: b,
      inRowClass: m ? "table-light" : (r == null ? void 0 : r.tr) || "",
      inCellClass: (r == null ? void 0 : r.td) || ""
    });
  });
  return {
    tagName: "tfoot",
    attributes: r != null && r.tfoot ? { class: r.tfoot } : {},
    children: a
  };
}, _ = ({ inTableElement: l, inColumns: e = [], inData: t = [], inRowConfig: n = {}, inColumnsConfig: o = [], inClasses: r = {} } = {}) => {
  var y, h;
  const a = l, s = e, i = t, d = n, u = o, c = r;
  if (!a) return;
  const m = M({
    inColumns: s,
    inData: i,
    inRowConfig: d,
    inColumnsConfig: u,
    inClasses: c
  }), f = (h = (y = window.ks) == null ? void 0 : y["json-to-dom"]) == null ? void 0 : h.buildSpecElement;
  if (typeof f != "function") return;
  const b = f({ inSpec: m }), p = a.querySelector("tbody");
  p && b && p.replaceWith(b);
}, J = ({ inTableElement: l, inColumns: e = [], inComputedFooter: t = [], inClasses: n = {} } = {}) => {
  var m, f;
  const o = l, r = e, a = t, s = n;
  if (!o) return;
  const i = V({
    inColumns: r,
    inComputedFooter: a,
    inClasses: s
  }), d = (f = (m = window.ks) == null ? void 0 : m["json-to-dom"]) == null ? void 0 : f.buildSpecElement;
  if (typeof d != "function") return;
  const u = i ? d({ inSpec: i }) : null, c = o.querySelector("tfoot");
  c && u ? c.replaceWith(u) : c && !u ? c.remove() : !c && u && o.appendChild(u);
}, R = ({ inTableElement: l, inStore: e, inClasses: t = {} } = {}) => {
  var a, s, i, d;
  const n = l, o = e, r = t;
  !n || !o || (_({
    inTableElement: n,
    inColumns: o.activeColumns,
    inData: o.stateData,
    inRowConfig: (a = o.config) == null ? void 0 : a.row,
    inColumnsConfig: ((i = (s = o.source) == null ? void 0 : s.config) == null ? void 0 : i.columnsConfig) || ((d = o.config) == null ? void 0 : d.columnsConfig) || [],
    inClasses: r
  }), J({
    inTableElement: n,
    inColumns: o.activeColumns,
    inComputedFooter: o.computedFooter,
    inClasses: r
  }));
}, It = "table", Et = {}, kt = [], xt = {
  tagName: It,
  attributes: Et,
  children: kt
}, Nt = ({
  inColumns: l = [],
  inData: e = [],
  inComputedFooter: t = [],
  inRowConfig: n = {},
  inClasses: o = {},
  inColumnsConfig: r
} = {}) => {
  const a = l, s = e, i = t, d = n, u = o, c = r, m = St({ inColumns: a, inClasses: u }), f = M({
    inColumns: a,
    inData: s,
    inRowConfig: d,
    inClasses: u,
    inColumnsConfig: c
  }), b = V({ inColumns: a, inComputedFooter: i, inClasses: u }), p = structuredClone(xt);
  return u != null && u.table && (p.attributes.class = u.table), p.children = [m, f, b].filter(Boolean), p;
}, A = ({ inTable: l } = {}) => {
  var o, r, a;
  const e = l;
  if (!(e != null && e.store))
    return null;
  const t = (r = (o = e.store.source) == null ? void 0 : o.config) == null ? void 0 : r.columnsConfig, n = Nt({
    inColumns: e.store.activeColumns,
    inData: e.store.stateData,
    inComputedFooter: e.store.computedFooter,
    inRowConfig: (a = e.store.config) == null ? void 0 : a.row,
    inClasses: e.classes,
    inColumnsConfig: t
  });
  return e.spec = n, n;
}, T = ({ inSpec: l } = {}) => {
  var i, d, u;
  const e = l;
  if (!e || typeof e != "object") return null;
  if (Array.isArray(e)) {
    const c = e.map((m) => T({ inSpec: m })).filter(Boolean);
    return c.length > 0 ? c : null;
  }
  const n = (Array.isArray(e.children) ? e.children : []).map((c) => T({ inSpec: c })).filter(Boolean), o = ((i = e.attributes) == null ? void 0 : i.id) || e.id, r = !!o, a = n.length > 0;
  if (!r && !a)
    return null;
  const s = {
    tagName: e.tagName
  };
  return o && (s.id = o), (d = e.attributes) != null && d.name && (s.name = e.attributes.name), (u = e.attributes) != null && u.type && (s.type = e.attributes.type), e.attributes && (s.attributes = e.attributes), n.length > 0 && (s.children = n), s;
}, jt = async ({ inTable: l, inContainerId: e, inContainer: t, inQuery: n = {} } = {}) => {
  var b, p;
  const o = l, r = e, a = t, s = n;
  if (!o)
    return console.error("[json-to-dom-renderers:Table] Table instance (inTable) is required to render."), {
      treeWithIds: null,
      spec: null,
      element: null,
      error: "Table instance (inTable) is required"
    };
  o.dataProvider && typeof o.load == "function" ? await o.load({ inQuery: s }) : A({ inTable: o });
  const i = o.spec || A({ inTable: o }), d = T({ inSpec: i }), u = (p = (b = window.ks) == null ? void 0 : b["json-to-dom"]) == null ? void 0 : p.buildSpecElement;
  if (typeof u != "function")
    return console.error("json-to-dom buildSpecElement not found on window.ks"), {
      treeWithIds: d,
      spec: i,
      element: null
    };
  const c = u({ inSpec: i }), m = Array.isArray(c) ? c[0] : c;
  let f = null;
  if (a instanceof HTMLElement)
    f = a;
  else {
    const y = r || o.containerId;
    y && (f = document.getElementById(y));
  }
  return f && (f.innerHTML = "", f.appendChild(m)), o.tableElement = m, o.controlsTree = d, {
    treeWithIds: d,
    spec: i,
    element: m,
    store: o.store
  };
}, Ft = ({ inTable: l, inContainerId: e, inContainer: t } = {}) => {
  var m, f;
  const n = l, o = e, r = t;
  if (!n)
    return console.error("[json-to-dom-renderers:Table] Table instance (inTable) is required to render structure."), null;
  const a = n.spec || A({ inTable: n }), s = T({ inSpec: a }), i = (f = (m = window.ks) == null ? void 0 : m["json-to-dom"]) == null ? void 0 : f.buildSpecElement;
  if (typeof i != "function")
    return console.error("json-to-dom buildSpecElement not found on window.ks"), {
      treeWithIds: s,
      spec: a,
      element: null
    };
  const d = i({ inSpec: a }), u = Array.isArray(d) ? d[0] : d;
  let c = null;
  if (r instanceof HTMLElement)
    c = r;
  else {
    const b = o || n.containerId;
    b && (c = document.getElementById(b));
  }
  return c && (c.innerHTML = "", c.appendChild(u)), n.tableElement = u, n.controlsTree = s, {
    treeWithIds: s,
    spec: a,
    element: u,
    store: n.store
  };
}, Rt = ({ inTable: l } = {}) => {
  const e = l;
  return {
    buildSpec: () => A({ inTable: e }),
    repaintBody: () => {
      var i;
      e != null && e.tableElement && _({
        inTableElement: e.tableElement,
        inColumns: e.store.activeColumns,
        inData: e.store.stateData,
        inRowConfig: (i = e.store.config) == null ? void 0 : i.row,
        inClasses: e.classes
      });
    },
    repaintFoot: () => {
      e != null && e.tableElement && J({
        inTableElement: e.tableElement,
        inColumns: e.store.activeColumns,
        inComputedFooter: e.store.computedFooter,
        inClasses: e.classes
      });
    },
    refreshTable: () => {
      e != null && e.tableElement && R({
        inTableElement: e.tableElement,
        inStore: e.store,
        inClasses: e.classes
      });
    },
    renderStructure: ({ inContainerId: i, inContainer: d, targetContainerId: u } = {}) => {
      const f = Ft({
        inTable: e,
        inContainerId: i || u,
        inContainer: d
      });
      return f != null && f.element && (e.tableElement = f.element, e.controlsTree = f.treeWithIds), f;
    },
    render: async ({ inContainerId: i, inContainer: d, targetContainerId: u, inQuery: c = {} } = {}) => {
      const p = await jt({
        inTable: e,
        inContainerId: i || u,
        inContainer: d,
        inQuery: c
      });
      return p != null && p.element && (e.tableElement = p.element, e.controlsTree = p.treeWithIds), p;
    }
  };
}, H = ({ inTable: l, inQuery: e = "" } = {}) => {
  const t = l, n = e;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterOriginalData({ inQuery: n }), R({
    inTableElement: t.tableElement,
    inStore: t.store,
    inClasses: t.classes
  }));
}, z = ({ inTable: l, inQuery: e = "" } = {}) => {
  const t = l, n = e;
  !(t != null && t.tableElement) || !(t != null && t.store) || (t.store.filterStateData({ inQuery: n }), R({
    inTableElement: t.tableElement,
    inStore: t.store,
    inClasses: t.classes
  }));
}, Lt = ({ inTable: l, inQuery: e = "", inFromState: t = !1, query: n = "" } = {}) => {
  const o = l, r = e || n;
  t ? z({ inTable: o, inQuery: r }) : H({ inTable: o, inQuery: r });
}, S = async ({ inTable: l, inQuery: e = {} } = {}) => {
  var o, r;
  const t = l, n = e;
  if (!(t != null && t.dataProvider) || typeof t.dataProvider.read != "function")
    return console.warn("[json-to-dom-renderers:Table] Table.load called without a valid dataProvider.read implementation"), (o = t == null ? void 0 : t.store) == null ? void 0 : o.stateData;
  try {
    const a = await t.dataProvider.read({ inQuery: n }), s = Array.isArray(a) ? a : (a == null ? void 0 : a.data) || [];
    return t.store.updateData({ inData: s }), t.buildSpec(), s;
  } catch (a) {
    return console.error("[json-to-dom-renderers:Table] Failed to load records via dataProvider.read:", a), (r = t == null ? void 0 : t.store) == null ? void 0 : r.stateData;
  }
}, $t = async ({ inTable: l, inQuery: e = {} } = {}) => {
  var o;
  const t = l, n = e;
  if (!(t != null && t.dataProvider) || typeof t.dataProvider.read != "function")
    return console.warn("[json-to-dom-renderers:Table] Table.loadSpec called without a valid dataProvider.read implementation"), (t == null ? void 0 : t.spec) || ((o = t == null ? void 0 : t.buildSpec) == null ? void 0 : o.call(t));
  try {
    const r = await t.dataProvider.read({ inQuery: n }), a = Array.isArray(r) ? r : (r == null ? void 0 : r.data) || [];
    return t.store.updateData({ inData: a }), t.buildSpec();
  } catch (r) {
    return console.error("[json-to-dom-renderers:Table] Failed to load spec via dataProvider.read:", r), t == null ? void 0 : t.spec;
  }
}, Ot = ({ inTable: l, inData: e = [] } = {}) => {
  const t = l, n = e;
  return t.store.updateData({ inData: n }), t.render();
}, Qt = async ({ inTable: l, inItem: e = {} } = {}) => {
  const t = l, n = e;
  if (!(t != null && t.dataProvider) || typeof t.dataProvider.create != "function")
    throw new Error("Table.createRecord requires a valid dataProvider.create implementation");
  const o = await t.dataProvider.create({ inItem: n });
  return await S({ inTable: t }), o;
}, Pt = async ({ inTable: l, inId: e = null, inItem: t = {} } = {}) => {
  const n = l, o = e, r = t;
  if (!(n != null && n.dataProvider) || typeof n.dataProvider.update != "function")
    throw new Error("Table.updateRecord requires a valid dataProvider.update implementation");
  const a = await n.dataProvider.update({ inId: o, inItem: r });
  return await S({ inTable: n }), a;
}, Bt = async ({ inTable: l, inId: e = null } = {}) => {
  const t = l, n = e;
  if (!(t != null && t.dataProvider) || typeof t.dataProvider.delete != "function")
    throw new Error("Table.deleteRecord requires a valid dataProvider.delete implementation");
  const o = await t.dataProvider.delete({ inId: n });
  return await S({ inTable: t }), o;
}, Wt = ({ inTable: l } = {}) => {
  const e = l;
  return {
    load: async ({ inQuery: c, query: m } = {}) => await S({
      inTable: e,
      inQuery: c ?? m ?? {}
    }),
    loadSpec: async ({ inQuery: c, query: m } = {}) => await $t({
      inTable: e,
      inQuery: c ?? m ?? {}
    }),
    update: ({ inData: c, data: m } = {}) => Ot({ inTable: e, inData: c ?? m ?? [] }),
    createRecord: async ({ inItem: c, item: m } = {}) => await Qt({ inTable: e, inItem: c ?? m ?? {} }),
    updateRecord: async ({ inId: c, id: m = null, inItem: f, item: b = {} } = {}) => await Pt({ inTable: e, inId: c ?? m, inItem: f ?? b }),
    deleteRecord: async ({ inId: c, id: m = null } = {}) => await Bt({ inTable: e, inId: c ?? m }),
    filterOriginalData: ({ inQuery: c, query: m } = {}) => {
      H({ inTable: e, inQuery: c ?? m ?? "" });
    },
    filterStateData: ({ inQuery: c, query: m } = {}) => {
      z({ inTable: e, inQuery: c ?? m ?? "" });
    },
    filter: ({ inQuery: c, query: m, inFromState: f = !1 } = {}) => {
      Lt({
        inTable: e,
        inQuery: c ?? m ?? "",
        inFromState: f
      });
    }
  };
}, Ut = !0, Kt = {
  columns: []
}, qt = {
  striped: !0,
  hover: !0
}, Mt = [
  {
    id: "totals",
    title: "Total",
    type: "aggregate",
    values: {}
  }
], Vt = {
  table: "",
  thead: "",
  tfoot: "",
  th: "",
  tbody: "",
  tr: "",
  td: ""
}, _t = {
  serial: Ut,
  head: Kt,
  row: qt,
  foot: Mt,
  classes: Vt
};
class I {
  constructor({
    data: e = [],
    columns: t = [],
    config: n = {},
    layout: o,
    theme: r,
    classes: a = {},
    dataProvider: s = null,
    targetContainerId: i = ""
  } = {}) {
    const d = e, u = t, c = n, m = o || (c == null ? void 0 : c.layout) || "compact", f = r || (c == null ? void 0 : c.theme) || "default", b = a, p = s, y = i;
    this.containerId = y, this.layout = m, this.theme = f, this.customClasses = b, this.classes = j({
      inLayout: this.layout,
      inTheme: this.theme,
      inConfigClasses: c == null ? void 0 : c.classes,
      inCustomClasses: this.customClasses
    }), this.dataProvider = p, this.tableElement = null, this.controlsTree = null, this.store = new dt({
      inData: d,
      inColumns: u,
      inConfig: c
    }), this.methods = Rt({ inTable: this }), this.actions = Wt({ inTable: this }), this.spec = this.buildSpec();
  }
  setLayout({ layout: e = "compact", inLayout: t } = {}) {
    return vt({ inTable: this, inLayout: t || e || "compact" });
  }
  setTheme({ theme: e = "default", inTheme: t } = {}) {
    return Ct({ inTable: this, inTheme: t || e || "default" });
  }
  buildSpec() {
    return this.methods.buildSpec();
  }
  renderStructure(e = {}) {
    return this.methods.renderStructure(e);
  }
  async loadSpec(e = {}) {
    return await this.actions.loadSpec(e);
  }
  async render(e = {}) {
    return await this.methods.render(e);
  }
  getControlsTree() {
    return this.controlsTree;
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
  // Methods (DOM / repaints) delegations for backward compatibility
  repaintBody() {
    return this.methods.repaintBody();
  }
  repaintFoot() {
    return this.methods.repaintFoot();
  }
  refreshTable() {
    return this.methods.refreshTable();
  }
  // Actions (state / CRUD / filtering) delegations for backward compatibility
  load(e = {}) {
    return this.actions.load(e);
  }
  update(e = {}) {
    return this.actions.update(e);
  }
  createRecord(e = {}) {
    return this.actions.createRecord(e);
  }
  updateRecord(e = {}) {
    return this.actions.updateRecord(e);
  }
  deleteRecord(e = {}) {
    return this.actions.deleteRecord(e);
  }
  filterOriginalData(e = {}) {
    return this.actions.filterOriginalData(e);
  }
  filterStateData(e = {}) {
    return this.actions.filterStateData(e);
  }
  filter(e = {}) {
    return this.actions.filter(e);
  }
}
I.layouts = Object.keys(x);
I.themes = Object.keys(N);
I.configTemplate = _t;
class Jt extends U {
  constructor({ inColumns: e = [], inConfig: t = {} } = {}) {
    const n = e, o = t;
    super({
      inColumns: n,
      inConfig: o
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: e } = {}) {
    var o, r;
    const t = e;
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
const Ht = ({ inHeadConfig: l = {}, inClasses: e = {} } = {}) => {
  const t = l, n = e, o = (t == null ? void 0 : t.title) || "", r = (t == null ? void 0 : t.subtitle) || "";
  if (!o && !r) return null;
  const a = [];
  return o && a.push({
    tagName: "div",
    textContent: o,
    attributes: {
      class: (n == null ? void 0 : n.headTitle) || "h5 fw-bold mb-1"
    }
  }), r && a.push({
    tagName: "div",
    textContent: r,
    attributes: {
      class: (n == null ? void 0 : n.headSubtitle) || "text-muted small"
    }
  }), {
    tagName: "div",
    attributes: {
      class: (n == null ? void 0 : n.head) || (t == null ? void 0 : t.class) || "pb-2 mb-3 border-bottom"
    },
    children: a
  };
}, zt = ({ inColumn: l = {}, inClasses: e = {}, inConfig: t = {} } = {}) => {
  const n = l, o = e, r = t, a = n.key || "", s = n.label || a, i = n.type === "number" ? "number" : "text", d = {
    tagName: "label",
    textContent: s,
    attributes: o != null && o.label ? { class: o.label } : {}
  }, u = n.datalist === !0 || n.datalist !== !1 && i !== "number", c = n.datalistId || `${a}-datalist`, m = {
    type: i,
    name: a,
    placeholder: `Enter ${s}...`
  };
  o != null && o.input && (m.class = o.input), u && (m.list = c);
  const f = {
    tagName: "input",
    attributes: m
  };
  n.id && (f.attributes.id = n.id, d.attributes.for = n.id);
  const b = (r == null ? void 0 : r.searchButtons) === !1 || n.searchButton === !1 || n.search === !1, p = n.searchButton === !0 || n.search === !0 || (r == null ? void 0 : r.searchButtons) === !0, y = !b && (p || !!n.searchId);
  let h;
  if (y) {
    const g = {
      tagName: "button",
      textContent: "Search",
      attributes: {
        type: "button",
        id: n.searchId || `${a}-search`,
        name: `${a}-search`,
        "data-key": a,
        class: (o == null ? void 0 : o.button) || "btn btn-outline-secondary"
      }
    };
    h = {
      tagName: "div",
      attributes: o != null && o.group ? { class: o.group } : {},
      children: [f, g]
    };
  } else
    h = f;
  return o != null && o.controlWrapper && (h = {
    tagName: "div",
    attributes: { class: o.controlWrapper },
    children: [h]
  }), {
    tagName: "div",
    attributes: o != null && o.field ? { class: o.field } : {},
    children: [d, h]
  };
}, Gt = ({ inColumns: l = [], inConfig: e = {}, inClasses: t = {} } = {}) => {
  const n = l, o = e, r = t;
  if (!Array.isArray(n)) return { tagName: "div", children: [] };
  const a = n.map((i) => zt({ inColumn: i, inClasses: r, inConfig: o }));
  return {
    tagName: "div",
    attributes: r != null && r.body ? { class: r.body } : {},
    children: a
  };
}, Xt = ({ inFootConfig: l = {}, inClasses: e = {} } = {}) => {
  const t = l, n = e, o = t == null ? void 0 : t.buttons;
  if (!Array.isArray(o) || o.length === 0) return null;
  const r = o.map((s) => {
    const d = s.variant === "primary" ? "btn btn-primary" : (n == null ? void 0 : n.button) || "btn btn-outline-secondary", u = s.class || d, c = {
      type: s.type || "button",
      name: s.name || "",
      class: u
    };
    return s.id && (c.id = s.id), {
      tagName: "button",
      textContent: s.label || s.name,
      attributes: c
    };
  });
  return {
    tagName: "div",
    attributes: {
      class: (n == null ? void 0 : n.foot) || (t == null ? void 0 : t.class) || "d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top"
    },
    children: r
  };
}, Yt = ({ inColumns: l = [], inConfig: e = {}, inClasses: t = {} } = {}) => {
  const n = l, o = e, r = t, a = Ht({ inHeadConfig: o == null ? void 0 : o.head, inClasses: r }), s = Gt({ inColumns: n, inConfig: o, inClasses: r }), i = Xt({ inFootConfig: o == null ? void 0 : o.foot, inClasses: r });
  return {
    tagName: "div",
    attributes: r != null && r.form ? { class: r.form } : {},
    children: [a, s, i].filter(Boolean)
  };
}, Zt = ({ inForm: l } = {}) => {
  var d, u;
  const e = l;
  if (!e)
    return console.error("[json-to-dom-renderers:Form] Form instance (inForm) is required to render."), {
      treeWithIds: null,
      spec: null,
      element: null,
      error: "Form instance (inForm) is required"
    };
  const t = e.containerId, n = document.getElementById(t);
  if (!n)
    return console.error(`[json-to-dom-renderers:Form] Target container "#${t}" was not found in the DOM.`), {
      treeWithIds: null,
      spec: null,
      element: null,
      error: `Target container "#${t}" not found in DOM.`
    };
  const o = Yt({
    inColumns: e.store.activeColumns,
    inConfig: e.store.config,
    inClasses: e.classes
  }), r = T({ inSpec: o }), a = (u = (d = window.ks) == null ? void 0 : d["json-to-dom"]) == null ? void 0 : u.buildSpecElement;
  if (typeof a != "function")
    return console.error("json-to-dom buildSpecElement not found on window.ks"), {
      treeWithIds: r,
      spec: o,
      element: null
    };
  const s = a({ inSpec: o }), i = Array.isArray(s) ? s[0] : s;
  return n.innerHTML = "", n.appendChild(i), {
    treeWithIds: r,
    spec: o,
    element: i
  };
}, te = {
  form: "",
  body: "d-flex flex-column gap-3",
  field: "col-12",
  label: "form-label mb-1",
  controlWrapper: "",
  group: "input-group input-group-sm w-100",
  input: "form-control",
  button: "btn",
  foot: "d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top"
}, ee = {
  form: "",
  body: "d-flex flex-column gap-3",
  field: "row align-items-center g-2",
  label: "col-sm-4 col-form-label text-sm-end mb-0",
  controlWrapper: "col-sm-8",
  group: "input-group input-group-sm w-100",
  input: "form-control",
  button: "btn",
  foot: "d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top"
}, ne = {
  form: "mb-3",
  body: "row g-3 align-items-center",
  field: "col-auto d-flex align-items-center gap-2 mb-2",
  label: "col-form-label col-form-label-sm text-nowrap mb-0",
  controlWrapper: "",
  group: "input-group input-group-sm w-auto",
  input: "form-control",
  button: "btn",
  foot: "col-auto d-flex align-items-center gap-2 mt-2"
}, B = {
  stacked: te,
  horizontal: ee,
  inline: ne
}, oe = {
  form: "bg-light p-3 rounded shadow-sm border",
  body: "",
  field: "",
  label: "fw-semibold text-secondary small",
  controlWrapper: "",
  group: "",
  input: "bg-white border-secondary border-opacity-25",
  button: "btn-outline-primary",
  foot: "border-secondary border-opacity-25"
}, re = {
  form: "bg-transparent border-0 shadow-none",
  body: "",
  field: "",
  label: "text-muted small",
  controlWrapper: "",
  group: "",
  input: "bg-light border-light-subtle",
  button: "btn-light border",
  foot: "border-light-subtle"
}, ae = {
  form: "card p-3 shadow-sm bg-dark text-light border-secondary",
  body: "",
  field: "",
  label: "fw-semibold text-light small",
  controlWrapper: "",
  group: "",
  input: "bg-dark text-light border-secondary",
  button: "btn-outline-light",
  foot: "border-secondary"
}, se = {
  form: "card p-3 shadow-sm bg-black text-light border-secondary border-opacity-50",
  body: "",
  field: "",
  label: "fw-bold text-white small",
  controlWrapper: "",
  group: "",
  input: "bg-dark text-white border-secondary",
  button: "btn-primary",
  foot: "border-secondary border-opacity-50"
}, W = {
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
  light: oe,
  extraLight: re,
  dark: ae,
  extraDark: se
}, le = ({ inForm: l, inTheme: e = "default" } = {}) => {
  var o, r;
  const t = l, n = e || "default";
  if (t && (t.theme = n, t.classes = L({
    inLayout: t.layout,
    inTheme: t.theme,
    inConfigClasses: (r = (o = t.store) == null ? void 0 : o.config) == null ? void 0 : r.classes,
    inCustomClasses: t.customClasses
  }), t.formElement))
    return t.render();
}, L = ({
  inLayout: l = "stacked",
  inTheme: e = "default",
  inConfigClasses: t = {},
  inCustomClasses: n = {}
} = {}) => {
  const o = l || "stacked", r = e || "default", a = t || {}, s = n || {}, i = B[o] || B.stacked || {}, d = W[r] || W.default || {}, u = /* @__PURE__ */ new Set([
    ...Object.keys(i),
    ...Object.keys(d),
    ...Object.keys(a),
    ...Object.keys(s)
  ]), c = {};
  for (const m of u) {
    const f = [
      i[m],
      d[m],
      a[m],
      s[m]
    ].filter(Boolean).join(" ").split(/\s+/).filter(Boolean);
    c[m] = Array.from(new Set(f)).join(" ");
  }
  return c;
}, ie = ({ inForm: l, inLayout: e = "stacked" } = {}) => {
  var o, r;
  const t = l, n = e || "stacked";
  if (t && (t.layout = n, t.classes = L({
    inLayout: t.layout,
    inTheme: t.theme,
    inConfigClasses: (r = (o = t.store) == null ? void 0 : o.config) == null ? void 0 : r.classes,
    inCustomClasses: t.customClasses
  }), t.formElement))
    return t.render();
};
class ce {
  constructor({
    columns: e = [],
    config: t = {},
    layout: n,
    theme: o,
    classes: r = {},
    targetContainerId: a = "form-container",
    inColumns: s,
    inConfig: i,
    inLayout: d,
    inTheme: u,
    inClasses: c,
    inTargetContainerId: m
  } = {}) {
    const f = s || e, b = i || t, p = d || n || (b == null ? void 0 : b.layout) || "stacked", y = u || o || (b == null ? void 0 : b.theme) || "default", h = c || r, g = m || a;
    this.containerId = g, this.layout = p, this.theme = y, this.customClasses = h, this.classes = L({
      inLayout: this.layout,
      inTheme: this.theme,
      inConfigClasses: b == null ? void 0 : b.classes,
      inCustomClasses: this.customClasses
    }), this.formElement = null, this.controlsTree = null, this.store = new Jt({
      inColumns: f,
      inConfig: b
    });
  }
  setLayout({ inLayout: e, layout: t = "stacked" } = {}) {
    return ie({ inForm: this, inLayout: e || t || "stacked" });
  }
  setTheme({ inTheme: e, theme: t = "default" } = {}) {
    return le({ inForm: this, inTheme: e || t || "default" });
  }
  get columns() {
    return this.store.activeColumns;
  }
  get config() {
    return this.store.config;
  }
  render() {
    const e = Zt({ inForm: this });
    return e && (this.formElement = e.element, this.controlsTree = e.treeWithIds), e;
  }
  getControlsTree() {
    return this.controlsTree;
  }
}
class ue extends U {
  constructor({ inData: e = [], inColumns: t = [], inConfig: n = {}, inTopN: o = 100 } = {}) {
    const r = e, a = t, s = n, i = o;
    super({
      inData: r,
      inColumns: a,
      inConfig: s,
      inTopN: i
    }), this.library = this._buildLibrary({
      inSource: this.source
    });
  }
  _buildLibrary({ inSource: e } = {}) {
    var a, s, i, d, u;
    const t = e, n = this._resolveActiveColumns({
      inColumnsCatalog: t == null ? void 0 : t.columns,
      inColumnKeys: ((s = (a = t == null ? void 0 : t.config) == null ? void 0 : a.datalist) == null ? void 0 : s.columns) || ((i = t == null ? void 0 : t.config) == null ? void 0 : i.columns)
    }), o = K({
      inData: t == null ? void 0 : t.originalData
    }), r = ((u = (d = t == null ? void 0 : t.config) == null ? void 0 : d.datalist) == null ? void 0 : u.topN) ?? (t == null ? void 0 : t.topN) ?? 100;
    return {
      activeColumns: n,
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
  updateData({ inData: e = [] } = {}) {
    const t = e;
    return this.library.stateData = Array.isArray(t) ? t : [], this.library.stateData;
  }
}
const G = ({ inData: l = [], inKey: e = "", inTopN: t = 100 } = {}) => {
  const n = l, o = e, r = t;
  if (!Array.isArray(n) || !o) return [];
  const a = /* @__PURE__ */ new Map();
  for (const d of n) {
    if (!d || typeof d != "object") continue;
    const u = d[o];
    if (u != null) {
      const c = String(u).trim();
      c !== "" && a.set(c, (a.get(c) || 0) + 1);
    }
  }
  const s = Array.from(a.entries()).map(([d, u]) => ({ value: d, count: u })).sort((d, u) => u.count - d.count);
  return (r > 0 && Number.isFinite(r) ? s.slice(0, r) : s).map(({ value: d, count: u }) => ({
    tagName: "option",
    attributes: {
      value: d,
      label: `${d} (${u})`
    },
    textContent: `${d} (${u})`
  }));
}, de = ({ inData: l = [], inColumns: e = [], inTopN: t = 100 } = {}) => {
  const n = l, o = e, r = t;
  if (!Array.isArray(o) || o.length === 0)
    return {
      tagName: "div",
      attributes: { id: "ks-datalists-wrapper" },
      children: []
    };
  const a = o.map((s) => {
    const i = s.key || "", d = s.datalistId || `${i}-datalist`, u = G({
      inData: n,
      inKey: i,
      inTopN: r
    });
    return {
      tagName: "datalist",
      attributes: {
        id: d
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
}, me = ({ inDataList: l } = {}) => {
  var a, s;
  const e = l;
  if (!e || typeof document > "u") return null;
  let t = document.getElementById(e.containerId);
  t || (console.warn(`[json-to-dom-renderers:DataList] Target container "#${e.containerId}" was not found in the DOM; auto-created and appended to document.body.`), t = document.createElement("div"), t.id = e.containerId, document.body.appendChild(t));
  const n = de({
    inData: e.store.stateData,
    inColumns: e.store.activeColumns,
    inTopN: e.store.topN
  });
  e.spec = n;
  const o = (s = (a = window.ks) == null ? void 0 : a["json-to-dom"]) == null ? void 0 : s.buildSpecElement;
  let r = null;
  if (typeof o == "function") {
    const i = o({ inSpec: n });
    r = Array.isArray(i) ? i[0] : i;
  }
  if (!r || r.children.length === 0) {
    const i = document.createElement("div");
    i.id = "ks-datalists-wrapper";
    for (const d of e.store.activeColumns) {
      const u = d.key || "", c = d.datalistId || `${u}-datalist`, m = document.createElement("datalist");
      m.id = c;
      const f = G({
        inData: e.store.stateData,
        inKey: u,
        inTopN: e.store.topN
      });
      for (const b of f) {
        const p = document.createElement("option");
        p.value = b.attributes.value, p.label = b.attributes.label, p.textContent = b.textContent, m.appendChild(p);
      }
      i.appendChild(m);
    }
    r = i;
  }
  return e.element = r, t.innerHTML = "", e.element && t.appendChild(e.element), {
    spec: e.spec,
    element: e.element
  };
};
class $ {
  constructor({
    data: e = [],
    columns: t = [],
    config: n = {},
    dataProvider: o = null,
    targetContainerId: r = "datalist-container"
  } = {}) {
    const a = e, s = t, i = n, d = o, u = r;
    this.containerId = u, this.dataProvider = d, this.element = null, this.spec = null, this.store = new ue({
      inData: a,
      inColumns: s,
      inConfig: i
    });
  }
  async load({ query: e = {} } = {}) {
    const t = e;
    if (!this.dataProvider || typeof this.dataProvider.read != "function")
      return console.warn("[json-to-dom-renderers:DataList] DataList.load called without a valid dataProvider.read implementation"), this.store.stateData;
    try {
      const n = await this.dataProvider.read({ inQuery: t }), o = Array.isArray(n) ? n : (n == null ? void 0 : n.data) || [];
      return this.store.updateData({ inData: o }), this.render(), o;
    } catch (n) {
      return console.error("[json-to-dom-renderers:DataList] Failed to load records via dataProvider.read:", n), this.store.stateData;
    }
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
    return me({ inDataList: this });
  }
  update({ data: e = [] } = {}) {
    const t = e;
    return this.store.updateData({ inData: t }), this.render();
  }
}
$.layouts = [];
$.themes = [];
const fe = ({
  inBaseUrl: l = "",
  inReadUrl: e = "",
  inCreateUrl: t = "",
  inUpdateUrl: n = "",
  inDeleteUrl: o = "",
  inHeaders: r = {},
  inFetchOptions: a = {},
  inCustom: s = {}
} = {}) => {
  const i = l, d = e || i, u = t || i, c = n || i, m = o || i, f = {
    "Content-Type": "application/json",
    ...r
  }, b = a, p = s;
  return {
    read: async ({ inQuery: y = {}, inUrl: h } = {}) => {
      const g = y;
      if (typeof p.read == "function")
        return await p.read({ inQuery: g });
      const C = h || d;
      if (!C) return [];
      let v = C;
      if (g && typeof g == "object" && Object.keys(g).length > 0) {
        const D = new URLSearchParams(g).toString();
        D && (v += (v.includes("?") ? "&" : "?") + D);
      }
      const w = await fetch(v, {
        method: "GET",
        headers: f,
        ...b
      });
      if (!w.ok)
        throw new Error(`DataProvider read failed: ${w.status} ${w.statusText}`);
      return await w.json();
    },
    create: async ({ inItem: y = {}, inUrl: h } = {}) => {
      const g = y;
      if (typeof p.create == "function")
        return await p.create({ inItem: g });
      const v = await fetch(h || u, {
        method: "POST",
        headers: f,
        body: JSON.stringify(g),
        ...b
      });
      if (!v.ok)
        throw new Error(`DataProvider create failed: ${v.status} ${v.statusText}`);
      return await v.json();
    },
    update: async ({ inId: y, inItem: h = {}, inUrl: g } = {}) => {
      const C = y, v = h;
      if (typeof p.update == "function")
        return await p.update({ inId: C, inItem: v });
      let w = g || c;
      C != null && (w.includes(":id") ? w = w.replace(":id", encodeURIComponent(C)) : w = `${w.replace(/\/$/, "")}/${encodeURIComponent(C)}`);
      const D = await fetch(w, {
        method: "PUT",
        headers: f,
        body: JSON.stringify(v),
        ...b
      });
      if (!D.ok)
        throw new Error(`DataProvider update failed: ${D.status} ${D.statusText}`);
      return await D.json();
    },
    delete: async ({ inId: y, inUrl: h } = {}) => {
      const g = y;
      if (typeof p.delete == "function")
        return await p.delete({ inId: g });
      let C = h || m;
      g != null && (C.includes(":id") ? C = C.replace(":id", encodeURIComponent(g)) : C = `${C.replace(/\/$/, "")}/${encodeURIComponent(g)}`);
      const v = await fetch(C, {
        method: "DELETE",
        headers: f,
        ...b
      });
      if (!v.ok)
        throw new Error(`DataProvider delete failed: ${v.status} ${v.statusText}`);
      return await v.json();
    }
  };
};
window.ks ?? (window.ks = {});
window.ks["json-to-dom-renderers"] = {
  Table: I,
  Form: ce,
  DataList: $,
  createDataProvider: fe
};
export {
  $ as DataList,
  ce as Form,
  I as Table,
  fe as createDataProvider
};
