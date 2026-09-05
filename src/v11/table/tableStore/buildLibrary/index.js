import { cloneData } from "../../../common/cloneData.js";
import { insertSerial } from "./serial/insertSerial.js";
import { calculateFooter } from "./footer/calculateFooter.js";

export const buildLibrary = ({ inSource = {}, inResolveColumns } = {}) => {
    const localSource = inSource;
    const localResolveColumns = inResolveColumns;

    const activeColumns = typeof localResolveColumns === "function"
        ? localResolveColumns({
            inColumnsCatalog: localSource?.columns,
            inColumnKeys: localSource?.config?.head?.columns
        })
        : (localSource?.columns || []);

    const stateData = cloneData({
        inData: localSource?.originalData
    });

    const serialResult = insertSerial({
        inColumns: activeColumns,
        inData: stateData,
        inConfig: localSource?.config
    });

    const computedFooter = calculateFooter({
        inData: serialResult.data,
        inFooterConfig: localSource?.config?.foot
    });

    return {
        activeColumns: serialResult.columns,
        stateData: serialResult.data,
        computedFooter,
        isSerialEnabled: serialResult.isSerialEnabled
    };
};

export default buildLibrary;
