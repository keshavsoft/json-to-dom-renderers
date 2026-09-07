import { buildSpec } from "./buildSpec.js";
import { pruneTreeWithIds } from "../../../common/pruneTreeWithIds.js";

const renderTable = async ({ inTable, inContainerId, inContainer, inQuery = {} } = {}) => {
    const localTable = inTable;
    const localContainerId = inContainerId;
    const localContainer = inContainer;
    const localQuery = inQuery;

    if (!localTable) {
        console.error("[json-to-dom-renderers:Table] Table instance (inTable) is required to render.");
        return {
            treeWithIds: null,
            spec: null,
            element: null,
            error: "Table instance (inTable) is required"
        };
    }

    // Internally call load() which pulls data and calls buildSpec() internally
    if (localTable.dataProvider && typeof localTable.load === "function") {
        await localTable.load({ inQuery: localQuery });
    } else {
        buildSpec({ inTable: localTable });
    }

    const tableSpec = localTable.spec || buildSpec({ inTable: localTable });
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

    // Resolve target container if provided
    let container = null;
    if (localContainer instanceof HTMLElement) {
        container = localContainer;
    } else {
        const targetId = localContainerId || localTable.containerId;
        if (targetId) {
            container = document.getElementById(targetId);
        }
    }

    if (container) {
        container.innerHTML = "";
        container.appendChild(tableElement);
    }

    localTable.tableElement = tableElement;
    localTable.controlsTree = controlsTree;

    return {
        treeWithIds: controlsTree,
        spec: tableSpec,
        element: tableElement,
        store: localTable.store
    };
};


export { renderTable };
export default renderTable;
