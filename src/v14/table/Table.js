import { TableStore } from "./tableStore/index.js";
import { layouts, setLayout } from "./layout/index.js";
import { themes, setTheme } from "./theme/index.js";
import { resolveClasses } from "./classes/index.js";
import { methods, createMethods } from "./methods/index.js";
import { actions, createActions } from "./actions/index.js";
import { config as templateConfig } from "./templates/index.js";

class Table {
    constructor({
        data = [],
        columns = [],
        config = {},
        layout,
        theme,
        classes = {},
        dataProvider = null,
        targetContainerId = ""
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
        // console.log("this.store : ", this.store);
        this.methods = createMethods({ inTable: this });
        this.actions = createActions({ inTable: this });
        this.spec = this.buildSpec();
    }


    setLayout({ layout = "compact", inLayout } = {}) {
        const localLayout = inLayout || layout || "compact";
        return setLayout({ inTable: this, inLayout: localLayout });
    }

    setTheme({ theme = "default", inTheme } = {}) {
        const localTheme = inTheme || theme || "default";
        return setTheme({ inTable: this, inTheme: localTheme });
    }

    buildSpec() {
        return this.methods.buildSpec();
    }

    renderStructure(args = {}) {
        return this.methods.renderStructure(args);
    }

    async loadSpec(args = {}) {
        return await this.actions.loadSpec(args);
    }

    async render(args = {}) {
        return await this.methods.render(args);
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
    load(args = {}) {
        return this.actions.load(args);
    }

    update(args = {}) {
        return this.actions.update(args);
    }

    createRecord(args = {}) {
        return this.actions.createRecord(args);
    }

    updateRecord(args = {}) {
        return this.actions.updateRecord(args);
    }

    deleteRecord(args = {}) {
        return this.actions.deleteRecord(args);
    }

    filterOriginalData(args = {}) {
        return this.actions.filterOriginalData(args);
    }

    filterStateData(args = {}) {
        return this.actions.filterStateData(args);
    }

    filter(args = {}) {
        return this.actions.filter(args);
    }
}

Table.layouts = Object.keys(layouts);
Table.themes = Object.keys(themes);
Table.configTemplate = templateConfig;

export { Table, methods, actions, templateConfig };
export default Table;
