export const buildFoot = ({ inFootConfig = {} } = {}) => {
    const localFootConfig = inFootConfig;

    const buttons = localFootConfig?.buttons;
    if (!Array.isArray(buttons) || buttons.length === 0) return null;

    const buttonNodes = buttons.map(btn => {
        const isPrimary = btn.variant === "primary";
        const btnClass = isPrimary
            ? "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
            : "px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-150 ease-in-out cursor-pointer";

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

    return {
        tagName: "div",
        attributes: {
            class: "flex items-center justify-end gap-3 pt-4 mt-2 border-t border-slate-200"
        },
        children: buttonNodes
    };
};

export default buildFoot;
