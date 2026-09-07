const min = ({ inData = [], inKey } = {}) => {
    const localData = inData;
    const localKey = inKey;

    if (!Array.isArray(localData) || localData.length === 0 || !localKey) return 0;

    let found = false;
    let minVal = Infinity;

    localData.forEach(row => {
        const val = Number(row?.[localKey]);
        if (!isNaN(val)) {
            found = true;
            if (val < minVal) minVal = val;
        }
    });

    return found ? minVal : 0;
};

export { min };
export default min;
