class SourceStore {
    constructor({ inData = [], inColumns = [], inConfig = {}, inTopN } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;
        const localTopN = inTopN;

        this.source = this._buildSource({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig,
            inTopN: localTopN
        });
    }

    _buildSource({ inData = [], inColumns = [], inConfig = {}, inTopN } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;
        const localTopN = inTopN;

        return {
            originalData: Array.isArray(localData)
                ? (typeof structuredClone === "function" ? structuredClone(localData) : JSON.parse(JSON.stringify(localData)))
                : [],
            columns: Array.isArray(localColumns) ? localColumns : [],
            config: localConfig || {},
            topN: localTopN
        };
    }

    _resolveActiveColumns({ inColumnsCatalog = [], inColumnKeys = [] } = {}) {
        const localCatalog = inColumnsCatalog;
        const localKeys = inColumnKeys;

        if (Array.isArray(localKeys) && localKeys.length > 0) {
            const catalogMap = new Map((Array.isArray(localCatalog) ? localCatalog : []).map(col => [col.key, col]));
            const missingKeys = [];
            const resolved = [];

            for (const key of localKeys) {
                const column = catalogMap.get(key);
                if (column) {
                    resolved.push(column);
                } else {
                    missingKeys.push(key);
                }
            }

            if (missingKeys.length > 0) {
                console.warn(
                    `[json-to-dom-renderers] Warning: Config requested columns [${missingKeys.map(k => `"${k}"`).join(", ")}] that do not exist in the columns catalog.`
                );
            }

            return resolved;
        }

        return Array.isArray(localCatalog) ? localCatalog : [];
    }

    get rawData() {
        return this.source.originalData;
    }

    get config() {
        return this.source.config;
    }
}

export { SourceStore };
export default SourceStore;
