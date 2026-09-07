const avg = ({ inData = [], inKey } = {}) => {
    const localData = inData;
    const localKey = inKey;

    if (!Array.isArray(localData) || localData.length === 0 || !localKey) return 0;

    let validCount = 0;
    const total = localData.reduce((acc, row) => {
        const val = Number(row?.[localKey]);
        if (!isNaN(val)) {
            validCount++;
            return acc + val;
        }
        return acc;
    }, 0);

    return validCount > 0 ? total / validCount : 0;
};

export { avg };
export default avg;
