export const cloneData = ({ inData = [] } = {}) => {
    const localData = inData;

    if (!Array.isArray(localData)) {
        return [];
    }

    return typeof structuredClone === "function"
        ? structuredClone(localData)
        : JSON.parse(JSON.stringify(localData));
};

export default cloneData;
