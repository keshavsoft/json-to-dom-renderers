import { SourceStore } from "../../common/SourceStore.js";
import { cloneData } from "../../common/cloneData.js";

export class DataListStore extends SourceStore {
    constructor({ inData = [], inColumns = [], inConfig = {}, inTopN = 100 } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;
        const localTopN = inTopN;

        super({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig,
            inTopN: localTopN
        });

        this.library = this._buildLibrary({
            inSource: this.source
        });
    }

    _buildLibrary({ inSource } = {}) {
        const localSource = inSource;

        const activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: localSource?.columns,
            inColumnKeys: localSource?.config?.datalist?.columns || localSource?.config?.columns
        });

        const stateData = cloneData({
            inData: localSource?.originalData
        });

        const topN = localSource?.config?.datalist?.topN ?? localSource?.topN ?? 100;

        return {
            activeColumns,
            stateData,
            topN
        };
    }

    get stateData() {
        return this.library.stateData;
    }

    get activeColumns() {
        return this.library.activeColumns;
    }

    get topN() {
        return this.library.topN;
    }

    updateData({ inData = [] } = {}) {
        const localData = inData;
        this.library.stateData = Array.isArray(localData) ? localData : [];
        return this.library.stateData;
    }
}

export default DataListStore;
