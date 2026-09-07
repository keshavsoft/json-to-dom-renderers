const load = async ({ inTable, inQuery = {} } = {}) => {
    const localTable = inTable;
    const localQuery = inQuery;

    if (!localTable?.dataProvider || typeof localTable.dataProvider.read !== "function") {
        console.warn("[json-to-dom-renderers:Table] Table.load called without a valid dataProvider.read implementation");
        return localTable?.store?.stateData;
    }

    try {
        const fetchedData = await localTable.dataProvider.read({ inQuery: localQuery });
        const records = Array.isArray(fetchedData) ? fetchedData : (fetchedData?.data || []);
        localTable.store.updateData({ inData: records });
        localTable.buildSpec();
        return records;
    } catch (error) {
        console.error("[json-to-dom-renderers:Table] Failed to load records via dataProvider.read:", error);
        return localTable?.store?.stateData;
    }
};

const loadSpec = async ({ inTable, inQuery = {} } = {}) => {

    const localTable = inTable;
    const localQuery = inQuery;

    if (!localTable?.dataProvider || typeof localTable.dataProvider.read !== "function") {
        console.warn("[json-to-dom-renderers:Table] Table.loadSpec called without a valid dataProvider.read implementation");
        return localTable?.spec || localTable?.buildSpec?.();
    }

    try {
        const fetchedData = await localTable.dataProvider.read({ inQuery: localQuery });
        const records = Array.isArray(fetchedData) ? fetchedData : (fetchedData?.data || []);
        localTable.store.updateData({ inData: records });
        const spec = localTable.buildSpec();
        return spec;
    } catch (error) {
        console.error("[json-to-dom-renderers:Table] Failed to load spec via dataProvider.read:", error);
        return localTable?.spec;
    }
};

const update = ({ inTable, inData = [] } = {}) => {
    const localTable = inTable;
    const localData = inData;

    localTable.store.updateData({ inData: localData });
    return localTable.render();
};


const createRecord = async ({ inTable, inItem = {} } = {}) => {
    const localTable = inTable;
    const localItem = inItem;

    if (!localTable?.dataProvider || typeof localTable.dataProvider.create !== "function") {
        throw new Error("Table.createRecord requires a valid dataProvider.create implementation");
    }
    const result = await localTable.dataProvider.create({ inItem: localItem });
    await load({ inTable: localTable });
    return result;
};

const updateRecord = async ({ inTable, inId = null, inItem = {} } = {}) => {
    const localTable = inTable;
    const localId = inId;
    const localItem = inItem;

    if (!localTable?.dataProvider || typeof localTable.dataProvider.update !== "function") {
        throw new Error("Table.updateRecord requires a valid dataProvider.update implementation");
    }
    const result = await localTable.dataProvider.update({ inId: localId, inItem: localItem });
    await load({ inTable: localTable });
    return result;
};

const deleteRecord = async ({ inTable, inId = null } = {}) => {
    const localTable = inTable;
    const localId = inId;

    if (!localTable?.dataProvider || typeof localTable.dataProvider.delete !== "function") {
        throw new Error("Table.deleteRecord requires a valid dataProvider.delete implementation");
    }
    const result = await localTable.dataProvider.delete({ inId: localId });
    await load({ inTable: localTable });
    return result;
};

export { load, loadSpec, update, createRecord, updateRecord, deleteRecord };
