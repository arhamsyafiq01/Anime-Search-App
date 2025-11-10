// src/components/AlphabetFilter.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAlphabet } from "../features/animeSearch/animeSearchSlice";
import type { RootState, AppDispatch } from "../store";
import { Link } from "react-router-dom";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const AlphabetFilter: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const selectedAlphabet = useSelector(
    (state: RootState) => state.animeSearch.selectedAlphabet
  );

  const handleAlphabetClick = (char: string) => {
    dispatch(setSelectedAlphabet(char));
  };

  const clearFilter = () => {
    dispatch(setSelectedAlphabet(""));
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {alphabet.map((char) => (
        <Link
          key={char}
          to="#"
          onClick={() => handleAlphabetClick(char)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors
            ${
              selectedAlphabet === char
                ? "text-blue-600 font-bold"
                : "text-gray-700 hover:text-blue-500"
            }`}
        >
          {char}
        </Link>
      ))}

      {/* ✅ Show Clear Button only if alphabet is selected */}
      {selectedAlphabet && (
        <button
          onClick={clearFilter}
          className="px-4 py-1 text-sm font-medium bg-red-500  hover:bg-red-600 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default AlphabetFilter;
