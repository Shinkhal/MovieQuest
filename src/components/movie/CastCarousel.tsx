import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Movie } from '@/types/api';

export function CastCarousel({ movie }: { movie: Movie }) {
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  if (cast.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center">
        <Users className="h-5 w-5 mr-2 text-primary" />
        Cast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cast.map((actor) => (
          <div key={actor.id} className="bg-muted/50 rounded-lg overflow-hidden">
            {actor.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                alt={actor.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            ) : (
              <div className="w-full h-48 bg-muted flex items-center justify-center">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="p-2">
              <h4 className="font-medium text-sm text-foreground truncate">{actor.name}</h4>
              <p className="text-muted-foreground text-xs truncate">{actor.character}</p>
            </div>
          </div>
        ))}
      </div>
      {movie.credits?.cast && movie.credits.cast.length > 10 && (
        <p className="text-muted-foreground text-sm mt-2">
          +{movie.credits.cast.length - 10} more cast members
        </p>
      )}
    </div>
  );
}