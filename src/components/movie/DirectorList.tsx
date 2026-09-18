import { Badge } from '@/components/ui/badge';
import { Movie } from '@/types/api';

export function DirectorList({ movie }: { movie: Movie }) {
  const directors = movie.credits?.crew?.filter((person) => person.job === 'Director') || [];
  if (directors.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-foreground">
        {directors.length > 1 ? 'Directors' : 'Director'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {directors.map((director) => (
          <Badge key={director.id} variant="secondary" className="bg-muted text-muted-foreground">
            {director.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}