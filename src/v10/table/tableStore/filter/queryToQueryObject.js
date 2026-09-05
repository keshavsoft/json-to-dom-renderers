export const queryToQueryObject = ({ inQuery = "", inActiveColumns = [] } = {}) => {
    const localQuery = inQuery;
    const localActiveColumns = inActiveColumns;

    // Collect active column keys
    const activeKeys = new Set(
        (Array.isArray(localActiveColumns) ? localActiveColumns : [])
            .map(col => (typeof col === "object" && col !== null ? col.key : col))
            .filter(Boolean)
    );

    // If query is an object representing column-specific criteria or explicit structured query
    if (typeof localQuery === "object" && localQuery !== null) {
        if (localQuery.type === "string") {
            return {
                type: "string",
                value: String(localQuery.value ?? "").trim().toLowerCase()
            };
        }

        const rawObject = (localQuery.type === "object" && typeof localQuery.value === "object" && localQuery.value !== null)
            ? localQuery.value
            : localQuery;

        const sanitized = {};
        for (const [key, val] of Object.entries(rawObject)) {
            if (activeKeys.has(key) && val !== undefined && val !== null) {
                const strVal = String(val).trim().toLowerCase();
                if (strVal !== "") {
                    sanitized[key] = strVal;
                }
            }
        }

        return {
            type: "object",
            value: sanitized
        };
    }

    // Default: treat as string query across active columns
    return {
        type: "string",
        value: String(localQuery ?? "").trim().toLowerCase()
    };
};

export default queryToQueryObject;
