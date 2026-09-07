import { buildSpec } from "./buildSpec.js";
import { pruneTreeWithIds } from "../../../common/pruneTreeWithIds.js";

const renderStructure = ({ inTable, inContainerId, inContainer } = {}) => {
    const localTable = inTable;
    const localContainerId = inContainerId;
    const localContainer = inContainer;

    if (!localTable) {
        console.error("[json-to-dom-renderers:Table] Table instance (inTable) is required to render structure.");
        return null;
    }

    // Pure structure from current store (no data fetching)
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

    // Resolve target container
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


export { renderStructure };
export default renderStructure;
