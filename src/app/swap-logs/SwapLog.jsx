import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useRef, useEffect } from "react";
import { getSwapLogs } from "../../api/swapLog";
import { shortDateTime } from "../../utils/util";

const formatTime = (params) => {
  return shortDateTime(new Date(params.value));
};

const combine = (params, col1, col2, n) => {
  const data = params.data;
  if (!n) {
    return data[col1] + "/" + data[col2];
  }

  return fix(data[col1], n) + "/" + fix(data[col2], n);
};

const fix = (value, n) => {
  return value ? value.toFixed(n) : "";
};

const fix2 = (params) => {
  return fix(params.value, 2);
};

const fix4 = (params) => {
  return fix(params.value, 4);
};

const colDefs = [
  { field: "updatedTime", width: 140, valueFormatter: formatTime },
  { field: "batch", width: 110 },
  { field: "pair", width: 110 },
  { field: "side", width: 75 },
  { field: "amount", headerName: "amt", width: 85 },
  { field: "state", width: 75, valueFormatter: (params) => params.value.substr(0, 3) },
  { field: "purpose", width: 75, valueFormatter: (params) => params.value.substr(0, 3) },
  {
    field: "pcBal",
    width: 130,
    valueGetter: (params) => combine(params, "pcBaseBal", "pcTermBal", 2),
  },
  // { field: "pcBaseBal", width: 100, valueFormatter: fix2 },
  // { field: "pcTermBal", width: 100, valueFormatter: fix2 },
  {
    field: "kcBal",
    width: 130,
    valueGetter: (params) => combine(params, "kcBaseBal", "kcTermBal", 2),
  },
  // { field: "kcBaseBal", width: 100, valueFormatter: fix2 },
  // { field: "kcTermBal", width: 100, valueFormatter: fix2 },

  {
    field: "Per B/A",
    width: 100,
    valueGetter: (params) => combine(params, "pcBidPercent", "pcAskPercent", 3),
  },

  // { field: "kcBestAsk", headerName: "kcAsk", width: 90 },
  // { field: "kcBestAskSize", headerName: "AskSize", width: 90, valueFormatter: fix2 },
  {
    field: "kcAsk/size",
    width: 150,
    valueGetter: (params) => combine(params, "kcBestAsk", "kcBestAskSize"),
  },
  // { field: "kcBestBid", headerName: "kcBid", width: 90 },
  // { field: "kcBestBidSize", headerName: "BidSize", width: 90, valueFormatter: fix2 },
  {
    field: "kcBid/size",
    width: 150,
    valueGetter: (params) => combine(params, "kcBestBid", "kcBestBidSize"),
  },

  // { field: "pcPriceBid", width: 90 },
  // { field: "pcPriceAsk", width: 90 },
  {
    field: "pcBid/ask",
    width: 130,
    valueGetter: (params) => combine(params, "pcPriceBid", "pcPriceAsk", 6),
  },

  { field: "kcTime", width: 140, valueFormatter: formatTime },
  { field: "pcTime", width: 140, valueFormatter: formatTime },
  { field: "matchedTimestamp", width: 140, valueFormatter: formatTime },
  { field: "pcBidPercent", width: 100, valueFormatter: fix4 },
  { field: "pcAskPercent", width: 100, valueFormatter: fix4 },
];
const defaultGridOptions = {
  rowHeight: 28,
  headerHeight: 28,
};

const numberOfDays = 7;

const SwapLog = () => {
  const gridApiRef = useRef();
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await getSwapLogs(numberOfDays);
      setRowData(data.swapLogs);
    })();
  }, []);

  const reload = async () => {
    const data = await getSwapLogs(numberOfDays);
    setRowData(data.swapLogs);
  };

  return (
    <div className={"ag-theme-quartz"} style={{ width: "100%", height: "100%" }}>
      <div className="button-bar">
        <h2>Swap History</h2>
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

export default SwapLog;
