import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useRef, useEffect } from "react";
import { getBep20List } from "../../api/token";
import { shortDateTime } from "../../utils/util";
import { useNavigate } from "react-router-dom";

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
/*
    symbol: spl[0],
    address: spl[1],
    decimals: 18,
    cex: spl[2],
    bnbPool: spl[3],
    monitorPrice: true,
    amount: Number(spl[4]),
*/

const defaultGridOptions = {
  rowHeight: 28,
  headerHeight: 28,
};

const Bep20List = () => {
  const gridApiRef = useRef();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);

  const colDefs = [
    {
      field: "...",
      width: 60,
      valueGetter: (params) => params.data,
      cellRenderer: (params) => {
        const data = params.data;
        console.log("data: ", data);
        let bnbPool = false;
        if (data.bnbPcV2 && data.bnbPcV2 > 10000) {
          bnbPool = true;
        }
        let amount = 0;
        if (data.bid) {
          if (data.bid < 10) {
            amount = Math.floor(200 / data.bid); //200USDT
          } else {
            amount = (200 / data.bid).toFixed(4); //200USDT
          }
        }
        let id = `${data.currency}_${data.contractAddress}_kucoin_${bnbPool}_${amount}`;

        return (
          <span onClick={() => navigate("/token-detail/" + id)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="22px">
              <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
            </svg>
          </span>
        );
      },
    },
    { field: "pair", width: 110 },
    { field: "bnbPcV2", headerName: "bnbPcV2 $", width: 100 },
    { field: "usdtPcV2", headerName: "usdtPcV2 $", width: 100 },
    { field: "fullName", width: 150 },
    { field: "bid", width: 100 },
    { field: "ask", width: 100 },
    { field: "volValue", headerName: "Vol value 24h", width: 120, valueFormatter: fix2 },
    { field: "contractAddress", width: 370 },
    {
      field: "contractAddress",
      headerName: "PooCoin",
      width: 100,
      cellRenderer: function (params) {
        return (
          <a href={"https://poocoin.app/tokens/" + params.value} target="_blank" rel="noopener">
            Link
          </a>
        );
      },
    },
    { field: "currency", width: 100 },
    { field: "time", width: 140, valueFormatter: formatTime },
    { field: "withdrawalMinFee", width: 100 },
    {
      field: "withdrawalMinVal",
      width: 100,
      valueGetter: (params) => Number(params.data.averagePrice * params.data.withdrawalMinFee).toFixed(8),
    },
  ];

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
        <h2>BEP20 Token - Kucoin</h2>
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
