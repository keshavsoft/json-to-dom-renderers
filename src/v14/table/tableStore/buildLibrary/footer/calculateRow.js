import typesConfig from "./types.json" with { type: "json" };
import { sum, count, avg, min, max } from "./aggregates/index.js";

const aggregateFunctions = {
    sum,
    count,
    avg,
    min,
    max
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

const calculateRow = ({ inRowConfig = {}, inData = [], inScope = {} } = {}) => {
    const localRowConfig = inRowConfig;
    const localData = inData;
    const localScope = inScope;

    // Pull default keys and fallbacks directly from types.json
    const defaultRow = typesConfig.rowKeys || {};
    const rowId = localRowConfig.id ?? defaultRow.id;
    const rowTitle = localRowConfig.title ?? defaultRow.title;
    const rowType = localRowConfig.type ?? defaultRow.type;
    const valuesConfig = localRowConfig.values ?? defaultRow.values;
    const computedValues = {};

    if (rowType === "aggregate") {
        const supported = typesConfig.types?.aggregate?.supportedFunctions || [];

        Object.entries(valuesConfig).forEach(([colKey, aggType]) => {
            if (!supported.includes(aggType)) {
                console.warn(
                    `[json-to-dom-renderers] Warning: Unknown aggregate function "${aggType}" for column "${colKey}". Supported: [${supported.join(", ")}]`
                );
                return;
            }

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

export { calculateRow };
export default calculateRow;
