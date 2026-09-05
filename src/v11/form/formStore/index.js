import { SourceStore } from "../../common/SourceStore.js";

export class FormStore extends SourceStore {
    constructor({ inColumns = [], inConfig = {} } = {}) {
        const localColumns = inColumns;
        const localConfig = inConfig;

        super({
            inColumns: localColumns,
            inConfig: localConfig
        });

        this.library = this._buildLibrary({
            inSource: this.source
        });
    }

    _buildLibrary({ inSource } = {}) {
        const localSource = inSource;

        const activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: localSource?.columns,
            inColumnKeys: localSource?.config?.body?.columns
        });

        return {
            activeColumns
        };
    }

    get activeColumns() {
        return this.library.activeColumns;
    }
}

export default FormStore;
