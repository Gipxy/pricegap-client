import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./DetailPage.css"; // Import CSS file
import { getAllTokens, upsertToken } from "../../api/token";
import { useNavigate } from "react-router-dom";

const DetailPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [tokens, setTokens] = useState([]);
  const [token, setToken] = useState({});

  //   const [token, setToken] = useState({
  //     address: "0x846f52020749715f02aef25b5d1d65e48945649d",
  //     decimals: 18,
  //     symbol: "UMB",
  //     remark: "Gate IO is in ETH network. Gate.io",
  //     cex: "gate",
  //     bnbPool: true,
  //     monitorPrice: true,
  //     amount: 7000,
  //   });

  useEffect(() => {
    (async function () {
      const data = await getAllTokens();
      const newTokens = data.tokens;
      setTokens(newTokens);

      const token = newTokens.find((t) => t.symbol === id);
      if (token) {
        setToken(token);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setToken((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add logic to submit edited data (e.g., API call)
    console.log("Form submitted:", token);

    //verify all field of token are mandatory, if not alert
    if (!token.symbol || !token.address || !token.decimals || !token.amount || !token.cex || !token.amount) {
      alert("Please fill in all fields!");
      return;
    }

    if (!token._id) {
      token._id = token.symbol;
    }

    token.updatedTime = Date.now();

    await upsertToken(token);

    navigate("/tokens");
  };

  return (
    <div>
      <h1>Token Detail - {id} </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label">Symbol:</label>
          <input className="form-input" type="text" name="symbol" readOnly={id != "new"} value={token.symbol} onChange={handleChange} />
        </div>
        <div>
          <label className="form-label">Address:</label>
          <input className="form-input" type="text" name="address" value={token.address} onChange={handleChange} />
        </div>
        <div>
          <label className="form-label">Decimals:</label>
          <input className="form-input" type="number" name="decimals" value={token.decimals} onChange={handleChange} />
        </div>

        <div>
          <label className="form-label">CEX:</label>
          <input className="form-input" type="text" name="cex" value={token.cex} onChange={handleChange} />
        </div>
        <div>
          <label className="form-label">BnbPool:</label>
          <input className="form-input" type="checkbox" name="bnbPool" checked={token.bnbPool} onChange={handleChange} />
        </div>
        <div>
          <label className="form-label">MonitorPrice:</label>
          <input className="form-input" type="checkbox" name="monitorPrice" checked={token.monitorPrice} onChange={handleChange} />
        </div>
        <div>
          <label className="form-label">Amount:</label>
          <input className="form-input" type="number" name="amount" value={token.amount} onChange={handleChange} />
        </div>
        <div>
          <label className="form-label">Remark:</label>
          <input className="form-input" type="text" name="remark" value={token.remark} onChange={handleChange} />
        </div>
        <div className="form-container">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default DetailPage;
