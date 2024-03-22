import api from "../libs/api";

export const getBep20List = async () => {
  const res = await api.post("/monitor/getAllBep20Token");
  return res;
};
