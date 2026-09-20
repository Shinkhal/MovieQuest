'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Movie } from '@/types/api';
import axios from 'axios';

const WATCHLIST_EVENT = 'moviequest_watchlist_updated';

function getLocalWatchlist(key: string): Movie[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    }
  } catch {
    return [];
  }
  return [];
}

function setLocalWatchlist(key: string, list: Movie[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(list));
      window.dispatchEvent(new Event(WATCHLIST_EVENT));
    }
  } catch (e) {
    console.error('Failed to save local watchlist', e);
  }
}

export function useWatchlist() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = status === 'authenticated';
  
  // Scope storage key per user identity to prevent cross-account data leakage
  const storageKey = useMemo(() => {
    const userId = session?.user?.id || session?.user?.email;
    return userId ? `moviequest_watchlist_${userId}` : 'moviequest_watchlist_guest';
  }, [session?.user?.id, session?.user?.email]);

  const [localList, setLocalList] = useState<Movie[]>([]);

  // Load from scoped local storage initially and when account switches
  useEffect(() => {
    setLocalList(getLocalWatchlist(storageKey));

    const handleStorage = () => {
      setLocalList(getLocalWatchlist(storageKey));
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(WATCHLIST_EVENT, handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(WATCHLIST_EVENT, handleStorage);
    };
  }, [storageKey]);

  // Use React Query for cloud watchlist (cached and deduplicated across all components)
  const { data: cloudList = [], isLoading: isCloudLoading } = useQuery<Movie[]>({
    queryKey: ['cloud-watchlist', session?.user?.id || session?.user?.email],
    queryFn: async () => {
      // Gather items from the user-scoped local key
      const local = getLocalWatchlist(storageKey);

      // Also migrate any items saved under the generic guest key (pre-login)
      const guestKey = 'moviequest_watchlist_guest';
      const guestItems = storageKey !== guestKey ? getLocalWatchlist(guestKey) : [];
      const mergedLocal = [...local];
      const localIds = new Set(mergedLocal.map((m) => m.id));
      for (const g of guestItems) {
        if (!localIds.has(g.id)) {
          mergedLocal.push(g);
          localIds.add(g.id);
        }
      }

      if (mergedLocal.length > 0) {
        // Sync local + guest to cloud on first fetch
        const { data } = await axios.post('/api/watchlist', { syncList: mergedLocal });
        if (data?.movies) {
          setLocalWatchlist(storageKey, data.movies);
          // Clear migrated guest items
          if (guestItems.length > 0 && typeof window !== 'undefined') {
            localStorage.removeItem(guestKey);
          }
          return data.movies;
        }
      }
      const { data } = await axios.get('/api/watchlist');
      if (data?.movies) {
        setLocalWatchlist(storageKey, data.movies);
        // Clear migrated guest items
        if (guestItems.length > 0 && typeof window !== 'undefined') {
          localStorage.removeItem(guestKey);
        }
        return data.movies;
      }
      return [];
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const watchlist = isAuthenticated ? cloudList : localList;

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
      setLocalWatchlist(storageKey, updated);

      if (isAuthenticated) {
        addToWatchlistMutation.mutate(simplifiedMovie);
      }
    },
    [watchlist, isAuthenticated, storageKey, addToWatchlistMutation]
  );

  const removeFromWatchlist = useCallback(
    (movieId: number) => {
      const updated = watchlist.filter((m) => m.id !== movieId);
      setLocalList(updated);
      setLocalWatchlist(storageKey, updated);

      if (isAuthenticated) {
        removeFromWatchlistMutation.mutate(movieId);
      }
    },
    [watchlist, isAuthenticated, storageKey, removeFromWatchlistMutation]
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
