import { buildForm } from "../formBuilder/index.js";
import { pruneTreeWithIds } from "../../common/pruneTreeWithIds.js";

const renderForm = ({ inForm } = {}) => {
    const localForm = inForm;
    if (!localForm) return null;

    const container = document.getElementById(localForm.containerId);
    if (!container) return null;

    const formSpec = buildForm({
        inColumns: localForm.store.activeColumns,
        inConfig: localForm.store.config,
        inClasses: localForm.classes
    });

    const controlsTree = pruneTreeWithIds({ inSpec: formSpec });

    const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
    if (typeof builder !== "function") {
        console.error("json-to-dom buildSpecElement not found on window.ks");
        return {
            treeWithIds: controlsTree,
            spec: formSpec,
            element: null
        };
    }

    const domElement = builder({ inSpec: formSpec });
    const formElement = Array.isArray(domElement) ? domElement[0] : domElement;

    container.innerHTML = "";
    container.appendChild(formElement);

    return {
        treeWithIds: controlsTree,
        spec: formSpec,
        element: formElement
    };
};

export { renderForm };
export default renderForm;
