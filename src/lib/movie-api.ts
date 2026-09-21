import axios from 'axios';
import { cache } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Movie } from '@/types/api';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * Fetch full movie details with credits, videos, watch providers, and similar movies in a single TMDB request.
 * Wrapped in React cache() so generateMetadata and Page component share the exact same promise during SSR.
 */
export const getMovieServer = cache(async (id: string): Promise<Movie> => {
  const baseUrl = 'https://api.themoviedb.org/3';
  const url = `${baseUrl}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar,watch/providers&language=en-US`;
  
  const { data } = await axios.get(url);

  return {
    ...data,
    credits: data.credits || { cast: [], crew: [] },
    videos: data.videos || { results: [] },
    watch_providers: data['watch/providers'] || {},
    similar: data.similar || { results: [] },
  };
});

/** Client-side hook for movie details (uses React Query with caching) */
export function useMovieDetail(id: string | number) {
  return useQuery<Movie, Error, Movie>({
    queryKey: ['movie', id],
    queryFn: async () => {
      const path = `/movie/${id}`;
      const params = new URLSearchParams({
        path,
        append_to_response: 'credits,videos,similar,watch/providers',
        language: 'en-US',
      });
      const { data } = await axios.get(`/api/tmdb?${params.toString()}`);
      return {
        ...data,
        credits: data.credits || { cast: [], crew: [] },
        videos: data.videos || { results: [] },
        watch_providers: data['watch/providers'] || {},
        similar: data.similar || { results: [] },
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}