import { Table } from "./table/index.js";
import { Form } from "./form/index.js";
import { DataList } from "./datalist/index.js";

window.ks ??= {};
window.ks["json-to-dom-renderers"] = {
    Table,
    Form,
    DataList
};

export { Table, Form, DataList };
