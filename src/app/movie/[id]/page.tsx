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
import { MovieReviews } from '@/components/movie/MovieReviews';
import { ResultCard } from '@/components/search/ResultCard';
import { Sparkles, Film } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieServer(id);
    return {
      title: `${movie.title} | MovieQuest`,
      description: movie.overview || `Watch ${movie.title} online with MovieQuest streaming guide.`,
      openGraph: {
        title: `${movie.title} - MovieQuest`,
        description: movie.overview || `Discover details and stream ${movie.title}`,
        images: movie.backdrop_path
          ? [`https://image.tmdb.org/t/p/original${movie.backdrop_path}`]
          : movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : [],
      },
    };
  } catch {
    return {
      title: 'Movie Details | MovieQuest',
    };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  let movie;
  try {
    movie = await getMovieServer(id);
  } catch (error) {
    notFound();
  }

  if (!movie || !movie.id) {
    notFound();
  }

  // Find trailer key
  const trailerKey =
    movie.videos?.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official
    )?.key ||
    movie.videos?.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    )?.key ||
    movie.videos?.results?.find((v) => v.site === 'YouTube')?.key ||
    null;

  const similarMovies = movie.similar?.results?.slice(0, 5) || [];

  return (
    <div className="bg-background text-foreground min-h-screen pb-20">
      {/* Backdrop hero */}
      <MovieBackdrop movie={movie} />

      {/* Movie main details section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Column: Poster & Actions */}
          <PosterSection movie={movie} trailerKey={trailerKey} />

          {/* Right Column: Information & Cast */}
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
            <InfoBadges movie={movie} />

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-muted-foreground text-sm sm:text-base italic mt-1 font-light">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genres/${genre.id}`}
                    className="px-3.5 py-1 rounded-full bg-muted/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border/60 text-muted-foreground text-xs font-semibold transition-all"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            <Overview movie={movie} />
            <DirectorList movie={movie} />
            <CastCarousel movie={movie} />
            <StreamingProviders movie={movie} />

            {/* Financial and Production Details */}
            <div className="mt-8 pt-8 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialDetails movie={movie} />
              <ProductionCompanies movie={movie} />
            </div>
          </div>
        </div>

        {/* User Reviews & Ratings Section */}
        <MovieReviews movieId={movie.id} movieTitle={movie.title} />

        {/* Similar / Recommended Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                More Like This
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {similarMovies.map((similar) => (
                <ResultCard key={similar.id} movie={similar} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal (client-side) */}
      <TrailerModalClient trailerKey={trailerKey} />
    </div>
  );
}