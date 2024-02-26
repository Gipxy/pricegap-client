import { ethers } from "ethers";
import { currentConfig } from "../config";

// Provider Functions

export function getProvider() {
  return new ethers.providers.JsonRpcProvider(currentConfig.rpc.mainnet);
}
