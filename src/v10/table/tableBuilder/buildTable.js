import { buildHead } from "./parts/buildHead.js";
import { buildBody } from "./parts/buildBody.js";
import { buildFoot } from "./parts/buildFoot.js";

export const buildTable = ({ inColumns = [], inData = [], inComputedFooter = [], inRowConfig = {}, inClasses = {} } = {}) => {
    const localColumns = inColumns;
    const localData = inData;
    const localComputedFooter = inComputedFooter;
    const localRowConfig = inRowConfig;
    const localClasses = inClasses;

    const thead = buildHead({ inColumns: localColumns, inClasses: localClasses });
    const tbody = buildBody({ inColumns: localColumns, inData: localData, inRowConfig: localRowConfig, inClasses: localClasses });
    const tfoot = buildFoot({ inColumns: localColumns, inComputedFooter: localComputedFooter, inClasses: localClasses });

    const tableAttributes = localClasses?.table ? { class: localClasses.table } : {};

    return {
        tagName: "table",
        attributes: tableAttributes,
        children: [thead, tbody, tfoot].filter(Boolean)
    };
};

export default buildTable;
