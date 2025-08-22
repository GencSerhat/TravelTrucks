// src/features/campers/campersAPI.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io",
});

export const getCampers = async (args = {}) => {
  const { append, ...rest } = args; 
  const params = Object.fromEntries(
    Object.entries(rest).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" && v !== false
    )
  );
  const res = await api.get("/campers", { params });
  return res.data; 
};

export const getCamperById = async (id) => {
  const res = await api.get(`/campers/${id}`);
  return res.data;
};
