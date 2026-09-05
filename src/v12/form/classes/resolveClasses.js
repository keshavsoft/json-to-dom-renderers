import { layouts } from "../layout/index.js";
import { themes } from "../theme/index.js";

const resolveClasses = ({
    inLayout = "stacked",
    inTheme = "default",
    inConfigClasses = {},
    inCustomClasses = {}
} = {}) => {
    const localLayout = inLayout || "stacked";
    const localTheme = inTheme || "default";
    const localConfigClasses = inConfigClasses || {};
    const localCustomClasses = inCustomClasses || {};

    const layoutObj = layouts[localLayout] || layouts["stacked"] || {};
    const themeObj = themes[localTheme] || themes["default"] || {};

    const allKeys = new Set([
        ...Object.keys(layoutObj),
        ...Object.keys(themeObj),
        ...Object.keys(localConfigClasses),
        ...Object.keys(localCustomClasses)
    ]);

    const resolved = {};

    for (const key of allKeys) {
        const tokens = [
            layoutObj[key],
            themeObj[key],
            localConfigClasses[key],
            localCustomClasses[key]
        ]
            .filter(Boolean)
            .join(" ")
            .split(/\s+/)
            .filter(Boolean);

        resolved[key] = Array.from(new Set(tokens)).join(" ");
    }

    return resolved;
};

export { resolveClasses };
export default resolveClasses;
