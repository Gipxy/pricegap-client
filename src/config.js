import { FeeAmount } from "./libs/constants";

// Example Configuration

export const currentConfig = {
  rpc: {
    local: "http://localhost:8545",
    mainnet: "https://bsc-dataseed.bnbchain.org",
  },
  tokens: {
    amountIn: 1000,
    poolFee: FeeAmount.MEDIUM,
  },
};
