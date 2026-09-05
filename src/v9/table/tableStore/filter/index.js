import { queryToQueryObject } from "./queryToQueryObject.js";
import { filterData } from "./filterData.js";
import { resequenceSerial } from "./resequenceSerial.js";
import { calculateFooter } from "../buildLibrary/footer/calculateFooter.js";

export const runFilter = ({ inStore, inData = [], inQuery = "" } = {}) => {
    const localStore = inStore;
    const localData = inData;
    const localQuery = inQuery;

    const activeColumns = localStore.library.activeColumns;
    const isSerialEnabled = localStore.library.isSerialEnabled;
    const footConfig = localStore.source.config?.foot;

    const queryObject = queryToQueryObject({
        inQuery: localQuery,
        inActiveColumns: activeColumns
    });

    const filtered = filterData({
        inData: localData,
        inQueryObject: queryObject,
        inActiveColumns: activeColumns
    });

    const resequenced = resequenceSerial({
        inData: filtered,
        inIsEnabled: isSerialEnabled
    });

    const computedFooter = calculateFooter({
        inData: resequenced,
        inFooterConfig: footConfig
    });

    localStore.library.stateData = resequenced;
    localStore.library.computedFooter = computedFooter;

    return {
        activeColumns: localStore.library.activeColumns,
        stateData: localStore.library.stateData,
        computedFooter: localStore.library.computedFooter
    };
};

export default runFilter;
