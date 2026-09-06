const buildHead = ({ inHeadConfig = {}, inClasses = {} } = {}) => {
    const localHeadConfig = inHeadConfig;
    const localClasses = inClasses;

    const title = localHeadConfig?.title || "";
    const subtitle = localHeadConfig?.subtitle || "";

    if (!title && !subtitle) return null;

    const children = [];

    if (title) {
        children.push({
            tagName: "div",
            textContent: title,
            attributes: {
                class: localClasses?.headTitle || "h5 fw-bold mb-1"
            }
        });
    }

    if (subtitle) {
        children.push({
            tagName: "div",
            textContent: subtitle,
            attributes: {
                class: localClasses?.headSubtitle || "text-muted small"
            }
        });
    }

    const headClass = localClasses?.head || localHeadConfig?.class || "pb-2 mb-3 border-bottom";

    return {
        tagName: "div",
        attributes: {
            class: headClass
        },
        children
    };
};

export { buildHead };
export default buildHead;
