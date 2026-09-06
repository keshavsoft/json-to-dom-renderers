import { buildTable } from "../tableBuilder/index.js";
import { pruneTreeWithIds } from "../../common/pruneTreeWithIds.js";

const renderTable = ({ inTable } = {}) => {
    const localTable = inTable;
    if (!localTable) {
        console.error("[json-to-dom-renderers:Table] Table instance (inTable) is required to render.");
        return {
            treeWithIds: null,
            spec: null,
            element: null,
            error: "Table instance (inTable) is required"
        };
    }

    const containerId = localTable.containerId;
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`[json-to-dom-renderers:Table] Target container "#${containerId}" was not found in the DOM.`);
        return {
            treeWithIds: null,
            spec: null,
            element: null,
            error: `Target container "#${containerId}" not found in DOM.`
        };
    }

    const tableSpec = buildTable({
        inColumns: localTable.store.activeColumns,
        inData: localTable.store.stateData,
        inComputedFooter: localTable.store.computedFooter,
        inRowConfig: localTable.store.config?.row,
        inClasses: localTable.classes
    });

    const controlsTree = pruneTreeWithIds({ inSpec: tableSpec });

    const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
    if (typeof builder !== "function") {
        console.error("json-to-dom buildSpecElement not found on window.ks");
        return {
            treeWithIds: controlsTree,
            spec: tableSpec,
            element: null
        };
    }

    const domElement = builder({ inSpec: tableSpec });
    const tableElement = Array.isArray(domElement) ? domElement[0] : domElement;

    container.innerHTML = "";
    container.appendChild(tableElement);

    return {
        treeWithIds: controlsTree,
        spec: tableSpec,
        element: tableElement
    };
};

export { renderTable };
export default renderTable;
