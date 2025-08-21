import axios from "axios";

const api = axios.create({
  baseURL: "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io",
});

export const getCampers = async ({ page = 1, limit = 4 } = {}) => {
  const res = await api.get("/campers", {
    params: { page, limit },
  });
  console.log("API Response:", res.data); // kontrol için
  return res.data; // Array dönmeli
};
export const getCamperById = async (id) => {
  const res = await api.get(`/campers/${id}`);
  return res.data;
};
