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
        const { items: newItems = [] } = action.payload.data || {};
        const append = action.payload.append;
        const normalized = newItems.map((c) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          price: c.price,
          rating: c.rating,
          reviews: c.reviews?.length ?? 0,
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

        // state.items = append ? [...state.items, ...newItems] : newItems;

        state.hasMore = newItems.length >= (state.limit || 4);
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});
export const { resetCampers } = camperSlice.actions;
export default camperSlice.reducer;
