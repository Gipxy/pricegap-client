import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function WsTest() {
  let storeId = 10;
  const URL = "ws://127.0.0.1:5000?storeId=" + storeId;

  const [ws, setWs] = useState(new WebSocket(URL));

  useEffect(() => {
    ws.onopen = (e) => {
      newFunction(e);

      function newFunction(e) {
        alert("WebSocket Connected");
      }
    };

    ws.onmessage = (e) => {
      const message = e.data;
      alert(message);
    };

    return () => {
      ws.onclose = () => {
        alert("WebSocket Disconnected");
        setWs(new WebSocket(URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose, ws, URL]);

  return (
    <div
      style={{
        color: "red",
        fontSize: "4rem",
      }}
    >
      store: {storeId}
    </div>
  );
}
