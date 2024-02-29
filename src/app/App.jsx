import React from "react";
import Compare from "./Compare";
import WsTest from "./wstest/WsTest";
import NoPage from "./nopage/NoPage";
import Pairs from "./pair-list/Pairs";
import HotList from "./hot-list/HotList";
import Layout from "./Layout";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";

import "./App.css";

const App = () => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="compare" element={<Compare />} />
          <Route path="hot-list" element={<HotList />} />
          <Route path="ws-test" element={<WsTest />} />
          <Route path="pairs" element={<Pairs />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
