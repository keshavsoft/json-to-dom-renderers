import { SourceStore } from "../../common/SourceStore.js";
import { buildLibrary } from "./buildLibrary/index.js";
import { runFilter } from "./filter/index.js";

export class TableStore extends SourceStore {
    constructor({ inData = [], inColumns = [], inConfig = {} } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;

        super({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig
        });

        this.library = buildLibrary({
            inSource: this.source,
            inResolveColumns: this._resolveActiveColumns.bind(this)
        });
    }

    get stateData() {
        return this.library.stateData;
    }

    get activeColumns() {
        return this.library.activeColumns;
    }

    get computedFooter() {
        return this.library.computedFooter;
    }

    filterOriginalData({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        return runFilter({
            inStore: this,
            inData: this.source.originalData,
            inQuery: localQuery
        });
    }

    filterStateData({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        return runFilter({
            inStore: this,
            inData: this.library.stateData,
            inQuery: localQuery
        });
    }

    filter({ inQuery = "" } = {}) {
        const localQuery = inQuery;
        return this.filterOriginalData({ inQuery: localQuery });
    }
}

export default TableStore;
