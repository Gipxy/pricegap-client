import api from "../libs/api";

export const getBalanceLogs = async () => {
  const res = await api.post("/monitor/getBalanceLogs");
  return res;
};
