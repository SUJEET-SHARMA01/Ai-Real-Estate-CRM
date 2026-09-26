import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/client";

export const fetchProperties = createAsyncThunk("properties/fetchAll", async () => {
  const res = await apiClient.get("/properties/");
  return res.data;
});

export const createProperty = createAsyncThunk(
  "properties/create",
  async (propertyData, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/properties/", propertyData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Could not add property.");
    }
  }
);

const propertiesSlice = createSlice({
  name: "properties",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProperties.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default propertiesSlice.reducer;
