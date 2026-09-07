import { resolveClasses } from "../classes/index.js";

const setLayout = ({ inForm, inLayout = "stacked" } = {}) => {
    const localForm = inForm;
    const localLayout = inLayout || "stacked";

    if (!localForm) return;

    localForm.layout = localLayout;
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

export { setLayout };
export default setLayout;
