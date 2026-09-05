export const sum = ({ inData = [], inKey } = {}) => {
    const localData = inData;
    const localKey = inKey;

    if (!Array.isArray(localData) || !localKey) return 0;

    return localData.reduce((acc, row) => {
        const val = Number(row?.[localKey]);
        return acc + (isNaN(val) ? 0 : val);
    }, 0);
};

export default sum;
