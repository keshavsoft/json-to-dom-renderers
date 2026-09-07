const buildField = ({ inColumn = {}, inClasses = {}, inConfig = {} } = {}) => {
    const localColumn = inColumn;
    const localClasses = inClasses;
    const localConfig = inConfig;

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

    const isSearchDisabled = localConfig?.searchButtons === false || localColumn.searchButton === false || localColumn.search === false;
    const isSearchExplicit = localColumn.searchButton === true || localColumn.search === true || localConfig?.searchButtons === true;
    const hasSearchButton = !isSearchDisabled && (isSearchExplicit || Boolean(localColumn.searchId));

    let controlNode;

    if (hasSearchButton) {
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

        controlNode = groupNode;
    } else {
        controlNode = inputNode;
    }

    if (localClasses?.controlWrapper) {
        controlNode = {
            tagName: "div",
            attributes: { class: localClasses.controlWrapper },
            children: [controlNode]
        };
    }

    return {
        tagName: "div",
        attributes: localClasses?.field ? { class: localClasses.field } : {},
        children: [labelNode, controlNode]
    };
};

export { buildField };
export default buildField;
