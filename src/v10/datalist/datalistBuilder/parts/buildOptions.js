export const buildOptions = ({ inData = [], inKey = "", inTopN = 100 } = {}) => {
    const localData = inData;
    const localKey = inKey;
    const localTopN = inTopN;

    if (!Array.isArray(localData) || !localKey) return [];

    const countsMap = new Map();

    for (const row of localData) {
        if (!row || typeof row !== "object") continue;
        const val = row[localKey];
        if (val !== undefined && val !== null) {
            const strVal = String(val).trim();
            if (strVal !== "") {
                countsMap.set(strVal, (countsMap.get(strVal) || 0) + 1);
            }
        }
    }

    const sorted = Array.from(countsMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);

    const limited = (localTopN > 0 && Number.isFinite(localTopN))
        ? sorted.slice(0, localTopN)
        : sorted;

    return limited.map(({ value, count }) => ({
        tagName: "option",
        attributes: {
            value: value,
            label: `${value} (${count})`
        },
        textContent: `${value} (${count})`
    }));
};

export default buildOptions;
