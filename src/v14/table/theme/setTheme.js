import { resolveClasses } from "../classes/index.js";

const setTheme = ({ inTable, inTheme = "default" } = {}) => {
    const localTable = inTable;
    const localTheme = inTheme || "default";

    if (!localTable) return;

    localTable.theme = localTheme;
    localTable.classes = resolveClasses({
        inLayout: localTable.layout,
        inTheme: localTable.theme,
        inConfigClasses: localTable.store?.config?.classes,
        inCustomClasses: localTable.customClasses
    });

    if (localTable.tableElement) {
        return localTable.render();
    }
};

export { setTheme };
export default setTheme;
