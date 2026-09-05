export const resequenceSerial = ({ inData = [], inIsEnabled = false } = {}) => {
    const localData = inData;
    const localIsEnabled = inIsEnabled;

    if (!localIsEnabled || !Array.isArray(localData)) {
        return localData;
    }

    return localData.map((row, index) => ({
        ...row,
        serial: index + 1
    }));
};

export default resequenceSerial;
