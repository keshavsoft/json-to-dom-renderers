import { repaintBody } from "./repaintBody.js";
import { repaintFoot } from "./repaintFoot.js";

const refreshTable = ({ inTableElement, inStore, inClasses = {} } = {}) => {
    const localTableElement = inTableElement;
    const localStore = inStore;
    const localClasses = inClasses;

    if (!localTableElement || !localStore) return;

    repaintBody({
        inTableElement: localTableElement,
        inColumns: localStore.activeColumns,
        inData: localStore.stateData,
        inRowConfig: localStore.config?.row,
        inColumnsConfig: localStore.source?.config?.columnsConfig || localStore.config?.columnsConfig || [],
        inClasses: localClasses
    });

    repaintFoot({
        inTableElement: localTableElement,
        inColumns: localStore.activeColumns,
        inComputedFooter: localStore.computedFooter,
        inClasses: localClasses
    });
};

export { refreshTable };
export default refreshTable;
