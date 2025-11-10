// src/components/AnimeCardSkeleton.tsx
import React from "react";

const AnimeCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse bg-white shadow">
      <div className="h-40 bg-gray-300 rounded-md mb-4"></div>

      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
};

export default AnimeCardSkeleton;
