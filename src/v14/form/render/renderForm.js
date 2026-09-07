import { buildForm } from "../formBuilder/index.js";
import { pruneTreeWithIds } from "../../common/pruneTreeWithIds.js";

const renderForm = ({ inForm } = {}) => {
    const localForm = inForm;
    if (!localForm) {
        console.error("[json-to-dom-renderers:Form] Form instance (inForm) is required to render.");
        return {
            treeWithIds: null,
            spec: null,
            element: null,
            error: "Form instance (inForm) is required"
        };
    }

    const containerId = localForm.containerId;
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`[json-to-dom-renderers:Form] Target container "#${containerId}" was not found in the DOM.`);
        return {
            treeWithIds: null,
            spec: null,
            element: null,
            error: `Target container "#${containerId}" not found in DOM.`
        };
    }

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
