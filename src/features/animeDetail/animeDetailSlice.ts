// src/features/animeDetail/animeDetailSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as jikan from "../../api/jikan"; // Import your API service as a namespace to avoid relying on a specific named export
import type { Anime } from "../../api/jikan";

interface AnimeDetailState {
  detail: Anime | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AnimeDetailState = {
  detail: null,
  loading: "idle",
  error: null,
};

export const fetchAnimeDetailsById = createAsyncThunk(
  "animeDetail/fetchAnimeDetailsById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await (jikan as any).getAnimeDetails(id);
      return response.data; // The API returns an object { data: Anime } for details
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch anime details");
    }
  }
);

const animeDetailSlice = createSlice({
  name: "animeDetail",
  initialState,
  reducers: {
    clearAnimeDetails: (state) => {
      state.detail = null;
      state.error = null;
      state.loading = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeDetailsById.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchAnimeDetailsById.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchAnimeDetailsById.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
        state.detail = null;
      });
  },
});

export const { clearAnimeDetails } = animeDetailSlice.actions;

export default animeDetailSlice.reducer;
