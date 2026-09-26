import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/client";

export const fetchClients = createAsyncThunk("clients/fetchAll", async () => {
  const res = await apiClient.get("/clients/");
  return res.data;
});

export const createClient = createAsyncThunk(
  "clients/create",
  async (clientData, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/clients/", clientData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Could not add client.");
    }
  }
);

const clientsSlice = createSlice({
  name: "clients",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default clientsSlice.reducer;
