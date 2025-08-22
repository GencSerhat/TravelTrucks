import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCampers } from "./campersAPI";

export const fetchCampers = createAsyncThunk(
  "campers/fetchCampers",
  async (args = {}, { rejectWithValue }) => {
    try {
      const data = await getCampers(args);
      return { data, append: args.append || false };
    } catch (err) {
      return rejectWithValue(err.message || "Fetch error");
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  page: 1,
  limit: 4,
  hasMore: true, // LoadMore kontrolü
  lastQuery: {}, // son filtrleeme
};
const camperSlice = createSlice({
  name: "campers",
  initialState,
  reducers: {
    resetCampers(state) {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
      state.lastQuery = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampers.fulfilled, (state, action) => {
        state.isLoading = false;
        // 1) Argümanlardan son filtreleri çıkart (page/limit/append hariç)
        const allArgs = action.meta?.arg || {};
        const { append = false, page = 1, limit=4, ...onlyFilters } = allArgs;
        if (!append) state.lastQuery = onlyFilters; // yeni aramada güncelle

        // 2) API yanıtından items'ı al ve normalize et
        const { items: rawItems = [] } = action.payload.data || {};

        const normalized = rawItems.map((c) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          price: c.price,
          rating: c.rating,
          reviews: Array.isArray(c.reviews) ? c.reviews.length : 0,
          image: c.gallery?.[0]?.original || "/Pic.png",
          features: [
            c.transmission,
            c.engine,
            c.AC && "AC",
            c.kitchen && "Kitchen",
            c.TV && "TV",
            c.bathroom && "Bathroom",
            c.microwave && "Microwave",
            c.refrigerator && "Refrigerator",
            c.gas && "Gas",
            c.water && "Water",
          ].filter(Boolean),
          description: c.description,
        }));
        state.items = append ? [...state.items, ...normalized] : normalized;

        state.page = page;
        if (typeof limit === "number") state.limit = limit;
        state.hasMore = normalized.length >= (state.limit || 4);
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});
export const { resetCampers } = camperSlice.actions;
export default camperSlice.reducer;
