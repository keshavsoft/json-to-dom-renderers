export const filterData = ({ inData = [], inQueryObject = {}, inActiveColumns = [] } = {}) => {
    const localData = inData;
    const localQueryObject = inQueryObject;
    const localActiveColumns = inActiveColumns;

    if (!Array.isArray(localData)) return [];

    // Handle query object format
    const queryType = localQueryObject?.type;
    const queryValue = localQueryObject?.value;

    const activeKeys = (Array.isArray(localActiveColumns) && localActiveColumns.length > 0)
        ? localActiveColumns.map(col => (typeof col === "object" && col !== null ? col.key : col)).filter(Boolean)
        : null;

    // Case 1: Object query (column-specific criteria)
    if (queryType === "object") {
        const criteria = typeof queryValue === "object" && queryValue !== null ? queryValue : {};
        const entries = Object.entries(criteria);

        if (entries.length === 0) return [...localData];

        return localData.filter(row => {
            if (!row || typeof row !== "object") return false;
            return entries.every(([key, expectedVal]) => {
                const rowVal = row[key];
                if (rowVal === null || rowVal === undefined) return false;
                return String(rowVal).toLowerCase().includes(expectedVal);
            });
        });
    }

    // Case 2: String query (global search across active columns)
    const normalizedQuery = typeof queryValue === "string"
        ? queryValue
        : String(localQueryObject ?? "").trim().toLowerCase();

    if (!normalizedQuery) return [...localData];

    return localData.filter(row => {
        if (!row || typeof row !== "object") return false;
        const valuesToCheck = activeKeys ? activeKeys.map(k => row[k]) : Object.values(row);
        return valuesToCheck.some(val => {
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(normalizedQuery);
        });
    });
};

export default filterData;
