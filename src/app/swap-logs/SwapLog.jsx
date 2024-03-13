import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useRef, useEffect } from "react";
import { getSwapLogs } from "../../api/swapLog";
import { shortDateTime } from "../../utils/util";

const formatTime = (params) => {
  return shortDateTime(new Date(params.value));
};

const fix2 = (params) => {
  return params.value.toFixed(2);
};

const colDefs = [
  { field: "updatedTime", width: 140, valueFormatter: formatTime },
  { field: "batch", width: 110 },
  { field: "pair", width: 110 },
  { field: "side", width: 80 },
  { field: "amount", width: 85 },
  { field: "state", width: 75, valueFormatter: (params) => params.value.substr(0, 3) },
  { field: "purpose", width: 75, valueFormatter: (params) => params.value.substr(0, 3) },
  { field: "pcBaseBal", width: 120, valueFormatter: fix2 },
  { field: "pcTermBal", width: 120, valueFormatter: fix2 },
  { field: "kcBaseBal", width: 120, valueFormatter: fix2 },
  { field: "kcTermBal", width: 120, valueFormatter: fix2 },
  { field: "kcBestAsk", headerName: "kcAsk", width: 90 },
  { field: "kcBestAskSize", headerName: "AskSize", width: 90, valueFormatter: fix2 },
  { field: "kcBestBid", headerName: "kcBid", width: 90 },
  { field: "kcBestBidSize", headerName: "BidSize", width: 90, valueFormatter: fix2 },
  { field: "pcPriceBid", width: 90 },
  { field: "pcPriceAsk", width: 90 },
  { field: "kcTime", width: 140, valueFormatter: formatTime },
  { field: "pcTime", width: 140, valueFormatter: formatTime },
  { field: "matchedTimestamp", width: 140, valueFormatter: formatTime },
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
