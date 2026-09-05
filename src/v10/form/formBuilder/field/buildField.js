export const buildField = ({ inColumn = {}, inClasses = {} } = {}) => {
    const localColumn = inColumn;
    const localClasses = inClasses;

    const key = localColumn.key || "";
    const labelText = localColumn.label || key;
    const inputType = localColumn.type === "number" ? "number" : "text";

    const labelNode = {
        tagName: "label",
        textContent: labelText,
        attributes: localClasses?.label ? { class: localClasses.label } : {}
    };

    const hasDatalist = localColumn.datalist === true || (localColumn.datalist !== false && inputType !== "number");
    const datalistId = localColumn.datalistId || `${key}-datalist`;

    const inputAttributes = {
        type: inputType,
        name: key,
        placeholder: `Enter ${labelText}...`
    };

    if (localClasses?.input) {
        inputAttributes.class = localClasses.input;
    }

    if (hasDatalist) {
        inputAttributes.list = datalistId;
    }

    const inputNode = {
        tagName: "input",
        attributes: inputAttributes
    };

    if (localColumn.id) {
        inputNode.attributes.id = localColumn.id;
        labelNode.attributes.for = localColumn.id;
    }

    const searchButtonNode = {
        tagName: "button",
        textContent: "Search",
        attributes: {
            type: "button",
            id: localColumn.searchId || `${key}-search`,
            name: `${key}-search`,
            "data-key": key,
            class: localClasses?.button || "btn btn-outline-secondary"
        }
    };

    const groupNode = {
        tagName: "div",
        attributes: localClasses?.group ? { class: localClasses.group } : {},
        children: [inputNode, searchButtonNode]
    };

    return {
        tagName: "div",
        attributes: localClasses?.field ? { class: localClasses.field } : {},
        children: [labelNode, groupNode]
    };
};

export default buildField;
