import { repaintBody } from "./repaintBody.js";
import { repaintFoot } from "./repaintFoot.js";

export const refreshTable = ({ inTableElement, inStore } = {}) => {
    const localTableElement = inTableElement;
    const localStore = inStore;

    if (!localTableElement || !localStore) return;

    repaintBody({
        inTableElement: localTableElement,
        inColumns: localStore.activeColumns,
        inData: localStore.stateData,
        inRowConfig: localStore.config?.row
    });

    repaintFoot({
        inTableElement: localTableElement,
        inColumns: localStore.activeColumns,
        inComputedFooter: localStore.computedFooter
    });
};

export default refreshTable;
