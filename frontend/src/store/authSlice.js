import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/client";

const storedToken = localStorage.getItem("crm_token");
const storedAgent = localStorage.getItem("crm_agent");

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      return { ...res.data, email };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Login failed. Check your credentials."
      );
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/signup", { name, email, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Signup failed.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken || null,
    agent: storedAgent ? JSON.parse(storedAgent) : null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.agent = null;
      localStorage.removeItem("crm_token");
      localStorage.removeItem("crm_agent");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.access_token;
        const agent = { name: action.payload.email };
        state.agent = agent;
        localStorage.setItem("crm_token", action.payload.access_token);
        localStorage.setItem("crm_agent", JSON.stringify(agent));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
