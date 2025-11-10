import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import type { AppDispatch } from "../store";
import {
  fetchAnimeBySearchTerm,
  setCurrentPage,
  clearSearchResults,
} from "../features/animeSearch/animeSearchSlice";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";
import AnimeCardSkeleton from "../components/AnimeCardSkeleton";
import AlphabetFilter from "../components/AlphabetFilter";

const SearchPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    searchTerm,
    selectedAlphabet,
    results,
    loading,
    error,
    pagination,
    currentPage,
  } = useSelector((state: RootState) => state.animeSearch);

  const currentQuery = selectedAlphabet || searchTerm;

  useEffect(() => {
    if (currentQuery.trim() !== "") {
      dispatch(
        fetchAnimeBySearchTerm({ query: currentQuery, page: currentPage })
      );
    } else {
      dispatch(clearSearchResults());
      if (currentPage !== 1) dispatch(setCurrentPage(1));
    }
  }, [currentQuery, currentPage, dispatch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (
        pagination &&
        newPage >= 1 &&
        newPage <= pagination.last_visible_page
      ) {
        dispatch(setCurrentPage(newPage));
      }
    },
    [dispatch, pagination]
  );

  return (
    <div className="p-20 max-w-7xl mx-auto">
      <h2 className="text-xl font-extrabold text-center text-gray-800">
        Discover Anime
      </h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Use the alphabetical filter or search for your favorite titles.
      </p>

      <div className="max-w-lg mx-auto mb-10">
        <SearchBar />
      </div>

      <div className="text-center ">
        <AlphabetFilter />
      </div>

      {loading === "pending" && currentQuery !== "" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-6">
          {[...Array(25)].map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {loading === "succeeded" &&
        results.length === 0 &&
        currentQuery !== "" && (
          <div className="mt-12 text-center text-gray-600">
            <p className="text-2xl mb-3">
              🤷‍♂️ No results found for "
              <span className="font-semibold">{currentQuery}</span>".
            </p>
            <p className="text-lg">Try a different search or spelling.</p>
          </div>
        )}

      {currentQuery === "" && results.length === 0 && loading === "idle" && (
        <div className="mt-16 text-center text-gray-500">
          <p className="text-3xl mb-4">✨ Start your anime adventure!</p>
          <p className="text-xl">Type in the search bar above to find anime.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Results for:
            <span className="text-blue-600">
              {selectedAlphabet ? selectedAlphabet.toUpperCase() : searchTerm}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {results.map((anime) => (
              <div
                key={anime.mal_id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <Link to={`/anime/${anime.mal_id}`} className="block">
                  <img
                    src={
                      anime.images.webp.small_image_url ||
                      "https://via.placeholder.com/200x280?text=No+Image"
                    }
                    alt={anime.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                      {anime.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {anime.type}
                      {anime.episodes ? ` · ${anime.episodes} eps` : ""}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {pagination && (
            <div className="mt-10 flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading === "pending"}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                Previous
              </button>

              <span className="text-xl font-medium text-gray-700">
                Page {currentPage}
                {pagination.last_visible_page ? (
                  <> of {pagination.last_visible_page}</>
                ) : (
                  <> of ?</>
                )}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.has_next_page || loading === "pending"}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg "
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
