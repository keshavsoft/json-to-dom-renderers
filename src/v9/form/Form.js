import { buildForm } from "./formBuilder/buildForm.js";
import { pruneTreeWithIds } from "../common/pruneTreeWithIds.js";
import { FormStore } from "./formStore/index.js";
import defaultClasses from "./classes.json" with { type: "json" };

export class Form {
    constructor({ columns = [], config = {}, classes = defaultClasses, targetContainerId = "form-container", inColumns, inConfig, inClasses, inTargetContainerId } = {}) {
        const localColumns = columns || inColumns || [];
        const localConfig = config || inConfig || {};
        const localClasses = classes || inClasses || defaultClasses;
        const localTargetContainerId = targetContainerId || inTargetContainerId || "form-container";

        this.containerId = localTargetContainerId;
        this.classes = { ...defaultClasses, ...(localConfig?.classes || {}), ...localClasses };
        this.formElement = null;
        this.controlsTree = null;

        this.store = new FormStore({
            inColumns: localColumns,
            inConfig: localConfig
        });
    }

    get columns() {
        return this.store.activeColumns;
    }

    get config() {
        return this.store.config;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return null;

        const formSpec = buildForm({
            inColumns: this.store.activeColumns,
            inConfig: this.store.config,
            inClasses: this.classes
        });

        // Extract pruned tree with controls having IDs only
        this.controlsTree = pruneTreeWithIds({ inSpec: formSpec });

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
        if (typeof builder !== "function") {
            console.error("json-to-dom buildSpecElement not found on window.ks");
            return this.controlsTree;
        }

        const domElement = builder({ inSpec: formSpec });
        this.formElement = Array.isArray(domElement) ? domElement[0] : domElement;

        container.innerHTML = "";
        container.appendChild(this.formElement);

        return {
            treeWithIds: this.controlsTree,
            spec: formSpec,
            element: this.formElement
        };
    }

    getControlsTree() {
        return this.controlsTree;
    }
}

export default Form;
