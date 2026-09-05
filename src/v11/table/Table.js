import { TableStore } from "./tableStore/index.js";
import { buildTable } from "./tableBuilder/buildTable.js";
import { pruneTreeWithIds } from "../common/pruneTreeWithIds.js";
import { repaintBody, repaintFoot, refreshTable } from "./repaints/index.js";
import { filterTable, filterOriginalTable, filterStateTable } from "./filter/filterTable.js";
import defaultClasses from "./classes.json" with { type: "json" };

export class Table {
    constructor({ data = [], columns = [], config = {}, theme = "default", classes = null, dataProvider = null, targetContainerId = "table-container", inData, inColumns, inConfig, inTheme, inClasses, inDataProvider, inTargetContainerId } = {}) {
        const localData = data || inData || [];
        const localColumns = columns || inColumns || [];
        const localConfig = config || inConfig || {};
        const localTheme = inTheme || theme || localConfig?.theme || "default";
        const baseTheme = defaultClasses[localTheme] || defaultClasses["default"] || defaultClasses;
        const localClasses = classes || inClasses || {};
        const localDataProvider = inDataProvider || dataProvider || null;
        const localTargetContainerId = targetContainerId || inTargetContainerId || "table-container";

        this.containerId = localTargetContainerId;
        this.theme = localTheme;
        this.classes = { ...baseTheme, ...(localConfig?.classes || {}), ...localClasses };
        this.dataProvider = localDataProvider;
        this.tableElement = null;
        this.controlsTree = null;

        this.store = new TableStore({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig
        });
    }

    setTheme({ theme = "default", inTheme } = {}) {
        const localTheme = inTheme || theme || "default";
        this.theme = localTheme;
        const baseTheme = defaultClasses[localTheme] || defaultClasses["default"] || defaultClasses;
        this.classes = { ...baseTheme, ...(this.store.config?.classes || {}) };
        if (this.tableElement) {
            return this.render();
        }
    }

    async load({ inQuery = {}, query = null } = {}) {
        const localQuery = query || inQuery;
        if (!this.dataProvider || typeof this.dataProvider.read !== "function") {
            console.warn("Table.load called without a valid dataProvider.read implementation");
            return this.store.stateData;
        }

        const fetchedData = await this.dataProvider.read({ inQuery: localQuery });
        const records = Array.isArray(fetchedData) ? fetchedData : (fetchedData?.data || []);
        this.store.updateData({ inData: records });
        this.render();
        return records;
    }

    update({ data = [], inData } = {}) {
        const localData = data?.length > 0 ? data : (inData || []);
        this.store.updateData({ inData: localData });
        return this.render();
    }

    async createRecord({ inItem = {}, item = null } = {}) {
        const localItem = item || inItem;
        if (!this.dataProvider || typeof this.dataProvider.create !== "function") {
            throw new Error("Table.createRecord requires a valid dataProvider.create implementation");
        }
        const result = await this.dataProvider.create({ inItem: localItem });
        await this.load();
        return result;
    }

    async updateRecord({ inId, id = null, inItem = {}, item = null } = {}) {
        const localId = id != null ? id : inId;
        const localItem = item || inItem;
        if (!this.dataProvider || typeof this.dataProvider.update !== "function") {
            throw new Error("Table.updateRecord requires a valid dataProvider.update implementation");
        }
        const result = await this.dataProvider.update({ inId: localId, inItem: localItem });
        await this.load();
        return result;
    }

    async deleteRecord({ inId, id = null } = {}) {
        const localId = id != null ? id : inId;
        if (!this.dataProvider || typeof this.dataProvider.delete !== "function") {
            throw new Error("Table.deleteRecord requires a valid dataProvider.delete implementation");
        }
        const result = await this.dataProvider.delete({ inId: localId });
        await this.load();
        return result;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return null;

        const tableSpec = buildTable({
            inColumns: this.store.activeColumns,
            inData: this.store.stateData,
            inComputedFooter: this.store.computedFooter,
            inRowConfig: this.store.config?.row,
            inClasses: this.classes
        });

        // Extract pruned tree with controls having IDs only (like Form v4)
        this.controlsTree = pruneTreeWithIds({ inSpec: tableSpec });

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;

        if (typeof builder !== "function") {
            console.error("json-to-dom buildSpecElement not found on window.ks");
            return this.controlsTree;
        }

        const domElement = builder({ inSpec: tableSpec });
        this.tableElement = Array.isArray(domElement) ? domElement[0] : domElement;

        container.innerHTML = "";
        container.appendChild(this.tableElement);

        return {
            treeWithIds: this.controlsTree,
            spec: tableSpec,
            element: this.tableElement
        };
    }

    getControlsTree() {
        return this.controlsTree;
    }

    repaintBody() {
        if (!this.tableElement) return;

        repaintBody({
            inTableElement: this.tableElement,
            inColumns: this.store.activeColumns,
            inData: this.store.stateData,
            inRowConfig: this.store.config?.row,
            inClasses: this.classes
        });
    }

    repaintFoot() {
        if (!this.tableElement) return;

        repaintFoot({
            inTableElement: this.tableElement,
            inColumns: this.store.activeColumns,
            inComputedFooter: this.store.computedFooter,
            inClasses: this.classes
        });
    }

    refreshTable() {
        if (!this.tableElement) return;

        refreshTable({
            inTableElement: this.tableElement,
            inStore: this.store,
            inClasses: this.classes
        });
    }

    filterOriginalData({ query = "", inQuery = "" } = {}) {
        const localQuery = query || inQuery;

        filterOriginalTable({
            inTable: this,
            inQuery: localQuery
        });
    }

    filterStateData({ query = "", inQuery = "" } = {}) {
        const localQuery = query || inQuery;

        filterStateTable({
            inTable: this,
            inQuery: localQuery
        });
    }

    filter({ query = "", inQuery = "" } = {}) {
        const localQuery = query || inQuery;
        this.filterOriginalData({ query: localQuery });
    }
}

export { repaintBody, repaintFoot, refreshTable } from "./repaints/index.js";
export { filterTable, filterOriginalTable, filterStateTable } from "./filter/filterTable.js";
export default Table;
