import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useState, useRef } from "react";
import { initPriceList } from "./priceListHelper";

import { quote as pancakeQuote } from "../../libs/pancakeQuote";
import { kcQuote } from "../../api/kcQuote";
import { timeOnly } from "../../utils/util";

import useWebSocket from "react-use-websocket";

//const WSURL = "ws://127.0.0.1:5000?storeId=1";
const WSURL = import.meta.env.VITE_WS_URL;

const MAX_HISTORY = 10;

let g_autoRollover = false;

//1% mean veryhot
const isVeryHot = (ask, bid) => {
  if (ask <= bid) {
    return true;
  }
  return false;
};

const buildHotLog = (rowNode) => {
  let pcBidPercent = calcPercent(rowNode.data.bidV3, rowNode.data.kcBestAsk);
  let pcAskPercent = calcPercent(rowNode.data.kcBestBid, rowNode.data.askV3);

  const hotLog = {
    id: rowNode.data.id,
    pair: rowNode.data.pair,
    symbolIn: rowNode.data.symbolIn,
    symbolOut: rowNode.data.symbolOut,
    amountIn: rowNode.data.amountIn,
    amountOut: rowNode.data.amountOut,
    bidV3: rowNode.data.bidV3,
    pcBidPercent: pcBidPercent,
    askV3: rowNode.data.askV3,
    pcAskPercent: pcAskPercent,
    taken: rowNode.data.taken,
    kcPrice: rowNode.data.kcPrice,
    kcSize: rowNode.data.kcSize,
    kcBestAsk: rowNode.data.kcBestAsk,
    kcBestAskSize: rowNode.data.kcBestAskSize,
    kcBestBid: rowNode.data.kcBestBid,
    kcBestBidSize: rowNode.data.kcBestBidSize,
    kcTime: rowNode.data.kcTime,
  };

  return hotLog;
};

async function fetchKcPrice(row, rowNode) {
  const t1 = new Date();
  const tickerRes = await kcQuote(row.tokenIn, row.tokenOut);
  const kcTaken = new Date() - t1;
  rowNode.setDataValue("kcTaken", kcTaken);
  const ticker = tickerRes.data;
  if (ticker) {
    rowNode.setDataValue("kcPrice", ticker.price);
    rowNode.setDataValue("kcSize", ticker.size);
    rowNode.setDataValue("kcBestAsk", ticker.bestAsk);
    rowNode.setDataValue("kcBestAskSize", ticker.bestAskSize);
    rowNode.setDataValue("kcBestBid", ticker.bestBid);
    rowNode.setDataValue("kcBestBidSize", ticker.bestBidSize);
    rowNode.setDataValue("kcTime", timeOnly(new Date(ticker.time)));
  }

  return ticker;
}

const colDefs = [
  { field: "id", width: 50 },
  { field: "pair", width: 110 },
  { field: "amountIn", headerName: "Amt In", width: 70 },
  { field: "bidV3", width: 90 },
  { field: "kcBestAsk", headerName: "KcAsk", width: 90 },
  { field: "kcBestBid", headerName: "KcBid", width: 90 },
  { field: "askV3", width: 90 },
  { field: "kcBestBidSize", headerName: "BidSize", width: 90 },
  { field: "kcBestAskSize", headerName: "AskSize", width: 90 },
  { field: "kcPrice", width: 90 },
  { field: "kcSize", headerName: "size", width: 90 },
  { field: "kcTime", headerName: "KcTime", width: 110 },
  { field: "kcTaken", headerName: "KcTaken", width: 80 },
  { field: "amountOut", headerName: "Amt Out V2", width: 130 },
  { field: "taken", headerName: "Taken V2", width: 80 },
];

async function fetchPancakePrice(row, rowNode) {
  const oneRefreshTime = new Date();
  try {
    const amountOut = await pancakeQuote(row.tokenIn, row.tokenOut);
    const panCakeTaken = new Date() - oneRefreshTime;

    rowNode.setDataValue("amountOut", amountOut);
    rowNode.setDataValue("taken", panCakeTaken);
  } catch (error) {
    console.log("fetchPancakePrice error:", error);
  }
}

