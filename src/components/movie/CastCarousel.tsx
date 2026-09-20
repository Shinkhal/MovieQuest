import Image from 'next/image';
import { Users } from 'lucide-react';
import { Movie } from '@/types/api';

export function CastCarousel({ movie }: { movie: Movie }) {
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  if (cast.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        Top Billed Cast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {cast.map((actor) => (
          <div
            key={actor.id}
            className="group rounded-xl overflow-hidden border border-border/60 bg-card/60 hover:bg-card/90 transition-colors shadow-sm"
          >
            {/* Actor Profile Picture */}
            <div className="relative aspect-[3/4] w-full bg-muted overflow-hidden">
              {actor.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 p-2 text-center">
                  <Users className="h-8 w-8 mb-1" />
                  <span className="text-[10px]">No Photo</span>
                </div>
              )}
            </div>

            {/* Actor Info */}
            <div className="p-2.5">
              <h4 className="font-semibold text-xs text-foreground truncate" title={actor.name}>
                {actor.name}
              </h4>
              <p className="text-[11px] text-muted-foreground truncate" title={actor.character}>
                {actor.character}
              </p>
            </div>
          </div>
        ))}
      </div>
      {movie.credits?.cast && movie.credits.cast.length > 10 && (
        <p className="text-xs text-muted-foreground mt-3 italic">
          +{movie.credits.cast.length - 10} more cast and crew members
        </p>
      )}
    </div>
  );
}