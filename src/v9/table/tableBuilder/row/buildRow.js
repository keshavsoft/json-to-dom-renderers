export const buildRow = ({
    inCellTagName = "td",
    inCells = [],
    inRowClass = "",
    inCellClass = ""
} = {}) => {
    const localCellTagName = inCellTagName;
    const localCells = inCells;
    const localRowClass = inRowClass;
    const localCellClass = inCellClass;

    return {
        tagName: "tr",
        attributes: localRowClass ? { class: localRowClass } : {},
        children: localCells.map(cell => {
            const textContent = typeof cell === "object" ? String(cell.textContent ?? "") : String(cell ?? "");
            const cellClass = typeof cell === "object" && cell.class !== undefined ? cell.class : localCellClass;
            const align = typeof cell === "object" ? cell.align : "";
            const alignClass = align === "right" ? "text-end" : (align === "center" ? "text-center" : "");

            const finalClass = [cellClass, alignClass].filter(Boolean).join(" ").trim();
            const attributes = finalClass ? { class: finalClass } : {};
            if (typeof cell === "object" && cell.id) {
                attributes.id = cell.id;
            }

            return {
                tagName: localCellTagName,
                textContent,
                attributes
            };
        })
    };
};

export default buildRow;
