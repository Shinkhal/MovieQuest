import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Movie } from '@/types/api';

export function MovieBackdrop({ movie }: { movie: Movie }) {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : null;

  return (
    <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden">
      {/* Background image */}
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />

      {/* Back button */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6">
        <Link href="/search">
          <Button variant="outline" className="border-muted bg-background/80 backdrop-blur hover:bg-muted">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Button>
        </Link>
      </div>
    </div>
  );
}