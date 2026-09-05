import { buildHead } from "./parts/buildHead.js";
import { buildBody } from "./parts/buildBody.js";
import { buildFoot } from "./parts/buildFoot.js";

export const buildForm = ({ inColumns = [], inConfig = {}, inClasses = {} } = {}) => {
    const localColumns = inColumns;
    const localConfig = inConfig;
    const localClasses = inClasses;

    const head = buildHead({ inHeadConfig: localConfig?.head, inClasses: localClasses });
    const body = buildBody({ inColumns: localColumns, inClasses: localClasses });
    const foot = buildFoot({ inFootConfig: localConfig?.foot, inClasses: localClasses });

    const formAttr = localClasses?.form ? { class: localClasses.form } : {};

    return {
        tagName: "div",
        attributes: formAttr,
        children: [head, body, foot].filter(Boolean)
    };
};

export default buildForm;
