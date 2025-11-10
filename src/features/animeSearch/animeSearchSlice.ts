// src/features/animeSearch/animeSearchSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { searchAnime } from "../../api/jikan"; // Import your API service
import type { JikanPagination, Anime } from "../../api/jikan";

// Define a type for the slice state
interface AnimeSearchState {
  searchTerm: string;
  selectedAlphabet: string; // New state for selected alphabet
  results: Anime[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  pagination: JikanPagination | null;
  currentPage: number;
}

// Define the initial state using that type
const initialState: AnimeSearchState = {
  searchTerm: "",
  selectedAlphabet: "", // Initially no alphabet selected
  results: [],
  loading: "idle",
  error: null,
  pagination: null,
  currentPage: 1,
};

export const fetchAnimeBySearchTerm = createAsyncThunk(
  "animeSearch/fetchAnimeBySearchTerm",
  async (
    { query, page }: { query: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      // Call the API service without passing the AbortSignal (searchAnime accepts up to 3 args)
      const response = await searchAnime(query, page, 25);
      return response;
    } catch (error: any) {
      // It's important to check if the error is an AbortError
      if (error.name === "AbortError") {
        console.log("Fetch aborted by user input.");
        // Optionally, you can return a special value or re-throw
        // if you want extraReducers to handle it differently.
        // For now, we'll just suppress the error for aborted requests.
        throw error; // Let Redux handle the rejected state, but don't show a user error
      }
      return rejectWithValue(error.message || "Failed to fetch anime");
    }
  }
);

export const animeSearchSlice = createSlice({
  name: "animeSearch",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset page when search term changes
      state.selectedAlphabet = ""; // Clear alphabet when free-text searching
    },
    setSelectedAlphabet: (state, action: PayloadAction<string>) => {
      state.selectedAlphabet = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.pagination = null;
      state.error = null;
      state.loading = "idle";
      state.currentPage = 1;
      state.searchTerm = ""; // Ensure searchTerm is also cleared
      state.selectedAlphabet = ""; // Clear alphabet on clear
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeBySearchTerm.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchAnimeBySearchTerm.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.results = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAnimeBySearchTerm.rejected, (state, action) => {
        // Only set error if it's not an abort error
        if (action.error.name === "AbortError") {
          state.loading = "idle"; // Or keep it pending/idle, depending on desired UX
        } else {
          state.loading = "failed";
          state.error = action.payload as string; // Payload is the error message
          state.results = [];
          state.pagination = null;
        }
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setSearchTerm,
  setCurrentPage,
  clearSearchResults,
  setSelectedAlphabet,
} = animeSearchSlice.actions;

export default animeSearchSlice.reducer;
