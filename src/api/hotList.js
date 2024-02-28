import api from "../libs/api";

export const getHotList = async () => {
  const res = await api.post("/monitor/getHostList");
  return res;
};
