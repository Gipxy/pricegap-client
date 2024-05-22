import api from "../libs/api";

export const getBalanceLogs = async () => {
  const {balanceLogs} = await api.post("/monitor/getBalanceLogs");

  //for loop
  for (let i = balanceLogs.length-1; i >= 0 ; i--) {
    const b = balanceLogs[i];
    let pcWbnbInUsdt = 0;

    if (b.pcWbnb && b.priceBnbSell && b.priceBnbBuy) {
      pcWbnbInUsdt = Number(b.pcWbnb) * (Number(b.priceBnbSell) + Number(b.priceBnbBuy))/2
    }

    b.totalUsdt = Number(b.pcUsdt) + Number(b.gateUsdt) + Number(b.kcUsdt);
    b.totalUsdtWbnb = b.totalUsdt + pcWbnbInUsdt;

    if (i < balanceLogs.length-1) {
      const wbnbDiff = b.pcWbnb - balanceLogs[i+1].pcWbnb;
      const pcWbnbInUsdtDiff = Number(wbnbDiff) * (Number(b.priceBnbSell) + Number(b.priceBnbBuy))/2
      b.pnl = (b.totalUsdt - balanceLogs[i+1].totalUsdt) + pcWbnbInUsdtDiff;
    }
  }

  return balanceLogs;
};
