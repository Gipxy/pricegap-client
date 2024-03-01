import api from "../libs/api";

export const getHotList = async (numberOfDays) => {
  const res = await api.post("/monitor/getHostList", { days: numberOfDays });
  return res;
};
