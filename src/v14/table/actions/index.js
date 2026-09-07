import { filterTable, filterOriginalTable, filterStateTable } from "./filter/index.js";
import { load, loadSpec, update, createRecord, updateRecord, deleteRecord } from "./crud/index.js";

const actions = {
    load,
    loadSpec,
    update,
    createRecord,
    updateRecord,
    deleteRecord,
    filterTable,
    filterOriginalTable,
    filterStateTable
};

const createActions = ({ inTable } = {}) => {
    const localTable = inTable;

    const localLoad = async ({ inQuery, query } = {}) => {
        const localQuery = inQuery ?? query ?? {};

        return await load({
            inTable: localTable,
            inQuery: localQuery
        });
    };

    const localLoadSpec = async ({ inQuery, query } = {}) => {
        const localQuery = inQuery ?? query ?? {};

        return await loadSpec({
            inTable: localTable,
            inQuery: localQuery
        });
    };




    const localUpdate = ({ inData, data } = {}) => {
        const localData = inData ?? data ?? [];
        return update({ inTable: localTable, inData: localData });
    };

    const localCreateRecord = async ({ inItem, item } = {}) => {
        const localItem = inItem ?? item ?? {};
        return await createRecord({ inTable: localTable, inItem: localItem });
    };

    const localUpdateRecord = async ({ inId, id = null, inItem, item = {} } = {}) => {
        const localId = inId ?? id;
        const localItem = inItem ?? item;
        return await updateRecord({ inTable: localTable, inId: localId, inItem: localItem });
    };

    const localDeleteRecord = async ({ inId, id = null } = {}) => {
        const localId = inId ?? id;
        return await deleteRecord({ inTable: localTable, inId: localId });
    };

    const localFilterOriginalData = ({ inQuery, query } = {}) => {
        const localQuery = inQuery ?? query ?? "";
        filterOriginalTable({ inTable: localTable, inQuery: localQuery });
    };

    const localFilterStateData = ({ inQuery, query } = {}) => {
        const localQuery = inQuery ?? query ?? "";
        filterStateTable({ inTable: localTable, inQuery: localQuery });
    };

    const localFilter = ({ inQuery, query, inFromState = false } = {}) => {
        const localQuery = inQuery ?? query ?? "";
        const localFromState = inFromState;
        filterTable({
            inTable: localTable,
            inQuery: localQuery,
            inFromState: localFromState
        });
    };

    return {
        load: localLoad,
        loadSpec: localLoadSpec,
        update: localUpdate,
        createRecord: localCreateRecord,
        updateRecord: localUpdateRecord,
        deleteRecord: localDeleteRecord,
        filterOriginalData: localFilterOriginalData,
        filterStateData: localFilterStateData,
        filter: localFilter
    };
};

export {
    actions,
    createActions,
    load,
    loadSpec,
    update,
    createRecord,
    updateRecord,
    deleteRecord,
    filterTable,
    filterOriginalTable,
    filterStateTable
};
export default actions;

