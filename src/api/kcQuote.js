import api from "../libs/api";

export const kcQuote = async (tokenIn, tokenOut) => {
  //Rest/Market/Symbols/getTicker
  const ticker = await api.post("/kc/getTicker", {
    pair: tokenIn.symbol + "-" + tokenOut.symbol,
  });
  return ticker;
};
