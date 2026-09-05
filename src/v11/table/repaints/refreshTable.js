import { repaintBody } from "./repaintBody.js";
import { repaintFoot } from "./repaintFoot.js";

export const refreshTable = ({ inTableElement, inStore, inClasses = {} } = {}) => {
    const localTableElement = inTableElement;
    const localStore = inStore;
    const localClasses = inClasses;

    if (!localTableElement || !localStore) return;

    repaintBody({
        inTableElement: localTableElement,
        inColumns: localStore.activeColumns,
        inData: localStore.stateData,
        inRowConfig: localStore.config?.row,
        inClasses: localClasses
    });

    repaintFoot({
        inTableElement: localTableElement,
        inColumns: localStore.activeColumns,
        inComputedFooter: localStore.computedFooter,
        inClasses: localClasses
    });
};

export default refreshTable;
