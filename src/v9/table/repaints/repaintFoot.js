import { buildFoot } from "../tableBuilder/parts/buildFoot.js";

export const repaintFoot = ({ inTableElement, inColumns = [], inComputedFooter = [], inClasses = {} } = {}) => {
    const localTableElement = inTableElement;
    const localColumns = inColumns;
    const localComputedFooter = inComputedFooter;
    const localClasses = inClasses;

    if (!localTableElement) return;

    const newFootSpec = buildFoot({
        inColumns: localColumns,
        inComputedFooter: localComputedFooter,
        inClasses: localClasses
    });

    const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
    if (typeof builder !== "function") return;

    const newTfoot = newFootSpec ? builder({ inSpec: newFootSpec }) : null;
    const currentTfoot = localTableElement.querySelector("tfoot");

    if (currentTfoot && newTfoot) {
        currentTfoot.replaceWith(newTfoot);
    } else if (currentTfoot && !newTfoot) {
        currentTfoot.remove();
    } else if (!currentTfoot && newTfoot) {
        localTableElement.appendChild(newTfoot);
    }
};

export default repaintFoot;
