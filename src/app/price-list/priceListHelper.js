import { tokenPairs } from "../../libs/tokenPair";
import { tokenList } from "../../libs/token";

export const initPriceList = () => {
  let count = 0;
  const ret = tokenPairs.map((pair) => {
    const tokens = pair.split("-");
    const oneRow = {
      id: count++,
      pair: tokenList[tokens[0]].symbol + "-" + tokenList[tokens[1]].symbol,
      symbolIn: tokenList[tokens[0]].symbol,
      symbolOut: tokenList[tokens[1]].symbol,
      amountIn: tokenList[tokens[0]].amount,
      amountOut: "",
      tokenIn: tokenList[tokens[0]],
      tokenOut: tokenList[tokens[1]],
      kcPrice: "",
      kcSize: "",
      kcBestAsk: "",
      kcBestAskSize: "",
      kcBestBid: "",
      kcBestBidSize: "",
      kcTime: "",
    };
    return oneRow;
  });

  return ret;
};
