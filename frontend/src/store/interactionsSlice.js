import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/client";

export const fetchInteractions = createAsyncThunk(
  "interactions/fetchAll",
  async () => {
    const res = await apiClient.get("/interactions/");
    return res.data;
  }
);

export const createInteraction = createAsyncThunk(
  "interactions/create",
  async (interactionData, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/interactions/", interactionData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Could not log interaction."
      );
    }
  }
);

const interactionsSlice = createSlice({
  name: "interactions",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default interactionsSlice.reducer;
