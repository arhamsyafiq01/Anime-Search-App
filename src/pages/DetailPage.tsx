import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import type { AppDispatch } from "../store";
import {
  fetchAnimeDetailsById,
  clearAnimeDetails,
} from "../features/animeDetail/animeDetailSlice";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the anime ID from the URL
  const dispatch: AppDispatch = useDispatch();
  const { detail, loading, error } = useSelector(
    (state: RootState) => state.animeDetail
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAnimeDetailsById(Number(id)));
    }
    return () => {
      dispatch(clearAnimeDetails());
    };
  }, [id, dispatch]);

  if (loading === "idle" && !detail && id) {
    return <div style={{ padding: "20px" }}>Loading anime details...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
  }

  if (!detail) {
    return <div style={{ padding: "20px" }}>Anime details not found.</div>;
  }

  const renderDataItems = (items: { mal_id: number; name: string }[]) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.mal_id}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
        >
          {item.name}
        </span>
      ))}
    </div>
  );

  return (
    <div className="p-8 max-w-300 mx-auto bg-white rounded-lg mt-8 mb-10">
      <Link
        to="/"
        className="text-blue-600 hover:underline flex items-center mb-6 text-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Back to Search
      </Link>

      {loading === "idle" && !detail && id ? (
        <div className="text-center p-8 text-xl text-gray-600">
          Loading anime details...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600 text-xl border border-red-400 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : !detail ? (
        <div className="p-8 text-center text-gray-600 text-xl">
          Anime details not found.
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
            {detail.title}
          </h1>

          <div className="flex flex-col md:flex-row gap-10 mb-10 items-start">
            {detail.images?.webp?.large_image_url && (
              <img
                src={detail.images.webp.large_image_url}
                alt={detail.title}
                className="w-full md:w-80 h-auto object-cover rounded-lg shadow-xl shrink-0"
              />
            )}
            <div className="flex-1 space-y-4">
              <p className="text-xl">
                <strong className="font-semibold text-gray-800">Type:</strong>{" "}
                {detail.type}
              </p>
              <p className="text-xl">
                <strong className="font-semibold text-gray-800">
                  Episodes:
                </strong>{" "}
                {detail.episodes || "N/A"}
              </p>
              <p className="text-xl">
                <strong className="font-semibold text-gray-800">Score:</strong>{" "}
                {detail.score || "N/A"}
              </p>
              <p className="text-xl">
                <strong className="font-semibold text-gray-800">
                  Members:
                </strong>{" "}
                {detail.members ? detail.members.toLocaleString() : "N/A"}
              </p>
              <a
                href={detail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View on MyAnimeList
              </a>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-5 text-gray-900">Synopsis</h2>
          <p className="text-lg text-gray-700 leading-relaxed text-justify">
            {detail.synopsis || "No synopsis available."}
          </p>

          {detail.genres && detail.genres.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Genres</h3>
              {renderDataItems(detail.genres)}
            </div>
          )}

          {detail.themes && detail.themes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Themes</h3>
              {renderDataItems(detail.themes)}
            </div>
          )}

          {detail.demographics && detail.demographics.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Demographics
              </h3>
              {renderDataItems(detail.demographics)}
            </div>
          )}

          {detail.producers && detail.producers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Producers
              </h3>
              {renderDataItems(detail.producers)}
            </div>
          )}

          {detail.licensors && detail.licensors.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Licensors
              </h3>
              {renderDataItems(detail.licensors)}
            </div>
          )}

          {detail.source && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Source</h3>
              <p className="text-lg text-gray-700">{detail.source}</p>
            </div>
          )}

          {detail.rating && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Rating</h3>
              <p className="text-lg text-gray-700">{detail.rating}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetailPage;
