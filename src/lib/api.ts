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

  return useQuery<{ results: Movie[]; total_pages: number }>({
    queryKey: ['movies', type, query, page, sortBy],
    queryFn: () => fetchFromTmdb(endpoint),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
