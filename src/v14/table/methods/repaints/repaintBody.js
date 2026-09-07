import { buildBody } from "../tableBuilder/parts/index.js";

const repaintBody = ({ inTableElement, inColumns = [], inData = [], inRowConfig = {}, inColumnsConfig = [], inClasses = {} } = {}) => {
    const localTableElement = inTableElement;
    const localColumns = inColumns;
    const localData = inData;
    const localRowConfig = inRowConfig;
    const localColumnsConfig = inColumnsConfig;
    const localClasses = inClasses;

    if (!localTableElement) return;

    const newBodySpec = buildBody({
        inColumns: localColumns,
        inData: localData,
        inRowConfig: localRowConfig,
        inColumnsConfig: localColumnsConfig,
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

export { repaintBody };
export default repaintBody;
