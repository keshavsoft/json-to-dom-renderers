import { repaintBody, repaintFoot, refreshTable } from "./repaints/index.js";
import { renderTable, renderStructure, buildSpec } from "./render/index.js";
import { buildTable } from "./tableBuilder/index.js";

const methods = {
    repaintBody,
    repaintFoot,
    refreshTable,
    renderTable,
    renderStructure,
    buildSpec,
    buildTable
};


const createMethods = ({ inTable } = {}) => {
    const localTable = inTable;

    const localBuildSpec = () => {
        return buildSpec({ inTable: localTable });
    };

    const localRepaintBody = () => {
        if (!localTable?.tableElement) return;

        repaintBody({
            inTableElement: localTable.tableElement,
            inColumns: localTable.store.activeColumns,
            inData: localTable.store.stateData,
            inRowConfig: localTable.store.config?.row,
            inClasses: localTable.classes
        });
    };

    const localRepaintFoot = () => {
        if (!localTable?.tableElement) return;

        repaintFoot({
            inTableElement: localTable.tableElement,
            inColumns: localTable.store.activeColumns,
            inComputedFooter: localTable.store.computedFooter,
            inClasses: localTable.classes
        });
    };

    const localRefreshTable = () => {
        if (!localTable?.tableElement) return;

        refreshTable({
            inTableElement: localTable.tableElement,
            inStore: localTable.store,
            inClasses: localTable.classes
        });
    };

    const localRender = async ({ inContainerId, inContainer, targetContainerId, inQuery = {} } = {}) => {
        const localContainerId = inContainerId || targetContainerId;
        const localContainer = inContainer;
        const localQuery = inQuery;

        const result = await renderTable({
            inTable: localTable,
            inContainerId: localContainerId,
            inContainer: localContainer,
            inQuery: localQuery
        });

        if (result?.element) {
            localTable.tableElement = result.element;
            localTable.controlsTree = result.treeWithIds;
        }

        return result;
    };

    const localRenderStructure = ({ inContainerId, inContainer, targetContainerId } = {}) => {
        const localContainerId = inContainerId || targetContainerId;
        const localContainer = inContainer;

        const result = renderStructure({
            inTable: localTable,
            inContainerId: localContainerId,
            inContainer: localContainer
        });

        if (result?.element) {
            localTable.tableElement = result.element;
            localTable.controlsTree = result.treeWithIds;
        }

        return result;
    };

    return {
        buildSpec: localBuildSpec,
        repaintBody: localRepaintBody,
        repaintFoot: localRepaintFoot,
        refreshTable: localRefreshTable,
        renderStructure: localRenderStructure,
        render: localRender
    };
};

export { methods, createMethods, buildSpec, repaintBody, repaintFoot, refreshTable, renderTable, renderStructure, buildTable };
export default methods;

