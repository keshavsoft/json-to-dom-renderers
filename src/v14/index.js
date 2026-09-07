import { Table } from "./table/index.js";
import { Form } from "./form/index.js";
import { DataList } from "./datalist/index.js";
import { createDataProvider } from "./provider/index.js";

const version = "v14.0.0";

window.ks ??= {};
window.ks["json-to-dom-renderers"] = {
    version,
    Table,
    Form,
    DataList,
    createDataProvider
};

export { version, Table, Form, DataList, createDataProvider };


