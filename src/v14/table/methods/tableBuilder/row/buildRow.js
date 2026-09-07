const resolveAlignClass = ({ inAlign = "" } = {}) => {
    const localAlign = inAlign;

    if (localAlign === "right") return "text-end";
    if (localAlign === "center") return "text-center";
    return "";
};

const resolveTextContent = ({ inCell } = {}) => {
    const localCell = inCell;

    if (typeof localCell === "object" && localCell !== null) {
        return String(localCell.textContent ?? "");
    }
    return String(localCell ?? "");
};

const resolveCellAttributes = ({ inCell, inDefaultClass = "" } = {}) => {
    const localCell = inCell;
    const localDefaultClass = inDefaultClass;

    const isObject = typeof localCell === "object" && localCell !== null;
    const cellClass = isObject && localCell.class !== undefined ? localCell.class : localDefaultClass;
    const align = isObject ? localCell.align : "";
    const alignClass = resolveAlignClass({ inAlign: align });
    const finalClass = [cellClass, alignClass].filter(Boolean).join(" ").trim();

    const localAttributes = finalClass ? { class: finalClass } : {};
    const inAttributes = isObject && localCell.inAttributes ? localCell.inAttributes : {};

    const attributes = { ...inAttributes };

    for (const [key, value] of Object.entries(localAttributes)) {
        attributes[key] = attributes[key] ? `${attributes[key]} ${value}`.trim() : value;
    }

    return attributes;
};



const buildCell = ({ inCell, inCellTagName = "td", inDefaultClass = "" } = {}) => {

    const localCell = inCell;
    const localCellTagName = inCellTagName;
    const localDefaultClass = inDefaultClass;

    const textContent = resolveTextContent({ inCell: localCell });
    const attributes = resolveCellAttributes({ inCell: localCell, inDefaultClass: localDefaultClass });

    // console.log("-------:", localCell, attributes);

    return {
        tagName: localCellTagName,
        textContent,
        attributes
    };
};

const buildRow = ({
    inCellTagName = "td",
    inCells = [],
    inRowClass = "",
    inCellClass = "",
    inColumnsConfig: inColumnsConfig
} = {}) => {
    const localCellTagName = inCellTagName;
    const localCells = inCells;
    const localRowClass = inRowClass;
    const localCellClass = inCellClass;
    const localColumnsConfig = inColumnsConfig;

    const rowAttributes = localRowClass ? { class: localRowClass } : {};

    const children = localCells.map(cell => {
        const returnFromBuildCell = buildCell({
            inCell: cell,
            inCellTagName: localCellTagName,
            inDefaultClass: localCellClass,
            inColumnsConfig: localColumnsConfig
        });

        // console.log("cell", cell);
        return returnFromBuildCell;
    });

    return {
        tagName: "tr",
        attributes: rowAttributes,
        children
    };
};

export { buildRow, buildCell, resolveCellAttributes, resolveAlignClass };
export default buildRow;
