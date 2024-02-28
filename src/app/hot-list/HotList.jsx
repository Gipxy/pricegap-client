import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useRef, useEffect } from "react";
import { getHotList } from "../../api/hotList";
import { shortDateTime } from "../../utils/util";

const cellStateClassRules = {
  "state-veryhot": (params) => params.value >= 2,
  "state-hot": (params) => params.value >= 0.5 && params.value < 2,
  "state-warm": (params) => params.value >= 0.05 && params.value < 0.5,
  "state-normal": (params) => params.value < 0.05,
};

const formatTime = (params) => {
  return shortDateTime(new Date(params.value));
};

const colDefs = [
  { field: "pair", width: 120 },
  { field: "amountIn", headerName: "amtIn", width: 85 },
  { field: "bidV3", width: 90 },
  { field: "kcBestAsk", headerName: "kcAsk", width: 90 },
  {
    field: "pcBidPercent",
    headerName: "bidPer",
    cellClassRules: cellStateClassRules,
    width: 90,
  },
  { field: "askV3", width: 90 },
  { field: "kcBestBid", headerName: "kcBid", width: 90 },
  {
    field: "pcAskPercent",
    headerName: "askPer",
    cellClassRules: cellStateClassRules,
    width: 90,
  },
  { field: "kcBestAskSize", headerName: "Kc askSize", width: 90 },
  { field: "kcBestBidSize", headerName: "Kc bidSize", width: 90 },
  { field: "kcTime", width: 140, valueFormatter: formatTime },
  { field: "pcTime", width: 140, valueFormatter: formatTime },
  { field: "timestamp", width: 140, valueFormatter: formatTime },
  { field: "kcTaken", width: 90 },
  { field: "kcPrice", width: 90 },
  { field: "kcSize", width: 90 },
];
const defaultGridOptions = {
  rowHeight: 28,
  headerHeight: 28,
};

const HotList = () => {
  const gridApiRef = useRef();
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await getHotList();
      setRowData(data.hotList);
    })();
  }, []);

  const reload = async () => {
    const data = await getHotList();
    setRowData(data.hotList);
  };

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
      <div className="button-bar">
        <h2>Matched Log</h2>
        <div className="buttons">
          <button onClick={reload}>Reload</button>
        </div>
      </div>

      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          filter: "agTextColumnFilter",
        }}
        onGridReady={(event) => {
          gridApiRef.current = event.api;
          var defaultSortModel = [];
          event.api.applyColumnState({ state: defaultSortModel });
        }}
        gridOptions={defaultGridOptions}
      />
    </div>
  );
};

export default HotList;
