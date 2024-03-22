import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useRef, useEffect } from "react";
import { getBep20List } from "../../api/token";
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
  return value ? Number(value).toFixed(n) : "";
};

const fix2 = (params) => {
  return fix(params.value, 2);
};

const fix8 = (params) => {
  return fix(params.value, 8);
};

/*
{
  currency: 'AITECH',
  name: 'AITECH',
  fullName: 'Solidus Ai Tech',
  precision: 8,
  confirms: 32,
  contractAddress: '0x2d060ef4d6bf7f9e5edde373ab735513c0e4f944',
  isMarginEnabled: false,
  isDebitEnabled: false,
  chainName: 'BEP20',
  withdrawalMinSize: 4,
  depositMinSize: null,
  withdrawFeeRate: 0,
  withdrawMaxFee: null,
  withdrawalMinFee: 2,
  isWithdrawEnabled: true,
  isDepositEnabled: true,
  preConfirms: 32,
  _id: 'AITECH-USDT',
  pair: 'AITECH-USDT',
  time: 1711073396692,
  symbol: 'AITECH-USDT',
  buy: 0.3175,
  sell: 0.3186,
  changeRate: -0.0479,
  changePrice: -0.016,
  high: 0.3576,
  low: 0.2971,
  vol: 5280950.34,
  volValue: 1709219.776414,
  last: 0.3175,
  averagePrice: 0.3256771,
  takerFeeRate: 0.001,
  makerFeeRate: 0.001,
  takerCoefficient: '2',
  makerCoefficient: '2'
}
*/

const colDefs = [
  { field: "time", width: 140, valueFormatter: formatTime },
  { field: "pair", width: 110 },
  { field: "currency", width: 100 },
  { field: "fullName", width: 150 },
  { field: "bid", width: 100 },
  { field: "ask", width: 100 },
  { field: "volValue", headerName: "Vol value 24h", width: 120, valueFormatter: fix2 },
  { field: "averagePrice", width: 100, valueFormatter: fix8 },
  { field: "contractAddress", width: 400 },
  { field: "withdrawalMinFee", width: 100 },
  {
    field: "withdrawalMinVal",
    width: 100,
    valueGetter: (params) =>
      Number(params.data.averagePrice * params.data.withdrawalMinFee).toFixed(8),
  },
  { field: "precision", width: 60 },
];
const defaultGridOptions = {
  rowHeight: 28,
  headerHeight: 28,
};

const Bep20List = () => {
  const gridApiRef = useRef();
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await getBep20List();
      setRowData(data.bep20List);
    })();
  }, []);

  const reload = async () => {
    const data = await getBep20List();
    setRowData(data.bep20List);
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

export default Bep20List;
