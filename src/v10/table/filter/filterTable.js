import { refreshTable } from "../repaints/refreshTable.js";

export const filterOriginalTable = ({ inTable, inQuery = "" } = {}) => {
    const localTable = inTable;
    const localQuery = inQuery;

    if (!localTable?.tableElement || !localTable?.store) return;

    localTable.store.filterOriginalData({ inQuery: localQuery });

    refreshTable({
        inTableElement: localTable.tableElement,
        inStore: localTable.store
    });
};

export const filterStateTable = ({ inTable, inQuery = "" } = {}) => {
    const localTable = inTable;
    const localQuery = inQuery;

    if (!localTable?.tableElement || !localTable?.store) return;

    localTable.store.filterStateData({ inQuery: localQuery });

    refreshTable({
        inTableElement: localTable.tableElement,
        inStore: localTable.store
    });
};

export const filterTable = ({ inTable, inQuery = "", inFromState = false, query = "" } = {}) => {
    const localTable = inTable;
    const localQuery = inQuery || query;
    const localFromState = inFromState;

    if (localFromState) {
        filterStateTable({ inTable: localTable, inQuery: localQuery });
    } else {
        filterOriginalTable({ inTable: localTable, inQuery: localQuery });
    }
};

export default filterTable;