const PriceList = () => {
  // Column Definitions: Defines & controls grid columns.
  const gridApiRef = useRef();
  const [autoReload, setAutoReload] = useState(null);
  const [autoRolloverHistory, setAutoRolloverHistory] = useState(false);

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(initPriceList());
  const [hotList, setHotList] = useState([]);
  const [refreshTime, setRefreshTime] = useState("");
  const [enableV2, setEnableV2] = useState(false);

  const onQuote = useCallback(async () => {
    const gridApi = gridApiRef.current;
    const time = timeOnly(new Date());
    setRefreshTime(time);
    for (let i = 0; i < rowData.length; i++) {
      const row = rowData[i];
      const rowNode = gridApi.getRowNode(i);
      //Pancake
      enableV2 && (await fetchPancakePrice(row, rowNode));

      //KuCoin
      const ticker = await fetchKcPrice(row, rowNode);
      if (
        ticker &&
        (isVeryHot(ticker.bestAsk, rowNode.data.bidV3) ||
          isVeryHot(rowNode.data.askV3, ticker.bestBid))
      ) {
        const hotLog = buildHotLog(rowNode);

        setHotList((prevState) => {
          let newHotList;

          console.log("g_autoRollover:", g_autoRollover);

          if (g_autoRollover && prevState.length >= MAX_HISTORY) {
            newHotList = prevState.slice(1);
            newHotList.push(hotLog);
          } else {
            newHotList = [hotLog, ...prevState];
          }

          return newHotList;
        });
      }
    }
  }, []);

  const toggleAutoReload = () => {
    if (autoReload) {
      clearInterval(autoReload);
      setAutoReload(null);
    } else {
      let newAutoReload = setInterval(onQuote, 3000);
      setAutoReload(newAutoReload);
    }
  };
  const toggleAutoRollover = () => {
    g_autoRollover = !autoRolloverHistory;
    setAutoRolloverHistory(!autoRolloverHistory);
  };

  const toggleEnableV2 = () => {
    setEnableV2(!enableV2);
  };

  const clearHotHistory = () => {
    setHotList([]);
  };

  const onFitColumns = () => {
    const api = gridApiRef.current;

    const allColumnIds = [];
    api.getColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    api.autoSizeColumns(allColumnIds, false);
  };

  //ws
  const { lastJsonMessage } = useWebSocket(WSURL, {
    share: true,
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
  });

  console.log("lastJsonMessage:", lastJsonMessage);

  const updateIfRequire = () => {
    const gridApi = gridApiRef.current;

    const price = lastJsonMessage;
    if (!price) {
      return;
    }

    for (let i = 0; i < rowData.length; i++) {
      const row = rowData[i];
      const rowNode = gridApi.getRowNode(i);
      if (row.symbolIn == price.symbolIn && row.symbolOut == price.symbolOut) {
        price.priceBid && rowNode.setDataValue("bidV3", price.priceBid);
        price.priceAsk && rowNode.setDataValue("askV3", price.priceAsk);
      }
    }
  };

  updateIfRequire();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        className={"ag-theme-quartz"}
        style={{ width: "100%", height: "220px" }}
      >
        <div className="button-bar">
          <h2>Live data</h2>
          <div className="buttons">
            {/* <button onClick={onQuote}>Quote</button> */}
            <button onClick={toggleAutoReload}>
              {autoReload ? "Stop" : "3s"}
            </button>
            <button onClick={toggleEnableV2}>{enableV2 ? "!V2" : "V2"}</button>
          </div>
          <label>{refreshTime}</label>
        </div>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{}}
          onGridReady={(event) => {
            gridApiRef.current = event.api;
          }}
          getRowId={(params) => {
            return params.data.id;
          }}
          gridOptions={defaultGridOptions}
        />
      </div>
      <div className="button-bar" style={{ marginTop: "40px" }}>
        <h2>History</h2>
        <button onClick={toggleAutoRollover}>
          {" "}
          {autoRolloverHistory ? "!Roll" : "Roll"}{" "}
        </button>
        <button onClick={clearHotHistory}>Clear</button>
      </div>

      <div
        className={"ag-theme-quartz"}
        style={{ width: "100%", height: "550px" }}
      >
        <AgGridReact
          rowData={hotList}
          columnDefs={hotListColDefs}
          gridOptions={defaultGridOptions}
        />
      </div>
    </div>
  );
};

const defaultGridOptions = {
  rowHeight: 28,
  headerHeight: 28,
};
const cellStateClassRules = {
  "state-veryhot": (params) => params.value >= 2,
  "state-hot": (params) => params.value >= 0.5 && params.value < 2,
  "state-warm": (params) => params.value >= 0.05 && params.value < 0.5,
  "state-normal": (params) => params.value < 0.05,
};

const hotListColDefs = [
  { field: "kcTime", headerName: "KcTime", width: 110 },
  { field: "pair", width: 110 },
  { field: "bidV3", width: 95 },
  {
    field: "pcBidPercent",
    headerName: "bidPer",
    width: 95,
    cellClassRules: cellStateClassRules,
  },
  { field: "askV3", width: 95 },
  {
    field: "pcAskPercent",
    headerName: "askPer",
    width: 95,
    cellClassRules: cellStateClassRules,
  },
  { field: "kcBestBid", headerName: "Bid", width: 90 },
  { field: "kcBestAsk", headerName: "Ask", width: 90 },
  { field: "kcBestBidSize", headerName: "BidSize", width: 90 },
  { field: "kcBestAskSize", headerName: "AskSize", width: 90 },
  { field: "amountIn", headerName: "Amt In V2", width: 100 },
  { field: "amountOut", headerName: "Amt Out V2", width: 120 },
  { field: "taken", width: 70 },
  { field: "kcPrice", width: 100 },
  { field: "kcSize", headerName: "size", width: 100 },
  { field: "kcTaken", headerName: "Taken", width: 80 },
];

function calcPercent(val1, val2) {
  if (!val1 || !val2) {
    return null;
  }
  return (((val1 - val2) * 100) / val2).toFixed(6);
}

export default PriceList;
