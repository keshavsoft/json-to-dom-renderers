import { calculateRow } from "./calculateRow.js";

const calculateFooter = ({ inData = [], inFooterConfig = [] } = {}) => {
    const localData = inData;
    const localFooterConfig = inFooterConfig;

    if (!Array.isArray(localFooterConfig)) return [];

    const localScope = {};
    const localComputedRows = [];

    localFooterConfig.forEach(rowConfig => {
        const computedRow = calculateRow({
            inRowConfig: rowConfig,
            inData: localData,
            inScope: localScope
        });

        if (rowConfig.id) {
            localScope[rowConfig.id] = computedRow.values;
        }

        localComputedRows.push(computedRow);
    });

    return localComputedRows;
};

export { calculateFooter };
export default calculateFooter;
