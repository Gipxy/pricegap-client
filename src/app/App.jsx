import React from "react";
import Compare from "./Compare";
import WsTest from "./wstest/WsTest";
import NoPage from "./nopage/NoPage";
import Pairs from "./pair-list/Pairs";
import LiveCheck from "./live-check/LiveCheck";
import Tokens from "./token-list/Tokens";
import TokenDetail from "./token-list/Detail";
import SwapLog from "./swap-logs/SwapLog";
import Balance from "./balance/Balance";
import Bep20List from "./bep20-list/Bep20List";
import Layout from "./Layout";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";

import "./App.css";

const App = () => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="compare" element={<Compare />} />
          <Route path="tokens" element={<Tokens />} />
          <Route path="/token-detail/:id" element={<TokenDetail />} />
          <Route path="swap-log" element={<SwapLog />} />
          <Route path="balance" element={<Balance />} />
          <Route path="ws-test" element={<WsTest />} />
          <Route path="bep20-list" element={<Bep20List />} />
          <Route path="pairs" element={<Pairs />} />
          <Route path="live-check" element={<LiveCheck />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
