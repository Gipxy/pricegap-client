import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useRef, useEffect } from "react";
import { getPairs } from "../../api/pairs";

const colDefs = [
  { field: "pair" },
  { field: "symbolIn" },
  { field: "symbolOut" },
  { field: "pcTvl" },
  { field: "pcVl24h" },
  { field: "pc" },
  { field: "kc" },
  { field: "kcBase" },
];

const Pairs = () => {
  const gridApiRef = useRef();
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    (async function () {
      const pairs = await getPairs();
      setRowData(pairs);

      setTimeout(onFitColumns, 1000);
    })();
  }, []);

  const onFitColumns = () => {
    const api = gridApiRef.current;

    const allColumnIds = [];
    api.getColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    api.autoSizeColumns(allColumnIds, false);
  };

  return (
    <div
      className={"ag-theme-quartz"}
      style={{ width: "100%", height: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          filter: "agTextColumnFilter",
        }}
        onGridReady={(event) => {
          gridApiRef.current = event.api;

          var defaultSortModel = [
            { colId: "pc", sort: "desc", sortIndex: 0 },
            { colId: "kc", sort: "desc", sortIndex: 1 },
            { colId: "pcTvl", sort: "desc", sortIndex: 2 },
          ];

          event.api.applyColumnState({ state: defaultSortModel });
        }}
        getRowId={(params) => {
          return params.data.pair;
        }}
      />
    </div>
  );
};

export default Pairs;
