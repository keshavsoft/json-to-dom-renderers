export const pruneTreeWithIds = ({ inSpec } = {}) => {
    const localSpec = inSpec;

    if (!localSpec || typeof localSpec !== "object") return null;

    if (Array.isArray(localSpec)) {
        const prunedArray = localSpec
            .map(item => pruneTreeWithIds({ inSpec: item }))
            .filter(Boolean);
        return prunedArray.length > 0 ? prunedArray : null;
    }

    const localChildren = Array.isArray(localSpec.children) ? localSpec.children : [];
    const prunedChildren = localChildren
        .map(child => pruneTreeWithIds({ inSpec: child }))
        .filter(Boolean);

    const nodeId = localSpec.attributes?.id || localSpec.id;
    const hasId = Boolean(nodeId);
    const hasChildrenWithId = prunedChildren.length > 0;

    if (!hasId && !hasChildrenWithId) {
        return null;
    }

    const result = {
        tagName: localSpec.tagName
    };

    if (nodeId) {
        result.id = nodeId;
    }

    if (localSpec.attributes?.name) {
        result.name = localSpec.attributes.name;
    }

    if (localSpec.attributes?.type) {
        result.type = localSpec.attributes.type;
    }

    if (localSpec.attributes) {
        result.attributes = localSpec.attributes;
    }

    if (prunedChildren.length > 0) {
        result.children = prunedChildren;
    }

    return result;
};

export default pruneTreeWithIds;
