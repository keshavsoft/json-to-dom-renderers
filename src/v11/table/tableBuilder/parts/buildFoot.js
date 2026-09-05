import { buildRow } from "../row/buildRow.js";

export const buildFoot = ({ inColumns = [], inComputedFooter = [], inClasses = {} } = {}) => {
    const localColumns = inColumns;
    const localComputedFooter = inComputedFooter;
    const localClasses = inClasses;

    if (!Array.isArray(localComputedFooter) || localComputedFooter.length === 0) {
        return null;
    }

    const footRows = localComputedFooter.map((computedRow, rowIndex) => {
        const rowTitle = computedRow.title || "";
        const rowValues = computedRow.values || {};
        const isLastRow = rowIndex === localComputedFooter.length - 1;

        const titleColIndex = localColumns.findIndex(c => !c.isSerial);

        const cells = localColumns.map((col, colIndex) => {
            if (rowValues[col.key] !== undefined) {
                const val = rowValues[col.key];
                const textContent = typeof val === "number" ? val.toFixed(2) : String(val);

                return {
                    textContent,
                    align: col.align || "right",
                    class: isLastRow ? "fw-bold" : "fw-semibold"
                };
            }

            if (colIndex === titleColIndex) {
                return {
                    textContent: rowTitle,
                    class: isLastRow ? "fw-bold text-uppercase" : "fw-semibold text-uppercase"
                };
            }

            return {
                textContent: "",
                class: ""
            };
        });

        return buildRow({
            inCellTagName: "td",
            inCells: cells,
            inRowClass: isLastRow ? "table-light" : (localClasses?.tr || ""),
            inCellClass: localClasses?.td || ""
        });
    });

    const tfootAttributes = localClasses?.tfoot ? { class: localClasses.tfoot } : {};

    return {
        tagName: "tfoot",
        attributes: tfootAttributes,
        children: footRows
    };
};

export default buildFoot;
