import { DataListStore } from "./datalistStore/index.js";
import { renderDataList } from "./render/index.js";

class DataList {
    constructor({
        data = [],
        columns = [],
        config = {},
        dataProvider = null,
        targetContainerId = "datalist-container"
    } = {}) {
        const localData = data;
        const localColumns = columns;
        const localConfig = config;
        const localDataProvider = dataProvider;
        const localTargetContainerId = targetContainerId;

        this.containerId = localTargetContainerId;
        this.dataProvider = localDataProvider;
        this.element = null;
        this.spec = null;

        this.store = new DataListStore({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig
        });
    }

    async load({ query = {} } = {}) {
        const localQuery = query;
        if (!this.dataProvider || typeof this.dataProvider.read !== "function") {
            console.warn("DataList.load called without a valid dataProvider.read implementation");
            return this.store.stateData;
        }

        const fetchedData = await this.dataProvider.read({ inQuery: localQuery });
        const records = Array.isArray(fetchedData) ? fetchedData : (fetchedData?.data || []);
        this.store.updateData({ inData: records });
        this.render();
        return records;
    }

    get data() {
        return this.store.stateData;
    }

    get columns() {
        return this.store.activeColumns;
    }

    get config() {
        return this.store.config;
    }

    render() {
        return renderDataList({ inDataList: this });
    }

    update({ data = [] } = {}) {
        const localData = data;
        this.store.updateData({ inData: localData });
        return this.render();
    }
}

DataList.layouts = [];
DataList.themes = [];

export { DataList };
export default DataList;
