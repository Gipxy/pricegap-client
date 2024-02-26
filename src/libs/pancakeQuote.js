import { ethers } from "ethers";
import { routerAbi as routeAbi } from "./routeAbi";
import { PANCAKE_ROUTER_V2_ADDRESS } from "./constants";
import { getProvider } from "./providers";
import { toReadableAmount, fromReadableAmount } from "./conversion";

const provider = getProvider();
const contractRouter = new ethers.Contract(
  PANCAKE_ROUTER_V2_ADDRESS,
  routeAbi,
  provider
);

export async function quote(tokenIn, tokenOut) {
  const amountIn = fromReadableAmount(tokenIn.amount, tokenIn.decimals);
  const amountsOut = await contractRouter.getAmountsOut(amountIn, [
    tokenIn.address,
    tokenOut.address,
  ]);

  return toReadableAmount(amountsOut[1], tokenOut.decimals);
}
