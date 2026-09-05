export const buildHead = ({ inHeadConfig = {} } = {}) => {
    const localHeadConfig = inHeadConfig;

    const title = localHeadConfig?.title || "";
    const subtitle = localHeadConfig?.subtitle || "";

    if (!title && !subtitle) return null;

    const children = [];

    if (title) {
        children.push({
            tagName: "label",
            textContent: title,
            attributes: {
                class: "block text-lg font-bold text-slate-900"
            }
        });
    }

    if (subtitle) {
        children.push({
            tagName: "label",
            textContent: subtitle,
            attributes: {
                class: "block text-xs text-slate-500 mt-0.5"
            }
        });
    }

    return {
        tagName: "div",
        attributes: {
            class: "border-b border-slate-200 pb-4 mb-2"
        },
        children
    };
};

export default buildHead;
