import { buildHead } from "./parts/buildHead.js";
import { buildBody } from "./parts/buildBody.js";
import { buildFoot } from "./parts/buildFoot.js";
import structure from "./structure.json" with { type: "json" };

const buildTable = ({ inColumns = [], inData = [], inComputedFooter = [],
    inRowConfig = {}, inClasses = {}, inColumnsConfig } = {}) => {
    const localColumns = inColumns;
    const localData = inData;
    const localComputedFooter = inComputedFooter;
    const localRowConfig = inRowConfig;
    const localClasses = inClasses;
    const localColumnsConfig = inColumnsConfig;

    const thead = buildHead({ inColumns: localColumns, inClasses: localClasses });

    const tbody = buildBody({
        inColumns: localColumns, inData: localData,
        inRowConfig: localRowConfig, inClasses: localClasses,
        inColumnsConfig: localColumnsConfig
    });

    const tfoot = buildFoot({ inColumns: localColumns, inComputedFooter: localComputedFooter, inClasses: localClasses });

    // 1. Pull the base structure shell from structure.json
    const tableSpec = structuredClone(structure);

    // 2. Populate attributes only if classes exist
    if (localClasses?.table) {
        tableSpec.attributes.class = localClasses.table;
    }

    // 3. Populate children
    tableSpec.children = [thead, tbody, tfoot].filter(Boolean);

    return tableSpec;
};

export { buildTable, structure };
export default buildTable;
