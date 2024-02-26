import api from "../libs/api";

export const getPairs = async () => {
  const pairs = await api.post("/common/pairs");
  return pairs;
};
