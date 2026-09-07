import { buildField } from "../field/index.js";

const buildBody = ({ inColumns = [], inConfig = {}, inClasses = {} } = {}) => {
    const localColumns = inColumns;
    const localConfig = inConfig;
    const localClasses = inClasses;

    if (!Array.isArray(localColumns)) return { tagName: "div", children: [] };

    const fieldRows = localColumns.map(col => buildField({ inColumn: col, inClasses: localClasses, inConfig: localConfig }));

    const bodyAttr = localClasses?.body ? { class: localClasses.body } : {};

    return {
        tagName: "div",
        attributes: bodyAttr,
        children: fieldRows
    };
};

export { buildBody };
export default buildBody;
