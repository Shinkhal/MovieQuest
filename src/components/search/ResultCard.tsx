import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie } from '@/types/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * A single movie result card used on the search results grid.
 * It receives a `Movie` object and displays poster, title, rating, year, and genres.
 */
export function ResultCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null;

  return (
    <Card className="bg-surface/10 border border-muted/20 hover:border-primary transition-colors overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[2/3] w-full">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
            No Image
          </div>
        )}
        {/* Rating badge */}
        <div className="absolute top-2 right-2">
          <Badge
            className={cn(
              'font-medium shadow-md',
              movie.vote_average >= 7
                ? 'bg-green-500 text-green-950'
                : movie.vote_average >= 5
                ? 'bg-amber-500 text-amber-950'
                : 'bg-red-500 text-red-950'
            )}
          >
            <Star className="h-3 w-3 mr-1 fill-current" />
            {movie.vote_average.toFixed(1)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-base mb-1 line-clamp-1 text-foreground hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-muted text-xs flex items-center mb-2">
          <Clock className="h-3 w-3 mr-1" />
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
        {/* Genres (show up to 2) */}
        {movie.genre_ids && movie.genre_ids.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {movie.genre_ids.slice(0, 2).map((gid) => (
              <span key={gid} className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                {gid}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
