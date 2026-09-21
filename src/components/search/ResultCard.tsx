'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Bookmark, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie } from '@/types/api';
import Image from 'next/image';
import Link from 'next/link';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useSession, signIn } from 'next-auth/react';
import { toast } from 'sonner';

// Standard TMDB genre ID map for fast fallback lookups
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export function ResultCard({ movie }: { movie: Movie }) {
  const { data: session } = useSession();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isBookmarked = isInWatchlist(movie.id);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) {
      signIn(undefined, { callbackUrl: `/movie/${movie.id}` });
      return;
    }
    const added = toggleWatchlist(movie);
    if (added) {
      toast.success(`"${movie.title}" added to your Watchlist`);
    } else {
      toast.info(`"${movie.title}" removed from your Watchlist`);
    }
  };

  const formattedYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const genreNames =
    movie.genres?.map((g) => g.name) ||
    movie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean) ||
    [];

  return (
    <Card className="group relative bg-card/60 hover:bg-card/90 border border-border/60 hover:border-primary/50 transition-all duration-300 overflow-hidden h-full flex flex-col rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/5">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        <Link href={`/movie/${movie.id}`} className="block w-full h-full relative">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-muted/60 text-muted-foreground p-4 text-center">
              <Film className="h-10 w-10 mb-2 opacity-40" />
              <span className="text-xs font-medium">No Poster Available</span>
            </div>
          )}

          {/* Backdrop gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick detail overlay at bottom of poster on hover */}
          <div className="absolute bottom-2 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-[11px] text-white/90 line-clamp-2 leading-tight">
              {movie.overview || 'No synopsis provided.'}
            </p>
          </div>
        </Link>

        {/* Rating badge */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          <Badge
            className={cn(
              'font-semibold backdrop-blur-md border text-xs px-2 py-0.5 shadow-md flex items-center gap-1',
              movie.vote_average >= 7.5
                ? 'bg-emerald-500/90 text-white border-emerald-400/40'
                : movie.vote_average >= 6.0
                ? 'bg-amber-500/90 text-white border-amber-400/40'
                : movie.vote_average > 0
                ? 'bg-rose-500/90 text-white border-rose-400/40'
                : 'bg-zinc-700/90 text-white border-zinc-600/40'
            )}
          >
            <Star className="h-3 w-3 fill-current text-white" />
            {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'NR'}
          </Badge>
        </div>

        {/* Bookmark Action Button (Sibling to Link, not nested inside) */}
        <button
          onClick={handleBookmark}
          aria-label={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
          className={cn(
            'absolute top-2.5 left-2.5 z-10 p-2 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer',
            isBookmarked
              ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
              : 'bg-black/60 text-white/80 hover:text-white border-white/20 hover:bg-black/80 opacity-0 group-hover:opacity-100'
          )}
        >
          <Bookmark className={cn('h-3.5 w-3.5', isBookmarked && 'fill-current')} />
        </button>
      </div>

      {/* Card Content / Details */}
      <CardContent className="p-3.5 flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/movie/${movie.id}`}>
            <h3
              className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors duration-200"
              title={movie.title}
            >
              {movie.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-3 w-3 text-muted-foreground/70" />
              {formattedYear || 'Unknown'}
            </span>
            {movie.vote_count ? (
              <span className="text-[11px] text-muted-foreground/80">
                {movie.vote_count.toLocaleString()} votes
              </span>
            ) : null}
          </div>
        </div>

        {/* Genre Badges */}
        {genreNames.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {genreNames.slice(0, 2).map((gName, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-muted text-muted-foreground border border-border/40"
              >
                {gName}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
