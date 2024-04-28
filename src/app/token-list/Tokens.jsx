import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useRef, useEffect } from "react";
import { getAllTokens } from "../../api/token";
import { shortDateTime } from "../../utils/util";
import { useNavigate } from "react-router-dom";

const formatTime = (params) => {
  return shortDateTime(new Date(params.value));
};

const colDefs = [
  { field: "symbol", width: 120 },
  { field: "address", width: 120 },
  { field: "decimals", width: 90 },
  { field: "amount", width: 90 },
  { field: "cex", width: 90 },
  { field: "bnbPool", width: 90 },
  { field: "monitorPrice", width: 90 },
  { field: "updatedTime", width: 140, valueFormatter: formatTime },
];

const Tokens = () => {
  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await getAllTokens();
      setRowData(data.tokens);
    })();
  }, []);

  const reload = async () => {
    const data = await getAllTokens();
    setRowData(data.tokens);
  };

  const createNew = async () => {
    navigate("/token-detail/new");
  };

  const defaultGridOptions = {
    rowHeight: 28,
    headerHeight: 28,
    onRowDoubleClicked: (row) => {
      navigate(`/token-detail/${row.data._id}`);
    },
  };

  return (
    <div className={"ag-theme-quartz"} style={{ width: "100%", height: "100%" }}>
      <div className="button-bar">
        <h4>Token List</h4>
        <div className="buttons">
          <button onClick={reload}>Reload</button>
          <button onClick={createNew}>Create New</button>
        </div>
      </div>

      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          filter: "agTextColumnFilter",
        }}
        gridOptions={defaultGridOptions}
      />
    </div>
  );
};

export default Tokens;
