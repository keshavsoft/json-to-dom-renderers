import { buildTable } from "../tableBuilder/index.js";
import { pruneTreeWithIds } from "../../common/pruneTreeWithIds.js";

const renderTable = ({ inTable } = {}) => {
    const localTable = inTable;
    if (!localTable) return null;

    const container = document.getElementById(localTable.containerId);
    if (!container) return null;

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
