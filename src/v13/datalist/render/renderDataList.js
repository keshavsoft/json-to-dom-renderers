import { buildDataList } from "../datalistBuilder/index.js";
import { buildOptions } from "../datalistBuilder/parts/index.js";

const renderDataList = ({ inDataList } = {}) => {
    const localDataList = inDataList;
    if (!localDataList || typeof document === "undefined") return null;

    let container = document.getElementById(localDataList.containerId);
    if (!container) {
        console.warn(`[json-to-dom-renderers:DataList] Target container "#${localDataList.containerId}" was not found in the DOM; auto-created and appended to document.body.`);
        container = document.createElement("div");
        container.id = localDataList.containerId;
        document.body.appendChild(container);
    }

    const dataListSpec = buildDataList({
        inData: localDataList.store.stateData,
        inColumns: localDataList.store.activeColumns,
        inTopN: localDataList.store.topN
    });

    localDataList.spec = dataListSpec;

    const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
    let domElement = null;

    if (typeof builder === "function") {
        const built = builder({ inSpec: dataListSpec });
        domElement = Array.isArray(built) ? built[0] : built;
    }

    // Fallback if builder is not present or returns empty element
    if (!domElement || domElement.children.length === 0) {
        const wrapper = document.createElement("div");
        wrapper.id = "ks-datalists-wrapper";

        for (const col of localDataList.store.activeColumns) {
            const key = col.key || "";
            const datalistId = col.datalistId || `${key}-datalist`;
            const datalist = document.createElement("datalist");
            datalist.id = datalistId;

            const options = buildOptions({
                inData: localDataList.store.stateData,
                inKey: key,
                inTopN: localDataList.store.topN
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

    localDataList.element = domElement;

    container.innerHTML = "";
    if (localDataList.element) {
        container.appendChild(localDataList.element);
    }

    return {
        spec: localDataList.spec,
        element: localDataList.element
    };
};

export { renderDataList };
export default renderDataList;
