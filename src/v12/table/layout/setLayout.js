import { resolveClasses } from "../classes/index.js";

const setLayout = ({ inTable, inLayout = "compact" } = {}) => {
    const localTable = inTable;
    const localLayout = inLayout || "compact";

    if (!localTable) return;

    localTable.layout = localLayout;
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

export { setLayout };
export default setLayout;
