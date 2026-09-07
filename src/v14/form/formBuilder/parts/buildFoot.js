const buildFoot = ({ inFootConfig = {}, inClasses = {} } = {}) => {
    const localFootConfig = inFootConfig;
    const localClasses = inClasses;

    const buttons = localFootConfig?.buttons;
    if (!Array.isArray(buttons) || buttons.length === 0) return null;

    const buttonNodes = buttons.map(btn => {
        const isPrimary = btn.variant === "primary";
        const defaultBtnClass = isPrimary
            ? "btn btn-primary"
            : (localClasses?.button || "btn btn-outline-secondary");
        const btnClass = btn.class || defaultBtnClass;

        const attributes = {
            type: btn.type || "button",
            name: btn.name || "",
            class: btnClass
        };

        if (btn.id) {
            attributes.id = btn.id;
        }

        return {
            tagName: "button",
            textContent: btn.label || btn.name,
            attributes
        };
    });

    const footClass = localClasses?.foot || localFootConfig?.class || "d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top";

    return {
        tagName: "div",
        attributes: {
            class: footClass
        },
        children: buttonNodes
    };
};

export { buildFoot };
export default buildFoot;
