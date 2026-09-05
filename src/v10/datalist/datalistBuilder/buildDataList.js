import { buildOptions } from "./parts/buildOptions.js";

export const buildDataList = ({ inData = [], inColumns = [], inTopN = 100 } = {}) => {
    const localData = inData;
    const localColumns = inColumns;
    const localTopN = inTopN;

    if (!Array.isArray(localColumns) || localColumns.length === 0) {
        return {
            tagName: "div",
            attributes: { id: "ks-datalists-wrapper" },
            children: []
        };
    }

    const datalistSpecs = localColumns.map(col => {
        const key = col.key || "";
        const datalistId = col.datalistId || `${key}-datalist`;

        const options = buildOptions({
            inData: localData,
            inKey: key,
            inTopN: localTopN
        });

        return {
            tagName: "datalist",
            attributes: {
                id: datalistId
            },
            children: options
        };
    });

    return {
        tagName: "div",
        attributes: {
            id: "ks-datalists-wrapper"
        },
        children: datalistSpecs
    };
};

export default buildDataList;
