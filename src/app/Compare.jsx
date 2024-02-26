import React from "react";
import { currentConfig } from "../config";
import PriceList from "./price-list/PriceList";

const Compare = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {currentConfig.rpc.mainnet === "" && (
        <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>
      )}

      <PriceList />
    </div>
  );
};

export default Compare;
