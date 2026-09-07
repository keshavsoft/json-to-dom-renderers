import { resolveClasses } from "../classes/index.js";

const setTheme = ({ inForm, inTheme = "default" } = {}) => {
    const localForm = inForm;
    const localTheme = inTheme || "default";

    if (!localForm) return;

    localForm.theme = localTheme;
    localForm.classes = resolveClasses({
        inLayout: localForm.layout,
        inTheme: localForm.theme,
        inConfigClasses: localForm.store?.config?.classes,
        inCustomClasses: localForm.customClasses
    });

    if (localForm.formElement) {
        return localForm.render();
    }
};

export { setTheme };
export default setTheme;
