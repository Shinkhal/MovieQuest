import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Clock, Info } from 'lucide-react';
import { Movie } from '@/types/api';

export function InfoBadges({ movie }: { movie: Movie }) {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-2">
      {/* Rating badge */}
      <Badge
        className={
          movie.vote_average >= 7
            ? 'bg-green-500 text-green-950 font-semibold'
            : movie.vote_average >= 5
            ? 'bg-amber-500 text-amber-950 font-semibold'
            : 'bg-red-500 text-red-950 font-semibold'
        }
      >
        <Star className="h-3 w-3 mr-1 fill-current" />
        {movie.vote_average.toFixed(1)}
      </Badge>

      {/* Year badge */}
      <Badge variant="outline" className="border-muted text-muted-foreground">
        <Calendar className="h-3 w-3 mr-1" />
        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
      </Badge>

      {/* Runtime badge */}
      {movie.runtime && (
        <Badge variant="outline" className="border-muted text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
        </Badge>
      )}

      {/* Status badge */}
      {movie.status && (
        <Badge variant="outline" className="border-muted text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          {movie.status}
        </Badge>
      )}
    </div>
  );
}