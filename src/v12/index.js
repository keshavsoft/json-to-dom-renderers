import { Table } from "./table/index.js";
import { Form } from "./form/index.js";
import { DataList } from "./datalist/index.js";
import { createDataProvider } from "./provider/index.js";

window.ks ??= {};
window.ks["json-to-dom-renderers"] = {
    Table,
    Form,
    DataList,
    createDataProvider
};

export { Table, Form, DataList, createDataProvider };

