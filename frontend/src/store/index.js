import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import clientsReducer from "./clientsSlice";
import propertiesReducer from "./propertiesSlice";
import interactionsReducer from "./interactionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    properties: propertiesReducer,
    interactions: interactionsReducer,
  },
});
