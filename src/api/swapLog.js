import api from "../libs/api";

export const getSwapLogs = async (numberOfDays) => {
  const res = await api.post("/monitor/getSwapLogs", { days: numberOfDays });
  return res;
};
