import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMovieServer } from '@/lib/movie-api';
import { MovieBackdrop } from '@/components/movie/MovieBackdrop';
import { PosterSection } from '@/components/movie/PosterSection';
import { InfoBadges } from '@/components/movie/InfoBadges';
import { Overview } from '@/components/movie/Overview';
import { DirectorList } from '@/components/movie/DirectorList';
import { CastCarousel } from '@/components/movie/CastCarousel';
import { StreamingProviders } from '@/components/movie/StreamingProviders';
import { FinancialDetails } from '@/components/movie/FinancialDetails';
import { ProductionCompanies } from '@/components/movie/ProductionCompanies';
import { TrailerModalClient } from '@/components/movie/TrailerModalClient';
import { Movie } from '@/types/api';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieServer(id);
    return {
      title: `${movie.title} | MovieQuest`,
      description: movie.overview || `Watch ${movie.title} online`,
      openGraph: {
        title: movie.title,
        description: movie.overview || `Watch ${movie.title} online`,
        images: movie.backdrop_path
          ? [`https://image.tmdb.org/t/p/original${movie.backdrop_path}`]
          : movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : [],
      },
    };
  } catch {
    return {
      title: 'Movie Not Found | MovieQuest',
    };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieServer(id);

  if (!movie) {
    notFound();
  }

  // Find trailer key
  const trailerKey = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official
  )?.key ||
    movie.videos?.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    )?.key ||
    movie.videos?.results?.find((v) => v.site === 'YouTube')?.key ||
    null;

  return (
    <div className="bg-background text-foreground min-h-screen pb-16">
      {/* Backdrop hero */}
      <MovieBackdrop movie={movie} />

      {/* Movie details */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster & trailer */}
          <PosterSection
            movie={movie}
            trailerKey={trailerKey}
          />

          {/* Info section */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <InfoBadges movie={movie} />
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-muted-foreground italic mb-4">{movie.tagline}</p>
            )}

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <Overview movie={movie} />
            <DirectorList movie={movie} />
            <CastCarousel movie={movie} />
            <StreamingProviders movie={movie} />

            {/* Additional Details Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialDetails movie={movie} />
              <ProductionCompanies movie={movie} />
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal - Client Component */}
      <TrailerModalClient trailerKey={trailerKey} />
    </div>
  );
}