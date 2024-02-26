import { ethers } from "ethers";

const DISPLAY_DECIMALS = 6;

export function fromReadableAmount(amount, decimals) {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}

export function toReadableAmount(rawAmount, decimals) {
  const formatted = ethers.utils.formatUnits(rawAmount, decimals);
  return Number(formatted).toFixed(DISPLAY_DECIMALS);
}
