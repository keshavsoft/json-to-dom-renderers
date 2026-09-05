import { buildBody } from "../tableBuilder/parts/buildBody.js";

export const repaintBody = ({ inTableElement, inColumns = [], inData = [], inRowConfig = {}, inClasses = {} } = {}) => {
    const localTableElement = inTableElement;
    const localColumns = inColumns;
    const localData = inData;
    const localRowConfig = inRowConfig;
    const localClasses = inClasses;

    if (!localTableElement) return;

    const newBodySpec = buildBody({
        inColumns: localColumns,
        inData: localData,
        inRowConfig: localRowConfig,
        inClasses: localClasses
    });

    const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
    if (typeof builder !== "function") return;

    const newTbody = builder({ inSpec: newBodySpec });
    const currentTbody = localTableElement.querySelector("tbody");

    if (currentTbody && newTbody) {
        currentTbody.replaceWith(newTbody);
    }
};

export default repaintBody;
