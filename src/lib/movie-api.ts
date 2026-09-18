import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Movie } from '@/types/api';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/** Fetch full movie details with credits, videos, and watch providers */
export async function getMovieServer(id: string): Promise<Movie> {
  const baseUrl = 'https://api.themoviedb.org/3';
  const [movieRes, creditsRes, videosRes, providersRes] = await Promise.all([
    axios.get(`${baseUrl}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos&language=en-US`),
    axios.get(`${baseUrl}/movie/${id}/credits?api_key=${TMDB_API_KEY}`),
    axios.get(`${baseUrl}/movie/${id}/videos?api_key=${TMDB_API_KEY}`),
    axios.get(`${baseUrl}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`),
  ]);

  return {
    ...movieRes.data,
    credits: creditsRes.data,
    videos: videosRes.data,
    watch_providers: providersRes.data,
  };
}

/** Client-side hook for movie details (uses React Query) */
export function useMovieDetail(id: string | number) {
  return useQuery<Movie, Error, Movie>({
    queryKey: ['movie', id],
    queryFn: async () => {
      const baseUrl = 'https://api.themoviedb.org/3';
      const [movieRes, creditsRes, videosRes, providersRes] = await Promise.all([
        axios.get(`${baseUrl}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos&language=en-US`),
        axios.get(`${baseUrl}/movie/${id}/credits?api_key=${TMDB_API_KEY}`),
        axios.get(`${baseUrl}/movie/${id}/videos?api_key=${TMDB_API_KEY}`),
        axios.get(`${baseUrl}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`),
      ]);
      return {
        ...movieRes.data,
        credits: creditsRes.data,
        videos: videosRes.data,
        watch_providers: providersRes.data,
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}