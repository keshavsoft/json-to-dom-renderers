export const insertSerial = ({ inColumns = [], inData = [], inConfig = {}, inLabel } = {}) => {
    const localColumns = inColumns;
    const localData = inData;
    const localConfig = inConfig;
    const localLabel = inLabel;

    const isSerialEnabled = Boolean(
        localConfig?.serial ||
        localConfig?.table?.serial ||
        localConfig?.head?.serial
    );

    if (!isSerialEnabled) {
        return {
            columns: localColumns,
            data: localData,
            isSerialEnabled: false
        };
    }

    const resolvedLabel = localLabel || (
        typeof localConfig?.serial === "object"
            ? (localConfig.serial.label || "#")
            : "#"
    );

    const serialCol = {
        key: "serial",
        label: resolvedLabel,
        align: "center",
        isSerial: true
    };

    const hasSerialCol = (Array.isArray(localColumns) ? localColumns : []).some(col => col.key === "serial");
    const updatedColumns = hasSerialCol
        ? localColumns
        : [serialCol, ...(Array.isArray(localColumns) ? localColumns : [])];

    const updatedData = (Array.isArray(localData) ? localData : []).map((row, index) => ({
        serial: index + 1,
        ...(row || {})
    }));

    return {
        columns: updatedColumns,
        data: updatedData,
        isSerialEnabled: true
    };
};

export default insertSerial;
