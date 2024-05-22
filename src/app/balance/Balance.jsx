import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useEffect } from "react";
import { getBalanceLogs } from "../../api/balanceLog";
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
  if (value === 0) {
    return 0;
  }
  return value ? Number(value).toFixed(n) : "";
};

const fix2 = (params) => {

  return fix(params.value, 2);
};

const fix4 = (params) => {
  return fix(params.value, 4);
};

/*
const balance = {
    timestamp,
    pcDao: pcDao,
    pcCgpt: pcCgpt,
    pcUsdt: pcUsdt,
    kcDao: kcBalance.find((e) => e.currency == tokenList.DAO.symbol).balance,
    kcCgpt: kcBalance.find((e) => e.currency == tokenList.CGPT.symbol).balance,
    kcUsdt: kcBalance.find((e) => e.currency == tokenList.USDT.symbol).balance,
    _id: timestamp,
    pair,
    side: isCustomerSell ? "SELL" : "BUY",
    amount: gapSwapAmount,
    purpose: matchingPurpose,
    fakeSwap,
    pcBid: matchedResult?.pcPriceBid,
    pcAsk: matchedResult?.pcPriceAsk,
    kcAsk: matchedResult?.kcBestAsk,
    kcBid: matchedResult?.kcBestBid,
  };
*/

const colDefs = [
  { field: "timestamp", width: 140, valueFormatter: formatTime },
  {
    field: "totalUsdt",
    width: 110,
    valueFormatter: fix2
  },
  {
    field: "totalUsdtWbnb", headerName: "UsdtWbnb",
    width: 110,
    valueFormatter: fix2
  },
  {
    field: "pnl",
    width: 80,
    valueFormatter: fix2
  },
  { field: "pair", width: 110 },
  {
    field: "purpose",
    width: 75,
    valueFormatter: (params) => params?.value?.substr(0, 3),
  },
  {
    field: "b/a per",
    width: 130,
    valueGetter: (params) => combine(params, "bPer", "aPer"),
  },
  { field: "fakeSwap", width: 80 },
  { field: "swapSuccess", width: 80 },
  {
    field: "pc b/a",
    width: 130,
    valueGetter: (params) => combine(params, "pcBid", "pcAsk"),
  },
  {
    field: "kc b/a",
    width: 130,
    valueGetter: (params) => combine(params, "kcBid", "kcAsk"),
  },
  { field: "side", width: 75 },
  { field: "amount", width: 75 },
  { field: "pcUsdt", width: 110, valueFormatter: fix4 },
  { field: "kcUsdt", width: 110, valueFormatter: fix4 },
  { field: "gateUsdt", width: 110, valueFormatter: fix4 },
  { field: "pcWbnb", width: 110, valueFormatter: fix4 },
  { field: "pcChapz", width: 110, valueFormatter: fix4 },
  { field: "gateChapz", width: 110, valueFormatter: fix4 },
  { field: "pcDao", width: 110, valueFormatter: fix4 },
  { field: "kcDao", width: 110, valueFormatter: fix4 },
  { field: "pcUmb", width: 110, valueFormatter: fix4 },
  { field: "gateUmb", width: 110, valueFormatter: fix4 },
];
const defaultGridOptions = {
  rowHeight: 28,
  headerHeight: 28,
};

const Balance = () => {
  const gridApiRef = useRef();
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await getBalanceLogs();
      setRowData(data);
    })();
  }, []);

  const reload = async () => {
    const data = await getBalanceLogs();
    setRowData(data);
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

export default Balance;
