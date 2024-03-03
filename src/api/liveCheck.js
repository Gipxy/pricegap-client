import api from "../libs/api";

export const getLiveStatus = async () => {
  const res = await api.post("/common/live-check", {});
  return res;
};
