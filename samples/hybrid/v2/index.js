import columns from "./columns.json" with { type: "json" };
import tableConfig from "./table/config.json" with { type: "json" };
import searchConfig from "./search/config.json" with { type: "json" };
import datalistConfig from "./datalist/config.json" with { type: "json" };

// Import everything cleanly from CDN (v11 with DataProvider)
import { Table, Form, DataList, createDataProvider } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-dom-renderers/docs/dist/v11/min.js";

// 1. Data Provider configured from the outside with fetch endpoint
const dataProvider = createDataProvider({
    inReadUrl: "./data.json"
});

const startFunc = async () => {
    // 2. Instantiate Table with dataProvider (no hardcoded data!)
    const table = new Table({
        theme: "dark",
        columns,
        config: tableConfig,
        dataProvider,
        targetContainerId: "table-container"
    });

    // Fetch data dynamically and render table
    const fetchedData = await table.load();

    // 3. Instantiate and render Form
    const form = new Form({
        theme: "dark",
        columns,
        config: searchConfig,
        targetContainerId: "filter-container"
    });

    const fromForm = form.render();

    // 4. Instantiate and render DataList populated with fetched records
    const dataList = new DataList({
        theme: "dark",
        data: fetchedData,
        columns,
        config: datalistConfig,
        targetContainerId: "datalist-container"
    });

    dataList.render();

    const formElement = fromForm.element;
    const buttons = formElement.querySelectorAll("button");

    buttons.forEach(button => {
        button.addEventListener("click", event => {
            const currentTarget = event.currentTarget;
            const closestRow = currentTarget.closest("div");
            const input = closestRow.querySelector("input");
            const name = input.getAttribute("name");
            const value = input.value;
            const query = {};
            query[name] = value;

            table.filterStateData({ query });

            // Update datalist autocomplete options with new filtered state counts
            dataList.update({ data: table.store.stateData });
        });
    });
};

startFunc();
