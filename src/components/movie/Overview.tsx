import { Movie } from '@/types/api';

export function Overview({ movie }: { movie: Movie }) {
  if (!movie.overview) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-foreground">Overview</h3>
      <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
    </div>
  );
}