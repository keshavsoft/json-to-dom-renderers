import { buildRow } from "../row/buildRow.js";

export const buildHead = ({ inColumns = [], inClasses = {} } = {}) => {
    const localColumns = inColumns;
    const localClasses = inClasses;

    const headerCells = localColumns.map(col => ({
        textContent: col.label,
        align: col.align,
        id: col.id
    }));

    const headerRow = buildRow({
        inCellTagName: "th",
        inCells: headerCells,
        inCellClass: localClasses?.th || "",
        inRowClass: localClasses?.tr || ""
    });

    const theadAttributes = localClasses?.thead ? { class: localClasses.thead } : {};

    return {
        tagName: "thead",
        attributes: theadAttributes,
        children: [headerRow]
    };
};

export default buildHead;
