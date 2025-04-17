/**
 * Jikan API Service
 * 
 * This file contains utility functions for interacting with the Jikan API (v4)
 * for fetching anime and manga data.
 * 
 * Rate limiting: Jikan API allows 3 requests per second
 */

const BASE_URL = 'https://api.jikan.moe/v4';

// Queue for managing API requests to respect rate limits
class RequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing = false;
  private requestsThisSecond = 0;
  private lastRequestTime = 0;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    
    // Check if we need to wait due to rate limiting
    const now = Date.now();
    if (now - this.lastRequestTime < 1000) {
      this.requestsThisSecond++;
      if (this.requestsThisSecond >= 3) {
        // Wait until the next second before continuing
        const waitTime = 1000 - (now - this.lastRequestTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestsThisSecond = 0;
        this.lastRequestTime = Date.now();
      }
    } else {
      this.requestsThisSecond = 1;
      this.lastRequestTime = now;
    }

    // Process the next request
    const nextRequest = this.queue.shift();
    if (nextRequest) {
      try {
        await nextRequest();
      } catch (error) {
        console.error('Error processing request:', error);
      }
    }

    // Continue processing the queue
    this.processQueue();
  }
}

const requestQueue = new RequestQueue();

/**
 * Generic fetch function with error handling and rate limiting
 */
async function fetchWithRateLimit<T>(url: string): Promise<T> {
  return requestQueue.add(async () => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  });
}

// Types for API responses
export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface AnimeItem {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    prop: any;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface MangaItem {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  chapters: number;
  volumes: number;
  status: string;
  publishing: boolean;
  published: {
    from: string;
    to: string;
    prop: any;
  };
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  authors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  genres?: string | number[];
  rating?: string;
  order_by?: string;
  sort?: 'asc' | 'desc';
}

/**
 * Builds a URL with query parameters for API requests
 */
function buildUrl(endpoint: string, params: SearchParams = {}): string {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v.toString()));
      } else {
        url.searchParams.append(key, value.toString());
      }
    }
  });
  
  return url.toString();
}

/**
 * Search for anime with optional filters
 */
export async function searchAnime(params: SearchParams = {}): Promise<JikanResponse<AnimeItem[]>> {
  const url = buildUrl('anime', params);
  return fetchWithRateLimit<JikanResponse<AnimeItem[]>>(url);
}

/**
 * Get detailed information about a specific anime by ID
 */
export async function getAnimeById(id: number): Promise<JikanResponse<AnimeItem>> {
  const url = buildUrl(`anime/${id}`);
  return fetchWithRateLimit<JikanResponse<AnimeItem>>(url);
}

/**
 * Search for manga with optional filters
 */
export async function searchManga(params: SearchParams = {}): Promise<JikanResponse<MangaItem[]>> {
  const url = buildUrl('manga', params);
  return fetchWithRateLimit<JikanResponse<MangaItem[]>>(url);
}

/**
 * Get detailed information about a specific manga by ID
 */
export async function getMangaById(id: number): Promise<JikanResponse<MangaItem>> {
  const url = buildUrl(`manga/${id}`);
  return fetchWithRateLimit<JikanResponse<MangaItem>>(url);
}

/**
 * Get available genres for anime
 */
export async function getAnimeGenres(): Promise<JikanResponse<any[]>> {
  const url = buildUrl('genres/anime');
  return fetchWithRateLimit<JikanResponse<any[]>>(url);
}

/**
 * Get available genres for manga
 */
export async function getMangaGenres(): Promise<JikanResponse<any[]>> {
  const url = buildUrl('genres/manga');
  return fetchWithRateLimit<JikanResponse<any[]>>(url);
}

export default {
  searchAnime,
  getAnimeById,
  searchManga,
  getMangaById,
  getAnimeGenres,
  getMangaGenres
};
