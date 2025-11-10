export const JIKAN_API_BASE_URL = "https://api.jikan.moe/v4";

// Basic structure for common related entities (genres, studios, themes)
interface JikanDataItem {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

// Interface for aired dates
interface JikanAired {
  from: string | null; // e.g., "2002-10-03T00:00:00+00:00"
  to: string | null;
  prop: {
    from: { day: number | null; month: number | null; year: number | null };
    to: { day: number | null; month: number | null; year: number | null };
  };
  string: string; // e.g., "Oct 3, 2002 to Mar 25, 2007"
}

export interface Anime {
  mal_id: number;
  url: string;
  images: {
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  title: string;
  synopsis: string;
  type: string;
  episodes: number;
  status: string; // e.g., "Finished Airing", "Currently Airing"
  aired: JikanAired; // New field for airing dates
  score: number;
  members: number;
  genres: JikanDataItem[]; // New field for genres
  studios: JikanDataItem[]; // New field for studios
  themes: JikanDataItem[]; // New field for themes
  demographics: JikanDataItem[]; // New field for demographics
  producers: { mal_id: number; name: string }[];
  licensors: { mal_id: number; name: string }[];
  source: string | null;
  rating: string | null;

  // Add other fields you expect to use, e.g., 'rank', 'popularity', 'source', 'rating'
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanApiResponse<T> {
  data: T;
  pagination?: JikanPagination;
}

// Function to fetch anime by search term
export const searchAnime = async (
  query: string,
  page: number = 1,
  limit: number = 25, // Default limit
  signal?: AbortSignal // Add AbortSignal parameter
): Promise<JikanApiResponse<Anime[]>> => {
  const response = await fetch(
    `${JIKAN_API_BASE_URL}/anime?q=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`,
    { signal } // Pass the signal to the fetch call
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getAnimeDetails = async (
  id: number
): Promise<JikanApiResponse<Anime>> => {
  const response = await fetch(`${JIKAN_API_BASE_URL}/anime/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
