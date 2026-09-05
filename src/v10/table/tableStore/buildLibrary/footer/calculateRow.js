import { sum } from "./aggregates/sum.js";
import { count } from "./aggregates/count.js";

const aggregateFunctions = {
    sum,
    count
};

const evaluateExpression = ({ inExpression = "", inScope = {} } = {}) => {
    const localExpression = inExpression;
    const localScope = inScope;

    try {
        const scopeKeys = Object.keys(localScope);
        const scopeValues = Object.values(localScope);
        const fn = new Function(...scopeKeys, `return ${localExpression};`);
        return fn(...scopeValues);
    } catch (err) {
        console.error(`Error evaluating expression "${localExpression}":`, err);
        return 0;
    }
};

export const calculateRow = ({ inRowConfig = {}, inData = [], inScope = {} } = {}) => {
    const localRowConfig = inRowConfig;
    const localData = inData;
    const localScope = inScope;

    const rowId = localRowConfig.id || "";
    const rowTitle = localRowConfig.title || "";
    const rowType = localRowConfig.type || "aggregate";
    const valuesConfig = localRowConfig.values || {};
    const computedValues = {};

    if (rowType === "aggregate") {
        Object.entries(valuesConfig).forEach(([colKey, aggType]) => {
            const aggFn = aggregateFunctions[aggType];
            if (typeof aggFn === "function") {
                computedValues[colKey] = aggFn({ inData: localData, inKey: colKey });
            }
        });
    } else if (rowType === "eval") {
        Object.entries(valuesConfig).forEach(([colKey, expression]) => {
            if (typeof expression === "string") {
                computedValues[colKey] = evaluateExpression({
                    inExpression: expression,
                    inScope: localScope
                });
            }
        });
    }

    return {
        id: rowId,
        title: rowTitle,
        values: computedValues
    };
};

export default calculateRow;
