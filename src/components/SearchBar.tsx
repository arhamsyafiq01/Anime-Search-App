// src/components/SearchBar.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  fetchAnimeBySearchTerm,
  clearSearchResults,
} from "../features/animeSearch/animeSearchSlice";
import type { AppDispatch } from "../store";
import type { RootState } from "../store";

const DEBOUNCE_DELAY = 250; // 250ms debounce interval

const SearchBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentSearchTerm = useSelector(
    (state: RootState) => state.animeSearch.searchTerm
  );
  const [inputValue, setInputValue] = useState(currentSearchTerm);

  // Ref to store the AbortController for cancelling API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Ref for the debounce timer
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Effect to synchronize internal input value with Redux state (e.g., if cleared elsewhere)
  useEffect(() => {
    if (currentSearchTerm !== inputValue) {
      setInputValue(currentSearchTerm);
    }
  }, [currentSearchTerm]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTerm = event.target.value;
      setInputValue(newTerm);

      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Cancel any in-flight requests before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // If the new term is empty, clear results and don't make an API call
      if (newTerm.trim() === "") {
        dispatch(clearSearchResults());
        dispatch(setSearchTerm("")); // Clear Redux search term as well
        return;
      }

      // Set a new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        dispatch(setSearchTerm(newTerm)); // Update Redux state immediately after debounce
        // Now, dispatch the API call. We'll need a way to pass the signal.
        // For simplicity, for now, we'll let fetchAnimeBySearchTerm handle its own AbortController
        // if it was designed to, or we adapt fetchAnimeBySearchTerm.
        // For now, let's assume `fetchAnimeBySearchTerm` is updated to accept an `AbortSignal`.
        // We'll update the thunk in a moment.

        // Create a new AbortController for the upcoming fetch
        const controller = new AbortController();
        abortControllerRef.current = controller;

        dispatch(fetchAnimeBySearchTerm({ query: newTerm, page: 1 }));
        // .then(() => {
        //   // On success, clear the abort controller ref
        //   abortControllerRef.current = null;
        // })
        // .catch((error) => {
        //   // Handle error, e.g., if it was an abort error, don't show user error
        //   if (error.name === 'AbortError') {
        //     console.log('Fetch aborted:', newTerm);
        //   } else {
        //     console.error('Fetch error:', error);
        //   }
        //   abortControllerRef.current = null;
        // });
      }, DEBOUNCE_DELAY);
    },
    [dispatch]
  ); // Only re-create if dispatch changes (which it won't)

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Abort any pending requests
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search for anime"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full p-3 pr-10 text-lg text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />

      {/* ✅ Clear Button (shows only when input has text) */}
      {inputValue.trim() !== "" && (
        <button
          onClick={() => {
            setInputValue("");
            dispatch(setSearchTerm(""));
            dispatch(clearSearchResults());

            // Abort pending API
            if (abortControllerRef.current) {
              abortControllerRef.current.abort();
            }

            // Clear debounce
            if (debounceTimerRef.current) {
              clearTimeout(debounceTimerRef.current);
            }
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
