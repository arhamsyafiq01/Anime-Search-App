// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import animeSearchReducer from "../features/animeSearch/animeSearchSlice";
import animeDetailReducer from "../features/animeDetail/animeDetailSlice"; // Import the new reducer

export const store = configureStore({
  reducer: {
    animeSearch: animeSearchReducer,
    animeDetail: animeDetailReducer, // Add the new reducer here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
