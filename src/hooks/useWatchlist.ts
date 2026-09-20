'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Movie } from '@/types/api';
import axios from 'axios';

const WATCHLIST_KEY = 'moviequest_watchlist';
const WATCHLIST_EVENT = 'moviequest_watchlist_updated';

function getLocalWatchlist(): Movie[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  } catch {
    return [];
  }
  return [];
}

export function useWatchlist() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [localList, setLocalList] = useState<Movie[]>([]);
  const isAuthenticated = status === 'authenticated';

  // Load from local storage initially
  useEffect(() => {
    setLocalList(getLocalWatchlist());

    const handleStorage = () => {
      setLocalList(getLocalWatchlist());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(WATCHLIST_EVENT, handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(WATCHLIST_EVENT, handleStorage);
    };
  }, []);

  // Use React Query for cloud watchlist (cached and deduplicated across all components)
  const { data: cloudList = [], isLoading: isCloudLoading } = useQuery<Movie[]>({
    queryKey: ['cloud-watchlist', session?.user?.email || session?.user?.id],
    queryFn: async () => {
      const local = getLocalWatchlist();
      if (local.length > 0) {
        // Sync local to cloud on first fetch
        const { data } = await axios.post('/api/watchlist', { syncList: local });
        if (data?.movies) {
          localStorage.setItem(WATCHLIST_KEY, JSON.stringify(data.movies));
          return data.movies;
        }
      }
      const { data } = await axios.get('/api/watchlist');
      if (data?.movies) {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(data.movies));
        return data.movies;
      }
      return [];
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const watchlist = isAuthenticated && cloudList.length > 0 ? cloudList : localList;

  const isInWatchlist = useCallback(
    (movieId: number) => {
      return watchlist.some((m) => m.id === movieId);
    },
    [watchlist]
  );

  const addToWatchlistMutation = useMutation({
    mutationFn: async (movie: Movie) => {
      if (isAuthenticated) {
        await axios.post('/api/watchlist', { movie });
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['cloud-watchlist'] });
      }
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (movieId: number) => {
      if (isAuthenticated) {
        await axios.delete(`/api/watchlist?movieId=${movieId}`);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['cloud-watchlist'] });
      }
    },
  });

  const addToWatchlist = useCallback(
    (movie: Movie) => {
      const simplifiedMovie: Movie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        overview: movie.overview,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids || movie.genres?.map((g) => g.id) || [],
        popularity: movie.popularity || 0,
      };

      const updated = [simplifiedMovie, ...watchlist.filter((m) => m.id !== movie.id)];
      setLocalList(updated);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(WATCHLIST_EVENT));

      if (isAuthenticated) {
        addToWatchlistMutation.mutate(simplifiedMovie);
      }
    },
    [watchlist, isAuthenticated, addToWatchlistMutation]
  );

  const removeFromWatchlist = useCallback(
    (movieId: number) => {
      const updated = watchlist.filter((m) => m.id !== movieId);
      setLocalList(updated);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(WATCHLIST_EVENT));

      if (isAuthenticated) {
        removeFromWatchlistMutation.mutate(movieId);
      }
    },
    [watchlist, isAuthenticated, removeFromWatchlistMutation]
  );

  const toggleWatchlist = useCallback(
    (movie: Movie) => {
      if (isInWatchlist(movie.id)) {
        removeFromWatchlist(movie.id);
        return false;
      } else {
        addToWatchlist(movie);
        return true;
      }
    },
    [isInWatchlist, addToWatchlist, removeFromWatchlist]
  );

  return {
    watchlist,
    isLoaded: !isCloudLoading,
    count: watchlist.length,
    isAuthenticated,
    user: session?.user,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  };
}
