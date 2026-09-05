import { buildHead, buildBody, buildFoot } from "./parts/index.js";

const buildForm = ({ inColumns = [], inConfig = {}, inClasses = {} } = {}) => {
    const localColumns = inColumns;
    const localConfig = inConfig;
    const localClasses = inClasses;

    const head = buildHead({ inHeadConfig: localConfig?.head, inClasses: localClasses });
    const body = buildBody({ inColumns: localColumns, inConfig: localConfig, inClasses: localClasses });
    const foot = buildFoot({ inFootConfig: localConfig?.foot, inClasses: localClasses });

    const formAttr = localClasses?.form ? { class: localClasses.form } : {};

    return {
        tagName: "div",
        attributes: formAttr,
        children: [head, body, foot].filter(Boolean)
    };
};

export { buildForm };
export default buildForm;
