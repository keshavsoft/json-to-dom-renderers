import { buildDataList } from "./datalistBuilder/buildDataList.js";
import { buildOptions } from "./datalistBuilder/parts/buildOptions.js";
import { DataListStore } from "./datalistStore/index.js";
import defaultClasses from "./classes.json" with { type: "json" };

export class DataList {
    constructor({ data = [], columns = [], config = {}, theme = "default", classes = null, targetContainerId = "datalist-container", inData, inColumns, inConfig, inTheme, inClasses, inTargetContainerId } = {}) {
        const localData = data || inData || [];
        const localColumns = columns || inColumns || [];
        const localConfig = config || inConfig || {};
        const localTheme = inTheme || theme || localConfig?.theme || "default";
        const baseTheme = defaultClasses[localTheme] || defaultClasses["default"] || defaultClasses;
        const localClasses = classes || inClasses || {};
        const localTargetContainerId = targetContainerId || inTargetContainerId || "datalist-container";

        this.containerId = localTargetContainerId;
        this.theme = localTheme;
        this.classes = { ...baseTheme, ...(localConfig?.classes || {}), ...localClasses };
        this.element = null;
        this.spec = null;

        this.store = new DataListStore({
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
        if (this.element) {
            return this.render();
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
        if (typeof document === "undefined") return null;

        let container = document.getElementById(this.containerId);
        if (!container) {
            container = document.createElement("div");
            container.id = this.containerId;
            document.body.appendChild(container);
        }

        const dataListSpec = buildDataList({
            inData: this.store.stateData,
            inColumns: this.store.activeColumns,
            inTopN: this.store.topN
        });

        this.spec = dataListSpec;

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
        let domElement = null;

        if (typeof builder !== "function") {
            const wrapper = document.createElement("div");
            wrapper.id = "ks-datalists-wrapper";

            for (const col of this.store.activeColumns) {
                const key = col.key || "";
                const datalistId = col.datalistId || `${key}-datalist`;
                const datalist = document.createElement("datalist");
                datalist.id = datalistId;

                const options = buildOptions({
                    inData: this.store.stateData,
                    inKey: key,
                    inTopN: this.store.topN
                });

                for (const opt of options) {
                    const optionEl = document.createElement("option");
                    optionEl.value = opt.attributes.value;
                    optionEl.label = opt.attributes.label;
                    optionEl.textContent = opt.textContent;
                    datalist.appendChild(optionEl);
                }

                wrapper.appendChild(datalist);
            }
            domElement = wrapper;
        } else {
            const built = builder({ inSpec: dataListSpec });
            domElement = Array.isArray(built) ? built[0] : built;

            if (!domElement || domElement.children.length === 0) {
                const wrapper = document.createElement("div");
                wrapper.id = "ks-datalists-wrapper";

                for (const col of this.store.activeColumns) {
                    const key = col.key || "";
                    const datalistId = col.datalistId || `${key}-datalist`;
                    const datalist = document.createElement("datalist");
                    datalist.id = datalistId;

                    const options = buildOptions({
                        inData: this.store.stateData,
                        inKey: key,
                        inTopN: this.store.topN
                    });

                    for (const opt of options) {
                        const optionEl = document.createElement("option");
                        optionEl.value = opt.attributes.value;
                        optionEl.label = opt.attributes.label;
                        optionEl.textContent = opt.textContent;
                        datalist.appendChild(optionEl);
                    }

                    wrapper.appendChild(datalist);
                }
                domElement = wrapper;
            }
        }

        this.element = domElement;

        container.innerHTML = "";
        if (this.element) {
            container.appendChild(this.element);
        }

        return {
            spec: this.spec,
            element: this.element
        };
    }

    update({ data = [], inData } = {}) {
        const localData = data.length > 0 ? data : (inData || []);
        this.store.updateData({ inData: localData });
        return this.render();
    }
}

export default DataList;
