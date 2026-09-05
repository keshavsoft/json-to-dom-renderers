import { TableStore } from "./tableStore/index.js";
import { renderTable } from "./render/index.js";
import { layouts, setLayout } from "./layout/index.js";
import { themes, setTheme } from "./theme/index.js";
import { resolveClasses } from "./classes/index.js";
import { repaintBody, repaintFoot, refreshTable } from "./repaints/index.js";
import { filterTable, filterOriginalTable, filterStateTable } from "./filter/index.js";

class Table {
    constructor({
        data = [],
        columns = [],
        config = {},
        layout,
        theme,
        classes = {},
        dataProvider = null,
        targetContainerId = "table-container"
    } = {}) {
        const localData = data;
        const localColumns = columns;
        const localConfig = config;
        const localLayout = layout || localConfig?.layout || "compact";
        const localTheme = theme || localConfig?.theme || "default";
        const localClasses = classes;
        const localDataProvider = dataProvider;
        const localTargetContainerId = targetContainerId;

        this.containerId = localTargetContainerId;
        this.layout = localLayout;
        this.theme = localTheme;
        this.customClasses = localClasses;
        this.classes = resolveClasses({
            inLayout: this.layout,
            inTheme: this.theme,
            inConfigClasses: localConfig?.classes,
            inCustomClasses: this.customClasses
        });
        this.dataProvider = localDataProvider;
        this.tableElement = null;
        this.controlsTree = null;

        this.store = new TableStore({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig
        });
    }

    setLayout({ layout = "compact" } = {}) {
        const localLayout = layout || "compact";
        return setLayout({ inTable: this, inLayout: localLayout });
    }

    setTheme({ theme = "default" } = {}) {
        const localTheme = theme || "default";
        return setTheme({ inTable: this, inTheme: localTheme });
    }

    async load({ query = {} } = {}) {
        const localQuery = query;
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

    update({ data = [] } = {}) {
        const localData = data;
        this.store.updateData({ inData: localData });
        return this.render();
    }

    async createRecord({ item = {} } = {}) {
        const localItem = item;
        if (!this.dataProvider || typeof this.dataProvider.create !== "function") {
            throw new Error("Table.createRecord requires a valid dataProvider.create implementation");
        }
        const result = await this.dataProvider.create({ inItem: localItem });
        await this.load();
        return result;
    }

    async updateRecord({ id = null, item = {} } = {}) {
        const localId = id;
        const localItem = item;
        if (!this.dataProvider || typeof this.dataProvider.update !== "function") {
            throw new Error("Table.updateRecord requires a valid dataProvider.update implementation");
        }
        const result = await this.dataProvider.update({ inId: localId, inItem: localItem });
        await this.load();
        return result;
    }

    async deleteRecord({ id = null } = {}) {
        const localId = id;
        if (!this.dataProvider || typeof this.dataProvider.delete !== "function") {
            throw new Error("Table.deleteRecord requires a valid dataProvider.delete implementation");
        }
        const result = await this.dataProvider.delete({ inId: localId });
        await this.load();
        return result;
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
        const result = renderTable({ inTable: this });
        if (result) {
            this.tableElement = result.element;
            this.controlsTree = result.treeWithIds;
        }
        return result;
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

    filterOriginalData({ query = "" } = {}) {
        const localQuery = query;

        filterOriginalTable({
            inTable: this,
            inQuery: localQuery
        });
    }

    filterStateData({ query = "" } = {}) {
        const localQuery = query;

        filterStateTable({
            inTable: this,
            inQuery: localQuery
        });
    }

    filter({ query = "" } = {}) {
        const localQuery = query;
        this.filterOriginalData({ query: localQuery });
    }
}

Table.layouts = Object.keys(layouts);
Table.themes = Object.keys(themes);

export { Table, layouts, themes, setLayout, setTheme, resolveClasses, repaintBody, repaintFoot, refreshTable, filterTable, filterOriginalTable, filterStateTable };
export default Table;
