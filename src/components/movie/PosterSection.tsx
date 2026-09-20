'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play, Bookmark, BookmarkCheck, LogIn } from 'lucide-react';
import { Movie } from '@/types/api';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useSession, signIn } from 'next-auth/react';
import { toast } from 'sonner';

interface PosterSectionProps {
  movie: Movie;
  trailerKey: string | null;
}

export function PosterSection({ movie, trailerKey }: PosterSectionProps) {
  const { data: session } = useSession();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isBookmarked = isInWatchlist(movie.id);

  const handlePlayTrailer = () => {
    if (trailerKey) {
      window.dispatchEvent(new CustomEvent('open-trailer', { detail: trailerKey }));
    }
  };

  const handleToggleWatchlist = () => {
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

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 space-y-4">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/60 bg-muted/80">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium">
            No Poster Available
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        {trailerKey && (
          <Button
            className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm gap-2 shadow-lg shadow-primary/25 transition-transform active:scale-95"
            onClick={handlePlayTrailer}
          >
            <Play className="h-4 w-4 fill-current" />
            Watch Trailer
          </Button>
        )}

        <Button
          variant={isBookmarked ? 'secondary' : 'outline'}
          className="w-full py-5 rounded-xl border-border/80 font-medium text-xs sm:text-sm gap-2 transition-all hover:bg-muted"
          onClick={handleToggleWatchlist}
        >
          {!session?.user ? (
            <>
              <LogIn className="h-4 w-4 text-muted-foreground" />
              Sign In to Save
            </>
          ) : isBookmarked ? (
            <>
              <BookmarkCheck className="h-4 w-4 text-primary fill-primary/20" />
              In Watchlist
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              Add to Watchlist
            </>
          )}
        </Button>
      </div>
    </div>
  );
}