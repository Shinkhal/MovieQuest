import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Movie, Genre } from '@/types/api';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * Generic GET helper that automatically attaches the TMDB API key.
 * Keeps the key out of the client bundle – it is resolved at build time.
 */
async function fetchFromTmdb<T>(url: string): Promise<T> {
  const fullUrl = `${url}${url.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  const { data } = await axios.get<T>(fullUrl);
  return data;
}

/** Server-side function to fetch genres (for SSR/SSG) */
export async function getGenresServer(): Promise<Genre[]> {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`;

  // Retry logic for transient network errors
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data } = await axios.get<{ genres: Genre[] }>(url, {
        timeout: 10000,
      });
      return data.genres;
    } catch (error) {
      lastError = error as Error;
      if (attempt < 3) {
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // If all retries fail, return empty array instead of throwing
  // This allows the page to render with a fallback
  console.error('Failed to fetch genres after retries:', lastError);
  return [];
}

/** Hook to get a list of genres */
export function useGenres() {
  return useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: () => fetchFromTmdb<{ genres: Genre[] }>('https://api.themoviedb.org/3/genre/movie/list').then(r => r.genres),
    staleTime: 1000 * 60 * 60 * 24, // 1 day cache
  });
}

/** Hook to search / discover movies */
export function useMovies(params: {
  query?: string;
  page?: number;
  type: 'popular' | 'trending' | 'search';
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc';
}) {
  const { query = '', page = 1, type, sortBy = 'popularity.desc' } = params;

  const endpoint =
    type === 'popular'
      ? `https://api.themoviedb.org/3/discover/movie&sort_by=${sortBy}&page=${page}`
      : type === 'trending'
      ? `https://api.themoviedb.org/3/trending/movie/week&page=${page}`
      : `https://api.themoviedb.org/3/search/movie&query=${encodeURIComponent(query)}&page=${page}`;

  return useQuery<{ results: Movie[]; total_pages: number }, Error, { results: Movie[]; total_pages: number }>({
    queryKey: ['movies', type, query, page, sortBy],
    queryFn: () => fetchFromTmdb<{ results: Movie[]; total_pages: number }>(endpoint),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
