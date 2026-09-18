'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { Movie } from '@/types/api';

interface PosterSectionProps {
  movie: Movie;
  trailerKey: string | null;
}

export function PosterSection({ movie, trailerKey }: PosterSectionProps) {
  const handlePlayTrailer = () => {
    if (trailerKey) {
      window.dispatchEvent(new CustomEvent('open-trailer', { detail: trailerKey }));
    }
  };
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className="w-full md:w-1/3 lg:w-1/4">
      <div className="rounded-xl overflow-hidden shadow-xl">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="aspect-[2/3] w-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </div>

      {trailerKey && (
        <Button
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white gap-2"
          onClick={handlePlayTrailer}
        >
          <Video className="h-4 w-4" />
          Watch Trailer
        </Button>
      )}
    </div>
  );
}