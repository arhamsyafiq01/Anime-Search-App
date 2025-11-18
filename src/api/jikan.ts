export const JIKAN_API_BASE_URL = "https://api.jikan.moe/v4";
const JIKAN_RATE_LIMIT_DELAY = 2500; // 2.5 seconds between requests
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

// --- Request Queue ---
let lastRequestTime = 0;
const requestQueue: (() => Promise<any>)[] = [];
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue || requestQueue.length === 0) return;

  isProcessingQueue = true;

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const delayNeeded = JIKAN_RATE_LIMIT_DELAY - timeSinceLastRequest;

  if (delayNeeded > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayNeeded));
  }

  lastRequestTime = Date.now();
  const nextRequest = requestQueue.shift();

  if (nextRequest) {
    try {
      await nextRequest();
    } finally {
      isProcessingQueue = false;
      processQueue(); // process next
    }
  } else {
    isProcessingQueue = false;
  }
}

function enqueueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const runRequest = async () => {
      try {
        resolve(await requestFn());
      } catch (err) {
        reject(err);
      }
    };

    requestQueue.push(runRequest);
    processQueue();
  });
}

// --- Retry Handler ---
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  attempt = 0
): Promise<Response> {
  try {
    const res = await fetch(url, options);

    if (res.status === 429 && attempt < MAX_RETRY_ATTEMPTS) {
      console.warn(
        `Rate limit hit (429). Retrying in ${RETRY_DELAY_MS / 1000}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return fetchWithRetry(url, options, attempt + 1);
    }

    return res;
  } catch (err: any) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    console.error("Network error:", err);
    throw err;
  }
}

// --- Types ---
interface JikanDataItem {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface JikanAired {
  from: string | null;
  to: string | null;
  prop: {
    from: { day: number | null; month: number | null; year: number | null };
    to: { day: number | null; month: number | null; year: number | null };
  };
  string: string;
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
  status: string;
  aired: JikanAired;
  score: number;
  members: number;
  genres: JikanDataItem[];
  studios: JikanDataItem[];
  themes: JikanDataItem[];
  demographics: JikanDataItem[];
  producers: { mal_id: number; name: string }[];
  licensors: { mal_id: number; name: string }[];
  source: string | null;
  rating: string | null;
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

// --- API Functions (NOW using queue + retry) ---
export const searchAnime = async (
  query: string,
  page = 1,
  limit = 25,
  signal?: AbortSignal
): Promise<JikanApiResponse<Anime[]>> =>
  enqueueRequest(async () => {
    const url = `${JIKAN_API_BASE_URL}/anime?q=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`;

    const res = await fetchWithRetry(url, { signal });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    return res.json();
  });

export const getAnimeDetails = async (
  id: number
): Promise<JikanApiResponse<Anime>> =>
  enqueueRequest(async () => {
    const url = `${JIKAN_API_BASE_URL}/anime/${id}`;

    const res = await fetchWithRetry(url);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    return res.json();
  });
