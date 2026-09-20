import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Movie, Genre, MovieListResponse } from '@/types/api';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * Generic GET helper that automatically attaches the TMDB API key.
 */
export async function fetchFromTmdb<T>(url: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const parsedUrl = new URL(url);
  if (TMDB_API_KEY) {
    parsedUrl.searchParams.set('api_key', TMDB_API_KEY);
  }
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        parsedUrl.searchParams.set(k, String(v));
      }
    });
  }
  const { data } = await axios.get<T>(parsedUrl.toString());
  return data;
}

/** Server-side function to fetch genres (for SSR/SSG) */
export async function getGenresServer(): Promise<Genre[]> {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data } = await axios.get<{ genres: Genre[] }>(url, {
        timeout: 10000,
      });
      return data.genres || [];
    } catch (error) {
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      } else {
        console.error('Failed to fetch genres after retries:', error);
      }
    }
  }
  return [];
}

/** Hook to get a list of genres */
export function useGenres() {
  return useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: () =>
      fetchFromTmdb<{ genres: Genre[] }>('https://api.themoviedb.org/3/genre/movie/list').then(
        (r) => r.genres || []
      ),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export type MovieFetchType =
  | 'popular'
  | 'trending'
  | 'top_rated'
  | 'now_playing'
  | 'search'
  | 'genre';

export interface UseMoviesParams {
  query?: string;
  genreId?: number;
  page?: number;
  type: MovieFetchType;
  sortBy?: string;
}

/** Hook to search, discover, or browse movies by category or genre */
export function useMovies(params: UseMoviesParams) {
  const { query = '', genreId, page = 1, type, sortBy = 'popularity.desc' } = params;

  return useQuery<MovieListResponse>({
    queryKey: ['movies', type, query, genreId, page, sortBy],
    queryFn: async () => {
      if (type === 'search' && query.trim()) {
        return fetchFromTmdb<MovieListResponse>('https://api.themoviedb.org/3/search/movie', {
          query: query.trim(),
          page,
          include_adult: 'false',
        });
      }

      if (type === 'trending') {
        return fetchFromTmdb<MovieListResponse>(
          'https://api.themoviedb.org/3/trending/movie/week',
          { page }
        );
      }

      if (type === 'top_rated') {
        return fetchFromTmdb<MovieListResponse>(
          'https://api.themoviedb.org/3/movie/top_rated',
          { page }
        );
      }

      if (type === 'now_playing') {
        return fetchFromTmdb<MovieListResponse>(
          'https://api.themoviedb.org/3/movie/now_playing',
          { page }
        );
      }

      if (type === 'genre' || genreId) {
        return fetchFromTmdb<MovieListResponse>(
          'https://api.themoviedb.org/3/discover/movie',
          {
            with_genres: genreId,
            sort_by: sortBy,
            page,
            'vote_count.gte': 50,
          }
        );
      }

      // Default 'popular' or discover
      return fetchFromTmdb<MovieListResponse>(
        'https://api.themoviedb.org/3/discover/movie',
        {
          sort_by: sortBy,
          page,
          'vote_count.gte': 100,
        }
      );
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/** Server-side fetch helper for trending movies on Hero/Home */
export async function getTrendingMoviesServer(): Promise<Movie[]> {
  try {
    const data = await fetchFromTmdb<MovieListResponse>(
      'https://api.themoviedb.org/3/trending/movie/week'
    );
    return data.results || [];
  } catch {
    return [];
  }
}
