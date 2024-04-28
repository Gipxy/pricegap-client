import api from "../libs/api";

export const getBep20List = async () => {
  const res = await api.post("/monitor/getAllBep20Token");
  return res;
};

export const getAllTokens = async () => {
  const res = await api.post("/monitor/getAllTokens");
  return res;
};

export const upsertToken = async (token) => {
  const res = await api.post("/monitor/upsertToken", token);
  return res;
};
