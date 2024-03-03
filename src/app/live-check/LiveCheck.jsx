import React, { useState, useRef, useEffect } from "react";
import { getLiveStatus } from "../../api/liveCheck";

const LiveCheck = () => {
  const [status, setStatus] = useState("Not ready!");
  useEffect(() => {
    (async function () {
      console.log("Call me!");
      const result = await getLiveStatus();
      setStatus(result);
    })();
  }, []);

  return <div style={{ width: "100%", height: "100%" }}>Status: {status}</div>;
};

export default LiveCheck;
