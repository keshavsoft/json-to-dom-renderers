export const sampleColumns = [
    {
        "key": "vchtype",
        "label": "Vch Type",
        "type": "string",
        "id": "vchtype-id"
    },
    {
        "key": "vouchernumber",
        "label": "Vch No",
        "type": "string"
    },
    {
        "key": "allinventoryentries.stockitemname",
        "label": "Stock Item Name",
        "type": "string"
    },
    {
        "key": "allinventoryentries.batchallocations.batchname",
        "label": "Batch Name",
        "type": "string"
    },
    {
        "key": "allinventoryentries.batchallocations.amount",
        "label": "Amount",
        "type": "number",
        "align": "right"
    },
    {
        "key": "allinventoryentries.batchallocations.actualqty",
        "label": "Actual Qty",
        "type": "string"
    }
];

export const sampleTableConfig = {
    "serial": true,
    "head": {
        "columns": [
            "vchtype",
            "vouchernumber",
            "allinventoryentries.stockitemname",
            "allinventoryentries.batchallocations.batchname",
            "allinventoryentries.batchallocations.amount",
            "allinventoryentries.batchallocations.actualqty"
        ]
    },
    "row": {
        "striped": true,
        "hover": true
    },
    "foot": [
        {
            "id": "summaryRow",
            "title": "Total",
            "type": "aggregate",
            "values": {
                "amount": "sum"
            }
        },
        {
            "id": "taxRow",
            "title": "GST (18%)",
            "type": "eval",
            "values": {
                "amount": "summaryRow.amount * 0.18"
            }
        },
        {
            "id": "balanceRow",
            "title": "Grand Total",
            "type": "eval",
            "values": {
                "amount": "summaryRow.amount + taxRow.amount"
            }
        }
    ]
};

export const sampleSearchConfig = {
    "body": {
        "columns": [
            "allinventoryentries.stockitemname",
            "allinventoryentries.batchallocations.batchname",
            "allinventoryentries.batchallocations.amount"
        ]
    }
};

export const sampleDatalistConfig = {
    "datalist": {
        "columns": [
            "allinventoryentries.stockitemname",
            "allinventoryentries.batchallocations.batchname"
        ]
    }
};

export const sampleData = [
    {
        "type": "Voucher",
        "vchtype": "Sales/CA",
        "date": "2026-04-01",
        "vouchernumber": "1",
        "numberingstyle": "Auto Renumber",
        "isdeleted": false,
        "vouchernumberseries": "Default",
        "allinventoryentries.stockitemname": "Shading Net Kgs",
        "allinventoryentries.rate": "280.90/kgs",
        "allinventoryentries.amount": "1000.00",
        "allinventoryentries.actualqty": " 3.560 kgs",
        "allinventoryentries.billedqty": " 3.560 kgs",
        "allinventoryentries.batchallocations.mfdon": "20210723",
        "allinventoryentries.batchallocations.godownname": "Main Location",
        "allinventoryentries.batchallocations.batchname": "Rishi-Rs.205/-",
        "allinventoryentries.batchallocations.amount": "1000.00",
        "allinventoryentries.batchallocations.actualqty": " 3.560 kgs",
        "allinventoryentries.batchallocations.billedqty": " 3.560 kgs"
    },
    {
        "type": "Voucher",
        "vchtype": "Sales/CA",
        "date": "2026-04-01",
        "vouchernumber": "1",
        "numberingstyle": "Auto Renumber",
        "isdeleted": false,
        "vouchernumberseries": "Default",
        "allinventoryentries.stockitemname": "ROPE",
        "allinventoryentries.rate": "312.50/kgs",
        "allinventoryentries.amount": "100.00",
        "allinventoryentries.actualqty": " 0.320 kgs",
        "allinventoryentries.billedqty": " 0.320 kgs",
        "allinventoryentries.batchallocations.mfdon": "20210723",
        "allinventoryentries.batchallocations.godownname": "Main Location",
        "allinventoryentries.batchallocations.batchname": "Tuf-Rs.170",
        "allinventoryentries.batchallocations.amount": "100.00",
        "allinventoryentries.batchallocations.actualqty": " 0.320 kgs",
        "allinventoryentries.batchallocations.billedqty": " 0.320 kgs"
    },
    {
        "type": "Voucher",
        "vchtype": "Sales/CA",
        "date": "2026-04-01",
        "vouchernumber": "2",
        "numberingstyle": "Auto Renumber",
        "isdeleted": false,
        "vouchernumberseries": "Default",
        "allinventoryentries.stockitemname": "ROPE",
        "allinventoryentries.rate": "259.26/kgs",
        "allinventoryentries.amount": "420.00",
        "allinventoryentries.actualqty": " 1.620 kgs",
        "allinventoryentries.billedqty": " 1.620 kgs",
        "allinventoryentries.batchallocations.mfdon": "20210723",
        "allinventoryentries.batchallocations.godownname": "Main Location",
        "allinventoryentries.batchallocations.batchname": "Tuf-Rs.170",
        "allinventoryentries.batchallocations.amount": "420.00",
        "allinventoryentries.batchallocations.actualqty": " 1.620 kgs",
        "allinventoryentries.batchallocations.billedqty": " 1.620 kgs"
    },
    {
        "type": "Voucher",
        "vchtype": "Sales/CA",
        "date": "2026-04-01",
        "vouchernumber": "3",
        "numberingstyle": "Auto Renumber",
        "isdeleted": false,
        "vouchernumberseries": "Default",
        "allinventoryentries.stockitemname": "ROPE",
        "allinventoryentries.rate": "250.00/kgs",
        "allinventoryentries.amount": "200.00",
        "allinventoryentries.actualqty": " 0.800 kgs",
        "allinventoryentries.billedqty": " 0.800 kgs",
        "allinventoryentries.batchallocations.mfdon": "20210723",
        "allinventoryentries.batchallocations.godownname": "Main Location",
        "allinventoryentries.batchallocations.batchname": "Tuf-Rs.170",
        "allinventoryentries.batchallocations.amount": "200.00",
        "allinventoryentries.batchallocations.actualqty": " 0.800 kgs",
        "allinventoryentries.batchallocations.billedqty": " 0.800 kgs"
    }
];
